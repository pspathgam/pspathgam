
// Multicolor title
(function(){
  const title = "Government Primary School Pethgam Wagoora";
  const el = document.getElementById('multicolor-title');
  if(!el) return;
  el.innerHTML = '';
  const colors = ['#e11d48','#f97316','#f59e0b','#10b981','#06b6d4','#3b82f6','#7c3aed'];
  for(let i=0;i<title.length;i++){
    const span = document.createElement('span');
    span.textContent = title[i];
    if(title[i] === ' ') span.style.padding = '0 4px';
    span.style.color = colors[i % colors.length];
    span.style.fontWeight = '900';
    span.style.fontSize = '20px';
    el.appendChild(span);
  }
})();

// Date auto-update
(function(){
  const db = document.getElementById('datebox');
  if(!db) return;
  const now = new Date();
  const opts = {weekday:'short', year:'numeric', month:'short', day:'numeric'};
  db.textContent = now.toLocaleDateString('en-GB', opts);
  // year in footer
  const year = document.getElementById('year');
  if(year) year.textContent = new Date().getFullYear();
})();

// Simple hero slider
(function(){
  const imgs = document.querySelectorAll('.hero .slides img');
  if(!imgs.length) return;
  let idx = 0;
  imgs[idx].classList.add('active');
  setInterval(()=>{
    imgs[idx].classList.remove('active');
    idx = (idx+1) % imgs.length;
    imgs[idx].classList.add('active');
  },4000);
})();
