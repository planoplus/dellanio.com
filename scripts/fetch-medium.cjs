// Fetch Medium RSS feed for @dellanio and save clean JSON to assets/articles.json.
// Can be run manually or as a scheduled cron job on the EC2 server.
// Example cron (every 6 hours): 0 */6 * * * cd /path/to/site && node scripts/fetch-medium.cjs
const fs = require('node:fs');
const path = require('node:path');

const USERNAME = 'dellanio';
const FEED_URL = `https://medium.com/feed/@${USERNAME}`;
const OUTPUT_FILE = path.resolve(__dirname, '../assets/articles.json');

async function fetchAndSave() {
    console.log(`[Medium Sync] Fetching feed for @${USERNAME}...`);
    try {
        const response = await fetch(FEED_URL, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch Medium feed: ${response.status} ${response.statusText}`);
        }

        const xml = await response.text();
        const items = [];
        const itemRegex = /<item>([\s\S]*?)<\/item>/g;
        let match;

        while ((match = itemRegex.exec(xml)) !== null && items.length < 5) {
            const block = match[1];
            const titleMatch = /<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/.exec(block) || /<title>([\s\S]*?)<\/title>/.exec(block);
            const linkMatch = /<link>([\s\S]*?)<\/link>/.exec(block);
            const dateMatch = /<pubDate>([\s\S]*?)<\/pubDate>/.exec(block);
            const contentMatch = /<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/.exec(block) || /<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/.exec(block);

            const title = titleMatch ? titleMatch[1].trim() : '';
            let link = linkMatch ? linkMatch[1].trim() : '';
            if (link.includes('?')) {
                link = link.split('?')[0];
            }

            const pubDate = dateMatch ? new Date(dateMatch[1]).toISOString() : '';
            let snippet = '';
            if (contentMatch) {
                snippet = contentMatch[1]
                    .replace(/<[^>]+>/g, ' ')
                    .replace(/\s+/g, ' ')
                    .trim();
                if (snippet.length > 175) {
                    snippet = snippet.slice(0, 175).replace(/[,.;:!\s]+$/, '') + '…';
                }
            }

            if (title && link) {
                items.push({ title, link, pubDate, snippet });
            }
        }

        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(items, null, 2), 'utf-8');
        console.log(`[Medium Sync] Successfully saved ${items.length} articles to ${OUTPUT_FILE}`);
    } catch (error) {
        console.error(`[Medium Sync] Error:`, error.message);
        process.exitCode = 1;
    }
}

fetchAndSave();
