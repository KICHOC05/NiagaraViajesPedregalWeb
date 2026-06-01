/* ═══════════════════════════════════════════
   NIAGARA VIAJES PEDREGAL — Main JS v3.2
   ── Cambia el número aquí (una sola línea) ──
═══════════════════════════════════════════ */
const WA_NUMBER = '5215623981020';

/* ─────────────────────────────────────────
   Horarios de negocio
   Lun–Vie: 9:00–19:00  |  Sáb: 10:00–15:00
───────────────────────────────────────── */
const BUSINESS_HOURS = {
  1: { open: 9,  close: 19 },
  2: { open: 9,  close: 19 },
  3: { open: 9,  close: 19 },
  4: { open: 9,  close: 19 },
  5: { open: 9,  close: 19 },
  6: { open: 10, close: 15 },
  0: null
};

const SLOT_DURATION = 30;

const BOOKED_SLOTS = [
  formatTodaySlot(10, 0),
  formatTodaySlot(11, 30),
  formatTodaySlot(15, 0),
];

function formatTodaySlot(h, m) {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(h)}:${pad(m)}`;
}
function pad(n) { return String(n).padStart(2, '0'); }
function dateKey(date) {
  return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}`;
}

function generateSlots(date) {
  const dow   = date.getDay();
  const hours = BUSINESS_HOURS[dow];
  if (!hours) return [];

  const slots   = [];
  const now     = new Date();
  const isToday = dateKey(date) === dateKey(now);
  const dk      = dateKey(date);

  for (let h = hours.open; h < hours.close; h++) {
    for (let m = 0; m < 60; m += SLOT_DURATION) {
      const label    = `${pad(h)}:${pad(m)}`;
      const key      = `${dk} ${label}`;
      const slotTime = new Date(date);
      slotTime.setHours(h, m, 0, 0);

      let status = 'available';
      if (isToday) {
        const buffer = new Date(now.getTime() + 30 * 60 * 1000);
        if (slotTime <= buffer) status = 'past';
      }
      if (BOOKED_SLOTS.includes(key)) status = 'taken';
      slots.push({ label, status });
    }
  }
  return slots;
}

/* ─────────────────────────────────────────
   WhatsApp helpers
───────────────────────────────────────── */
function waLink(msg) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
}
function openWA(msg) { window.open(waLink(msg), '_blank'); }

function applyWALinks() {
  const fab = document.getElementById('wa-fab');
  if (fab) fab.href = waLink('Hola, me interesa información sobre sus experiencias de viaje.');

  const tel = document.getElementById('footer-tel');
  if (tel) {
    tel.href        = `tel:+${WA_NUMBER}`;
    tel.textContent = `+${WA_NUMBER}`;
  }

  const fwa = document.getElementById('footer-wa');
  if (fwa) fwa.href = waLink('Hola, quisiera más información.');

  document.querySelectorAll('[data-wa-msg]').forEach(el => {
    el.href   = waLink(el.dataset.waMsg);
    el.target = '_blank';
  });

  const agTel = document.getElementById('agenda-tel');
  if (agTel) agTel.href = `tel:+${WA_NUMBER}`;
}

/* ─────────────────────────────────────────
   LOADER
───────────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader')?.classList.add('hidden');
  }, 1800);
});

/* ─────────────────────────────────────────
   PROGRESS BAR + NAVBAR
───────────────────────────────────────── */
const LIGHT_SECTIONS = ['#servicios', '#aliados', '#nosotros', '#testimonios'];

function updateNav() {
  const sy        = window.scrollY;
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const pct       = maxScroll > 0 ? (sy / maxScroll) * 100 : 0;

  const bar = document.getElementById('progress');
  if (bar) bar.style.width = pct + '%';

  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let inLight = false;
  LIGHT_SECTIONS.forEach(sel => {
    const el = document.querySelector(sel);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top <= 72 && rect.bottom >= 72) inLight = true;
  });

  navbar.classList.remove('scrolled', 'light-bg');
  if      (sy < 10)  { /* top — transparente */ }
  else if (inLight)  { navbar.classList.add('light-bg'); }
  else               { navbar.classList.add('scrolled'); }
}
window.addEventListener('scroll', updateNav, { passive: true });
document.addEventListener('DOMContentLoaded', updateNav);

/* ─────────────────────────────────────────
   MOBILE DRAWER
───────────────────────────────────────── */
function toggleDrawer() {
  const drawer    = document.getElementById('drawer');
  const overlay   = document.getElementById('overlay');
  const hamburger = document.getElementById('hamburger');
  if (!drawer) return;
  const open = drawer.classList.toggle('open');
  overlay  ?.classList.toggle('open', open);
  hamburger?.classList.toggle('open', open);
}
function closeDrawer() {
  document.getElementById('drawer')   ?.classList.remove('open');
  document.getElementById('overlay')  ?.classList.remove('open');
  document.getElementById('hamburger')?.classList.remove('open');
}

