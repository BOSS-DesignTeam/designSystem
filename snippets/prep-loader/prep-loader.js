/*
 * Prep Loader: a chef's knife slicing carrots, cucumber, tomatoes, red onion and lemons
 * on a maple cutting board. Canvas-based, no dependencies.
 *
 * Auto-mounts on every element with [data-prep-loader] when the script loads.
 * Manual use:  const loader = PrepLoader.mount(el);  ...  loader.destroy();
 * See README.md in this folder for markup and options.
 */
(function () {
'use strict';
const BASE = 340;
const BD = { tl:118, tr:782, bl:84, br:816, top:292, front:388, bottom:428 };
const CROP = { x:60, y:108, w:780, h:342 };
const X0 = 150, REST = { x: 690, y: 214 };
const ENTER = 0.9, CHOP = 0.46, IMPACT = 0.4, SWEEP = 0.95, FLY = 0.45;

const lerp = (a,b,t) => a + (b-a)*t;
const clamp01 = t => Math.max(0, Math.min(1, t));
const easeIn = t => t*t*t;
const easeOut = t => 1 - Math.pow(1-t, 3);
const easeInOut = t => t<.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2;
const easeBack = t => { const c=1.4; return 1 + (c+1)*Math.pow(t-1,3) + c*Math.pow(t-1,2); };
function rng(seed){ return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed>>>15, 1|seed); t = t + Math.imul(t ^ t>>>7, 61|t) ^ t; return ((t ^ t>>>14) >>> 0) / 4294967296; }; }
function caps(t, a, b){ let k = 1;
  if (t < a){ const u=(a-t)/a; k = Math.sqrt(Math.max(0,1-u*u)); }
  if (t > 1-b){ const u=(t-(1-b))/b; k = Math.min(k, Math.sqrt(Math.max(0,1-u*u))); }
  return Math.max(k, .28); }
const round = (R) => t => R * Math.max(.16, Math.sqrt(Math.max(0, 1 - (2*t-1)**2)));
function disc(c, x, y, r, fill){ c.beginPath(); c.arc(x, y, r, 0, Math.PI*2); c.fillStyle = fill; c.fill(); }

/* ---------- cross-section faces (drawn in a unit circle of radius r) ---------- */
function faceCarrot(c, r){
  disc(c,0,0,r,'#d9661b'); disc(c,0,0,r*.9,'#ec8429'); disc(c,0,0,r*.55,'#f3a446'); disc(c,0,0,r*.28,'#f6b85f');
  c.strokeStyle='rgba(200,95,20,.45)'; c.lineWidth=Math.max(.6, r*.05);
  for (let i=0;i<10;i++){ const a=i/10*Math.PI*2; c.beginPath(); c.moveTo(Math.cos(a)*r*.3, Math.sin(a)*r*.3); c.lineTo(Math.cos(a)*r*.52, Math.sin(a)*r*.52); c.stroke(); }
}
function faceCucumber(c, r){
  disc(c,0,0,r,'#2c5420'); disc(c,0,0,r*.9,'#9fc46a'); disc(c,0,0,r*.84,'#dcebb2'); disc(c,0,0,r*.5,'#c7de8f');
  for (let i=0;i<3;i++){ const a=i/3*Math.PI*2 - Math.PI/2;
    for (let j=0;j<3;j++){ const d=r*(.18+j*.1); c.save(); c.translate(Math.cos(a)*d, Math.sin(a)*d); c.rotate(a);
      c.beginPath(); c.ellipse(0,0,r*.06,r*.035,0,0,Math.PI*2); c.fillStyle='#f6f7df'; c.fill(); c.restore(); } }
}
function faceTomato(c, r){
  disc(c,0,0,r,'#c82f22'); disc(c,0,0,r*.9,'#e04a36');
  for (let i=0;i<4;i++){ const a=i/4*Math.PI*2 + Math.PI/4;
    c.save(); c.translate(Math.cos(a)*r*.48, Math.sin(a)*r*.48); c.rotate(a);
    c.beginPath(); c.ellipse(0,0,r*.27,r*.2,0,0,Math.PI*2); c.fillStyle='#f58a66'; c.fill();
    for (let j=-1;j<=1;j++){ c.beginPath(); c.ellipse(j*r*.1, r*.04*(j%2?1:-1), r*.045, r*.03, .4, 0, Math.PI*2); c.fillStyle='#f7d46e'; c.fill(); }
    c.restore(); }
  disc(c,0,0,r*.2,'#f06f52');
}
function faceOnion(c, r){
  const rings = 6;
  for (let i=0;i<rings;i++){ const rr = r*(1 - i/rings*.92);
    disc(c,0,0,rr, i===0 ? '#6a2145' : '#b9466f'); disc(c,0,0,rr*.94 - (i===0?r*.02:0), '#f6e8ef'); }
  disc(c,0,0,r*.08,'#e9cddb');
}
function faceLemon(c, r){
  disc(c,0,0,r,'#eebc12'); disc(c,0,0,r*.9,'#fbf1c8');
  const n=9;
  for (let i=0;i<n;i++){ const a0=i/n*Math.PI*2 + .05, a1=(i+1)/n*Math.PI*2 - .05;
    c.beginPath(); c.moveTo(Math.cos((a0+a1)/2)*r*.12, Math.sin((a0+a1)/2)*r*.12);
    c.arc(0,0,r*.82,a0,a1); c.closePath(); c.fillStyle='#f6d43a'; c.fill(); }
  disc(c,0,0,r*.1,'#fbf1c8');
}

