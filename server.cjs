const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8490;
const PUBLIC_DIR = path.join(__dirname, 'public');
// Prioridade: DATA_DIR explícito > volume da Railway (setado automaticamente) > pasta local
const DATA_DIR = process.env.DATA_DIR || process.env.RAILWAY_VOLUME_MOUNT_PATH || path.join(__dirname, 'data');
const SCORES_FILE = path.join(DATA_DIR, 'scores.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

function loadScores() {
  try {
    return JSON.parse(fs.readFileSync(SCORES_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function saveScores(scores) {
  fs.writeFileSync(SCORES_FILE, JSON.stringify(scores, null, 2));
}

function sortScores(scores) {
  return scores.sort((a, b) => b.level - a.level || new Date(a.date) - new Date(b.date));
}

// geolocalização por IP (ip-api.com, gratuito) com cache em memória
const geoCache = new Map();
function getCountry(ip, cb) {
  if (!ip) return cb(null);
  if (geoCache.has(ip)) return cb(geoCache.get(ip));
  let done = false;
  const finish = (country) => {
    if (done) return;
    done = true;
    if (country !== null) geoCache.set(ip, country);
    cb(country);
  };
  const greq = http.get(`http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,countryCode`, { timeout: 3000 }, (r) => {
    let body = '';
    r.on('data', (d) => { body += d; if (body.length > 4096) greq.destroy(); });
    r.on('end', () => {
      try {
        const j = JSON.parse(body);
        finish(j.status === 'success' ? j.countryCode : null);
      } catch { finish(null); }
    });
  });
  greq.on('error', () => finish(null));
  greq.on('timeout', () => { greq.destroy(); finish(null); });
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === '/api/scores' && req.method === 'GET') {
    const scores = sortScores(loadScores()).slice(0, 50);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(scores));
  }

  if (url.pathname === '/api/geo' && req.method === 'GET') {
    const fwd = req.headers['x-forwarded-for'];
    const ip = fwd ? String(fwd).split(',')[0].trim() : (req.socket.remoteAddress || '');
    getCountry(ip, (country) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ country }));
    });
    return;
  }

  if (url.pathname === '/api/scores' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => { body += chunk; if (body.length > 10000) req.destroy(); });
    req.on('end', () => {
      try {
        const { name, level } = JSON.parse(body);
        const cleanName = String(name || '').trim().slice(0, 20);
        const cleanLevel = Math.max(0, Math.min(999, parseInt(level, 10) || 0));
        if (!cleanName) throw new Error('nome vazio');
        const scores = loadScores();
        const entry = { name: cleanName, level: cleanLevel, date: new Date().toISOString() };
        scores.push(entry);
        const sorted = sortScores(scores).slice(0, 200);
        saveScores(sorted);
        const rank = sorted.indexOf(entry) + 1;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, rank, scores: sorted.slice(0, 50) }));
      } catch {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: 'dados inválidos' }));
      }
    });
    return;
  }

  // arquivos estáticos
  let filePath = path.join(PUBLIC_DIR, url.pathname === '/' ? 'index.html' : url.pathname);
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('404');
    }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Inventor Memory rodando em http://localhost:${PORT}`);
});
