// Elements
const el = {
  console: document.getElementById('console'),
  bar1: document.getElementById('bar1'),
  bar2: document.getElementById('bar2'),
  bar3: document.getElementById('bar3'),
  threat: document.getElementById('threat'),
  uptime: document.getElementById('uptime'),
  agents: document.getElementById('agents'),
  incidents: document.getElementById('incidents'),
  world: document.getElementById('world'),
  arcs: document.getElementById('arcs'),
  pulses: document.getElementById('pulses'),
  popups: document.getElementById('popups'),
  pauseLogs: document.getElementById('pauseLogs'),
  clearLogs: document.getElementById('clearLogs'),
  counter: document.getElementById('counter'),
  traceback: document.getElementById('traceback'),
  vault: document.getElementById('vault')
};

// Utilities
const rnd = (min, max) => Math.random() * (max - min) + min;
const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];
const pad = (n) => String(n).padStart(2, '0');

const randomIP = () => Array(4).fill(0).map(() => Math.floor(Math.random() * 256)).join('.');

// Simple equirectangular projection to SVG space (1000x500)
function project([lon, lat]){
  const x = (lon + 180) / 360 * 1000;
  const y = (90 - lat) / 180 * 500;
  return [x, y];
}

// City catalog (realistic coordinates)
const cities = [
  {n:'New York, US', c:[-74.006, 40.7128]},
  {n:'Los Angeles, US', c:[-118.2437, 34.0522]},
  {n:'Chicago, US', c:[-87.6298, 41.8781]},
  {n:'Toronto, CA', c:[-79.3832, 43.6532]},
  {n:'Mexico City, MX', c:[-99.1332, 19.4326]},
  {n:'São Paulo, BR', c:[-46.6333, -23.5505]},
  {n:'Rio de Janeiro, BR', c:[-43.1729, -22.9068]},
  {n:'Buenos Aires, AR', c:[-58.3816, -34.6037]},
  {n:'London, UK', c:[-0.1276, 51.5072]},
  {n:'Paris, FR', c:[2.3522, 48.8566]},
  {n:'Madrid, ES', c:[-3.7038, 40.4168]},
  {n:'Berlin, DE', c:[13.4050, 52.5200]},
  {n:'Rome, IT', c:[12.4964, 41.9028]},
  {n:'Cairo, EG', c:[31.2357, 30.0444]},
  {n:'Lagos, NG', c:[3.3792, 6.5244]},
  {n:'Nairobi, KE', c:[36.8219, -1.2921]},
  {n:'Johannesburg, ZA', c:[28.0473, -26.2041]},
  {n:'Moscow, RU', c:[37.6173, 55.7558]},
  {n:'Istanbul, TR', c:[28.9784, 41.0082]},
  {n:'Dubai, AE', c:[55.2708, 25.2048]},
  {n:'Mumbai, IN', c:[72.8777, 19.0760]},
  {n:'Delhi, IN', c:[77.1025, 28.7041]},
  {n:'Singapore, SG', c:[103.8198, 1.3521]},
  {n:'Bangkok, TH', c:[100.5018, 13.7563]},
  {n:'Hong Kong, CN', c:[114.1694, 22.3193]},
  {n:'Seoul, KR', c:[126.9780, 37.5665]},
  {n:'Tokyo, JP', c:[139.6503, 35.6762]},
  {n:'Osaka, JP', c:[135.5022, 34.6937]},
  {n:'Sydney, AU', c:[151.2093, -33.8688]},
  {n:'Melbourne, AU', c:[144.9631, -37.8136]},
  {n:'Auckland, NZ', c:[174.7633, -36.8485]},
  {n:'San Francisco, US', c:[-122.4194, 37.7749]},
  {n:'Seattle, US', c:[-122.3321, 47.6062]},
  {n:'Vancouver, CA', c:[-123.1207, 49.2827]},
  {n:'Santiago, CL', c:[-70.6693, -33.4489]},
  {n:'Lima, PE', c:[-77.0428, -12.0464]},
];

// Telemetry logging
let logsPaused = false;
function log(message){
  if (logsPaused) return;
  const line = document.createElement('div');
  line.className = 'line';
  line.innerHTML = message;
  el.console.appendChild(line);
  el.console.scrollTop = el.console.scrollHeight;
}

function randomLog(){
  const a = sample(cities); const b = sample(cities);
  const ipA = randomIP(); const ipB = randomIP();
  const proto = sample(['TLS1.3','QUIC','SSH','IPSec','WireGuard']);
  const port = sample([22, 53, 80, 123, 443, 500, 3389, 8443, 27017]);
  const msgs = [
    `Inbound handshake <span class="hl">${proto}</span> from ${a.n} ${ipA}:${port}`,
    `Egress packet mirror ${ipB} &rarr; ${ipA} (${proto})`,
    `Auth probe denied from ${b.n} ${ipB}`,
    `Decrypting cipher suite ${proto} from ${a.n}`,
    `Launching traceroute to ${b.n} ${ipB}`,
    `Anomaly detected: ${ipA} &harr; ${ipB} (${sample(['DoH','Tor exit','Botnet','C2'])})`
  ];
  return sample(msgs);
}

setInterval(()=>log(randomLog()), 450);

