require('dotenv').config();
const cron = require('node-cron');
const { fetchBitcoinData } = require('./src/cryptoData');
const { buildEmailHTML }   = require('./src/emailTemplate');
const { sendNewsletter }   = require('./src/mailer');

async function runNewsletter() {
  console.log(`\n[${new Date().toISOString()}] 🚀 Ejecutando Bitcoin Daily Newsletter...`);
  try {
    const data = await fetchBitcoinData();
    const date = new Date().toLocaleDateString('es-ES', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
    const html = buildEmailHTML({ ...data, date });
    await sendNewsletter(html, date);
    console.log(`[${new Date().toISOString()}] ✅ Newsletter enviado!\n`);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] ❌ Error:`, err.message);
  }
}

// ─── Schedule ───────────────────────────────────────────────────────────────
// Cron: "0 8 * * *" = todos los días a las 8:00 AM
// Zona horaria: America/Argentina/Buenos_Aires (UTC-3)
//
// Si querés cambiar la hora, editá el primer campo:
//   "0 7 * * *" → 7 AM
//   "30 8 * * *" → 8:30 AM
//   "0 9 * * *" → 9 AM
// ─────────────────────────────────────────────────────────────────────────────
const schedule = '0 8 * * *';
const timezone = 'America/Argentina/Buenos_Aires';

console.log(`📅 Scheduler iniciado. Newsletter programado: ${schedule} (${timezone})`);
console.log(`📬 Destinatario: ${process.env.RECIPIENT_EMAIL}`);
console.log('⏳ Esperando próxima ejecución...\n');

cron.schedule(schedule, runNewsletter, { timezone });

// Para probar inmediatamente al iniciar el scheduler, descomentar la línea siguiente:
// runNewsletter();
