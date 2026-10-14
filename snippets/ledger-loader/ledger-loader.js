/*
 * Ledger Loader: a back-office desk seen from above. A pen fills in an inventory count, an invoice,
 * a 3-way match, a bank rec, a journal entry and a month-end calendar, and a rubber stamp marks each one.
 * Canvas-based, no dependencies. Companion to Prep Loader.
 *
 * Auto-mounts on every element with [data-ledger-loader] when the script loads.
 * Manual use:  const loader = LedgerLoader.mount(el);  ...  loader.destroy();
 * See README.md in this folder for markup and options.
 */
(function () {
'use strict';
const W = 600, H = 360;
const PX = 200, PY = 50, PW = 200, PH = 260;
const PEN_REST = { x: 92, y: 214 }, STAMP_REST = { x: 490, y: 96 };
const IN = .6, STAMP = 1.3, EXIT_AT = 1.0, EXIT = .55;
const HAND = '"Segoe Print","Bradley Hand","Chalkboard SE","Marker Felt",cursive';
const TYPE = '"Helvetica Neue",Helvetica,Arial,sans-serif';
const INK = '#23408e', TEXT = '#2a2f33', GREY = '#848c92', RULE = '#e2e5e7', PAPER = '#fdfdfb';
const BLUE = '#2b4fa3', RED = '#b3362a', GREEN = '#2f7d4f';

const lerp = (a,b,t) => a + (b-a)*t;
const clamp01 = t => Math.max(0, Math.min(1, t));
const easeIn = t => t*t*t;
const easeOut = t => 1 - Math.pow(1-t, 3);
const easeInOut = t => t<.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2;
function rng(seed){ return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed>>>15, 1|seed); t = t + Math.imul(t ^ t>>>7, 61|t) ^ t; return ((t ^ t>>>14) >>> 0) / 4294967296; }; }
function rrect(c,x,y,w,h,r){ c.beginPath(); c.moveTo(x+r,y); c.arcTo(x+w,y,x+w,y+h,r); c.arcTo(x+w,y+h,x,y+h,r); c.arcTo(x,y+h,x,y,r); c.arcTo(x,y,x+w,y,r); c.closePath(); }
function txt(c, s, x, y, size, weight, color, align){ c.font = `${weight||400} ${size}px ${TYPE}`; c.fillStyle = color || TEXT; c.textAlign = align || 'left'; c.textBaseline = 'alphabetic'; c.fillText(s, x, y); }
function rule(c, x1, y, x2, color){ c.fillStyle = color || RULE; c.fillRect(x1, y, x2-x1, 1); }
function head(c, title, sub){ txt(c, title, 16, 28, 14, 700); txt(c, sub, 16, 43, 8.5, 400, GREY); rule(c, 16, 52, 184, '#cfd4d7'); }

/* ---------- pen strokes ---------- */
function withLengths(s){ const cum=[0]; for (let i=1;i<s.pts.length;i++){ const [a,b]=[s.pts[i-1],s.pts[i]]; cum.push(cum[i-1]+Math.hypot(b[0]-a[0], b[1]-a[1])); } s.cum=cum; return s; }
function pointAt(s, f){
  const L = s.cum[s.cum.length-1]*f;
  for (let i=1;i<s.pts.length;i++) if (s.cum[i] >= L){ const k=(L-s.cum[i-1])/((s.cum[i]-s.cum[i-1])||1); return [lerp(s.pts[i-1][0], s.pts[i][0], k), lerp(s.pts[i-1][1], s.pts[i][1], k)]; }
  return s.pts[s.pts.length-1];
}
function seq(start){
  let t = start; const out = [];
  const add = (s, dur) => { s.t0 = t; s.t1 = t + dur; t = s.t1 + .14; out.push(withLengths(s)); };
  return {
    out, end: () => out.length ? out[out.length-1].t1 : start,
    tick(x,y){ add({ pts:[[x-5,y-1],[x-1,y+4],[x+8,y-8]] }, .2); },
    line(x1,y1,x2,y2,d){ add({ pts:[[x1,y1],[x2,y2]] }, d || .26); },
    circle(cx,cy,r){ const p=[]; for (let i=0;i<=28;i++){ const a=-1.4+i/24*Math.PI*2; p.push([cx+Math.cos(a)*r*1.2, cy+Math.sin(a)*r]); } add({ pts:p }, .45); },
    write(x,y,text,size){ size = size || 12; const w = text.length*size*.56, n = Math.max(2, text.length*2), p=[];
      for (let i=0;i<=n;i++) p.push([x + w*i/n, y - size*.35 + (i%2 ? -1 : 1)*size*.28]);
      add({ write:true, x, y, text, size, w, pts:p }, .12 + .06*text.length); },
  };
}