/* ---------- side-profile details (clipped to body) ---------- */
function sideCarrot(c, f, x0, cy, xEnd, R){
  c.strokeStyle='rgba(150,60,10,.38)'; c.lineWidth=1.3;
  for (let i=0;i<34;i++){ const t=R(), x=x0+t*f.L; if (x>xEnd) continue; const y=cy+(R()-.5)*f.r(t)*1.6;
    c.beginPath(); c.moveTo(x-4,y); c.quadraticCurveTo(x, y-2, x+5, y); c.stroke(); }
}
function sideCucumber(c, f, x0, cy, xEnd, R){
  c.lineWidth=2.2; c.strokeStyle='rgba(176,210,120,.35)';
  for (const k of [-.62,-.22,.25]){ c.beginPath(); c.moveTo(x0, cy+k*f.rmax); c.lineTo(xEnd, cy+k*f.rmax); c.stroke(); }
  c.fillStyle='rgba(20,40,15,.45)';
  for (let i=0;i<40;i++){ const x=x0+R()*f.L; if (x>xEnd) continue; disc(c, x, cy+(R()-.5)*f.rmax*1.6, 1.3, c.fillStyle); }
}
function sideShine(c, f, x0, cy, xEnd){
  const cx = x0 + f.L*.36; if (cx > xEnd) return;
  c.beginPath(); c.ellipse(cx, cy - f.rmax*.5, f.rmax*.32, f.rmax*.16, -.25, 0, Math.PI*2); c.fillStyle='rgba(255,255,255,.35)'; c.fill();
}
function sideOnion(c, f, x0, cy, xEnd){
  c.strokeStyle='rgba(70,15,45,.4)'; c.lineWidth=1.2;
  for (let k=-3;k<=3;k++){ c.beginPath();
    for (let i=0;i<=40;i++){ const t=i/40, x=x0+t*f.L; const y=cy + k/3.6*f.r(t); i?c.lineTo(x,y):c.moveTo(x,y); } c.stroke(); }
  sideShine(c,f,x0,cy,xEnd);
}
function sideLemon(c, f, x0, cy, xEnd, R){
  c.fillStyle='rgba(170,120,0,.28)';
  for (let i=0;i<60;i++){ const t=.08+R()*.84, x=x0+t*f.L; if (x>xEnd) continue; disc(c, x, cy+(R()-.5)*f.r(t)*1.7, 1.1, c.fillStyle); }
  sideShine(c,f,x0,cy,xEnd);
}