// Threat / breach model
let breachLevel = 0; // 0..100
function updateBars(){
  const p1 = Math.min(breachLevel, 30);
  const p2 = Math.max(Math.min(breachLevel-30, 30), 0);
  const p3 = Math.max(Math.min(breachLevel-60, 40), 0);
  el.bar1.style.width = p1 + '%';
  el.bar2.style.width = p2 + '%';
  el.bar3.style.width = p3 + '%';
  const threatPct = Math.min(100, Math.round(breachLevel));
  el.threat.textContent = `${threatPct}%`;
}

function stepAttack(){
  const step = sample([3,4,5,6]);
  breachLevel = Math.min(100, breachLevel + step);
  updateBars();
  if (breachLevel === 30) popup('Perimeter breached');
  if (breachLevel === 60) popup('Internal firewall compromised');
  if (breachLevel >= 100){
    popup('Core systems infiltrated: data exfiltration in progress');
    addIncident('Core exfiltration attempt', 'high');
    breachLevel = 0;
  }
}
setInterval(stepAttack, 1100);

// World arcs
function drawArc(aCity, bCity, mode='inbound'){
  const [x1,y1] = project(aCity.c);
  const [x2,y2] = project(bCity.c);
  const mx = (x1+x2)/2; const my = (y1+y2)/2;
  const dx = x2-x1; const dy = y2-y1;
  const dist = Math.hypot(dx, dy);
  const lift = Math.min(140, 30 + dist/6); // arc height
  const nx = -dy / dist; const ny = dx / dist; // normal vector
  const cx = mx + nx * lift; const cy = my + ny * lift;

  const path = document.createElementNS('http://www.w3.org/2000/svg','path');
  path.setAttribute('d', `M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`);
  path.setAttribute('class', `arc ${mode==='outbound'?'outbound':''} ${mode==='neutral'?'neutral':''}`);
  el.arcs.appendChild(path);

  const len = path.getTotalLength();
  path.style.strokeDasharray = `${len/18} ${len/9}`;
  path.style.strokeDashoffset = `${len}`;
  path.style.transition = 'stroke-dashoffset 2.8s linear';
  // kick animation
  requestAnimationFrame(()=>{ path.style.strokeDashoffset = '0'; });

  // Pulse at destination
  const endPulse = document.createElementNS('http://www.w3.org/2000/svg','circle');
  const [px,py] = [x2,y2];
  endPulse.setAttribute('cx', px.toFixed(1));
  endPulse.setAttribute('cy', py.toFixed(1));
  endPulse.setAttribute('r', '2.5');
  endPulse.setAttribute('class', `pulse ${mode==='outbound'?'outbound':''} ${mode==='neutral'?'neutral':''}`);
  el.pulses.appendChild(endPulse);

  // Grow/shrink pulse
  let t = 0; const grow = setInterval(()=>{
    t += 0.06; const r = 2.5 + Math.sin(t)*1.8; endPulse.setAttribute('r', String(Math.max(1.2, r)));
  }, 30);

  setTimeout(()=>{ path.remove(); endPulse.remove(); clearInterval(grow); }, 3200);

  // Incident feed
  addIncident(`${mode==='outbound'?'Egress':'Ingress'} ${aCity.n.split(',')[0]} → ${bCity.n.split(',')[0]}`, sample(['low','med','high']));
}

function addIncident(text, sev='low'){
  const li = document.createElement('li');
  const loc = document.createElement('span');
  const s = document.createElement('span');
  loc.className = 'loc'; loc.textContent = text;
  s.className = `sev ${sev}`; s.textContent = sev.toUpperCase();
  li.appendChild(loc); li.appendChild(s);
  el.incidents.prepend(li);
  while (el.incidents.children.length > 6) el.incidents.lastChild.remove();
}

// Attack generator
function randomArc(){
  let src = sample(cities), dst = sample(cities);
  while (dst === src) dst = sample(cities);
  const mode = sample(['inbound','outbound','neutral']);
  drawArc(src, dst, mode);
  log(`${mode === 'outbound' ? 'Egress' : 'Ingress'} route ${src.n} → ${dst.n}`);
}
setInterval(randomArc, 900);

// Uptime counter
const start = Date.now();
setInterval(()=>{
  const s = Math.floor((Date.now() - start)/1000);
  const hh = Math.floor(s/3600); const mm = Math.floor((s%3600)/60); const ss = s%60;
  el.uptime.textContent = `${pad(hh)}:${pad(mm)}:${pad(ss)}`;
}, 1000);

// Agents count flicker
setInterval(()=>{
  const base = 12; el.agents.textContent = String(base + Math.floor(rnd(-2,4)));
}, 1500);

// Controls
el.pauseLogs.addEventListener('click', ()=>{
  logsPaused = !logsPaused; el.pauseLogs.textContent = logsPaused ? 'Resume' : 'Pause';
});
el.clearLogs.addEventListener('click', ()=>{ el.console.innerHTML = ''; });
el.counter.addEventListener('click', ()=>{
  breachLevel = 0; updateBars();
  popup('Countermeasure deployed, attacker traced');
  addIncident('Countermeasure deployed', 'med');
});
el.traceback.addEventListener('click', ()=>{
  popup('Initiating traceback across nodes…');
  setTimeout(()=> popup('Attribution probability: 87%'), 1200);
});

// Vault interactions
el.vault.querySelectorAll('li').forEach(li=>{
  li.addEventListener('click', (e)=>{
    e.stopPropagation();
    popup('Accessing ' + li.textContent.trim());
  });
});

// Popups
function popup(text){
  const pop = document.createElement('div');
  pop.className = 'popup'; pop.textContent = text;
  el.popups.appendChild(pop); setTimeout(()=>pop.remove(), 3000);
}
