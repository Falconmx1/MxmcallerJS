import axios from 'axios';
import { getCache, setCache } from './cache.js';
import { getNextToken, markTokenAsFailed } from './tokens.js';
import { getProxy, markProxyAsFailed } from './proxy.js';

export async function lookupNumber(number, options = {}) {
  if (options.offline) {
    const cached = getCache(number);
    if (cached) {
      return { ...cached, fromCache: true };
    }
    throw new Error('Modo offline: Número no encontrado en caché');
  }
  
  const cached = getCache(number);
  if (cached && !options.force) {
    return { ...cached, fromCache: true };
  }
  
  const maxRetries = 3;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const token = getNextToken();
    const proxy = options.proxy || getProxy();
    
    if (!token) throw new Error('No hay tokens de Truecaller disponibles');
    
    try {
      const response = await axios.post('https://truecaller.com/api/v1/search', {
        phone: number,
        countryCode: detectCountry(number)
      }, {
        timeout: 10000,
        proxy: proxy ? {
          protocol: 'http',
          host: proxy.split(':')[0],
          port: parseInt(proxy.split(':')[1])
        } : undefined,
        headers: {
          'User-Agent': getRandomUserAgent(),
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      const result = {
        name: response.data.name || 'Desconocido',
        country: response.data.countryCode,
        carrier: response.data.carrier,
        spam: response.data.spam,
        whatsapp: response.data.whatsapp,
        timestamp: new Date().toISOString()
      };
      
      setCache(number, result);
      return { ...result, fromCache: false };
      
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        markTokenAsFailed(token);
      }
      if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
        markProxyAsFailed(proxy);
      }
      
      if (attempt === maxRetries) {
        throw new Error(`Falló después de ${maxRetries} intentos: ${error.message}`);
      }
      
      await delay(1000 * attempt);
    }
  }
}

function detectCountry(number) {
  const codes = {
    '52': 'MX', '1': 'US', '44': 'GB', '33': 'FR', '49': 'DE'
  };
  for (const [code, country] of Object.entries(codes)) {
    if (number.startsWith(`+${code}`)) return country;
  }
  return 'UNKNOWN';
}

function getRandomUserAgent() {
  const agents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
    'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36'
  ];
  return agents[Math.floor(Math.random() * agents.length)];
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
