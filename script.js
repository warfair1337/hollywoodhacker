const consoleEl = document.getElementById('console');
function log(message){
  const line = document.createElement('div');
  line.textContent = message;
  consoleEl.appendChild(line);
  consoleEl.scrollTop = consoleEl.scrollHeight;
}
function randomIP(){
  return Array(4).fill(0).map(()=>Math.floor(Math.random()*256)).join('.');
}
function randomLog(){
  const ips = randomIP()+" -> "+randomIP();
  const msgs = [
    `Connection from ${ips}`,
    `Packet sniff ${ips}`,
    `AUTH FAIL ${ips}`,
    `Decrypting cipher from ${ips}`,
    `Launching trace route to ${randomIP()}`
  ];
  return msgs[Math.floor(Math.random()*msgs.length)];
}
setInterval(()=>log(randomLog()),500);

let breachLevel = 0;
function stepAttack(){
  breachLevel += 5;
  updateBars();
  if(breachLevel === 30) popup('Perimeter breached');
  if(breachLevel === 60) popup('Internal firewall compromised');
  if(breachLevel >= 100){
    popup('Core systems infiltrated: data exfiltration in progress');
    breachLevel = 0;
  }
}
function updateBars(){
  document.getElementById('bar1').style.width = Math.min(breachLevel,30)+"%";
  document.getElementById('bar2').style.width = Math.max(Math.min(breachLevel-30,30),0)+"%";
  document.getElementById('bar3').style.width = Math.max(Math.min(breachLevel-60,40),0)+"%";
}
setInterval(stepAttack,1000);

const traces = document.getElementById('traces');
function drawTrace(){
  const x1 = Math.random()*1000;
  const y1 = Math.random()*250+50;
  const x2 = 500;
  const y2 = 250;
  const line = document.createElementNS('http://www.w3.org/2000/svg','line');
  line.setAttribute('x1',x1);
  line.setAttribute('y1',y1);
  line.setAttribute('x2',x2);
  line.setAttribute('y2',y2);
  line.setAttribute('class','trace');
  traces.appendChild(line);
  setTimeout(()=>line.remove(),2000);
}
setInterval(drawTrace,800);

document.getElementById('counter').addEventListener('click',()=>{
  breachLevel = 0;
  updateBars();
  popup('Countermeasure deployed, attacker traced');
});

function popup(text){
  const pop = document.createElement('div');
  pop.className = 'popup';
  pop.textContent = text;
  document.getElementById('popups').appendChild(pop);
  setTimeout(()=>pop.remove(),3000);
}

document.querySelectorAll('#browser li').forEach(li=>{
  li.addEventListener('click',e=>{
    e.stopPropagation();
    popup('Accessing '+li.textContent.trim());
  });
});
