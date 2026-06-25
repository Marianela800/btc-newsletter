require('dotenv').config();
const cron = require('node-cron');
const path = require('path');
const fs = require('fs');

function resolveModule(names) {
  for (const name of names) {
    const candidates = [
      path.join(__dirname, 'src', name),
      path.join(__dirname, name),
    ];
    for (const p of candidates) {
      if (fs.existsSync(p + '.js') || fs.existsSync(p)) return p;
    }
  }
  throw new Error(`Module not found: ${names.join(', ')}`);
}

const { fetchBitcoinData } = require(resolveModule(['cryptoData']));
const { buildEmailHTML }   = require(resolveModule(['emailTemplate']));
const { sendNewsletter }   = require(resolveModule(['mailer', 'correo electrónico']));

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

const schedule = '0 8 * * *';
const timezone = 'America/Argentina/Buenos_Aires';

console.log(`📅 Scheduler iniciado: ${schedule} (${timezone})`);
console.log(`📬 Destinatario: ${process.env.RECIPIENT_EMAIL}`);
console.log('⏳ Esperando próxima ejecución...\n');

cron.schedule(schedule, runNewsletter, { timezone });
runNewsletter();
