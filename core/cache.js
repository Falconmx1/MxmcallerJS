import fs from 'fs-extra';
import NodeCache from 'node-cache';
import chalk from 'chalk';

const cache = new NodeCache({ stdTTL: parseInt(process.env.CACHE_TTL || '86400') });
const CACHE_FILE = process.env.CACHE_FILE || './cache.json';

export function getCache(key) {
  return cache.get(key);
}

export function setCache(key, value) {
  cache.set(key, value);
  saveToFile();
  return true;
}

export async function showCacheStats() {
  const keys = cache.keys();
  console.log(chalk.cyan('\n📊 Estadísticas de caché:'));
  console.log(chalk.gray('─'.repeat(40)));
  console.log(chalk.white(`📦 Total en memoria: ${keys.length}`));
  console.log(chalk.white(`⏱️  TTL: ${process.env.CACHE_TTL || '86400'} segundos`));
  
  if (await fs.pathExists(CACHE_FILE)) {
    const fileCache = await fs.readJson(CACHE_FILE);
    console.log(chalk.white(`💾 Persistidos en disco: ${Object.keys(fileCache).length}`));
  }
}

export async function clearCache() {
  cache.flushAll();
  if (await fs.pathExists(CACHE_FILE)) {
    await fs.remove(CACHE_FILE);
  }
  return true;
}

async function saveToFile() {
  const allData = {};
  cache.keys().forEach(key => {
    allData[key] = cache.get(key);
  });
  await fs.writeJson(CACHE_FILE, allData, { spaces: 2 });
}

export async function loadCache() {
  if (await fs.pathExists(CACHE_FILE)) {
    const data = await fs.readJson(CACHE_FILE);
    Object.entries(data).forEach(([key, value]) => {
      cache.set(key, value);
    });
    console.log(chalk.gray(`📦 Caché cargada: ${Object.keys(data).length} números`));
  }
}
