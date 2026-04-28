import chalk from 'chalk';

let tokens = [];
let failedTokens = new Map();
let currentIndex = 0;

export function initTokens() {
  const tokenList = process.env.TRUECALLER_TOKENS;
  if (tokenList) {
    tokens = tokenList.split(',').map(t => t.trim());
    console.log(chalk.gray(`🔑 Cargados ${tokens.length} tokens de Truecaller`));
  } else {
    console.log(chalk.yellow('⚠️ No hay tokens configurados. Usa --offline o configura .env'));
  }
}

export function getNextToken() {
  if (tokens.length === 0) return null;
  
  const startIndex = currentIndex;
  do {
    const token = tokens[currentIndex % tokens.length];
    const fails = failedTokens.get(token) || 0;
    
    if (fails < 3) {
      currentIndex++;
      return token;
    }
    currentIndex++;
  } while (currentIndex % tokens.length !== startIndex);
  
  return null;
}

export function markTokenAsFailed(token) {
  const fails = (failedTokens.get(token) || 0) + 1;
  failedTokens.set(token, fails);
  console.log(chalk.yellow(`⚠️ Token falló (${fails}/3), cambiando al siguiente...`));
}

initTokens();
