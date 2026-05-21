/* ═══════════════════════════════════════════
   NIAGARA VIAJES — Dashboard JS
═══════════════════════════════════════════ */

/* ── Sidebar collapse (desktop) ── */
let collapsed = false;
function toggleCollapse() {
  const sidebar = document.getElementById('sidebar');
  const icon    = document.getElementById('collapseIcon');
  if (!sidebar) return;
  collapsed = !collapsed;
  sidebar.classList.toggle('collapsed', collapsed);
  if (icon) icon.className = collapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left';
  localStorage.setItem('sidebarCollapsed', collapsed);
}

/* ── Sidebar mobile ── */
function toggleSidebar() {
  const sidebar  = document.getElementById('sidebar');
  const overlay  = document.getElementById('sidebarOverlay');
  const icon     = document.getElementById('topbarIcon');
  if (!sidebar) return;
  const open = sidebar.classList.toggle('mobile-open');
  overlay?.classList.toggle('active', open);
  if (icon) icon.className = open ? 'fas fa-times' : 'fas fa-bars';
}
function closeSidebar() {
  document.getElementById('sidebar')       ?.classList.remove('mobile-open');
  document.getElementById('sidebarOverlay')?.classList.remove('active');
  const icon = document.getElementById('topbarIcon');
  if (icon) icon.className = 'fas fa-bars';
}

/* ── Buscar en tabla ── */
function filterTable() {
  const input = document.getElementById('searchInput');
  if (!input) return;
  const filter  = input.value.toLowerCase();
  const table   = document.getElementById('usuariosTable');
  if (!table) return;
  const rows    = table.querySelectorAll('tbody tr');
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(filter) ? '' : 'none';
  });
}

/* ── Toggle contraseña (dashboard) ── */
function togglePwDash(inputId, iconId) {
  const input = document.getElementById(inputId);
  const icon  = document.getElementById(iconId);
  if (!input || !icon) return;
  const show     = input.type === 'password';
  input.type     = show ? 'text' : 'password';
  icon.className = show ? 'fas fa-eye-slash' : 'fas fa-eye';
}

/* ── Fecha en bienvenida ── */
function setWelcomeDate() {
  const now    = new Date();
  const months = ['Ene','Feb','Mar','Abr','May','Jun',
                  'Jul','Ago','Sep','Oct','Nov','Dic'];
  const days   = ['Domingo','Lunes','Martes','Miércoles',
                  'Jueves','Viernes','Sábado'];
  const dayEl  = document.getElementById('dateDay');
  const monEl  = document.getElementById('dateMonth');
  if (dayEl) dayEl.textContent = now.getDate();
  if (monEl) monEl.textContent = `${days[now.getDay()]}, ${months[now.getMonth()]}`;
}

/* ── Auto-cerrar alertas ── */
function initAlerts() {
  document.querySelectorAll('.dash-alert').forEach(el => {
    setTimeout(() => {
      el.style.transition = 'opacity .5s, max-height .5s';
      el.style.opacity    = '0';
      el.style.maxHeight  = '0';
      el.style.overflow   = 'hidden';
    }, 4000);
  });
}

/* ── DOMContentLoaded ── */
document.addEventListener('DOMContentLoaded', () => {
  // Restaurar sidebar collapse
  if (localStorage.getItem('sidebarCollapsed') === 'true'
      && window.innerWidth > 768) {
    collapsed = false;
    toggleCollapse();
  }
  // Cerrar drawer al click en nav-item (mobile)
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      if (window.innerWidth <= 768) closeSidebar();
    });
  });
  setWelcomeDate();
  initAlerts();
});