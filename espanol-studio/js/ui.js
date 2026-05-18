// js/ui.js — UI rendering helpers

const UI = (() => {

  // ── Escaping ────────────────────────────────────────────────────
  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escAttr(str) {
    return String(str).replace(/"/g, '&quot;');
  }

  // ── Spinner ──────────────────────────────────────────────────────
  function spinnerHtml(msg = 'Cargando…') {
    return `<div class="loading-msg"><div class="spinner"></div>${esc(msg)}</div>`;
  }

  // ── Feedback element ─────────────────────────────────────────────
  function feedbackEl(id) {
    return document.getElementById(id);
  }

  function showFeedback(id, type, text) {
    const el = document.getElementById(id);
    if (!el) return;
    el.className = `feedback fb-${type} show`;
    el.textContent = text;
  }

  function hideFeedback(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.className = 'feedback';
    el.textContent = '';
  }

  // ── Build sidebar ─────────────────────────────────────────────────
  function buildSidebar(doneMap, onDayClick) {
    const sidebarInner = document.getElementById('sidebar-inner');
    const total = STUDY_DAYS.length;
    const doneCount = Object.keys(doneMap).filter(k => doneMap[k]).length;
    const pct = Math.round((doneCount / total) * 100);

    let html = `
      <div class="sidebar-progress">
        <div class="progress-label">
          <span>Progreso</span>
          <span>${doneCount}/${total} días</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width:${pct}%"></div>
        </div>
      </div>`;

    WEEK_GROUPS.forEach(group => {
      html += `<div class="week-label">${esc(group.label)}</div>`;
      group.ids.forEach(id => {
        const day = STUDY_DAYS.find(d => d.id === id);
        if (!day) return;
        const isDone = !!doneMap[id];
        const temaShort = day.tema.length > 52
          ? day.tema.slice(0, 52) + '…'
          : day.tema;
        html += `
          <button class="day-btn${isDone ? ' done' : ''}"
                  data-id="${id}"
                  aria-label="${esc(day.date)}: ${esc(day.tema)}">
            <div class="day-dot-wrap">
              <div class="day-dot ${esc(day.dotClass)}"></div>
            </div>
            <div class="day-text">
              <div class="day-name">${esc(day.date)}</div>
              <div class="day-tema-short">${esc(temaShort)}</div>
            </div>
          </button>`;
      });
    });

    sidebarInner.innerHTML = html;

    // Attach click listeners
    sidebarInner.querySelectorAll('.day-btn').forEach(btn => {
      btn.addEventListener('click', () => onDayClick(btn.dataset.id));
    });
  }

  // ── Set active day in sidebar ─────────────────────────────────────
  function setActiveDay(id) {
    document.querySelectorAll('.day-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.id === id);
    });
  }

  // ── Mark day done in sidebar ──────────────────────────────────────
  function markDoneInSidebar(id) {
    const btn = document.querySelector(`.day-btn[data-id="${id}"]`);
    if (btn) btn.classList.add('done');
  }

  // ── Update welcome stats ──────────────────────────────────────────
  function updateStats(doneMap) {
    const total = STUDY_DAYS.length;
    const done  = Object.keys(doneMap).filter(k => doneMap[k]).length;
    const left  = total - done;
    document.getElementById('stat-done').textContent  = done;
    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-left').textContent  = left;

    // Also refresh progress bar
    const fill = document.querySelector('.progress-fill');
    if (fill) fill.style.width = Math.round((done / total) * 100) + '%';
    const label = document.querySelector('.progress-label span:last-child');
    if (label) label.textContent = `${done}/${total} días`;
  }

  // ── Render explanation text ───────────────────────────────────────
  function renderExplanation(rawText, day) {
    // Split by section tags: [REGLAS], [EJEMPLOS], [ATENCIÓN]
    const tagRe = /\[(REGLAS|EJEMPLOS?|ATENCI[OÓ]N)\]/gi;
    const parts  = rawText.split(tagRe);

    let html = `<div class="explanation-card">
      <h3>📐 ${esc(day.tema)}</h3>`;

    if (parts.length <= 1) {
      // No section tags — render as plain text
      html += `<div class="rule-text">${esc(rawText)}</div>`;
    } else {
      for (let i = 1; i < parts.length; i += 2) {
        const tag     = parts[i].toUpperCase();
        const content = (parts[i + 1] || '').trim();
        if (tag.includes('EJEMP')) {
          html += `<div class="example-block">${esc(content)}</div>`;
        } else if (tag.includes('ATEN')) {
          html += `<div class="warning-block">⚠️ ${esc(content)}</div>`;
        } else {
          html += `<p class="section-title">📌 ${tag}</p>
                   <div class="rule-text">${esc(content)}</div>`;
        }
      }
    }

    html += `</div>
      <div class="btn-row">
        <button class="btn btn-primary btn-sm" id="go-exercises-btn">
          Ir a ejercicios →
        </button>
      </div>`;
    return html;
  }

  // ── Show / hide views ─────────────────────────────────────────────
  function showStudyView() {
    document.getElementById('welcome-screen').hidden = true;
    const sv = document.getElementById('study-view');
    sv.hidden = false;
  }

  function showWelcome() {
    document.getElementById('welcome-screen').hidden = false;
    document.getElementById('study-view').hidden = true;
  }

  // ── Inject study shell into #study-view ───────────────────────────
  function renderStudyShell(day) {
    const sv = document.getElementById('study-view');
    sv.innerHTML = `
      <div class="day-header">
        <span class="level-badge ${esc(day.badgeClass)}">${esc(day.level)}</span>
        <div>
          <div class="day-title">${esc(day.tema)}</div>
          <div class="day-schedule">${esc(day.date)} · ${esc(day.schedule)}</div>
        </div>
      </div>

      <div class="tabs" role="tablist">
        <button class="tab-btn active" role="tab"
                aria-selected="true" data-tab="explicacion">
          <img src="assets/img/book-open.svg" alt="" width="14" height="14" />
          Explicación
        </button>
        <button class="tab-btn" role="tab"
                aria-selected="false" data-tab="ejercicios">
          <img src="assets/img/pencil.svg" alt="" width="14" height="14" />
          Ejercicios
        </button>
      </div>

      <div id="panel-explicacion" class="panel active" role="tabpanel">
        ${spinnerHtml('Generando explicación…')}
      </div>
      <div id="panel-ejercicios" class="panel" role="tabpanel">
        ${spinnerHtml('Generando ejercicios…')}
      </div>`;
  }

  // ── Tab switching logic ───────────────────────────────────────────
  function attachTabListeners(onExercisesTabOpen) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const panel = document.getElementById('panel-' + btn.dataset.tab);
        if (panel) panel.classList.add('active');

        if (btn.dataset.tab === 'ejercicios') {
          onExercisesTabOpen();
        }
      });
    });
  }

  // ── Switch to exercises tab programmatically ──────────────────────
  function switchToExercisesTab() {
    const btn = document.querySelector('[data-tab="ejercicios"]');
    if (btn) btn.click();
  }

  return {
    esc, escAttr, spinnerHtml,
    showFeedback, hideFeedback,
    buildSidebar, setActiveDay, markDoneInSidebar,
    updateStats,
    renderExplanation,
    showStudyView, showWelcome,
    renderStudyShell, attachTabListeners,
    switchToExercisesTab
  };
})();