/* ---------- end pieces drawn outside the body ---------- */
function carrotTops(c, f, x0, cy){
  c.lineCap='round';
  const stems=[[-58,-34],[-66,-12],[-52,8],[-40,-44],[-70,-26]];
  for (const [dx,dy] of stems){
    c.strokeStyle='#3f7a22'; c.lineWidth=3;
    c.beginPath(); c.moveTo(x0+6, cy); c.quadraticCurveTo(x0+dx*.4, cy+dy*.2, x0+dx, cy+dy); c.stroke();
    c.fillStyle='#5a9a32';
    for (let k=.45;k<=1;k+=.18){ const x=x0+6+(dx-6)*k, y=cy+dy*k*k;
      c.beginPath(); c.ellipse(x, y, 6, 2.6, Math.atan2(dy,dx)+.9, 0, Math.PI*2); c.fill(); }
  }
}
function tomatoStem(c, f, x0, cy){
  const x=x0+f.L*.5, y=cy-f.rmax+3;
  c.fillStyle='#3e7a2a';
  for (let i=0;i<5;i++){ const a=i/5*Math.PI*2; c.beginPath(); c.ellipse(x+Math.cos(a)*7, y+Math.sin(a)*2.4, 8, 2.4, a*.25, 0, Math.PI*2); c.fill(); }
  c.fillStyle='#2f5f1e'; c.fillRect(x-1.6, y-7, 3.2, 7);
}
function onionEnds(c, f, x0, cy, whole){
  c.strokeStyle='#b8a37f'; c.lineWidth=1.4;
  for (let i=-3;i<=3;i++){ c.beginPath(); c.moveTo(x0+3, cy+i*2); c.lineTo(x0-7-Math.abs(i)%2*3, cy+i*3.4); c.stroke(); }
  if (whole){ const x=x0+f.L; c.fillStyle='#8a4a5e'; c.beginPath(); c.moveTo(x-6, cy-5); c.quadraticCurveTo(x+10, cy-4, x+18, cy-12); c.quadraticCurveTo(x+8, cy+2, x-6, cy+5); c.fill(); }
}
function lemonEnds(c, f, x0, cy, whole){
  c.fillStyle='#e0aa0c';
  c.beginPath(); c.ellipse(x0+1, cy, 5, 6, 0, 0, Math.PI*2); c.fill();
  if (whole){ c.beginPath(); c.ellipse(x0+f.L-1, cy, 6, 6.5, 0, 0, Math.PI*2); c.fill(); }
}

const FOODS = [
  { name:'Carrots',    cut:'Rondelle · 6 mm coins',   par:'2 qt',   L:330, rmax:24, th:22,
    r:t => lerp(24,7,t)*caps(t,.03,.05), skin:['#f6a04c','#e57620','#b4511a'],
    face:faceCarrot, side:sideCarrot, before:carrotTops, bits:['#ec8429','#f3a446'] },
  { name:'Cucumber',   cut:'Rounds · 5 mm, skin on',  par:'1 qt',   L:322, rmax:22, th:22,
    r:t => 22*caps(t,.06,.06), skin:['#4c7d34','#2f5a22','#1d3a15'],
    face:faceCucumber, side:sideCucumber, bits:['#dcebb2','#c7de8f'] },
  { name:'Tomatoes',   cut:'Slices · 8 mm, burger',   par:'1 ⅓ pan', L:94, rmax:46, th:13,
    r:round(46), skin:['#f0604a','#d23a26','#9c2416'],
    face:faceTomato, side:(c,f,x0,cy,xe)=>sideShine(c,f,x0,cy,xe), after:(c,f,x0,cy,whole,tEnd)=>{ if(tEnd>.58) tomatoStem(c,f,x0,cy); }, bits:['#e04a36','#f58a66','#f7d46e'] },
  { name:'Red onion',  cut:'Rings · 3 mm, shaved',    par:'1 qt',   L:90, rmax:44, th:11,
    r:t => round(44)(t)*(t>.5 ? 1-(t-.5)*.35 : 1), skin:['#9a4068','#6e2346','#471430'],
    face:faceOnion, side:sideOnion, after:(c,f,x0,cy,whole)=>onionEnds(c,f,x0,cy,whole), bits:['#f6e8ef','#b9466f'] },
  { name:'Lemons',     cut:'Wheels · 5 mm, bar',      par:'1 ⅙ pan', L:112, rmax:34, th:13,
    r:t => round(34)(t)*.96 + 1.5, skin:['#fbd84a','#efbe14','#c99608'],
    face:faceLemon, side:sideLemon, after:(c,f,x0,cy,whole)=>lemonEnds(c,f,x0,cy,whole), bits:['#f6d43a','#fbf1c8'] },
];
for (const f of FOODS){
  f.n = Math.floor((f.L - f.th*.8) / f.th);
  f.cy = BASE - f.rmax*.96;
  f.up = BASE - (2*f.rmax + 26);
}
const cutX = (f, j) => X0 + f.L - f.th*(Math.min(j, f.n-1)+1);
const STEPS = ['Slicing carrots','Cutting cucumber rounds','Slicing tomatoes','Shaving red onion','Cutting lemon wheels'];

