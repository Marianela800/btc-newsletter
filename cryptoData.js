const { ApifyClient } = require('apify-client');
const https = require('https');

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

async function runActor(actorId, input) {
       try {
                console.log(`▶ Running ${actorId}...`);
                const run = await client.actor(actorId).call(input, { waitSecs: 300 });
                const { items } = await client.dataset(run.defaultDatasetId).listItems();
                console.log(`✅ ${actorId} → ${items.length} items`);
                return items;
       } catch (err) {
                console.warn(`⚠️  ${actorId} failed: ${err.message}`);
                return [];
       }
}

async function fetchCryptoPanicNews() {
       return new Promise((resolve) => {
                const url = 'https://cryptopanic.com/api/v1/posts/?auth_token=pub_free&currencies=BTC&kind=news&public=true';
                https.get(url, (res) => {
                           let data = '';
                           res.on('data', (chunk) => { data += chunk; });
                           res.on('end', () => {
                                        try {
                                                       const json = JSON.parse(data);
                                                       const articles = (json.results || []).slice(0, 6).map((item) => ({
                                                                        title: item.title,
                                                                        url: item.url,
                                                                        source: item.source ? item.source.title : 'CryptoPanic',
                                                       }));
                                                       console.log(`✅ CryptoPanic news → ${articles.length} items`);
                                                       resolve(articles);
                                        } catch (e) {
                                                       console.warn(`⚠️  CryptoPanic parse error: ${e.message}`);
                                                       resolve([]);
                                        }
                           });
                }).on('error', (err) => {
                           console.warn(`⚠️  CryptoPanic fetch error: ${err.message}`);
                           resolve([]);
                });
       });
}

async function fetchBitcoinData() {
       const [priceData, fearGreed, news] = await Promise.all([
                // CoinGecko price + market data
                                                                  runActor('benthepythondev/crypto-intelligence', {
                                                                             mode: 'coin_details',
                                                                             coinIds: ['bitcoin'],
                                                                             vsCurrency: 'usd',
                                                                             days: 30,
                                                                             includeDetails: true,
                                                                  }),

                // Fear & Greed Index
                runActor('gio21/fear-greed-scraper', { limit: 7 }),

                // BTC News via CryptoPanic API (no scraping needed)
                fetchCryptoPanicNews(),
              ]);

  return { priceData, signals: [], fearGreed, news, aiAnalysis: [] };
}

module.exports = { fetchBitcoinData };
