const { chromium } = require('playwright');
const path = require('path'); const http = require('http'); const fs = require('fs');
const ROOT = path.join('/home/user/speedyla','quote-site');
const MIME = {'.html':'text/html','.css':'text/css','.js':'application/javascript','.webp':'image/webp','.png':'image/png','.ico':'image/x-icon','.xml':'application/xml','.txt':'text/plain','.json':'application/json','.webmanifest':'application/manifest+json'};
const server = http.createServer((req,res)=>{
  let p = decodeURIComponent(req.url.split('?')[0]); let f = path.join(ROOT, p);
  try { if (fs.statSync(f).isDirectory()) f = path.join(f,'index.html'); } catch(e){}
  if (!fs.existsSync(f)) { res.writeHead(404); return res.end('nf'); }
  res.writeHead(200, {'Content-Type': MIME[path.extname(f)] || 'application/octet-stream'});
  fs.createReadStream(f).pipe(res);
});
(async () => {
  await new Promise(r => server.listen(8098, r));
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const slug of (process.argv[3]||'').split(',')) {
    const w = +(process.argv[2]||1440);
    const ctx = await browser.newContext({ viewport:{width:w, height:1000} });
    const page = await ctx.newPage();
    await page.goto(`http://localhost:8098/${slug}`, {waitUntil:'load'});
    await page.waitForTimeout(200);
    const out = await page.evaluate(() => {
      const sel = ['.wrap','.prose','.sec-head','.faqs','.final .sec-head','.callout','.gal','.tb'];
      const res = [];
      for (const s of sel) {
        document.querySelectorAll(s).forEach((el,i) => {
          const r = el.getBoundingClientRect();
          if (r.height < 5) return;
          res.push(`${s}[${i}] x=${Math.round(r.x)} w=${Math.round(r.width)} h=${Math.round(r.height)} right-gap=${Math.round(document.documentElement.clientWidth - r.right)}`);
        });
      }
      return res;
    });
    console.log('=== ' + slug + ' @' + w);
    console.log(out.join('\n'));
    await ctx.close();
  }
  await browser.close(); server.close();
})();
