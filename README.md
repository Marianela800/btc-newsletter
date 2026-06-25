# ₿ Bitcoin Daily Newsletter

Recibí todos los días a las **8 AM** un email con el análisis completo de Bitcoin:
precio, RSI, MACD, Índice Miedo & Codicia, señal IA, noticias del día y más.

---

## 📁 Estructura del proyecto

```
btc-newsletter/
├── index.js          → Ejecutar una sola vez (prueba manual)
├── scheduler.js      → Scheduler diario (esto es lo que corre en el servidor)
├── src/
│   ├── cryptoData.js → Llama a los actores de Apify
│   ├── emailTemplate.js → Construye el HTML del email
│   └── mailer.js     → Envía el email por Gmail
├── .env.example      → Plantilla de variables de entorno
├── package.json
├── railway.toml      → Config para Railway
└── Dockerfile        → Config para cualquier plataforma con Docker
```

---

## 🚀 Paso a paso — Deploy en Railway (RECOMENDADO, gratis)

### 1. Obtener tu Apify Token

1. Andá a [apify.com](https://apify.com) → Iniciar sesión
2. **Settings → Integrations → API token**
3. Copiá el token

### 2. Crear Gmail App Password

> ⚠️ No uses tu contraseña normal de Gmail. Necesitás una "Contraseña de aplicación".

1. Andá a [myaccount.google.com](https://myaccount.google.com)
2. **Seguridad → Verificación en 2 pasos** (activarla si no la tenés)
3. **Seguridad → Contraseñas de aplicaciones**
4. Seleccioná "Otra (nombre personalizado)" → escribí "Bitcoin Newsletter"
5. Copiá las **16 letras** que aparecen (ej: `abcd efgh ijkl mnop`)

### 3. Subir a GitHub

```bash
# En la carpeta del proyecto
git init
git add .
git commit -m "Bitcoin Daily Newsletter"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/btc-newsletter.git
git push -u origin main
```

### 4. Deploy en Railway

1. Andá a [railway.app](https://railway.app) → **New Project**
2. **Deploy from GitHub repo** → seleccioná `btc-newsletter`
3. Railway detecta automáticamente el `railway.toml`

### 5. Configurar variables de entorno en Railway

En tu proyecto Railway → **Variables** → agregá:

| Variable | Valor |
|---|---|
| `APIFY_TOKEN` | tu token de Apify |
| `GMAIL_USER` | tu_cuenta@gmail.com |
| `GMAIL_APP_PASSWORD` | las 16 letras sin espacios |
| `RECIPIENT_EMAIL` | marianelaquiaro60@gmail.com |

### 6. ¡Listo! 🎉

Railway arranca `node scheduler.js` y todos los días a las 8 AM (hora Argentina) recibís el email.

---

## 🧪 Probar localmente antes del deploy

```bash
# 1. Instalar dependencias
npm install

# 2. Crear archivo .env con tus credenciales
cp .env.example .env
# Editá el .env con tus datos reales

# 3. Probar una sola vez (envía el email ahora)
node index.js

# 4. Iniciar el scheduler (corre en background, espera las 8 AM)
node scheduler.js
```

---

## ⏰ Cambiar el horario de envío

Editá `scheduler.js`, línea del `schedule`:

```js
const schedule = '0 8 * * *';   // 8:00 AM → cambiá el 8 por otra hora
```

Ejemplos:
- `'0 7 * * *'` → 7:00 AM
- `'30 8 * * *'` → 8:30 AM
- `'0 9 * * *'` → 9:00 AM

---

## 💰 Costos estimados

| Servicio | Costo |
|---|---|
| Railway (Hobby) | $5 USD/mes |
| Apify (por ejecución) | ~$0.35 USD/día → ~$10/mes |
| Gmail | Gratis |
| **Total** | **~$15 USD/mes** |

> Apify tiene créditos gratis de $5/mes para nuevas cuentas.

---

## 📧 Contenido del email

Cada mañana recibís:

- 💰 **Precio BTC** con cambios en 24h / 7d / 30d
- 😱 **Índice Miedo & Codicia** con interpretación
- 📊 **Señales técnicas**: RSI, MACD, spike de volumen, señal (BUY/SELL/HOLD)
- 🤖 **Análisis IA**: señal del día, zona de entrada/salida, posición de ciclo
- 💰 **Métricas**: market cap, volumen 24h, ATH
- 📰 **Top 5 noticias** de las últimas 24h

---

⚠️ *Disclaimer: Este newsletter es solo informativo. No constituye asesoramiento financiero.*
