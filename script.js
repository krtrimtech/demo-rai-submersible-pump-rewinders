/* =============================================
   RAI SUBMERSIBLE PUMP REWINDERS
   Premium B2B Landing Page Scripts
   Three.js 3D Particles + GSAP Animations
   ============================================= */

// ============================================
// 1. THREE.JS - 3D INTERACTIVE BACKGROUND
// ============================================
(function initHeroScene() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 25;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // --- FLOATING SPARK/BUBBLE PARTICLES ---
  const particleCount = 200;
  const particleGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 50;
    positions[i3 + 1] = (Math.random() - 0.5) * 35;
    positions[i3 + 2] = (Math.random() - 0.5) * 30 - 5;

    const color = new THREE.Color(Math.random() > 0.4 ? 0xffffff : 0xfb923c);
    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;

    sizes[i] = 0.05 + Math.random() * 0.15;
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const particleMaterial = new THREE.PointsMaterial({
    size: 0.15,
    vertexColors: true,
    transparent: true,
    opacity: 0.35,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  // --- CUSTOM THREE.JS CUSTOM GEOMETRY INJECTION ---
  
    // Rotating torus knots representing winding copper coils
    function createCoil(color) {
      const geo = new THREE.TorusKnotGeometry(0.8, 0.28, 40, 8, 3, 4);
      const mat = new THREE.MeshStandardMaterial({
        color: color,
        metalness: 0.95,
        roughness: 0.15,
        flatShading: true
      });
      return new THREE.Mesh(geo, mat);
    }

    const coilGroup = new THREE.Group();
    const coils = [];
    const customColors = [0xfb923c, 0x06b6d4, 0xb45309];
    for (let i = 0; i < 8; i++) {
      const coil = createCoil(customColors[i % customColors.length]);
      coil.position.set((Math.random() - 0.5) * 22, (Math.random() - 0.5) * 14, (Math.random() - 0.5) * 14 - 5);
      coilGroup.add(coil);
      coils.push({
        mesh: coil,
        rotSpeed: { x: (Math.random() - 0.5) * 0.02, y: (Math.random() - 0.5) * 0.02, z: 0.01 },
        floatSpeed: 0.2 + Math.random() * 0.4,
        floatAmp: 0.5 + Math.random() * 0.8,
        baseY: coil.position.y
      });
    }
    scene.add(coilGroup);
        

  // --- LIGHTING ---
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
  scene.add(ambientLight);

  const dirLight1 = new THREE.DirectionalLight(0xfb923c, 1.2);
  dirLight1.position.set(12, 18, 10);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0x06b6d4, 0.8);
  dirLight2.position.set(-10, -5, -5);
  scene.add(dirLight2);

  const pointLight = new THREE.PointLight(0xfb923c, 1.0, 45);
  pointLight.position.set(0, 0, 8);
  scene.add(pointLight);

  // --- MOUSE TRACKING ---
  let mouseX = 0, mouseY = 0;
  let targetMouseX = 0, targetMouseY = 0;

  document.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetMouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
  });

  // --- ANIMATION LOOP ---
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    // Smooth mouse follow
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    // Custom animation injection
    
    coils.forEach(c => {
      c.mesh.rotation.x += c.rotSpeed.x;
      c.mesh.rotation.y += c.rotSpeed.y;
      c.mesh.position.y = c.baseY + Math.sin(elapsed * c.floatSpeed) * c.floatAmp;
    });
        

    // Spark Particles drift upwards
    particles.rotation.y = elapsed * 0.02;
    const particlePositions = particleGeometry.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      particlePositions[i3 + 1] += 0.015;
      particlePositions[i3] += Math.sin(elapsed * 0.5 + i) * 0.005;
      
      if (particlePositions[i3 + 1] > 20) {
        particlePositions[i3 + 1] = -20;
        particlePositions[i3] = (Math.random() - 0.5) * 50;
      }
    }
    particleGeometry.attributes.position.needsUpdate = true;

    // Move point light
    pointLight.position.x = Math.sin(elapsed * 0.4) * 12 + mouseX * 6;
    pointLight.position.y = Math.cos(elapsed * 0.3) * 8 + mouseY * 4;

    renderer.render(scene, camera);
  }

  animate();

  // --- RESIZE HANDLER ---
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();

// ============================================
// 2. GSAP SCROLL REVEALS & INTRO ANIMATIONS
// ============================================
gsap.registerPlugin(ScrollTrigger);

