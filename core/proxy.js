import axios from 'axios';
import chalk from 'chalk';

let proxies = [];
let failedProxies = new Map();
let currentIndex = 0;

export function initProxies() {
  const proxyList = process.env.PROXY_LIST;
  if (proxyList) {
    proxies = proxyList.split(',').map(p => p.trim());
    console.log(chalk.gray(`🔄 Cargados ${proxies.length} proxies`));
  }
}

export function getProxy() {
  if (proxies.length === 0) return null;
  
  const startIndex = currentIndex;
  do {
    const proxy = proxies[currentIndex % proxies.length];
    const fails = failedProxies.get(proxy) || 0;
    
    if (fails < 3) {
      currentIndex++;
      return proxy;
    }
    currentIndex++;
  } while (currentIndex % proxies.length !== startIndex);
  
  return proxies[0];
}

export function markProxyAsFailed(proxy) {
  if (!proxy) return;
  const fails = (failedProxies.get(proxy) || 0) + 1;
  failedProxies.set(proxy, fails);
  console.log(chalk.yellow(`⚠️ Proxy falló: ${proxy} (${fails}/3)`));
}

export async function testProxies() {
  console.log(chalk.cyan('\n🧪 Probando proxies...'));
  
  for (const proxy of proxies) {
    try {
      const start = Date.now();
      await axios.get('http://httpbin.org/ip', {
        proxy: { host: proxy.split(':')[0], port: parseInt(proxy.split(':')[1]) },
        timeout: 5000
      });
      const latency = Date.now() - start;
      console.log(chalk.green(`✅ ${proxy} - ${latency}ms`));
    } catch (error) {
      console.log(chalk.red(`❌ ${proxy} - Falló`));
    }
  }
}

initProxies();
