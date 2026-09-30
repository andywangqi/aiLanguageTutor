const fs = require('fs');
const p = 'app/globals.css';
let s = fs.readFileSync(p, 'utf8');
const css = `
/* Workbench layout tightening: less chrome, more conversation */
.workbench-main {
  padding: 26px clamp(20px, 3.5vw, 56px) 24px;
  max-width: 1280px;
}
.workbench-topbar {
  margin-bottom: 18px;
}
.workbench-topbar h1 {
  font-size: 30px;
  margin-bottom: 4px;
}
.workbench-topbar p {
  font-size: 14px;
}
.workbench-sidebar {
  gap: 28px;
  padding: 28px 20px 24px;
}
.partner-banner {
  min-height: 0;
  margin-bottom: 16px;
  padding: 18px 24px;
  gap: 18px;
}
.workbench-mode-switcher {
  margin-bottom: 16px;
}
.workbench-grid {
  gap: 20px;
  grid-template-columns: minmax(0, 1.6fr) minmax(300px, 0.68fr);
}
.conversation-card {
  height: clamp(520px, calc(100dvh - 340px), 700px);
  min-height: 520px;
}
@media (max-width: 900px) {
  .workbench-topbar h1 {
    font-size: 26px;
  }
  .conversation-card {
    height: auto;
    min-height: 480px;
    max-height: none;
  }
}
`;
if (s.indexOf('Workbench layout tightening') < 0) s += css;
fs.writeFileSync(p, s, 'utf8');
console.log('layout patch ok');
