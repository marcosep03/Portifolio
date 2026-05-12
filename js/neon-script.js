// PARTICLE SYSTEM
class ParticleSystem {
  constructor() {
    this.canvas = document.getElementById('particles');
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    this.particles = [];
    this.mouse = { x: 0, y: 0 };
    this.init();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  init() {
    for (let i = 0; i < 100; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        brightness: Math.random() * 0.5 + 0.5
      });
    }
    this.animate();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

      this.ctx.save();
      this.ctx.globalAlpha = p.brightness;
      this.ctx.fillStyle = `hsl(200, 100%, ${50 + p.brightness * 50}%)`;
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = '#00f5ff';
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    });

    requestAnimationFrame(() => this.animate());
  }
}

// INICIALIZAÇÃO PARTICLES
const particles = new ParticleSystem();

// NAVEGAÇÃO POR SEÇÕES (SEM SCROLL INFINITO)
const navLinks = document.querySelectorAll('.nav-links li');
const sections = document.querySelectorAll('.section');
let currentSection = 0;

navLinks.forEach((link, index) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();

    // Remove active de todas as seções e nav links
    sections.forEach(s => s.classList.remove('active'));
    document.querySelector('.nav-links li.active')?.classList.remove('active');

    // Ativa a seção correta
    sections[index].classList.add('active');
    link.classList.add('active');
    currentSection = index;

    // Scroll suave para a seção ativa
    sections[index].scrollIntoView({ behavior: 'smooth' });
  });
});

// PROGRESS BAR (CORRIGIDO)
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const progress = (scrollTop / docHeight) * 100;
  document.querySelector('.progress-fill').style.width = progress + '%';
});

// EFEITO DE DIGITAÇÃO
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.textContent = '';
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

// ANIMAÇÕES DE NÚMEROS
function animateNumbers() {
  const numbers = document.querySelectorAll('.stat-number');
  numbers.forEach(num => {
    const target = +num.getAttribute('data-target');
    const increment = target / 100;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        num.textContent = target;
        clearInterval(timer);
      } else {
        num.textContent = Math.floor(current);
      }
    }, 30);
  });
}

// TEMA
const themeBtn = document.getElementById('theme-btn');
const body = document.body;

themeBtn.addEventListener('click', () => {
  body.dataset.theme = body.dataset.theme === 'light' ? 'dark' : 'light';
  themeBtn.textContent = body.dataset.theme === 'light' ? '🌙' : '☀️';
  localStorage.setItem('theme', body.dataset.theme);
});

// CARREGAR TEMA
const savedTheme = localStorage.getItem('theme') || 'dark';
body.dataset.theme = savedTheme;
themeBtn.textContent = savedTheme === 'light' ? '🌙' : '☀️';


document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();

  // Pega os dados do formulário
  const formData = new FormData(e.target);
  const nome = formData.get('nome') || e.target.querySelector('input[type="text"]').value;
  const email = formData.get('email') || e.target.querySelector('input[type="email"]').value;
  const mensagem = formData.get('mensagem') || e.target.querySelector('textarea').value;

  // Validação
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!nome.trim()) {
    showNotification('Por favor, insira seu nome!', 'error');
    return;
  }

  if (!emailRegex.test(email)) {
    showNotification('Email inválido!', 'error');
    return;
  }

  if (!mensagem.trim()) {
    showNotification('Por favor, escreva uma mensagem!', 'error');
    return;
  }

  // SIMULA ENVIO REAL
  setTimeout(() => {
    showNotification('✅ Mandado com sucesso! Em breve entrarei em contato!', 'success');
    e.target.reset();
  }, 800);
});

// FUNÇÃO NOTIFICAÇÃO
function showNotification(message, type) {
  // Remove notificações anteriores
  document.querySelectorAll('.notification').forEach(n => n.remove());

  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);

  // Animação de entrada
  requestAnimationFrame(() => {
    notification.classList.add('show');
  });

  // Remove após 4 segundos
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 400);
  }, 4000);
}

// FUNCIONALIDADE COPIAR/REDIRECIONAR PROJETOS
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('link-icon')) {
    const linkIcon = e.target;

    if (linkIcon.classList.contains('copy')) {
      // COPIAR LINK
      const url = linkIcon.parentElement.querySelector('.link-icon.link').href ||
        linkIcon.getAttribute('data-url') ||
        'https://github.com/marcosep03/projetosupport';

      navigator.clipboard.writeText(url).then(() => {
        const originalTitle = linkIcon.title;
        linkIcon.title = linkIcon.dataset.copy || 'Link copiado!';

        showNotification('📋 Link copiado!', 'success');

        // Restaura título original após 2s
        setTimeout(() => {
          linkIcon.title = originalTitle;
        }, 2000);
      });

    } else if (linkIcon.classList.contains('link')) {
      // REDIRECIONAR
      const url = linkIcon.href || linkIcon.getAttribute('data-url');
      if (url && url !== '#') {
        window.open(url, '_blank');
      }
    }
  }
});

// INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', () => {
  // Typing effect e números após 500ms
  setTimeout(() => {
    const typingEl = document.querySelector('.typing-effect');
    if (typingEl) {
      typeWriter(typingEl, typingEl.dataset.text, 80);
    }
    animateNumbers();
  }, 500);

  // Adiciona classe active na primeira seção
  sections[0].classList.add('active');
  navLinks[0].classList.add('active');
});

// RESIZE CANVAS
window.addEventListener('resize', () => particles.resize());

document.querySelectorAll('.section').forEach(section => {
  section.style.height = 'auto';
  section.style.minHeight = '100vh';
});

// Copiar e Redirecionar
document.addEventListener('click', function(e) {
  // COPIAR LINK 💾
  if (e.target.classList.contains('copy-link')) {
    e.preventDefault();
    const linkToCopy = e.target.getAttribute('data-copy');

    navigator.clipboard.writeText(linkToCopy).then(() => {
      // Muda o ícone temporariamente
      const originalIcon = e.target.textContent;
      e.target.textContent = '✅';
      e.target.style.background = '#10b981';

      setTimeout(() => {
        e.target.textContent = originalIcon;
        e.target.style.background = '';
      }, 1000);

      // Notificação
      showNotification('📋 Link copiado com sucesso!', 'success');
    });
    return;
  }

  // LINK DEMO 🔗
  if (e.target.classList.contains('demo-link')) {
    const demoUrl = e.target.getAttribute('href') !== '#' ?
      e.target.getAttribute('href') :
      e.target.getAttribute('data-demo');

    if (demoUrl && demoUrl !== '#') {
      e.preventDefault();
      window.open(demoUrl, '_blank');
    }
  }
});

//  - Scroll normal
document.querySelectorAll('.nav-links li').forEach((link, index) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetSection = document.querySelector(`#${link.dataset.section}`);

    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      // Remove active de todos
      document.querySelectorAll('.nav-links li').forEach(l => l.classList.remove('active'));
      document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));

      // Adiciona active no atual
      link.classList.add('active');
      targetSection.classList.add('active');
    }
  });
});