/* ---------- the six documents ---------- */
const STEPS = [
  { caption:'Counting inventory', stamp:['COUNTED', BLUE],
    rows:[['Roma tomatoes','25 lb cs','4'],['AP flour','50 lb bag','2'],['Olive oil','3 L tin','6'],['Lemons','case','3'],['Parmesan','wheel','1'],['Heavy cream','qt','12']],
    body(c){ head(c,'INVENTORY COUNT','Walk-in cooler · Oct 31 · Month-end');
      txt(c,'ITEM',16,68,7.5,700,GREY); txt(c,'UNIT',104,68,7.5,700,GREY); txt(c,'COUNT',150,68,7.5,700,GREY); rule(c,16,73,184);
      this.rows.forEach(([n,u],i) => { const y=92+i*27; txt(c,n,16,y,10); txt(c,u,104,y,8.5,400,GREY);
        c.strokeStyle=RULE; c.lineWidth=1; c.strokeRect(148.5,y-12.5,36,17); rule(c,16,y+9,184,'#eef0f1'); }); },
    pen(s){ this.rows.forEach((r,i) => s.write(155, 92+i*27+1, r[2], 13)); } },

  { caption:'Uploading invoices', stamp:['RECEIVED', RED], actMin:2.6,
    rows:[['Roma tomatoes, 25 lb','$42.50'],['Lemons, case','$38.00'],['Red onion, 50 lb','$31.75'],['Cucumbers, case','$27.40'],['Carrots, 25 lb','$19.95']],
    body(c){ head(c,'INVOICE','Harbor Produce Co. · No. 20418 · Net 30');
      txt(c,'DESCRIPTION',16,68,7.5,700,GREY); txt(c,'AMOUNT',184,68,7.5,700,GREY,'right'); rule(c,16,73,184);
      this.rows.forEach(([d,a],i) => { const y=92+i*22; txt(c,d,16,y,10); txt(c,a,184,y,10,400,TEXT,'right'); });
      rule(c,16,200,184,'#cfd4d7'); txt(c,'TOTAL',16,218,10,700); txt(c,'$159.60',184,218,11,700,TEXT,'right'); },
    overlay(c, tl){
      const s = clamp01((tl-.2)/1.1);
      if (tl > .2 && tl < 1.35){ const y = s*PH;
        const g = c.createLinearGradient(0,y-34,0,y); g.addColorStop(0,'rgba(42,138,156,0)'); g.addColorStop(1,'rgba(42,138,156,.28)');
        c.fillStyle=g; c.fillRect(0,y-34,PW,34); c.fillStyle='rgba(42,138,156,.9)'; c.fillRect(0,y-1,PW,2); }
      if (tl > 1.2){ const p = clamp01((tl-1.35)/.95), a = clamp01((tl-1.2)/.15);
        c.save(); c.globalAlpha *= a;
        c.shadowColor='rgba(0,0,0,.18)'; c.shadowBlur=6; rrect(c,30,226,140,24,12); c.fillStyle='#ffffff'; c.fill(); c.shadowColor='transparent';
        rrect(c,40,240,120,4,2); c.fillStyle='#e3eaec'; c.fill();
        if (p>0){ rrect(c,40,240,120*p,4,2); c.fillStyle='#2a8a9c'; c.fill(); }
        txt(c, p<1 ? 'Uploading invoice…' : 'Uploaded', 100, 236, 7.5, 600, '#2a6f7d', 'center');
        c.restore(); } } },

  { caption:'Matching invoices to POs', stamp:['MATCHED', GREEN],
    rows:[['$42.50','Roma tomatoes'],['$38.00','Lemons'],['$31.75','Red onion'],['$27.40','Cucumbers']],
    body(c){ head(c,'3-WAY MATCH','PO 7731 · Receiving · Invoice 20418');
      txt(c,'PO 7731',16,72,7.5,700,GREY); txt(c,'INVOICE 20418',172,72,7.5,700,GREY,'right'); rule(c,16,77,184);
      this.rows.forEach(([a,n],i) => { const y=100+i*30; txt(c,a,16,y,10.5,600); txt(c,n,16,y+11,7.5,400,GREY); txt(c,a,172,y,10.5,600,TEXT,'right'); });
      rule(c,16,218,184,'#cfd4d7'); txt(c,'Variance',16,236,10,700); txt(c,'$0.00',172,236,10,700,TEXT,'right'); },
    pen(s){ this.rows.forEach((r,i) => { const y=100+i*30-4; s.line(56,y,130,y,.22); s.tick(184,y); }); s.line(138,241,174,241,.2); } },

  { caption:'Reconciling the bank', stamp:['RECONCILED', GREEN],
    rows:[['10/02','Deposit','4,812.30'],['10/05','Harbor Produce','-159.60'],['10/09','Payroll','-6,240.00'],['10/14','Deposit','5,106.85'],['10/21','Linen service','-212.40'],['10/28','Card fees','-88.17']],
    body(c){ head(c,'BANK RECONCILIATION','Operating ··4471 · October 2026');
      this.rows.forEach(([d,n,a],i) => { const y=76+i*24; txt(c,d,16,y,8.5,400,GREY); txt(c,n,46,y,10); txt(c,a,172,y,10,400,TEXT,'right'); rule(c,16,y+8,184,'#eef0f1'); });
      rule(c,16,212,184,'#cfd4d7'); txt(c,'Difference',16,230,10,700); txt(c,'$0.00',172,230,10,700,TEXT,'right'); },
    pen(s){ this.rows.forEach((r,i) => s.tick(184, 76+i*24-4)); s.line(138,235,174,235,.18); s.line(138,239,174,239,.18); } },

  { caption:'Posting journal entries', stamp:['POSTED', BLUE],
    rows:[['5100 Food cost','1,284.60',0],['2000 A/P','1,284.60',1],['6200 Utilities','412.18',0],['2100 Accrued exp.','412.18',1]],
    body(c){ head(c,'JOURNAL ENTRY','JE-1042 · Oct 31 · Month-end accruals');
      txt(c,'ACCOUNT',16,70,7.5,700,GREY); txt(c,'DEBIT',102,70,7.5,700,GREY); txt(c,'CREDIT',152,70,7.5,700,GREY); rule(c,16,75,184);
      c.fillStyle=RULE; c.fillRect(97,62,1,150); c.fillRect(147,62,1,150);
      this.rows.forEach(([a],i) => { const y=96+i*26; txt(c,a,16,y,9); rule(c,16,y+8,184,'#eef0f1'); });
      rule(c,16,196,184,'#cfd4d7'); txt(c,'TOTAL',16,214,9,700); },
    pen(s){ this.rows.forEach(([,v,col],i) => s.write(col ? 152 : 102, 96+i*26+1, v, 10)); s.write(102,215,'1,696.78',10); s.write(152,215,'1,696.78',10); } },

  { caption:'Closing the month', stamp:['CLOSED', RED],
    body(c){ head(c,'OCTOBER 2026','Period close · Restaurant P&L');
      'SMTWTFS'.split('').forEach((d,i) => txt(c,d,28+i*24,70,7.5,700,GREY,'center'));
      for (let d=1; d<=31; d++){ const k=d+3, col=k%7, row=Math.floor(k/7); txt(c,String(d),28+col*24,96+row*28,10,d===31?700:400,TEXT,'center'); } },
    pen(s){ for (let r=0;r<5;r++){ const first = r===0 ? 4 : 0; s.line(28+first*24-9, 96+r*28-4, 28+6*24+9, 96+r*28-4, .2); } s.circle(28+6*24, 96+4*28-4, 11); } },
];

