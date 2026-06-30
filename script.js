//f
function splitChars(el) {
  const text = el.textContent;
  el.innerHTML = text.split('').map((c,i) =>
    c === ' ' ? ' ' :
    `<span class="char" style="transition-delay:${i*0.04}s">${c}</span>`
  ).join('');
}
['introWord','contactWord','tyWord'].forEach(id => {
  const el = document.getElementById(id);
  if(el) splitChars(el);
});

const allReveal = document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.char-reveal,.s-label');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {threshold: 0.12});
allReveal.forEach(el => revealObserver.observe(el));

const progressBar = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrollTop / docHeight) * 100;
  if(progressBar) progressBar.style.width = progress + '%';
}, {passive:true});

const heroPhoto = document.getElementById('heroPhoto');
const heroBgWord = document.getElementById('heroBgWord');
window.addEventListener('scroll', () => {
  const sy = window.scrollY;
  if(heroPhoto) {
    heroPhoto.style.transform = `translate(-50%,-50%) translateY(${sy * 0.15}px) scale(1.08)`;
    heroPhoto.style.opacity = Math.max(0, 1 - sy / 700);
  }
  if(heroBgWord) {
    heroBgWord.style.transform = `translateY(${sy * 0.15}px)`;
    heroBgWord.style.opacity = Math.max(0, 0.035 - sy / 15000);
  }
}, {passive:true});
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => { if(window.scrollY >= s.offsetTop - 140) current = s.id; });
  navLinks.forEach(a => {
    const isActive = a.getAttribute('href') === '#'+current;
    a.classList.toggle('active', isActive);
  });
}, {passive:true});

document.querySelectorAll('.proj-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const glow = card.querySelector('.proj-glow');
    if(glow) {
      glow.style.top = (e.clientY - rect.top - 60) + 'px';
      glow.style.left = (e.clientX - rect.left - 60) + 'px';
    }
  });
});

const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
const cursorGlow = document.getElementById('cursorGlow');
let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  if(cursorDot) { cursorDot.style.left = mouseX+'px'; cursorDot.style.top = mouseY+'px'; }
  if(cursorGlow) { cursorGlow.style.left = mouseX+'px'; cursorGlow.style.top = mouseY+'px'; }
});
//s
let ringX = 0, ringY = 0;
function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  if(cursorRing) { cursorRing.style.left = ringX+'px'; cursorRing.style.top = ringY+'px'; }
  requestAnimationFrame(animateRing);
}
animateRing();
//hs
document.querySelectorAll('a,button,.proj-card,.edu-card,.skill-item,.btn-primary,.btn-outline').forEach(el => {
  el.addEventListener('mouseenter', () => {
    if(cursorDot) cursorDot.classList.add('hovered');
    if(cursorRing) cursorRing.classList.add('hovered');
  });
  el.addEventListener('mouseleave', () => {
    if(cursorDot) cursorDot.classList.remove('hovered');
    if(cursorRing) cursorRing.classList.remove('hovered');
  });
});

//c
function animateCounter(el, target, duration=1800) {
  let start = 0;
  const step = timestamp => {
    if(!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if(progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}
const statsSection = document.querySelector('.hero-stats');
if(statsSection) {
  const statsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        document.querySelectorAll('[data-target]').forEach(el => {
          animateCounter(el, parseInt(el.dataset.target));
        });
        statsObserver.disconnect();
      }
    });
  }, {threshold: 0.5});
  statsObserver.observe(statsSection);
}
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];
function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resize();
window.addEventListener('resize', resize);
for(let i=0; i<55; i++) {
  particles.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.2 + 0.3,
    dx: (Math.random() - 0.5) * 0.3,
    dy: (Math.random() - 0.5) * 0.3,
    o: Math.random() * 0.4 + 0.1
  });
}
function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
    ctx.fillStyle = `rgba(212,168,83,${p.o})`;
    ctx.fill();
    p.x += p.dx; p.y += p.dy;
    if(p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if(p.y < 0 || p.y > canvas.height) p.dy *= -1;
  });
  requestAnimationFrame(drawParticles);
}
drawParticles();
//d
document.querySelectorAll('.edu-card, .proj-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateY(${x*8}deg) rotateX(${-y*8}deg) translateY(-5px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.4s ease';
  });
});

const heroTag = document.querySelector('.hero-tag');
if(heroTag) {
  const text = heroTag.textContent;
  heroTag.textContent = '';
  heroTag.style.opacity = '1';
  let i = 0;
  function typeNext() {
    if(i < text.length) {
      heroTag.textContent += text[i++];
      setTimeout(typeNext, 60);
    }
  }
  setTimeout(typeNext, 400);
}

//button
document.querySelectorAll('.btn-primary,.btn-outline').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width/2;
    const y = e.clientY - rect.top - rect.height/2;
    btn.style.transform = `translate(${x*0.25}px,${y*0.4}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
    btn.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
  });
});

const skillItems = document.querySelectorAll('.skill-item');
const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {threshold: 0.3});
skillItems.forEach(el => skillObserver.observe(el));
//h
document.querySelectorAll('.exp-item').forEach(item => {
  item.addEventListener('mouseenter', () => {
    item.style.paddingLeft = '1.5rem';
    item.style.transition = 'padding-left 0.3s';
  });
  item.addEventListener('mouseleave', () => {
    item.style.paddingLeft = '';
  });
});
