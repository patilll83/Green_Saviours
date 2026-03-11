/* ── Active sidebar link ─────────────────────────────────── */
const path = window.location.pathname;
const navLinks = document.querySelectorAll('#sidebar-nav a');
navLinks.forEach(link => {
  const href = link.getAttribute('href');
  if (href && href !== '/' && path.includes(href)) {
    link.classList.add('active');
  } else if (href === '/' && path === '/') {
    link.classList.add('active');
  }
});

/* ── Auto-dismiss alerts with slide-out animation ────────── */
const alertsWrapper = document.querySelector('.alerts-wrapper');
if (alertsWrapper) {
  setTimeout(() => {
    alertsWrapper.classList.add('hiding');
    alertsWrapper.addEventListener('animationend', () => {
      alertsWrapper.style.display = 'none';
    }, { once: true });
  }, 4500);
}

/* ── Sidebar toggle ──────────────────────────────────────── */
const sidebarBtn = document.querySelector('#sidebar-toggler-btn');
if (sidebarBtn) {
  sidebarBtn.addEventListener('click', () => {
    document.querySelector('#sidebar').classList.toggle('sidebar-hide');
  });
}

/* ── Form submit spinner (prevents double-submit) ────────── */
document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', function () {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn && !submitBtn.classList.contains('btn-loading')) {
      // Wrap text so spinner can overlay it
      if (!submitBtn.querySelector('.btn-text')) {
        submitBtn.innerHTML = `<span class="btn-text">${submitBtn.textContent}</span>`;
      }
      submitBtn.classList.add('btn-loading');
      // Safety release after 8 seconds in case of server error
      setTimeout(() => submitBtn.classList.remove('btn-loading'), 8000);
    }
  });
});