for (const st of STEPS){
  const s = seq(IN + .35);
  if (st.pen) st.pen(s);
  st.strokes = s.out;
  st.stampAt = Math.max(st.strokes.length ? s.end() + .45 : 0, IN + (st.actMin || .4));
  st.impact = st.stampAt + .5;
  st.exitAt = st.stampAt + EXIT_AT;
  st.total = st.exitAt + EXIT + .1;
}

function penAt(st, t){
  const S = st.strokes, W2 = p => ({ x:PX+p[0], y:PY+p[1] });
  if (!S.length) return { ...PEN_REST, lift:0 };
  const first = S[0], last = S[S.length-1], leave = first.t0 - .35;
  if (t < leave) return { ...PEN_REST, lift:0 };
  if (t < first.t0){ const e=easeInOut((t-leave)/.35), a=W2(first.pts[0]); return { x:lerp(PEN_REST.x,a.x,e), y:lerp(PEN_REST.y,a.y,e), lift:Math.sin(Math.PI*e) }; }
  for (let i=0;i<S.length;i++){
    const s = S[i];
    if (t <= s.t1){ const p=W2(pointAt(s, clamp01((t-s.t0)/(s.t1-s.t0)))); return { ...p, lift:0 }; }
    const n = S[i+1];
    if (n && t < n.t0){ const e=(t-s.t1)/(n.t0-s.t1), a=W2(s.pts[s.pts.length-1]), b=W2(n.pts[0]); return { x:lerp(a.x,b.x,e), y:lerp(a.y,b.y,e), lift:Math.sin(Math.PI*e)*.5 }; }
  }
  const e = easeInOut(clamp01((t-last.t1)/.35)), a = W2(last.pts[last.pts.length-1]);
  return { x:lerp(a.x,PEN_REST.x,e), y:lerp(a.y,PEN_REST.y,e), lift:Math.sin(Math.PI*e) };
}

