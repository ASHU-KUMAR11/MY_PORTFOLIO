// ============================================================
// THEME TOGGLE
// ============================================================
const themeToggle = document.getElementById('themeToggle');
const moonIcon = document.getElementById('moonIcon');
const sunIcon = document.getElementById('sunIcon');
const html = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeIcon(next);
});

function updateThemeIcon(theme) {
  if (theme === 'dark') {
    moonIcon.style.display = 'block';
    sunIcon.style.display = 'none';
  } else {
    moonIcon.style.display = 'none';
    sunIcon.style.display = 'block';
  }
}

// ============================================================
// NAVBAR SCROLL + ACTIVE LINKS
// ============================================================
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  // Scrolled class
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active nav link
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });

  // Scroll to top button
  const scrollTop = document.getElementById('scrollTop');
  if (window.scrollY > 400) {
    scrollTop.classList.add('visible');
  } else {
    scrollTop.classList.remove('visible');
  }
});

// ============================================================
// HAMBURGER MENU
// ============================================================
const hamburger = document.getElementById('hamburger');
const navLinksContainer = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinksContainer.classList.toggle('open');
});

navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinksContainer.classList.remove('open');
  });
});

// ============================================================
// SCROLL TO TOP
// ============================================================
document.getElementById('scrollTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============================================================
// FADE-UP INTERSECTION OBSERVER
// ============================================================
const fadeEls = document.querySelectorAll('.fade-up');

const observerOptions = {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

fadeEls.forEach(el => observer.observe(el));

// Project show more removed

// ============================================================
// ACHIEVEMENTS CAROUSEL DRAG
// ============================================================
const carousel = document.getElementById('achievementsCarousel');
let isDown = false;
let startX;
let scrollLeft;

carousel.addEventListener('mousedown', (e) => {
  isDown = true;
  carousel.classList.add('dragging');
  startX = e.pageX - carousel.offsetLeft;
  scrollLeft = carousel.scrollLeft;
});

carousel.addEventListener('mouseleave', () => {
  isDown = false;
  carousel.classList.remove('dragging');
});

carousel.addEventListener('mouseup', () => {
  isDown = false;
  carousel.classList.remove('dragging');
});

carousel.addEventListener('mousemove', (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - carousel.offsetLeft;
  const walk = (x - startX) * 2;
  carousel.scrollLeft = scrollLeft - walk;
});

// ============================================================
// CONTACT FORM SUBMISSION
// ============================================================
const contactForm = document.getElementById('contactForm');
const sendBtn = document.getElementById('sendBtn');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const originalText = sendBtn.innerHTML;
  sendBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="vertical-align:middle;margin-right:8px;animation:spin 0.8s linear infinite">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
    </svg>
    Sending...
  `;
  sendBtn.disabled = true;

  // STEP 2: Updated Service ID and Template ID from EmailJS
  const serviceID = "service_iqfnmld";
  const templateID = "template_arfnwu9";

  // Prepare the data to be sent (Ensures keys match template placeholders)
  const templateParams = {
    from_name: document.getElementById('nameInput').value,
    reply_to: document.getElementById('emailInput').value,
    subject: document.getElementById('subjectInput').value,
    message: document.getElementById('messageInput').value
  };

  console.log("Sending data:", templateParams);

  // Using emailjs.send instead of sendForm for 100% data reliability
  emailjs.send(serviceID, templateID, templateParams)
    .then((response) => {
      console.log("SUCCESS!", response.status, response.text);
      sendBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="vertical-align:middle;margin-right:8px">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
        Message Sent!
      `;
      sendBtn.style.background = '#22c55e';
      contactForm.reset();
    }, (err) => {
      console.error("FAILED...", err);
      const errorDetail = JSON.stringify(err);
      alert("⚠️ Email Sending Failed!\n\nLOGS:\n" + errorDetail + "\n\nTip: Ensure your Template placeholders use {{from_name}}, {{reply_to}}, {{subject}}, and {{message}}.");
      sendBtn.innerHTML = originalText;
      sendBtn.disabled = false;
    })
    .finally(() => {
      setTimeout(() => {
        if (sendBtn.innerHTML.includes("Message Sent")) {
          sendBtn.innerHTML = originalText;
          sendBtn.disabled = false;
          sendBtn.style.background = '';
        }
      }, 3000);
    });
});

// Spin animation for loading
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

// ============================================================
// TYPED / CURSOR EFFECT IN CODE CARD (cosmetic)
// ============================================================
// Already handled via CSS blink animation

// ============================================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
