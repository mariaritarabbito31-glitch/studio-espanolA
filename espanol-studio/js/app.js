// js/app.js — Main application controller

const App = (() => {

  // ── State ────────────────────────────────────────────────────────
  let currentDayId = null;
  let exercisesLoaded = false;
  let doneMap = {};

  // ── Persistence ──────────────────────────────────────────────────
  function loadDone() {
    try { doneMap = JSON.parse(localStorage.getItem('es_done') || '{}'); }
    catch { doneMap = {}; }
  }

  function saveDone() {
    localStorage.setItem('es_done', JSON.stringify(doneMap));
  }

  function markDayDone(id) {
    doneMap[id] = true;
    saveDone();
    UI.markDoneInSidebar(id);
    UI.updateStats(doneMap);

    // Update progress bar in sidebar
    const total = STUDY_DAYS.length;
    const done  = Object.keys(doneMap).filter(k => doneMap[k]).length;
    const fill  = document.querySelector('.progress-fill');
    if (fill) fill.style.width = Math.round((done / total) * 100) + '%';
    const lbl = document.querySelector('.progress-label span:last-child');
    if (lbl) lbl.textContent = `${done}/${total} días`;
  }

  // ── Modal (API Key) ──────────────────────────────────────────────
  function initModal() {
    const overlay   = document.getElementById('modal-overlay');
    const input     = document.getElementById('api-key-input');
    const toggle    = document.getElementById('toggle-key-visibility');
    const confirmBtn= document.getElementById('modal-confirm');
    const skipBtn   = document.getElementById('modal-skip');
    const errorBox  = document.getElementById('modal-error');
    const changeBtn = document.getElementById('btn-change-key');

    // Pre-fill if key exists
    const existing = API.getKey();
    if (existing) {
      input.value = existing;
      overlay.classList.add('hidden');
    }

    // Toggle password visibility
    toggle.addEventListener('click', () => {
      const isPass = input.type === 'password';
      input.type = isPass ? 'text' : 'password';
      toggle.setAttribute('aria-label', isPass ? 'Ocultar clave' : 'Mostrar clave');
    });

    // Confirm key
    confirmBtn.addEventListener('click', async () => {
      const key = input.value.trim();
      if (!key) {
        showModalError('Introduce una clave API válida.');
        return;
      }
      if (!key.startsWith('sk-ant-')) {
        showModalError('La clave debe empezar por "sk-ant-…".');
        return;
      }
      confirmBtn.textContent = 'Verificando…';
      confirmBtn.disabled    = true;
      errorBox.hidden        = true;

      const valid = await API.validateKey(key);
      if (valid) {
        API.setKey(key);
        overlay.classList.add('hidden');
      } else {
        showModalError('Clave inválida o sin créditos. Compruébala en console.anthropic.com.');
      }
      confirmBtn.textContent = 'Comenzar →';
      confirmBtn.disabled    = false;
    });

    // Skip
    skipBtn.addEventListener('click', () => {
      overlay.classList.add('hidden');
    });

    // Enter key on input
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') confirmBtn.click();
    });

    // Change key from header
    changeBtn.addEventListener('click', () => {
      input.value = API.getKey();
      errorBox.hidden = true;
      overlay.classList.remove('hidden');
      input.focus();
    });

    function showModalError(msg) {
      errorBox.textContent = msg;
      errorBox.hidden      = false;
    }
  }

  // ── Day navigation ───────────────────────────────────────────────
  function loadDay(id) {
    const day = STUDY_DAYS.find(d => d.id === id);
    if (!day) return;

    currentDayId    = id;
    exercisesLoaded = false;
    Exercises.resetExerciseData();

    UI.setActiveDay(id);
    UI.showStudyView();
    UI.renderStudyShell(day);

    // Tab listener: open exercises tab on demand
    UI.attachTabListeners(() => {
      if (!exercisesLoaded) {
        exercisesLoaded = true;
        Exercises.loadExercises(day);
      }
    });

    // Load explanation immediately
    Exercises.loadExplanation(day);
  }

  // ── Init ─────────────────────────────────────────────────────────
  function init() {
    loadDone();

    UI.buildSidebar(doneMap, (id) => loadDay(id));
    UI.updateStats(doneMap);
    initModal();
  }

  // Public
  return { init, markDayDone };
})();

// Boot
document.addEventListener('DOMContentLoaded', () => App.init());