/* ─────────────────────────────────────────
   COUNTER ANIMATION
───────────────────────────────────────── */
function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const stepTime = 16;
  const steps    = duration / stepTime;
  const inc      = target / steps;
  let current    = 0;

  el.style.minWidth = el.offsetWidth + 'px';

  const timer = setInterval(() => {
    current = Math.min(current + inc, target);
    el.textContent = Math.floor(current).toLocaleString('es-MX');
    if (current >= target) {
      el.textContent = target.toLocaleString('es-MX');
      clearInterval(timer);
    }
  }, stepTime);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.counter').forEach(el => {
    el.textContent = '0';
    counterObserver.observe(el);
  });
});

/* ─────────────────────────────────────────
   TOAST DE BIENVENIDA
───────────────────────────────────────── */
function showWelcomeToast(nombre) {
  let toast = document.getElementById('toastWelcome');
  if (!toast) {
    toast = document.createElement('div');
    toast.id        = 'toastWelcome';
    toast.className = 'toast-welcome';
    toast.innerHTML = `
      <div class="toast-icon"><i class="fas fa-check"></i></div>
      <div class="toast-text">
        <strong>¡Bienvenido, ${nombre}!</strong>
        <span>Nos alegra verte de nuevo.</span>
      </div>
      <button class="toast-close" onclick="closeToast()" aria-label="Cerrar">
        <i class="fas fa-times"></i>
      </button>
    `;
    document.body.appendChild(toast);
  }
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });
  setTimeout(() => closeToast(), 5000);
}

function closeToast() {
  const toast = document.getElementById('toastWelcome');
  if (!toast) return;
  toast.classList.remove('show');
  setTimeout(() => toast.remove(), 500);
}

document.addEventListener('DOMContentLoaded', () => {
  const params  = new URLSearchParams(window.location.search);
  const welcome = params.get('welcome');
  if (welcome) {
    showWelcomeToast(decodeURIComponent(welcome));
    const cleanUrl = window.location.pathname +
      (window.location.search.replace(/[?&]welcome=[^&]*/, '').replace(/^&/, '?') || '');
    window.history.replaceState({}, '', cleanUrl);
  }
});

/* ─────────────────────────────────────────
   ALIADOS — carrusel JS con rAF
   Loop continuo, sin glitch, sin CSS animation
───────────────────────────────────────── */
function initPartnersCarousel() {
  const outer = document.querySelector('.carousel-outer');
  const track = document.querySelector('.carousel-track');
  if (!outer || !track) return;
  if (track.dataset.jsInit) return;
  track.dataset.jsInit = '1';

  /* Desactivar animación CSS completamente */
  track.style.animation  = 'none';
  track.style.transition = 'none';
  track.style.transform  = 'translateX(0)';
  track.style.willChange = 'transform';

  /* Velocidad adaptada al dispositivo (px/s) */
  const isMobile = window.innerWidth <= 768;
  const PX_PER_SEC = isMobile ? 55 : 90;

  let pos    = 0;
  let paused = false;
  let lastTs = null;

  function getHalfWidth() {
    /* Mitad del track = ancho del set original (sin el duplicado) */
    return track.scrollWidth / 2;
  }

  function tick(ts) {
    if (!lastTs) lastTs = ts;
    /* Cap a 50ms para evitar saltos cuando el tab pierde foco */
    const dt = Math.min((ts - lastTs) / 1000, 0.05);
    lastTs = ts;

    if (!paused) {
      pos += PX_PER_SEC * dt;
      const half = getHalfWidth();
      if (half > 0 && pos >= half) {
        pos -= half;   /* loop silencioso */
      }
      track.style.transform = `translateX(-${pos}px)`;
    }

    requestAnimationFrame(tick);
  }

  /* Pausa solo en hover desktop — NO en touch (causa bug de scroll) */
  outer.addEventListener('mouseenter', () => { paused = true;  });
  outer.addEventListener('mouseleave', () => { paused = false; });

  /* Recalcular velocidad al cambiar orientación */
  window.addEventListener('resize', () => {
    /* No recalcular pos para no hacer saltos */
  }, { passive: true });

  /* Arrancar */
  requestAnimationFrame(ts => {
    lastTs = ts;
    requestAnimationFrame(tick);
  });
}

/* ─────────────────────────────────────────
   CALENDAR
───────────────────────────────────────── */
const MONTHS_ES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                   'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const DAYS_ES   = ['Do','Lu','Ma','Mi','Ju','Vi','Sá'];

let currentDate  = new Date();
let selectedDay  = null;
let selectedSlot = null;

