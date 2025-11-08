// api/proxy.js
const APIs = [
  'https://tikwm.com/api/?url=',
  'https://api.tiklydown.eu.org/?url=',
  'https://api.tikmate.app/api/download?url='
];

const CACHE = new Map();

export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'URL required' });

  const cacheKey = url;
  if (CACHE.has(cacheKey)) {
    return res.json(CACHE.get(cacheKey));
  }

  for (const api of APIs) {
    try {
      const response = await fetch(api + encodeURIComponent(url), {
        headers: { 'User-Agent': 'TikTokDownloader/1.0' }
      });
      if (response.ok) {
        const data = await response.json();
        const videoUrl = data.data?.play || data.play || data.hdplay || data.video;
        if (videoUrl) {
          const result = { success: true, video: videoUrl };
          CACHE.set(cacheKey, result);
          return res.json(result);
        }
      }
    } catch (e) {
      console.log(`Failed: ${api}`);
    }
  }

  res.status(500).json({ error: 'Video not found' });
}
