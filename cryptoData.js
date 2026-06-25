const { ApifyClient } = require('apify-client');
 
const client = new ApifyClient({ token: process.env.APIFY_TOKEN });
 
async function runActor(actorId, input) {
  try {
    console.log(`▶ Running ${actorId}...`);
    const run = await client.actor(actorId).call(input);
    const { items } = await client.dataset(run.defaultDatasetId).listItems();
    console.log(`✅ ${actorId} → ${items.length} items`);
    return items;
  } catch (err) {
    console.warn(`⚠️  ${actorId} failed: ${err.message}`);
    return [];
  }
}
 
async function fetchBitcoinData() {
  const [priceData, signals, fearGreed, news, aiAnalysis] = await Promise.all([
    runActor('benthepythondev/crypto-intelligence', {
      mode: 'coin',
      coinIds: ['bitcoin'],
      vsCurrency: 'usd',
      days: 30,
      includeDetails: true,
    }),
    runActor('cryptosignals/crypto-signals', { symbol: 'BTC' }),
    runActor('gio21/fear-greed-scraper', { limit: 7 }),
    runActor('code-node-tools/crypto-news-aggregator', {
      hoursBack: 24,
      maxArticles: 8,
      includeKeywords: ['bitcoin', 'BTC'],
      removeDuplicates: true,
      sortBy: 'date',
    }),
    runActor('yoloshii/crypto-ai-market-analyzer', {
      include_full_report: true,
    }),
  ]);
 
  return { priceData, signals, fearGreed, news, aiAnalysis };
}
 
module.exports = { fetchBitcoinData };
