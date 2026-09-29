const fs = require('fs');
function fail(m) { console.error('CHECK FAILED: ' + m); process.exit(1); }

// ---------- dictionaries.ts: per-locale hero proof ----------
{
  const p = 'lib/i18n/dictionaries.ts';
  const lines = fs.readFileSync(p, 'utf8').split('\n');
  const proofs = [
    '      proof: ["母語で始めてOK", "止まらずに話し続けられる"]',
    '      proof: ["เริ่มด้วยภาษาของคุณ", "คุยต่อได้โดยไม่สะดุด"]',
    '      proof: ["모국어로 시작하세요", "막히지 않고 계속 대화"]',
    '      proof: ["用母语开场也没关系", "卡住也能继续聊下去"]',
    '      proof: ["用母語開場也沒關係", "卡住也能繼續聊下去"]',
    '      proof: ["Empieza en tu idioma", "Sigue hablando aunque te atasques"]'
  ];
  let k = 0;
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const isHeroCta = lines[i].indexOf('      secondaryCta: "') === 0 && lines[i + 1] === '    },';
    if (isHeroCta) {
      // ensure trailing comma on secondaryCta, then append proof
      if (out[out.length - 1].slice(-1) !== ',') out[out.length - 1] = out[out.length - 1] + ',';
      out.push(proofs[k++]);
      if (k > proofs.length) fail('too many matches');
    } else {
      out.push(lines[i]);
    }
  }
  if (k !== proofs.length) fail('inserted ' + k + ' of ' + proofs.length);
  fs.writeFileSync(p, out.join('\n'), 'utf8');
  console.log('dictionaries ok');
}

// ---------- HomePage.tsx: fallback without credit-card talk ----------
{
  const p = 'components/landing/HomePage.tsx';
  let s = fs.readFileSync(p, 'utf8');
  const a = '(dictionary.hero.proof ?? ["1-minute free conversation", "No credit card required"])';
  if (s.indexOf(a) < 0) fail('fallback not found');
  s = s.split(a).join('(dictionary.hero.proof ?? ["Start in your own language", "Keep talking even when stuck"])');
  fs.writeFileSync(p, s, 'utf8');
  console.log('HomePage ok');
}
console.log('ALL OK');