const MARK = { x:100, y:150 };
function stampAt(st, t){
  const ts = t - st.stampAt, tx = PX + MARK.x, ty = PY + MARK.y, LIFT = 40;
  if (ts < 0 || ts > STAMP) return { ...STAMP_REST, h:0 };
  if (ts < .35){ const e=easeInOut(ts/.35); return { x:lerp(STAMP_REST.x,tx,e), y:lerp(STAMP_REST.y,ty,e), h:LIFT*easeOut(ts/.35) }; }
  if (ts < .5) return { x:tx, y:ty, h:LIFT*(1-easeIn((ts-.35)/.15)) };
  if (ts < .6) return { x:tx, y:ty, h:0 };
  if (ts < .9) return { x:tx, y:ty, h:LIFT*easeOut((ts-.6)/.3) };
  const e = easeInOut((ts-.9)/.4); return { x:lerp(tx,STAMP_REST.x,e), y:lerp(ty,STAMP_REST.y,e), h:LIFT*(1-e) };
}

function mount(root){
  if (!root || root._ledgerLoader) return root && root._ledgerLoader;
  const cv = root.querySelector('canvas') || root.insertBefore(document.createElement('canvas'), root.firstChild);
  cv.setAttribute('aria-hidden', 'true');
  const stepEl = root.querySelector('[data-ledger-loader-step]');
  const ctx = cv.getContext('2d');
  const off = document.createElement('canvas');
  let scale = 1, raf = 0, last = 0, visible = true, clock = 0, idx = 0;
  const reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize(){
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = cv.getBoundingClientRect().width || 300;
    cv.width = Math.round(w*dpr); cv.height = Math.round(w*dpr*H/W);
    scale = cv.width / W;
    off.width = cv.width; off.height = cv.height;
    paintDesk(off.getContext('2d'));
    render();
  }

  function paintDesk(c){
    c.setTransform(scale,0,0,scale,0,0);
    c.clearRect(0,0,W,H);
    const R = rng(3);
    // leather desk blotter
    c.save(); c.shadowColor='rgba(20,30,25,.35)'; c.shadowBlur=16*scale; c.shadowOffsetY=6*scale;
    rrect(c,16,14,568,332,16); const g=c.createLinearGradient(0,14,0,346); g.addColorStop(0,'#40604f'); g.addColorStop(1,'#2f4a3d'); c.fillStyle=g; c.fill(); c.restore();
    c.save(); rrect(c,16,14,568,332,16); c.clip();
    for (let i=0;i<900;i++){ c.fillStyle = R()<.5 ? 'rgba(255,255,255,.035)' : 'rgba(0,0,0,.05)'; c.fillRect(16+R()*568, 14+R()*332, 1.4, 1.4); }
    c.restore();
    c.setLineDash([5,4]); c.strokeStyle='rgba(196,214,200,.5)'; c.lineWidth=1.3; rrect(c,25,23,550,314,10); c.stroke(); c.setLineDash([]);

    // coffee
    c.save(); c.shadowColor='rgba(0,0,0,.3)'; c.shadowBlur=8*scale; c.shadowOffsetY=3*scale;
    c.beginPath(); c.arc(104,96,42,0,Math.PI*2); c.fillStyle='#efede7'; c.fill(); c.restore();
    c.beginPath(); c.arc(104,96,34,0,Math.PI*2); c.strokeStyle='#dedad1'; c.lineWidth=1; c.stroke();
    c.save(); c.translate(104,96); c.rotate(.5); rrect(c,24,-6,20,12,6); c.fillStyle='#ffffff'; c.fill(); c.strokeStyle='#d8d4cb'; c.stroke(); c.restore();
    c.beginPath(); c.arc(104,96,29,0,Math.PI*2); c.fillStyle='#ffffff'; c.fill(); c.strokeStyle='#d8d4cb'; c.stroke();
    const cg=c.createRadialGradient(98,90,2,104,96,24); cg.addColorStop(0,'#7a4a2a'); cg.addColorStop(1,'#3b2414');
    c.beginPath(); c.arc(104,96,23,0,Math.PI*2); c.fillStyle=cg; c.fill();
    c.beginPath(); c.ellipse(97,88,7,3.5,-.6,0,Math.PI*2); c.fillStyle='rgba(255,235,210,.25)'; c.fill();

    // calculator, showing the JE total
    c.save(); c.shadowColor='rgba(0,0,0,.35)'; c.shadowBlur=8*scale; c.shadowOffsetY=3*scale;
    rrect(c,448,200,84,112,9); c.fillStyle='#2e3236'; c.fill(); c.restore();
    rrect(c,456,208,68,22,4); c.fillStyle='#b8c6ae'; c.fill();
    c.font = `600 12px ui-monospace, Menlo, Consolas, monospace`; c.fillStyle='#2b3328'; c.textAlign='right'; c.fillText('1,696.78', 520, 224);
    for (let r=0;r<4;r++) for (let k=0;k<4;k++){ rrect(c,457+k*17,238+r*17,13,12,3); c.fillStyle = (k===3 && r===3) ? '#c97a3a' : '#4b5157'; c.fill(); }
  }

  function drawPaper(st, t){
    let x = PX, alpha = 1;
    if (t < IN) x = lerp(-PW-24, PX, easeOut(t/IN));
    else if (t > st.exitAt){ const e = easeIn(clamp01((t-st.exitAt)/EXIT)); x = lerp(PX, W+24, e); alpha = 1 - e*.7; }
    ctx.save(); ctx.globalAlpha = alpha; ctx.translate(x, PY);
    ctx.save(); ctx.shadowColor='rgba(10,20,15,.35)'; ctx.shadowBlur=10*scale; ctx.shadowOffsetY=4*scale;
    ctx.fillStyle=PAPER; ctx.fillRect(0,0,PW,PH); ctx.restore();
    st.body(ctx);
    if (st.overlay) st.overlay(ctx, t - IN);
    ctx.strokeStyle=INK; ctx.fillStyle=INK; ctx.lineWidth=1.7; ctx.lineCap='round'; ctx.lineJoin='round';
    for (const s of st.strokes){
      if (t <= s.t0) continue;
      const f = clamp01((t-s.t0)/(s.t1-s.t0));
      if (s.write){
        ctx.save(); if (f < 1){ ctx.beginPath(); ctx.rect(s.x-3, s.y-s.size*1.3, s.w*f+3, s.size*1.8); ctx.clip(); }
        ctx.font = `${s.size}px ${HAND}`; ctx.textAlign='left'; ctx.fillText(s.text, s.x, s.y); ctx.restore();
      } else {
        const L = s.cum[s.cum.length-1]*f; ctx.beginPath(); ctx.moveTo(s.pts[0][0], s.pts[0][1]);
        for (let i=1;i<s.pts.length;i++){ if (s.cum[i] <= L) ctx.lineTo(s.pts[i][0], s.pts[i][1]); else { const p=pointAt(s,f); ctx.lineTo(p[0],p[1]); break; } }
        ctx.stroke();
      }
    }
    if (t >= st.impact) drawMark(st);
    ctx.restore();
  }

  function drawMark(st){
    const [word, color] = st.stamp;
    ctx.save(); ctx.translate(MARK.x, MARK.y); ctx.rotate(-.16); ctx.globalAlpha *= .86;
    ctx.strokeStyle=color; ctx.lineWidth=3; rrect(ctx,-52,-19,104,38,5); ctx.stroke();
    ctx.lineWidth=1; rrect(ctx,-47,-14,94,28,3); ctx.stroke();
    ctx.font = `800 20px ${TYPE}`; const m = ctx.measureText(word).width, sz = Math.min(20, 20*84/m);
    ctx.font = `800 ${sz}px ${TYPE}`; ctx.fillStyle=color; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(word, 0, 1);
    const R = rng(word.length*31); ctx.fillStyle=PAPER;
    for (let i=0;i<70;i++) ctx.fillRect(-52+R()*104, -19+R()*38, .6+R()*1.6, .6+R()*1.2);
    ctx.restore();
  }

  function drawPen(p){
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(Math.PI/3);
    ctx.save(); ctx.translate(3+p.lift*7, -2-p.lift*5); ctx.globalAlpha = .28 - p.lift*.1;
    ctx.fillStyle='#000'; ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(14,-5); ctx.lineTo(118,-5); ctx.lineTo(118,5); ctx.lineTo(14,5); ctx.closePath(); ctx.fill(); ctx.restore();
    const s = 1 + p.lift*.06; ctx.scale(s, s);
    let g = ctx.createLinearGradient(0,-5,0,5); g.addColorStop(0,'#e8ecee'); g.addColorStop(.5,'#a9b1b6'); g.addColorStop(1,'#7c858a');
    ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(15,-4.6); ctx.lineTo(15,4.6); ctx.closePath(); ctx.fillStyle=g; ctx.fill();
    ctx.beginPath(); ctx.arc(.5,0,1.1,0,Math.PI*2); ctx.fillStyle=INK; ctx.fill();
    g = ctx.createLinearGradient(0,-5,0,5); g.addColorStop(0,'#4a5f9e'); g.addColorStop(.4,'#26356a'); g.addColorStop(1,'#111a36');
    rrect(ctx,14,-5,104,10,4); ctx.fillStyle=g; ctx.fill();
    ctx.fillStyle='rgba(0,0,0,.25)'; ctx.fillRect(15,-5,22,10);
    ctx.fillStyle='rgba(255,255,255,.28)'; ctx.fillRect(38,-3.6,76,1.4);
    rrect(ctx,72,-7.5,40,3,1.5); ctx.fillStyle='#c9d0d3'; ctx.fill();
    ctx.restore();
  }

  function drawStamp(p, color){
    const s = 1 + p.h/150;
    ctx.save(); ctx.translate(p.x + 3 + p.h*.35, p.y + 4 + p.h*.5); ctx.globalAlpha = Math.max(.12, .3 - p.h*.004);
    rrect(ctx,-54,-21,108,42,6); ctx.fillStyle='#000'; ctx.fill(); ctx.restore();
    ctx.save(); ctx.translate(p.x, p.y); ctx.scale(s, s);
    rrect(ctx,-54,-21,108,42,6); ctx.fillStyle='#2e2622'; ctx.fill();
    const g = ctx.createLinearGradient(0,-17,0,17); g.addColorStop(0,'#8a5e3b'); g.addColorStop(1,'#5e3d24');
    rrect(ctx,-50,-17,100,34,4); ctx.fillStyle=g; ctx.fill();
    ctx.fillStyle=color; ctx.fillRect(-44,-3,16,6);
    const k = ctx.createRadialGradient(-4,-5,2,0,0,17); k.addColorStop(0,'#d9a06a'); k.addColorStop(1,'#7a4c26');
    ctx.beginPath(); ctx.arc(0,0,16,0,Math.PI*2); ctx.fillStyle=k; ctx.fill();
    ctx.beginPath(); ctx.ellipse(-5,-6,5,2.6,-.6,0,Math.PI*2); ctx.fillStyle='rgba(255,240,220,.35)'; ctx.fill();
    ctx.restore();
  }

  function render(){
    const st = STEPS[idx], t = clock;
    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0,0,cv.width,cv.height);
    ctx.drawImage(off,0,0);
    const since = t - st.impact, shake = since > 0 && since < .3 ? Math.sin(since*90)*2.2*Math.exp(-since*18) : 0;
    ctx.setTransform(scale,0,0,scale,0,shake*scale);
    drawPaper(st, t);
    drawPen(penAt(st, t));
    drawStamp(stampAt(st, t), st.stamp[1]);
  }

  function update(dt){
    clock += dt;
    if (clock >= STEPS[idx].total){
      clock -= STEPS[idx].total; idx = (idx + 1) % STEPS.length;
      if (stepEl) stepEl.textContent = STEPS[idx].caption;
    }
  }

  function frame(now){
    raf = 0;
    if (!root.isConnected){ destroy(); return; }
    const dt = Math.min(.05, (now-last)/1000); last = now;
    update(dt); render();
    if (visible) raf = requestAnimationFrame(frame);
  }
  function start(){ if (!raf && !reduced){ last = performance.now(); raf = requestAnimationFrame(frame); } }

  const io = window.IntersectionObserver ? new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible) start(); }) : null;
  const ro = window.ResizeObserver ? new ResizeObserver(resize) : null;
  function destroy(){
    if (raf) cancelAnimationFrame(raf); raf = 0;
    io && io.disconnect(); ro && ro.disconnect();
    delete root._ledgerLoader;
  }

  if (stepEl) stepEl.textContent = STEPS[0].caption;
  if (reduced) clock = STEPS[0].impact + .1;
  resize();
  io && io.observe(root); ro && ro.observe(cv);
  start();
  return (root._ledgerLoader = { destroy });
}

window.LedgerLoader = { mount };
function autoMount(){ document.querySelectorAll('[data-ledger-loader]').forEach(mount); }
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', autoMount); else autoMount();
})();