function roundBottom(c,x,y,w,h,r){ c.beginPath(); c.moveTo(x,y); c.lineTo(x+w,y); c.lineTo(x+w,y+h-r); c.quadraticCurveTo(x+w,y+h,x+w-r,y+h); c.lineTo(x+r,y+h); c.quadraticCurveTo(x,y+h,x,y+h-r); c.closePath(); }

function mount(root){
  if (!root || root._prepLoader) return root && root._prepLoader;
  const cv = root.querySelector('canvas') || root.insertBefore(document.createElement('canvas'), root.firstChild);
  cv.setAttribute('aria-hidden', 'true');
  const stepEl = root.querySelector('[data-prep-loader-step]');
  const ctx = cv.getContext('2d');
  const off = document.createElement('canvas');
  let scale = 1, raf = 0, last = 0, visible = true;
  const reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const S = { i:0, phase:'enter', t:0, k:0, hit:false, cuts:0, slices:[], bits:[], shake:0, clock:0 };

  const view = (c, dy=0) => c.setTransform(scale,0,0,scale,-CROP.x*scale,(-CROP.y+dy)*scale);

  function resize(){
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = cv.getBoundingClientRect().width || 300;
    cv.width = Math.round(w*dpr); cv.height = Math.round(w*dpr*CROP.h/CROP.w);
    scale = cv.width / CROP.w;
    off.width = cv.width; off.height = cv.height;
    paintBoard(off.getContext('2d'));
    render();
  }

  function paintBoard(c){
    view(c);
    const R = rng(7);
    c.save(); c.shadowColor='rgba(30,20,10,.32)'; c.shadowBlur=18; c.shadowOffsetY=10;
    roundBottom(c, BD.bl, BD.front, BD.br-BD.bl, BD.bottom-BD.front, 12);
    const fg = c.createLinearGradient(0,BD.front,0,BD.bottom); fg.addColorStop(0,'#b57941'); fg.addColorStop(1,'#8f5728');
    c.fillStyle=fg; c.fill(); c.restore();
    c.save(); roundBottom(c, BD.bl, BD.front, BD.br-BD.bl, BD.bottom-BD.front, 12); c.clip();
    c.strokeStyle='rgba(70,35,10,.3)'; c.lineWidth=2;
    for (let x=BD.bl+58;x<BD.br-20;x+=62+R()*30){ c.beginPath(); c.moveTo(x,BD.front); c.lineTo(x,BD.bottom); c.stroke(); }
    c.restore();
    c.beginPath(); c.moveTo(BD.tl,BD.top); c.lineTo(BD.tr,BD.top); c.lineTo(BD.br,BD.front); c.lineTo(BD.bl,BD.front); c.closePath();
    const tg = c.createLinearGradient(0,BD.top,0,BD.front); tg.addColorStop(0,'#dcae72'); tg.addColorStop(1,'#e8be85');
    c.fillStyle=tg; c.fill();
    c.save(); c.clip();
    for (let i=0;i<26;i++){ const y=BD.top+R()*(BD.front-BD.top), a=.1+R()*.16, amp=1+R()*3, ph=R()*6;
      c.strokeStyle=`rgba(150,95,45,${a})`; c.lineWidth=1.6+R()*2; c.beginPath();
      for (let x=BD.bl;x<=BD.br;x+=12){ const yy=y+Math.sin(x/90+ph)*amp; x===BD.bl?c.moveTo(x,yy):c.lineTo(x,yy); } c.stroke(); }
    c.restore();
    c.strokeStyle='rgba(255,236,200,.75)'; c.lineWidth=2.5; c.beginPath(); c.moveTo(BD.bl+6,BD.front); c.lineTo(BD.br-6,BD.front); c.stroke();
  }

  function doCut(){
    const f = FOODS[S.i], j = S.cuts, x = cutX(f, j);
    const mid = (x + f.th/2 - X0) / f.L, r = f.r(mid);
    const pileR = BD.br - 40 - f.rmax, pileL = X0 + f.L + 34 + f.rmax;
    const sp = Math.min(f.rmax*.95, (pileR - pileL) / Math.max(1, f.n-1));
    S.slices.push({ r, fx:x + f.th/2, fy:f.cy, tx:pileR - j*sp, ty:BASE + 6 - (j%2)*8, born:S.clock });
    S.cuts++; S.shake = 2.4;
    const n = f.name === 'Tomatoes' || f.name === 'Lemons' ? 7 : 4;
    for (let q=0;q<n;q++) S.bits.push({ x, y:f.cy + (Math.random()-.5)*r, vx:(Math.random()-.5)*260, vy:-120-Math.random()*200,
      s:2.4+Math.random()*2.6, col:f.bits[q % f.bits.length], land:BASE + (Math.random()-.5)*60, life:1.8, stuck:false });
  }
  function advance(){
    S.i = (S.i + 1) % FOODS.length;
    S.phase='enter'; S.t=0; S.k=0; S.hit=false; S.cuts=0; S.slices=[]; S.bits=[];
    if (stepEl) stepEl.textContent = STEPS[S.i];
  }
  function update(dt){
    S.clock += dt; S.t += dt;
    const f = FOODS[S.i];
    if (S.phase==='enter'){ if (S.t>=ENTER){ S.phase='chop'; S.t=0; } }
    else if (S.phase==='chop'){
      if (!S.hit && S.t/CHOP >= IMPACT){ S.hit=true; doCut(); }
      if (S.t>=CHOP){ S.t-=CHOP; S.k++; S.hit=false; if (S.k>=f.n){ S.phase='sweep'; S.t=0; } }
    }
    else if (S.phase==='sweep' && S.t>=SWEEP) advance();
    for (const b of S.bits){
      b.life -= dt; if (b.stuck) continue;
      b.vy += 980*dt; b.x += b.vx*dt; b.y += b.vy*dt;
      if (b.vy>0 && b.y>=b.land){ b.y=b.land; b.stuck=true; }
    }
    S.bits = S.bits.filter(b => b.life>0);
    S.shake *= Math.exp(-dt*22);
  }

  /* knife position = where the edge meets the middle of the food; tilt = rock of the blade */
  function knifePos(f){
    const p = S.t;
    if (S.phase==='enter'){ const e=easeInOut(clamp01(p/ENTER)); return { x:lerp(REST.x, cutX(f,0), e), y:lerp(REST.y, f.up, e), tilt:lerp(.1,0,e) }; }
    if (S.phase==='sweep'){ const e=easeInOut(clamp01(p/(SWEEP*.8))); return { x:lerp(cutX(f,f.n-1), REST.x, e), y:lerp(f.up, REST.y, e), tilt:lerp(0,.1,e) }; }
    const q = p/CHOP, k = S.k;
    let y, tilt;
    if (q < .1){ y = f.up; tilt = 0; }
    else if (q < IMPACT){ const e=easeIn((q-.1)/(IMPACT-.1)); y = lerp(f.up, BASE, e); tilt = Math.sin(e*Math.PI)*.05; }
    else if (q < .52){ y = BASE; tilt = 0; }
    else { const e=easeOut((q-.52)/.48); y = lerp(BASE, f.up, e); tilt = -Math.sin(e*Math.PI)*.04; }
    const x = q < .6 ? cutX(f,k) : lerp(cutX(f,k), cutX(f,k+1), easeInOut((q-.6)/.4));
    return { x, y, tilt };
  }

  function drawFace(f, x, y, r, sx, sy, thick){
    if (thick>0){ ctx.save(); ctx.translate(x, y+thick); ctx.scale(sx, sy); disc(ctx,0,0,r,f.skin[2]); ctx.restore(); }
    ctx.save(); ctx.translate(x, y); ctx.scale(sx, sy); f.face(ctx, r); ctx.restore();
  }
  function drawFood(f, xOff, tEnd, alpha){
    const x0 = X0 + xOff, cy = f.cy, xEnd = x0 + tEnd*f.L, whole = tEnd >= .999;
    ctx.save(); ctx.globalAlpha = alpha;
    ctx.beginPath(); ctx.ellipse((x0+xEnd)/2, BASE+3, (xEnd-x0)/2+6, 7, 0, 0, Math.PI*2); ctx.fillStyle='rgba(80,45,15,.22)'; ctx.fill();
    if (f.before) f.before(ctx, f, x0, cy);
    const N = 48; ctx.beginPath();
    for (let i=0;i<=N;i++){ const t=tEnd*i/N, x=x0+t*f.L, y=cy-f.r(t); i?ctx.lineTo(x,y):ctx.moveTo(x,y); }
    for (let i=N;i>=0;i--){ const t=tEnd*i/N; ctx.lineTo(x0+t*f.L, cy+f.r(t)); }
    ctx.closePath();
    const g = ctx.createLinearGradient(0, cy-f.rmax, 0, cy+f.rmax);
    g.addColorStop(0,f.skin[0]); g.addColorStop(.45,f.skin[1]); g.addColorStop(1,f.skin[2]);
    ctx.fillStyle=g; ctx.fill();
    ctx.save(); ctx.clip(); f.side(ctx, f, x0, cy, xEnd, rng(FOODS.indexOf(f)+11)); ctx.restore();
    if (f.after) f.after(ctx, f, x0, cy, whole, tEnd);
    if (!whole) drawFace(f, xEnd, cy, f.r(tEnd), .3, 1, 0);
    ctx.restore();
  }

  /* Chef's knife drawn in true profile (u = along the blade, v = up from the edge),
     then projected so the blade runs away from the viewer (up and right on screen). */
  function drawKnife(x, y, tilt){
    ctx.save();
    ctx.translate(x - 30, y + 23);
    ctx.transform(.5, -.38, 0, -1, 0, 0);
    ctx.rotate(-tilt);
    // handle: black scales over a full tang
    ctx.beginPath();
    ctx.moveTo(-12,13); ctx.bezierCurveTo(-50,9, -90,8, -116,12);
    ctx.quadraticCurveTo(-131,27, -117,44); ctx.bezierCurveTo(-90,47, -50,47, -12,45); ctx.closePath();
    let g = ctx.createLinearGradient(0,8,0,47); g.addColorStop(0,'#141212'); g.addColorStop(.55,'#2c2826'); g.addColorStop(.8,'#45403c'); g.addColorStop(1,'#1a1817');
    ctx.fillStyle=g; ctx.fill();
    ctx.strokeStyle='#9aa4a9'; ctx.lineWidth=1.8; ctx.stroke();
    for (const u of [-34,-64,-94]){
      ctx.beginPath(); ctx.ellipse(u,28,4,4,0,0,Math.PI*2); ctx.fillStyle='#c9d0d3'; ctx.fill();
      ctx.beginPath(); ctx.ellipse(u+1,29.5,1.6,1.6,0,0,Math.PI*2); ctx.fillStyle='#f4f7f8'; ctx.fill();
    }
    // blade
    ctx.beginPath();
    ctx.moveTo(0,0); ctx.lineTo(120,0);
    ctx.bezierCurveTo(166,0, 196,11, 214,31);
    ctx.bezierCurveTo(186,42, 150,50, 110,50);
    ctx.lineTo(0,50); ctx.closePath();
    g = ctx.createLinearGradient(0,0,0,50);
    g.addColorStop(0,'#f7f9fa'); g.addColorStop(.1,'#d3d9dc'); g.addColorStop(.17,'#eef1f3'); g.addColorStop(.55,'#c2cacf'); g.addColorStop(1,'#98a2a8');
    ctx.fillStyle=g; ctx.fill();
    ctx.save(); ctx.clip();
    ctx.fillStyle='rgba(255,255,255,.35)';
    ctx.beginPath(); ctx.moveTo(60,0); ctx.lineTo(84,0); ctx.lineTo(70,52); ctx.lineTo(46,52); ctx.closePath(); ctx.fill();
    ctx.fillStyle='rgba(255,255,255,.18)';
    ctx.beginPath(); ctx.moveTo(92,0); ctx.lineTo(100,0); ctx.lineTo(86,52); ctx.lineTo(78,52); ctx.closePath(); ctx.fill();
    ctx.restore();
    // grind line, edge highlight, spine
    ctx.beginPath(); ctx.moveTo(2,8); ctx.lineTo(122,8); ctx.bezierCurveTo(160,8, 188,17, 206,31);
    ctx.strokeStyle='rgba(70,80,86,.35)'; ctx.lineWidth=1; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(1,.8); ctx.lineTo(120,.8); ctx.bezierCurveTo(166,.8, 196,12, 212,31);
    ctx.strokeStyle='#ffffff'; ctx.lineWidth=1.4; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0,50); ctx.lineTo(110,50); ctx.bezierCurveTo(150,50, 186,42, 214,31);
    ctx.strokeStyle='#6f7a80'; ctx.lineWidth=2; ctx.stroke();
    // bolster
    ctx.beginPath(); ctx.moveTo(2,0); ctx.quadraticCurveTo(-4,24, 2,50); ctx.lineTo(-12,47); ctx.quadraticCurveTo(-17,28, -12,12); ctx.closePath();
    g = ctx.createLinearGradient(-14,0,2,0); g.addColorStop(0,'#7d878c'); g.addColorStop(.6,'#d6dcdf'); g.addColorStop(1,'#9aa4a9');
    ctx.fillStyle=g; ctx.fill();
    ctx.restore();
  }

  function render(){
    const f = FOODS[S.i];
    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0,0,cv.width,cv.height);
    ctx.drawImage(off,0,0);
    view(ctx, Math.sin(S.clock*90)*S.shake);
    let xOff = 0, sweepX = 0, alpha = 1;
    if (S.phase==='enter') xOff = lerp(-560, 0, easeBack(clamp01(S.t/ENTER)));
    if (S.phase==='sweep'){ const e = easeIn(clamp01(S.t/SWEEP)); sweepX = e*620; alpha = 1-e; }
    ctx.save(); ctx.beginPath(); ctx.rect(BD.bl, 0, BD.br-BD.bl, 1000); ctx.clip();
    ctx.save(); ctx.translate(sweepX,0);
    for (const b of S.bits) if (b.stuck){ ctx.globalAlpha = alpha*Math.min(1,b.life); ctx.beginPath(); ctx.ellipse(b.x,b.y,b.s*1.3,b.s*.7,0,0,Math.PI*2); ctx.fillStyle=b.col; ctx.fill(); }
    ctx.restore();
    const tEnd = S.cuts ? (cutX(f, S.cuts-1) - X0)/f.L : 1;
    ctx.save(); ctx.translate(sweepX,0); drawFood(f, xOff, tEnd, alpha); ctx.restore();
    ctx.save(); ctx.translate(sweepX,0); ctx.globalAlpha = alpha;
    for (const s of S.slices){
      const p = clamp01((S.clock - s.born)/FLY), e = easeOut(p);
      const x = lerp(s.fx, s.tx, e), y = lerp(s.fy, s.ty, e) - Math.sin(Math.PI*p)*34;
      drawFace(f, x, y, s.r, lerp(.3,1,e), lerp(1,.5,e), 4*e);
    }
    ctx.restore();
    ctx.restore();
    const k = knifePos(f); drawKnife(k.x, k.y, k.tilt);
    for (const b of S.bits) if (!b.stuck) disc(ctx, b.x, b.y, b.s, b.col);
  }

  function frame(now){
    raf = 0;
    if (!root.isConnected){ destroy(); return; }
    const dt = Math.min(.05, (now-last)/1000); last = now;
    update(dt); render();
    if (visible) raf = requestAnimationFrame(frame);
  }
  function start(){ if (!raf && !reduced){ last = performance.now(); raf = requestAnimationFrame(frame); } }

  // pause while offscreen or hidden
  const io = window.IntersectionObserver ? new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible) start(); }) : null;
  const ro = window.ResizeObserver ? new ResizeObserver(resize) : null;
  function destroy(){
    if (raf) cancelAnimationFrame(raf); raf = 0;
    io && io.disconnect(); ro && ro.disconnect();
    delete root._prepLoader;
  }

  if (stepEl) stepEl.textContent = STEPS[0];
  if (reduced){ for (let i=0;i<150;i++) update(1/60); S.shake = 0; }
  resize();
  io && io.observe(root); ro && ro.observe(cv);
  start();
  return (root._prepLoader = { destroy });
}

window.PrepLoader = { mount };
function autoMount(){ document.querySelectorAll('[data-prep-loader]').forEach(mount); }
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', autoMount); else autoMount();
})();