function initScrollReveals() {
  const reveals = document.querySelectorAll('.reveal-up');
  reveals.forEach((el, i) => {
    gsap.fromTo(el, 
      { opacity: 0, y: 35 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true
        },
        delay: (i % 4) * 0.08
      }
    );
  });
}

function initHeroAnimations() {
  const tl = gsap.timeline({ delay: 0.3 });

  tl.fromTo('#navbar',
    { y: -30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
  )
  .fromTo('.hero-badge', 
    { opacity: 0, y: 25, scale: 0.9 },
    { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'back.out(1.4)' },
    '-=0.4'
  )
  .fromTo('.hero-title span',
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out' },
    '-=0.4'
  )
  .fromTo('.hero-desc',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
    '-=0.3'
  )
  .fromTo('.stat-item',
    { opacity: 0, y: 20, scale: 0.8 },
    { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: 'back.out(1.3)' },
    '-=0.3'
  )
  .fromTo('.stat-divider',
    { opacity: 0, scaleY: 0 },
    { opacity: 1, scaleY: 1, duration: 0.4, stagger: 0.08 },
    '-=0.4'
  )
  .fromTo('.hero-actions .btn',
    { opacity: 0, y: 15 },
    { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out' },
    '-=0.2'
  )
  .fromTo('.hero-scroll',
    { opacity: 0 },
    { opacity: 1, duration: 0.8 },
    '-=0.2'
  );
}

function animateCounters() {
  const counters = document.querySelectorAll('[data-count]');
  counters.forEach(counter => {
    const target = parseInt(counter.dataset.count);
    ScrollTrigger.create({
      trigger: counter,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: target,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: function() {
            counter.textContent = Math.floor(this.targets()[0].val).toLocaleString();
          }
        });
      }
    });
  });
}

// ============================================
// 3. WHATSAPP STOCK BOT SIMULATOR
// ============================================
window.sendMockQuery = function(optionText, responseText) {
  const chatArea = document.getElementById('chatArea');
  if (!chatArea) return;

  const sentDiv = document.createElement('div');
  sentDiv.className = 'chat-message sent';
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  sentDiv.innerHTML = `<p>${optionText}</p><span class="message-time">${timeStr}</span>`;
  chatArea.appendChild(sentDiv);
  
  chatArea.scrollTop = chatArea.scrollHeight;

  const buttons = document.querySelectorAll('.chat-option-btn');
  buttons.forEach(btn => btn.setAttribute('disabled', 'true'));

  const typingDiv = document.createElement('div');
  typingDiv.className = 'chat-message received typing-indicator-msg';
  typingDiv.innerHTML = `<p><i class="fas fa-ellipsis-h fa-spin"></i> Checking stocks...</p>`;
  setTimeout(() => {
    chatArea.appendChild(typingDiv);
    chatArea.scrollTop = chatArea.scrollHeight;
  }, 350);

  setTimeout(() => {
    const typingMsg = document.querySelector('.typing-indicator-msg');
    if (typingMsg) typingMsg.remove();

    const replyDiv = document.createElement('div');
    replyDiv.className = 'chat-message received';
    replyDiv.innerHTML = `<p>${responseText}</p><span class="message-time">${timeStr}</span>`;
    chatArea.appendChild(replyDiv);
    
    chatArea.scrollTop = chatArea.scrollHeight;
    buttons.forEach(btn => btn.removeAttribute('disabled'));
  }, 1200);
}

// ============================================
// 4. RFQ FORM HANDLING
// ============================================
window.handleFormSubmit = function(event) {
  event.preventDefault();
  const submitBtn = event.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  
  submitBtn.setAttribute('disabled', 'true');
  submitBtn.innerHTML = `<i class="fas fa-circle-notch fa-spin"></i> Submitting...`;

  setTimeout(() => {
    const modal = document.getElementById('successModal');
    if (modal) modal.classList.add('active');
    event.target.reset();
    submitBtn.removeAttribute('disabled');
    submitBtn.innerHTML = originalText;
  }, 1000);
}

// ============================================
// 5. NAVIGATION & GENERAL EVENT HANDLERS
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    });

    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
      });
    });
  }

  window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  initHeroAnimations();
  initScrollReveals();
  animateCounters();

  window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.classList.add('hidden');
    }
  });

  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader && !loader.classList.contains('hidden')) {
      loader.classList.add('hidden');
    }
  }, 3000);
});