function buildCalendar() {
  const y  = currentDate.getFullYear();
  const m  = currentDate.getMonth();

  const titleEl = document.getElementById('calTitle');
  if (titleEl) titleEl.textContent = `${MONTHS_ES[m]} ${y}`;

  const grid = document.getElementById('calGrid');
  if (!grid) return;
  grid.innerHTML = '';

  DAYS_ES.forEach(d => {
    const el = document.createElement('div');
    el.className   = 'cal-dow';
    el.textContent = d;
    grid.appendChild(el);
  });

  const firstDay    = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const today       = new Date(); today.setHours(0, 0, 0, 0);

  for (let i = 0; i < firstDay; i++) {
    const e = document.createElement('div');
    e.className = 'cal-day empty';
    grid.appendChild(e);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dayDate = new Date(y, m, d);
    const el      = document.createElement('div');
    el.className  = 'cal-day';
    el.textContent = d;

    const isToday  = dayDate.getTime() === today.getTime();
    const isPast   = dayDate < today;
    const dow      = dayDate.getDay();
    const hasHours = BUSINESS_HOURS[dow] !== null && BUSINESS_HOURS[dow] !== undefined;

    if (isToday)  el.classList.add('today');
    if (isPast)   el.classList.add('past');
    if (!hasHours) el.classList.add('sunday');

    if (selectedDay && dayDate.getTime() === selectedDay.getTime()) {
      el.classList.add('selected');
    }

    if (!isPast && hasHours) {
      el.addEventListener('click', () => selectDay(dayDate));
    }
    grid.appendChild(el);
  }
}

function selectDay(date) {
  selectedDay  = date;
  selectedSlot = null;
  buildCalendar();

  const label = document.getElementById('selectedDateLabel');
  if (label) {
    const dowNames = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
    label.textContent = `${dowNames[date.getDay()]} ${date.getDate()} de ${MONTHS_ES[date.getMonth()]}`;
  }

  const slots     = generateSlots(date);
  const slotsGrid = document.getElementById('slotsGrid');
  if (!slotsGrid) return;
  slotsGrid.innerHTML = '';

  if (slots.length === 0) {
    slotsGrid.innerHTML =
      '<p style="font-size:.8rem;color:var(--gray);grid-column:1/-1">No hay horarios disponibles este día.</p>';
  } else {
    slots.forEach(({ label, status }) => {
      const el = document.createElement('div');
      el.className   = 'slot';
      el.textContent = label;
      if (status === 'taken')     el.classList.add('taken');
      else if (status === 'past') el.classList.add('past-slot');
      else el.addEventListener('click', () => selectSlot(label));
      slotsGrid.appendChild(el);
    });
  }

  renderLegend();

  const sec  = document.getElementById('slotsSection');
  const form = document.getElementById('formSection');
  if (sec)  sec.style.display  = 'block';
  if (form) form.style.display = 'none';
  selectedSlot = null;
}

function renderLegend() {
  let legend = document.getElementById('slotsLegend');
  if (!legend) {
    legend = document.createElement('div');
    legend.id        = 'slotsLegend';
    legend.className = 'slots-legend';
    document.getElementById('slotsSection')?.insertBefore(legend,
      document.getElementById('slotsSection').firstChild);
  }
  legend.innerHTML = `
    <div class="legend-item">
      <div class="legend-dot" style="background:var(--gold)"></div>
      <span>Disponible</span>
    </div>
    <div class="legend-item">
      <div class="legend-dot" style="background:rgba(220,38,38,.4)"></div>
      <span>Reservado</span>
    </div>
    <div class="legend-item">
      <div class="legend-dot" style="background:rgba(107,114,128,.3)"></div>
      <span>No disponible</span>
    </div>
  `;
}

