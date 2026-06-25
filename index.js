require('dotenv').config();
const { fetchBitcoinData } = require('./src/cryptoData');
const { buildEmailHTML }   = require('./src/emailTemplate');
const { sendNewsletter }   = require('./src/mailer');

async function main() {
  console.log('🚀 Bitcoin Daily Newsletter — iniciando...\n');

  // 1. Fetch all data from Apify
  console.log('📡 Obteniendo datos de mercado...');
  const data = await fetchBitcoinData();

  // 2. Build the HTML email
  console.log('\n🎨 Generando newsletter...');
  const date = new Date().toLocaleDateString('es-ES', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
  const html = buildEmailHTML({ ...data, date });

  // 3. Send it
  console.log('\n📬 Enviando email...');
  await sendNewsletter(html, date);

  console.log('\n✅ Newsletter enviado exitosamente!');
}

main().catch(err => {
  console.error('❌ Error fatal:', err);
  process.exit(1);
});
