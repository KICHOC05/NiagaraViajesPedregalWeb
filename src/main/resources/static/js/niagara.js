/* ═══════════════════════════════════════════
   NIAGARA VIAJES PEDREGAL — Main JS v3.0
   ── Cambia el número aquí (una sola línea) ──
═══════════════════════════════════════════ */
const WA_NUMBER = '5215623981020';

/* ─────────────────────────────────────────
   Horarios de negocio reales
   Lun–Vie: 9:00–19:00  |  Sáb: 10:00–15:00
───────────────────────────────────────── */
const BUSINESS_HOURS = {
  1: { open: 9,  close: 19 }, // Lunes
  2: { open: 9,  close: 19 }, // Martes
  3: { open: 9,  close: 19 }, // Miércoles
  4: { open: 9,  close: 19 }, // Jueves
  5: { open: 9,  close: 19 }, // Viernes
  6: { open: 10, close: 15 }, // Sábado
  0: null                      // Domingo — cerrado
};

// Duración de cada cita en minutos
const SLOT_DURATION = 30;

// Simula citas ya reservadas (en producción vendrían del backend)
// Formato: 'YYYY-MM-DD HH:mm'
const BOOKED_SLOTS = [
  formatTodaySlot(10, 0),
  formatTodaySlot(11, 30),
  formatTodaySlot(15, 0),
];

function formatTodaySlot(h, m) {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(h)}:${pad(m)}`;
}
function pad(n) { return String(n).padStart(2,'0'); }
function dateKey(date) {
  return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}`;
}

/* ─────────────────────────────────────────
   Generar slots reales según día y hora actual
───────────────────────────────────────── */
function generateSlots(date) {
  const dow   = date.getDay();
  const hours = BUSINESS_HOURS[dow];
  if (!hours) return [];   // domingo

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

      // Slot en el pasado (si es hoy y la hora ya pasó + 30min buffer)
      if (isToday) {
        const buffer = new Date(now.getTime() + 30 * 60 * 1000);
        if (slotTime <= buffer) { status = 'past'; }
      }

      // Slot ya reservado
      if (BOOKED_SLOTS.includes(key)) { status = 'taken'; }

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
    tel.href = `tel:+${WA_NUMBER}`;
    tel.textContent = `+${WA_NUMBER}`;
  }
  const fwa = document.getElementById('footer-wa');
  if (fwa) fwa.href = waLink('Hola, quisiera más información.');

  document.querySelectorAll('[data-wa-msg]').forEach(el => {
    el.href = waLink(el.dataset.waMsg);
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
const LIGHT_SECTIONS = ['#servicios','#aliados','#nosotros','#testimonios'];

function updateNav() {
  const sy       = window.scrollY;
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const pct      = maxScroll > 0 ? (sy / maxScroll) * 100 : 0;

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

  navbar.classList.remove('scrolled','light-bg');
  if      (sy < 10)   { /* top — transparente */ }
  else if (inLight)   { navbar.classList.add('light-bg'); }
  else                { navbar.classList.add('scrolled'); }
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

  // Reservar espacio para evitar saltos de layout
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
    // Pre-fijar ancho para evitar temblor
    el.textContent = '0';
    counterObserver.observe(el);
  });
});

/* ─────────────────────────────────────────
   TOAST DE BIENVENIDA
   Se activa si el servidor agrega ?welcome=Nombre
   o si existe data-welcome en el body
───────────────────────────────────────── */
function showWelcomeToast(nombre) {
  let toast = document.getElementById('toastWelcome');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastWelcome';
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

  // Mostrar
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });

  // Auto cerrar en 5 segundos
  setTimeout(() => closeToast(), 5000);
}

function closeToast() {
  const toast = document.getElementById('toastWelcome');
  if (!toast) return;
  toast.classList.remove('show');
  setTimeout(() => toast.remove(), 500);
}

// Leer parámetro ?welcome=Nombre de la URL
document.addEventListener('DOMContentLoaded', () => {
  const params  = new URLSearchParams(window.location.search);
  const welcome = params.get('welcome');
  if (welcome) {
    showWelcomeToast(decodeURIComponent(welcome));
    // Limpiar el parámetro de la URL sin recargar
    const cleanUrl = window.location.pathname +
      (window.location.search.replace(/[?&]welcome=[^&]*/,'').replace(/^&/,'?') || '');
    window.history.replaceState({}, '', cleanUrl);
  }
});

