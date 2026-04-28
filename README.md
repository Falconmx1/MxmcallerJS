# 🔥 MxmcallerJS

<div align="center">

**La herramienta más potente para lookup de números telefónicos**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org)
[![Platform](https://img.shields.io/badge/platform-Linux%20%7C%20Windows%20%7C%20Termux-blue)]()

</div>

## 📌 Características Únicas

- ✅ **Caché local persistente** - Guarda resultados y evita rate limits
- ✅ **Proxy rotatorio automático** - Bypass de restricciones IP
- ✅ **Multicuenta Truecaller** - Balanceo de carga entre tokens
- ✅ **Modo offline** - Funciona solo con caché (sin API)
- ✅ **Detección automática de país** - Identifica código de área
- ✅ **Verificación de WhatsApp** - Detecta cuentas activas

## 🚀 Instalación

### Linux / Windows (global)
```bash
npm install -g mxmcallerjs

Termux (Android)
pkg update && pkg install nodejs git
npm install -g mxmcallerjs

Desde código fuente
git clone https://github.com/Falconmx1/MxmcallerJS
cd MxmcallerJS
npm install
npm link

📱 Uso Básico
# Búsqueda simple
mxmcaller +521234567890

# Con proxy específico
mxmcaller +521234567890 --proxy http://user:pass@proxy:8080

# Rotar proxies automáticamente
mxmcaller +521234567890 --rotate

# Modo offline (solo caché)
mxmcaller +521234567890 --offline

# Ver estadísticas de caché
mxmcaller --stats

# Probar proxies configurados
mxmcaller --test-proxies
