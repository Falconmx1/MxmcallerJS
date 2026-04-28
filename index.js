#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import ora from 'spinner';
import dotenv from 'dotenv';
import { lookupNumber } from './core/lookup.js';
import { showCacheStats, clearCache } from './core/cache.js';
import { rotateProxy, testProxies } from './core/proxy.js';

dotenv.config();

program
  .version('1.0.0')
  .description(chalk.cyan('🔥 MxmcallerJS - Más potente que TruecallerJS'))
  .argument('[number]', 'Número telefónico (ej: +521234567890)')
  .option('-p, --proxy <url>', 'Usar proxy específico')
  .option('-r, --rotate', 'Rotar proxies automáticamente')
  .option('--raw', 'Mostrar respuesta cruda')
  .option('--offline', 'Modo offline (solo caché)')
  .option('--stats', 'Mostrar estadísticas de caché')
  .option('--clear-cache', 'Limpiar caché')
  .option('--test-proxies', 'Probar proxies disponibles')
  .action(async (number, options) => {
    
    if (options.stats) {
      await showCacheStats();
      return;
    }
    
    if (options.clearCache) {
      await clearCache();
      console.log(chalk.green('✅ Caché limpiada correctamente'));
      return;
    }
    
    if (options.testProxies) {
      await testProxies();
      return;
    }
    
    if (!number) {
      console.log(chalk.red('❌ Error: Debes proporcionar un número telefónico'));
      console.log(chalk.yellow('📱 Ejemplo: mxmcaller +521234567890'));
      return;
    }
    
    const spinner = ora('🔍 Buscando en MxmcallerJS...').start();
    
    try {
      const result = await lookupNumber(number, options);
      spinner.succeed(chalk.green('✅ Información encontrada:'));
      
      if (options.raw) {
        console.log(chalk.cyan(JSON.stringify(result, null, 2)));
      } else {
        console.log(chalk.white('\n📞 Información del número:'));
        console.log(chalk.gray('─'.repeat(50)));
        
        if (result.name) console.log(chalk.green('👤 Nombre:'), chalk.white(result.name));
        if (result.country) console.log(chalk.green('🌍 País:'), chalk.white(result.country));
        if (result.carrier) console.log(chalk.green('📡 Operador:'), chalk.white(result.carrier));
        if (result.spam) console.log(chalk.red('⚠️ Spam:'), chalk.white(result.spam));
        if (result.whatsapp) console.log(chalk.green('💬 WhatsApp:'), chalk.white('Disponible'));
        
        console.log(chalk.gray('─'.repeat(50)));
        console.log(chalk.gray(`🔗 Cacheado: ${result.fromCache ? 'Sí' : 'No'}`));
      }
      
    } catch (error) {
      spinner.fail(chalk.red(error.message));
      console.log(chalk.yellow('\n💡 Tips:'));
      console.log(chalk.gray('• Usa --rotate para rotar proxies'));
      console.log(chalk.gray('• Configura .env con tus tokens'));
      console.log(chalk.gray('• Usa --offline para modo solo caché'));
    }
  });

program.parse();
