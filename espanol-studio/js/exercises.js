// js/exercises.js — Exercise rendering, checking and scoring

const Exercises = (() => {

  let _score     = 0;
  let _maxScore  = 0;
  let _dayId     = null;
  let _exerciseData = null;

  // ── Score helpers ────────────────────────────────────────────────
  function resetScore(dayId) {
    _score    = 0;
    _maxScore = 0;
    _dayId    = dayId;
  }
  function addScore(n) { _score += n; }
  function addMax(n)   { _maxScore += n; }
  function getScore()  { return { score: _score, max: _maxScore }; }

  function updateScoreBar() {
    const bar = document.getElementById('score-bar');
    if (!bar) return;
    bar.hidden = false;
    document.getElementById('score-num').textContent  = Math.round(_score);
    document.getElementById('score-max').textContent  = _maxScore;
  }

  // ── Flexible answer matching ─────────────────────────────────────
  function normalize(str) {
    return str
      .toLowerCase()
      .trim()
      .replace(/[¿¡.,;:!?]/g, '')
      .replace(/\s+/g, ' ');
  }

  function flexMatch(userAnswer, correct) {
    return normalize(userAnswer) === normalize(correct);
  }

  // ── Systems prompt for explanation ──────────────────────────────
  const EXPLANATION_SYSTEM = `Eres un profesor universitario experto en español para el curso Lengua y Traducción Española 2 (itinerario B1→B2). Escribe la explicación gramatical del tema del día completamente en español, de forma clara, precisa y académicamente rigurosa. Estructura la respuesta con estas tres etiquetas exactas en mayúsculas entre corchetes:

[REGLAS]
Morfología y usos detallados con tablas o paradigmas donde sean útiles.

[EJEMPLOS]
4-6 ejemplos representativos, cada uno seguido de una nota explicativa entre paréntesis.

[ATENCIÓN]
2-3 errores frecuentes o trampas que hay que evitar.

No uses markdown. No uses asteriscos ni almohadillas. Texto plano con las tres etiquetas indicadas.`;

  // ── System prompt for exercises ─────────────────────────────────
  const EXERCISES_SYSTEM = `Sei un professore universitario esperto di spagnolo (corso Lingua e Traduzione Spagnola 2, livello B1→B2). Crea esercizi in spagnolo sul tema indicato. Devi restituire ESCLUSIVAMENTE un oggetto JSON valido, senza alcun testo fuori dal JSON e senza backtick markdown. La struttura deve essere ESATTAMENTE questa:

{
  "completar": [
    {"frase": "Frase con ___ al posto del verbo.", "respuesta": "forma corretta", "pista": "tempo verbale"},
    ... (5 elementi)
  ],
  "transformar": [
    {"original": "Frase originale.", "instruccion": "Istruzione di trasformazione.", "respuesta": "Frase trasformata."},
    ... (4 elementi)
  ],
  "traducir": [
    {"italiano": "Frase in italiano.", "respuesta": "Traduzione in spagnolo."},
    ... (4 elementi)
  ],
  "produccion": [
    {"consigna": "Consegna della produzione libera.", "elementos": ["forma1","forma2","forma3"]}
  ],
  "quiz": [
    {"pregunta": "Domanda.", "opciones": ["A","B","C","D"], "correcta": 0, "explicacion": "Spiegazione della risposta corretta."},
    ... (5 elementi)
  ]
}

"correcta" è l'indice 0-based dell'opzione corretta. Tutti gli esercizi devono essere direttamente pertinenti al tema del giorno. Le frasi di traduzione devono essere italiano→spagnolo. Restituisci SOLO il JSON.`;

  // ── Load explanation ─────────────────────────────────────────────
  async function loadExplanation(day) {
    const panel = document.getElementById('panel-explicacion');
    try {
      const prompt = `Hoy es ${day.date}. El tema del día es: "${day.tema}". Escribe la explicación completa.`;
      const raw    = await API.send(prompt, EXPLANATION_SYSTEM, 1200);
      panel.innerHTML = UI.renderExplanation(raw, day);

      // "Go to exercises" button
      const goBtn = document.getElementById('go-exercises-btn');
      if (goBtn) goBtn.addEventListener('click', () => UI.switchToExercisesTab());

    } catch (err) {
      panel.innerHTML = errorHtml(err);
    }
  }

  // ── Load exercises ───────────────────────────────────────────────
  async function loadExercises(day) {
    const panel = document.getElementById('panel-ejercicios');

    // Already loaded
    if (_exerciseData) { renderPanel(panel, _exerciseData, day.id); return; }

    try {
      const prompt = `Tema del día: "${day.tema}" (${day.date}). Crea i esercizi.`;
      const raw    = await API.send(prompt, EXERCISES_SYSTEM, 1400);
      const clean  = raw.replace(/```json|```/g, '').trim();
      const data   = JSON.parse(clean);
      _exerciseData = data;
      renderPanel(panel, data, day.id);
    } catch (err) {
      panel.innerHTML = errorHtml(err);
    }
  }

  function resetExerciseData() { _exerciseData = null; }

  // ── Render exercise panel ────────────────────────────────────────
  function renderPanel(panel, data, dayId) {
    resetScore(dayId);

    // Calculate max score: 5 completar + 4 transformar + 4 traducir + 0.5 produccion + 5 quiz
    addMax(5 + 4 + 4 + 0.5 + 5);

    let html = `
      <!-- Score bar -->
      <div id="score-bar" class="score-bar" hidden>
        <div class="score-num" id="score-num">0</div>
        <div class="score-meta">
          <div class="score-label">puntos de <span id="score-max">0</span></div>
        </div>
        <button class="btn btn-secondary btn-sm" id="mark-done-btn">✓ Día completado</button>
      </div>`;

    html += buildCompletarSection(data.completar);
    html += buildTransformarSection(data.transformar);
    html += buildTraducirSection(data.traducir);
    html += buildProduccionSection(data.produccion);
    html += buildQuizSection(data.quiz);

    panel.innerHTML = html;
    attachAllListeners(panel, data, dayId);
  }

  // ── Section builders ─────────────────────────────────────────────

  function buildCompletarSection(items) {
    let html = `<div class="exercise-section">
      <h4 class="exercise-section-title">1 · Completar las frases</h4>`;
    items.forEach((item, i) => {
      const parts = item.frase.split('___');
      html += `<div class="exercise-card"
                    data-type="completar" data-idx="${i}"
                    data-answer="${UI.escAttr(item.respuesta)}">
        <p>${UI.esc(parts[0])}<input class="blank-input" type="text"
             placeholder="${UI.esc(item.pista || '…')}"
             data-q="completar-${i}" autocomplete="off"
             aria-label="Completar ${i+1}" />${UI.esc(parts[1] || '')}</p>
        <div class="feedback" id="fb-completar-${i}"></div>
      </div>`;
    });
    html += `<div class="btn-row">
      <button class="btn btn-primary btn-sm check-btn" data-check="completar">Corregir →</button>
    </div></div>`;
    return html;
  }

  function buildTransformarSection(items) {
    let html = `<div class="exercise-section">
      <h4 class="exercise-section-title">2 · Transformar frases</h4>`;
    items.forEach((item, i) => {
      html += `<div class="exercise-card"
                    data-type="transformar" data-idx="${i}"
                    data-answer="${UI.escAttr(item.respuesta)}">
        <p>${UI.esc(item.original)}</p>
        <span class="prompt-label">→ ${UI.esc(item.instruccion)}</span>
        <input type="text" data-q="transformar-${i}"
               placeholder="Tu respuesta…" autocomplete="off"
               aria-label="Transformar ${i+1}" />
        <div class="feedback" id="fb-transformar-${i}"></div>
      </div>`;
    });
    html += `<div class="btn-row">
      <button class="btn btn-primary btn-sm check-btn" data-check="transformar">Corregir →</button>
    </div></div>`;
    return html;
  }

  function buildTraducirSection(items) {
    let html = `<div class="exercise-section">
      <h4 class="exercise-section-title">3 · Traducción italiano → español</h4>`;
    items.forEach((item, i) => {
      html += `<div class="exercise-card"
                    data-type="traducir" data-idx="${i}"
                    data-answer="${UI.escAttr(item.respuesta)}">
        <p>🇮🇹 <em>${UI.esc(item.italiano)}</em></p>
        <input type="text" data-q="traducir-${i}"
               placeholder="Traducción…" autocomplete="off"
               aria-label="Traducir ${i+1}" />
        <div class="feedback" id="fb-traducir-${i}"></div>
      </div>`;
    });
    html += `<div class="btn-row">
      <button class="btn btn-primary btn-sm check-btn" data-check="traducir">Corregir →</button>
    </div></div>`;
    return html;
  }

  function buildProduccionSection(items) {
    let html = `<div class="exercise-section">
      <h4 class="exercise-section-title">4 · Producción libre</h4>`;
    items.forEach((item, i) => {
      html += `<div class="exercise-card" data-type="produccion" data-idx="${i}">
        <p>${UI.esc(item.consigna)}</p>
        ${item.elementos && item.elementos.length
          ? `<span class="prompt-label">Usa: ${item.elementos.map(e => `<em>${UI.esc(e)}</em>`).join(', ')}</span>`
          : ''}
        <textarea data-q="produccion-${i}"
                  placeholder="Escribe aquí tu respuesta…"
                  rows="4"
                  aria-label="Producción libre ${i+1}"></textarea>
        <div class="btn-row">
          <button class="btn btn-outline btn-sm correct-prod-btn" data-prod-idx="${i}">
            Corregir con IA ↗
          </button>
        </div>
        <div class="correction-area" id="corr-prod-${i}"></div>
      </div>`;
    });
    html += `</div>`;
    return html;
  }

  function buildQuizSection(items) {
    let html = `<div class="exercise-section">
      <h4 class="exercise-section-title">5 · Quiz de opción múltiple</h4>`;
    items.forEach((item, i) => {
      html += `<div class="exercise-card"
                    data-type="quiz" data-idx="${i}"
                    data-correct="${item.correcta}">
        <p><strong>${i + 1}.</strong> ${UI.esc(item.pregunta)}</p>
        <div class="quiz-options" role="radiogroup">`;
      item.opciones.forEach((op, oi) => {
        html += `<label class="quiz-opt" data-qi="${i}" data-oi="${oi}">
          <input type="radio" name="quiz-${i}" value="${oi}" />
          ${UI.esc(op)}
        </label>`;
      });
      html += `</div>
        <div class="feedback" id="fb-quiz-${i}"
             data-expl="${UI.escAttr(item.explicacion)}"></div>
      </div>`;
    });
    html += `<div class="btn-row">
      <button class="btn btn-primary btn-sm" id="check-quiz-btn">Corregir quiz →</button>
    </div></div>`;
    return html;
  }

  // ── Attach all listeners ─────────────────────────────────────────
  function attachAllListeners(panel, data, dayId) {

    // Check buttons (completar / transformar / traducir)
    panel.querySelectorAll('.check-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.check;
        let gained = 0;
        panel.querySelectorAll(`[data-type="${type}"]`).forEach(card => {
          const idx    = card.dataset.idx;
          const answer = card.dataset.answer;
          const input  = panel.querySelector(`[data-q="${type}-${idx}"]`);
          const fbId   = `fb-${type}-${idx}`;
          if (!input) return;
          const val = input.value.trim();
          if (!val) { UI.showFeedback(fbId, 'neutral', 'Escribe tu respuesta.'); return; }
          if (flexMatch(val, answer)) {
            UI.showFeedback(fbId, 'correct', '✓ Correcto: ' + answer);
            gained += 1;
          } else {
            UI.showFeedback(fbId, 'wrong', '✗ Respuesta modelo: ' + answer);
          }
        });
        addScore(gained);
        updateScoreBar();
      });
    });

    // Quiz
    panel.querySelectorAll('.quiz-opt').forEach(opt => {
      opt.addEventListener('click', () => {
        const qi = opt.dataset.qi;
        panel.querySelectorAll(`.quiz-opt[data-qi="${qi}"]`)
             .forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        opt.querySelector('input[type="radio"]').checked = true;
      });
    });

    const quizBtn = document.getElementById('check-quiz-btn');
    if (quizBtn) {
      quizBtn.addEventListener('click', () => {
        let gained = 0;
        data.quiz.forEach((item, i) => {
          const selected = panel.querySelector(`input[name="quiz-${i}"]:checked`);
          const fb       = document.getElementById(`fb-quiz-${i}`);
          if (!selected) { UI.showFeedback(`fb-quiz-${i}`, 'neutral', 'Selecciona una opción.'); return; }
          const oi      = parseInt(selected.value, 10);
          const correct = oi === item.correcta;
          panel.querySelectorAll(`.quiz-opt[data-qi="${i}"]`).forEach((opt, idx) => {
            opt.classList.remove('correct', 'wrong', 'selected');
            if (idx === item.correcta) opt.classList.add('correct');
            else if (idx === oi && !correct) opt.classList.add('wrong');
          });
          if (correct) {
            UI.showFeedback(`fb-quiz-${i}`, 'correct', '✓ ' + fb.dataset.expl);
            gained += 1;
          } else {
            UI.showFeedback(`fb-quiz-${i}`, 'wrong', '✗ ' + fb.dataset.expl);
          }
        });
        addScore(gained);
        updateScoreBar();
      });
    }

    // Producción libre — AI correction
    panel.querySelectorAll('.correct-prod-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const idx      = btn.dataset.prodIdx;
        const textarea = panel.querySelector(`[data-q="produccion-${idx}"]`);
        const corrArea = document.getElementById(`corr-prod-${idx}`);
        const val      = textarea.value.trim();
        if (!val) {
          corrArea.innerHTML = `<div class="feedback fb-neutral show">Escribe algo primero.</div>`;
          return;
        }
        btn.textContent = '⏳ Corrigiendo…';
        btn.disabled    = true;
        try {
          const day  = STUDY_DAYS.find(d => d.id === _dayId);
          const sys  = 'Eres un profesor de español universitario. Corrige brevemente la producción del estudiante (máx 80 palabras): señala errores específicos, sugiere mejoras concretas y da una valoración final (Excelente / Bien / Regular / Mejorar). Sé directo y constructivo. Responde en español.';
          const msg  = `Tema: "${day ? day.tema : ''}"\nTexto del estudiante:\n"${val}"`;
          const resp = await API.send(msg, sys, 400);
          corrArea.innerHTML = `<div class="correction-box">${UI.esc(resp)}</div>`;
          addScore(0.5);
          updateScoreBar();
        } catch (err) {
          corrArea.innerHTML = `<div class="feedback fb-wrong show">Error al corregir: ${UI.esc(err.message)}</div>`;
        }
        btn.textContent = 'Corregir con IA ↗';
        btn.disabled    = false;
      });
    });

    // Mark done
    const markBtn = document.getElementById('mark-done-btn');
    if (markBtn) {
      markBtn.addEventListener('click', () => {
        App.markDayDone(dayId);
        markBtn.textContent = '✓ ¡Completado!';
        markBtn.disabled    = true;
      });
    }
  }

  // ── Error HTML ───────────────────────────────────────────────────
  function errorHtml(err) {
    const isNoKey = err.message === 'NO_KEY';
    return `<div class="feedback fb-wrong show">
      ${isNoKey
        ? '⚠️ No hay clave API configurada. Haz clic en "API Key" en la cabecera para añadirla.'
        : '⚠️ Error al conectar con la IA: ' + UI.esc(err.message)}
    </div>`;
  }

  return {
    loadExplanation,
    loadExercises,
    resetExerciseData,
    getScore
  };
})();
