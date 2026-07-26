const { chromium } = require('playwright');
const path = require('path');
const http = require('http');
const fs = require('fs');

const ROOT = path.join(__dirname,'..','quote-site');
const MIME = {'.html':'text/html','.css':'text/css','.js':'application/javascript',
  '.webp':'image/webp','.png':'image/png','.ico':'image/x-icon','.xml':'application/xml',
  '.txt':'text/plain','.json':'application/json','.webmanifest':'application/manifest+json'};

const server = http.createServer((req,res)=>{
  let p = decodeURIComponent(req.url.split('?')[0]);
  let f = path.join(ROOT, p);
  try { if (fs.statSync(f).isDirectory()) f = path.join(f,'index.html'); } catch(e){}
  if (!fs.existsSync(f)) { res.writeHead(404); return res.end('nf'); }
  res.writeHead(200, {'Content-Type': MIME[path.extname(f)] || 'application/octet-stream'});
  fs.createReadStream(f).pipe(res);
});

(async () => {
  await new Promise(r => server.listen(8099, r));
  const browser = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
  });
  const errors = [];
  const targets = process.argv.slice(2);
  for (const spec of targets) {
    const [slug, w, h, tag] = spec.split('@');
    const ctx = await browser.newContext({ viewport:{width:+w, height:+h}, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    /* The sandbox has no outbound network, so the Google Maps iframe and the GHL
       DNI scripts fail to load and surface as console errors that are noise, not
       defects. Stub them so real errors stand out. */
    await page.route('**maps.google.com/**', r => r.fulfill({ status: 200,
      contentType: 'text/html', body: '<body style="margin:0;background:#e8eef2"></body>' }));
    await page.route('**leadconnectorhq.com/**', r => r.fulfill({ status: 200,
      contentType: 'application/javascript', body: '/* stub */' }));
    await page.route('**googletagmanager.com/**', r => r.fulfill({ status: 200,
      contentType: 'application/javascript', body: 'window.__gtagStubbed=true;' }));
    page.on('console', m => { if (m.type()==='error') errors.push(`${slug} ${w}px CONSOLE: ${m.text()}`); });
    page.on('requestfailed', r => errors.push(`${slug} ${w}px REQFAIL: ${r.url()} :: ${(r.failure()||{}).errorText}`));
    page.on('pageerror', e => errors.push(`${slug} ${w}px PAGEERROR: ${e.message}`));
    await page.goto(`http://localhost:8099/${slug}?gclid=TEST123&utm_source=google&utm_campaign=oc-core`, {waitUntil:'load'});
    await page.waitForTimeout(350);
    // horizontal overflow check
    const ov = await page.evaluate(() => ({
      scrollW: document.documentElement.scrollWidth,
      clientW: document.documentElement.clientWidth,
      offenders: [...document.querySelectorAll('*')]
        .filter(el => el.getBoundingClientRect().right > document.documentElement.clientWidth + 1)
        .slice(0,5).map(el => el.tagName+'.'+(el.className||'').toString().slice(0,40))
    }));
    if (ov.scrollW > ov.clientW + 1) {
      errors.push(`${slug} ${w}px HORIZONTAL OVERFLOW ${ov.scrollW}>${ov.clientW} :: ${ov.offenders.join(' | ')}`);
    }
    // tap target check
    const small = await page.evaluate(() => [...document.querySelectorAll('a,button,input,select')]
      .filter(el => {              // WCAG 2.5.8 exempts links inline in a sentence
        if (el.tagName !== 'A') return true;
        const p = el.closest('p,li,blockquote,figcaption');
        if (!p) return true;
        const txt = (p.textContent || '').trim().length;
        const own = (el.textContent || '').trim().length;
        return !(txt > own + 12);   // surrounded by prose → inline, exempt
      })
      .map(el => { const r = el.getBoundingClientRect(); return {t:el.tagName, w:Math.round(r.width), h:Math.round(r.height),
        txt:(el.textContent||el.getAttribute('aria-label')||'').trim().slice(0,26)}; })
      .filter(x => x.h > 0 && x.h < 24).slice(0,6));
    if (small.length) errors.push(`${slug} ${w}px SMALL TAP: ${JSON.stringify(small)}`);
    await page.screenshot({ path:path.join(__dirname,'..','.qa-shots',`${tag}.png`), fullPage: (h>2000) });
    await ctx.close();
  }
  await browser.close();
  server.close();
  console.log(errors.length ? "ISSUES:\n" + errors.join('\n') : "No console errors, no overflow, no sub-24px tap targets.");
})();