function selectSlot(time) {
  selectedSlot = time;
  document.querySelectorAll('.slot').forEach(s => s.classList.remove('selected'));
  [...document.querySelectorAll('.slot')]
    .find(s => s.textContent === time && !s.classList.contains('taken'))
    ?.classList.add('selected');

  const form = document.getElementById('formSection');
  if (form) {
    form.style.display = 'block';
    setTimeout(() => form.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  }
}

function changeMonth(dir) {
  currentDate.setMonth(currentDate.getMonth() + dir);
  selectedDay  = null;
  selectedSlot = null;
  buildCalendar();
  document.getElementById('slotsSection') && (document.getElementById('slotsSection').style.display = 'none');
  document.getElementById('formSection')  && (document.getElementById('formSection').style.display  = 'none');
}

function confirmarCita() {
  const nombre   = document.getElementById('fNombre')  ?.value.trim() || '';
  const apellido = document.getElementById('fApellido')?.value.trim() || '';
  const tel      = document.getElementById('fTel')     ?.value.trim() || '';
  const email    = document.getElementById('fEmail')   ?.value.trim() || '';
  const tipo     = document.getElementById('fTipo')    ?.value        || '';
  const modal    = document.getElementById('fModal')   ?.value        || '';

  if (!nombre) { alert('Por favor ingresa tu nombre.'); return; }
  if (!selectedDay || !selectedSlot) { alert('Por favor selecciona una fecha y horario.'); return; }

  const dowNames = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
  const fechaStr = `${dowNames[selectedDay.getDay()]} ${selectedDay.getDate()} de ${MONTHS_ES[selectedDay.getMonth()]} de ${selectedDay.getFullYear()}`;

  const msg =
    `Hola Niagara Viajes, quiero agendar una reunión:\n\n` +
    `👤 ${nombre} ${apellido}\n📞 ${tel || '-'}\n📧 ${email || '-'}\n\n` +
    `📅 Fecha: ${fechaStr}\n⏰ Hora: ${selectedSlot}\n` +
    `🗺️ Tipo: ${tipo || '-'}\n💻 Modalidad: ${modal || '-'}`;

  openWA(msg);

  BOOKED_SLOTS.push(`${dateKey(selectedDay)} ${selectedSlot}`);

  document.getElementById('slotsSection') .style.display = 'none';
  document.getElementById('formSection')  .style.display = 'none';
  document.getElementById('confirmSection')?.classList.add('show');
}

/* ─────────────────────────────────────────
   CARRUSEL DE TESTIMONIOS
───────────────────────────────────────── */
function initTestCarousel() {
  const track    = document.getElementById('testTrack');
  const prevBtn  = document.getElementById('testPrev');
  const nextBtn  = document.getElementById('testNext');
  const dotsWrap = document.getElementById('testDots');

  if (!track) return;
  const cards = Array.from(track.querySelectorAll('.test-card'));
  if (cards.length === 0) return;

  let current    = 0;
  let autoTimer  = null;
  let isDragging = false;
  let startX     = 0;
  let dragDelta  = 0;

  function visibleCount() {
    const w = window.innerWidth;
    if (w <= 600)  return 1;
    if (w <= 1024) return 2;
    return 3;
  }
  function maxIndex() { return Math.max(0, cards.length - visibleCount()); }
  function cardWidth() {
    if (!cards.length) return 0;
    return cards[0].getBoundingClientRect().width + 24;
  }

  function goTo(index, animated = true) {
    current = Math.max(0, Math.min(index, maxIndex()));
    track.style.transition = animated ? 'transform .45s cubic-bezier(.4,0,.2,1)' : 'none';
    track.style.transform  = `translateX(-${current * cardWidth()}px)`;
    updateDots();
    updateBtns();
  }

  function buildDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    for (let i = 0; i <= maxIndex(); i++) {
      const dot = document.createElement('button');
      dot.className = 'test-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Ir al testimonio ${i + 1}`);
      dot.addEventListener('click', () => { goTo(i); resetAuto(); });
      dotsWrap.appendChild(dot);
    }
  }
  function updateDots() {
    dotsWrap?.querySelectorAll('.test-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }
  function updateBtns() {
    if (prevBtn) prevBtn.disabled = current === 0;
    if (nextBtn) nextBtn.disabled = current >= maxIndex();
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(() => goTo(current >= maxIndex() ? 0 : current + 1), 5000);
  }
  function stopAuto()  { clearInterval(autoTimer); }
  function resetAuto() { stopAuto(); startAuto(); }

  prevBtn?.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  nextBtn?.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

  track.addEventListener('touchstart', e => {
    startX     = e.touches[0].clientX;
    isDragging = true;
    stopAuto();
  }, { passive: true });

  track.addEventListener('touchmove', e => {
    if (!isDragging) return;
    dragDelta = e.touches[0].clientX - startX;
    track.style.transition = 'none';
    track.style.transform  = `translateX(${-current * cardWidth() + dragDelta}px)`;
  }, { passive: true });

  track.addEventListener('touchend', () => {
    isDragging = false;
    const threshold = 60;
    if      (dragDelta < -threshold) goTo(current + 1);
    else if (dragDelta >  threshold) goTo(current - 1);
    else                              goTo(current);
    dragDelta = 0;
    startAuto();
  });

  track.addEventListener('mouseenter', stopAuto);
  track.addEventListener('mouseleave', startAuto);

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      buildDots();
      goTo(Math.min(current, maxIndex()), false);
    }, 200);
  });

  buildDots();
  goTo(0, false);
  startAuto();
}

/* ─────────────────────────────────────────
   AOS + INIT GLOBAL
───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 850, easing: 'ease-out-quart', once: true, offset: 60 });
  }

  buildCalendar();
  applyWALinks();

  /* Carrusel testimonios */
  initTestCarousel();

  /* Carrusel aliados — esperar un tick para que el DOM tenga dimensiones */
  requestAnimationFrame(() => {
    try { initPartnersCarousel(); }
    catch (e) { console.error('Partners carousel error:', e); }
  });
});