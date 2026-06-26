const { ApifyClient } = require('apify-client');

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

async function runActor(actorId, input) {
   try {
        console.log(`▶ Running ${actorId}...`);
        const run = await client.actor(actorId).call(input);
        const { items } = await client.dataset(run.defaultDatasetId).listItems();
        console.log(`✅ ${actorId} → ${items.length} items`);
        return items;h
   } catch (err) {
        console.warn(`⚠️  ${actorId} failed: ${err.message}`);
        return [];
   }
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

        // BTC News via web scraper
        runActor('apify/web-scraper', {
               startUrls: [{ url: 'https://cointelegraph.com/tags/bitcoin' }],
               pageFunction: async function pageFunction(context) {
                        const { $, request } = context;
                        const articles = [];
                        $('article').slice(0, 6).each((i, el) => {
                                   const title = $(el).find('h2, h3').first().text().trim();
                                   const link = $(el).find('a').first().attr('href');
                                   if (title) articles.push({ title, url: link, source: 'CoinTelegraph' });
                        });
                        return articles;
               },
               maxPagesPerCrawl: 1,
        }),
      ]);

  // Flatten news (web-scraper returns nested arrays)
  const flatNews = news.flat ? news.flat() : news;

  return { priceData, signals: [], fearGreed, news: flatNews, aiAnalysis: [] };
}

module.exports = { fetchBitcoinData };
