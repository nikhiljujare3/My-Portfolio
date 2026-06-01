// ==================== LOADER ====================
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 1600);
});

// ==================== CURSOR ====================
const cursor = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');
let mouseX=0, mouseY=0, trailX=0, trailY=0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX - 6 + 'px';
  cursor.style.top = mouseY - 6 + 'px';
});

function animateTrail(){
  trailX += (mouseX - trailX) * 0.15;
  trailY += (mouseY - trailY) * 0.15;
  cursorTrail.style.left = trailX - 18 + 'px';
  cursorTrail.style.top = trailY - 18 + 'px';
  requestAnimationFrame(animateTrail);
}
animateTrail();

document.querySelectorAll('a, button, .skill-tag, .project-card, .social-link').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'scale(2)';
    cursorTrail.style.transform = 'scale(1.5)';
    cursorTrail.style.borderColor = 'var(--accent2)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'scale(1)';
    cursorTrail.style.transform = 'scale(1)';
    cursorTrail.style.borderColor = 'var(--accent)';
  });
});

// ==================== CANVAS BG ====================
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let W, H, particles=[];

function resizeCanvas(){
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function createParticles(){
  particles = [];
  for(let i=0; i<80; i++){
    particles.push({
      x: Math.random()*W,
      y: Math.random()*H,
      vx: (Math.random()-0.5)*0.4,
      vy: (Math.random()-0.5)*0.4,
      r: Math.random()*2+0.5,
      opacity: Math.random()*0.5+0.1,
      color: Math.random() > 0.5 ? '0,245,196' : '124,106,255'
    });
  }
}
createParticles();

// Grid lines
function drawGrid(){
  ctx.strokeStyle = 'rgba(0,245,196,0.03)';
  ctx.lineWidth = 1;
  const gs = 80;
  for(let x=0; x<W; x+=gs){
    ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();
  }
  for(let y=0; y<H; y+=gs){
    ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();
  }
}

function drawFrame(){
  ctx.clearRect(0,0,W,H);
  drawGrid();
  
  // Draw connections
  for(let i=0;i<particles.length;i++){
    for(let j=i+1;j<particles.length;j++){
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx*dx+dy*dy);
      if(dist < 120){
        ctx.strokeStyle = `rgba(0,245,196,${0.08*(1-dist/120)})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
  
  // Draw particles
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
    ctx.fillStyle = `rgba(${p.color},${p.opacity})`;
    ctx.fill();
    
    p.x += p.vx;
    p.y += p.vy;
    if(p.x<0||p.x>W) p.vx*=-1;
    if(p.y<0||p.y>H) p.vy*=-1;
  });
  
  requestAnimationFrame(drawFrame);
}
drawFrame();

// ==================== 3D CARD TILT ====================
const heroCard = document.getElementById('heroCard');
if(heroCard){
  heroCard.parentElement.addEventListener('mousemove', e => {
    const rect = heroCard.parentElement.getBoundingClientRect();
    const cx = rect.left + rect.width/2;
    const cy = rect.top + rect.height/2;
    const rx = (e.clientY - cy) / rect.height * 20;
    const ry = -(e.clientX - cx) / rect.width * 20;
    heroCard.style.animation = 'none';
    heroCard.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  heroCard.parentElement.addEventListener('mouseleave', () => {
    heroCard.style.animation = 'float3d 6s ease-in-out infinite';
    heroCard.style.transform = '';
  });
}

// ==================== PROJECT CARD GLOW ====================
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mx', x+'%');
    card.style.setProperty('--my', y+'%');
  });
});

// ==================== SCROLL REVEAL ====================
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
    }
  });
}, {threshold: 0.12});

document.querySelectorAll('.reveal, .timeline-item').forEach(el => observer.observe(el));

// ==================== SCROLL PROGRESS ====================
window.addEventListener('scroll', () => {
  const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  document.getElementById('scrollBar').style.height = pct + '%';
});

// ==================== COUNT UP ANIMATION ====================
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      const targets = entry.target.querySelectorAll('[data-target]');
      targets.forEach(el => {
        const target = parseInt(el.getAttribute('data-target'));
        let current = 0;
        const step = target / 50;
        const timer = setInterval(() => {
          current += step;
          if(current >= target){
            current = target;
            clearInterval(timer);
          }
          el.textContent = current % 1 === 0 ? Math.floor(current) : current.toFixed(2);
        }, 30);
      });
      countObserver.unobserve(entry.target);
    }
  });
}, {threshold: 0.3});

document.querySelectorAll('.about-stats-grid').forEach(el => countObserver.observe(el));