/* ─────────────────────────────────────────
   CALENDAR — con horarios reales
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

  // Headers días
  DAYS_ES.forEach(d => {
    const el = document.createElement('div');
    el.className = 'cal-dow'; el.textContent = d;
    grid.appendChild(el);
  });

  const firstDay    = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const today       = new Date(); today.setHours(0,0,0,0);

  // Empties
  for (let i = 0; i < firstDay; i++) {
    const e = document.createElement('div'); e.className = 'cal-day empty';
    grid.appendChild(e);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dayDate = new Date(y, m, d);
    const el      = document.createElement('div');
    el.className  = 'cal-day';
    el.textContent = d;

    const isToday  = dayDate.getTime() === today.getTime();
    const isPast   = dayDate < today;
    const isSunday = dayDate.getDay() === 0;

    if (isToday)  el.classList.add('today');
    if (isSunday) el.classList.add('sunday');
    if (isPast)   el.classList.add('past');

    // Días sin horario disponible (cerrado)
    const dow = dayDate.getDay();
    const hasHours = BUSINESS_HOURS[dow] !== null && BUSINESS_HOURS[dow] !== undefined;
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
    const dow = date.getDay();
    const dowNames = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
    label.textContent = `${dowNames[dow]} ${date.getDate()} de ${MONTHS_ES[date.getMonth()]}`;
  }

  const slots     = generateSlots(date);
  const slotsGrid = document.getElementById('slotsGrid');
  if (!slotsGrid) return;
  slotsGrid.innerHTML = '';

  if (slots.length === 0) {
    slotsGrid.innerHTML = '<p style="font-size:.8rem;color:var(--gray);grid-column:1/-1">No hay horarios disponibles este día.</p>';
  } else {
    slots.forEach(({ label, status }) => {
      const el = document.createElement('div');
      el.className = 'slot';
      el.textContent = label;
      if (status === 'taken')    { el.classList.add('taken'); }
      else if (status === 'past'){ el.classList.add('past-slot'); }
      else {
        el.addEventListener('click', () => selectSlot(label));
      }
      slotsGrid.appendChild(el);
    });
  }

  // Leyenda
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
    legend.id = 'slotsLegend';
    legend.className = 'slots-legend';
    const sec = document.getElementById('slotsSection');
    if (sec) sec.insertBefore(legend, sec.firstChild);
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
  if (form) form.style.display = 'block';

  // Scroll suave al formulario
  setTimeout(() => form?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
}

function changeMonth(dir) {
  currentDate.setMonth(currentDate.getMonth() + dir);
  selectedDay  = null;
  selectedSlot = null;
  buildCalendar();
  const sec  = document.getElementById('slotsSection');
  const form = document.getElementById('formSection');
  if (sec)  sec.style.display  = 'none';
  if (form) form.style.display = 'none';
}

function confirmarCita() {
  const nombre   = document.getElementById('fNombre')  ?.value.trim() || '';
  const apellido = document.getElementById('fApellido')?.value.trim() || '';
  const tel      = document.getElementById('fTel')     ?.value.trim() || '';
  const email    = document.getElementById('fEmail')   ?.value.trim() || '';
  const tipo     = document.getElementById('fTipo')    ?.value        || '';
  const modal    = document.getElementById('fModal')   ?.value        || '';

  if (!nombre) { alert('Por favor ingresa tu nombre.'); return; }
  if (!selectedDay || !selectedSlot) {
    alert('Por favor selecciona una fecha y horario.');
    return;
  }

  const dowNames = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
  const fechaStr = `${dowNames[selectedDay.getDay()]} ${selectedDay.getDate()} de ${MONTHS_ES[selectedDay.getMonth()]} de ${selectedDay.getFullYear()}`;

  const msg =
    `Hola Niagara Viajes, quiero agendar una reunión:\n\n` +
    `👤 ${nombre} ${apellido}\n` +
    `📞 ${tel || '-'}\n` +
    `📧 ${email || '-'}\n\n` +
    `📅 Fecha: ${fechaStr}\n` +
    `⏰ Hora: ${selectedSlot}\n` +
    `🗺️ Tipo de viaje: ${tipo || '-'}\n` +
    `💻 Modalidad: ${modal || '-'}`;

  openWA(msg);

  // Marcar el slot como reservado localmente
  BOOKED_SLOTS.push(`${dateKey(selectedDay)} ${selectedSlot}`);

  // Mostrar confirmación
  document.getElementById('slotsSection') .style.display = 'none';
  document.getElementById('formSection')  .style.display = 'none';
  document.getElementById('confirmSection')?.classList.add('show');
}

/* ─────────────────────────────────────────
   AOS + INIT
───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 850, easing: 'ease-out-quart', once: true, offset: 60 });
  }
  buildCalendar();
  applyWALinks();
});