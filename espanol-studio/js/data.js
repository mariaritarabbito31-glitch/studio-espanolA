// js/data.js — Calendar data for all study days

const STUDY_DAYS = [
  // ── SETTIMANA B1 (18–24 maggio) ──────────────────────────────────
  {
    id: 'lun18', date: 'Lunes 18 mayo', level: 'B1',
    dotClass: 'dot-b1', badgeClass: 'badge-b1',
    tema: 'Pretérito pluscuamperfecto + futuro simple',
    schedule: '11:00–13:00 estudio · 14:30–17:30 ejercicios · 17:30–19:00 usos futuro · 19:00–20:00 gimnasio · 21:30–22:30 test rápido',
    week: 'Semana B1 · 18–24 mayo'
  },
  {
    id: 'mar19', date: 'Martes 19 mayo', level: 'B1',
    dotClass: 'dot-b1', badgeClass: 'badge-b1',
    tema: 'Condicional simple + verbos de cambio',
    schedule: '11:00–13:00 estudio · 14:30–17:30 verbos de cambio · 17:30–19:30 ejercicios · 21:30–22:30 repaso',
    week: 'Semana B1 · 18–24 mayo'
  },
  {
    id: 'mie20', date: 'Miércoles 20 mayo', level: 'B1',
    dotClass: 'dot-b1', badgeClass: 'badge-b1',
    tema: 'Imperativo afirmativo y negativo + enclisis y proclisis pronominal',
    schedule: '11:00–13:00 estudio · 14:30–17:30 pronombres · 17:30–19:00 ejercicios · 19:00–20:00 gimnasio · 21:30–22:30 repaso',
    week: 'Semana B1 · 18–24 mayo'
  },
  {
    id: 'jue21', date: 'Jueves 21 mayo', level: 'B1',
    dotClass: 'dot-b1', badgeClass: 'badge-b1',
    tema: 'Presente de subjuntivo – morfología y usos base',
    schedule: '11:00–13:00 estudio · 14:30–17:30 ejercicios · 17:30–19:30 traducción · 21:30–22:30 test',
    week: 'Semana B1 · 18–24 mayo'
  },
  {
    id: 'vie22', date: 'Viernes 22 mayo', level: 'B1',
    dotClass: 'dot-b1', badgeClass: 'badge-b1',
    tema: 'El uso del neutro (lo)',
    schedule: '11:00–13:00 estudio · 14:30–17:30 ejercicios · 17:30–19:00 repaso · 19:00–20:00 gimnasio',
    week: 'Semana B1 · 18–24 mayo'
  },
  {
    id: 'sab23', date: 'Sábado 23 mayo', level: 'LIBRE',
    dotClass: 'dot-lib', badgeClass: 'badge-lib',
    tema: 'Espacio libre – Recuperación o consolidación',
    schedule: '11:00–13:00 repaso libre · 14:30–17:30 ejercicios a elección · 17:30–20:00 lectura auténtica',
    week: 'Semana B1 · 18–24 mayo'
  },
  {
    id: 'dom24', date: 'Domingo 24 mayo', level: 'B1',
    dotClass: 'dot-rev', badgeClass: 'badge-b1',
    tema: 'REVISIÓN SEMANA B1 + minitest',
    schedule: '11:00–13:00 repaso global · 14:30–16:00 minitest · 16:00–18:00 corrección de errores',
    week: 'Semana B1 · 18–24 mayo'
  },

  // ── SETTIMANA B2-a (25–31 maggio) ────────────────────────────────
  {
    id: 'lun25', date: 'Lunes 25 mayo', level: 'B2',
    dotClass: 'dot-b2', badgeClass: 'badge-b2',
    tema: 'Futuro compuesto: morfología y usos',
    schedule: '11:00–13:00 estudio · 14:30–17:30 ejercicios · 17:30–19:00 marcadores temporales · 19:00–20:00 gimnasio · 21:30–22:30 tarjetas',
    week: 'Semana B2 · 25–31 mayo'
  },
  {
    id: 'mar26', date: 'Martes 26 mayo', level: 'B2',
    dotClass: 'dot-b2', badgeClass: 'badge-b2',
    tema: 'Condicional compuesto: morfología y usos',
    schedule: '11:00–13:00 estudio · 14:30–17:30 hipótesis · 17:30–19:30 ejercicios · 21:30–22:30 test simulado',
    week: 'Semana B2 · 25–31 mayo'
  },
  {
    id: 'mie27', date: 'Miércoles 27 mayo', level: 'B2',
    dotClass: 'dot-b2', badgeClass: 'badge-b2',
    tema: 'Imperfecto de subjuntivo: morfología y usos',
    schedule: '11:00–13:00 estudio · 14:30–17:30 ejercicios · 17:30–19:00 secuencia temporal · 19:00–20:00 gimnasio · 21:30–22:30 drill',
    week: 'Semana B2 · 25–31 mayo'
  },
  {
    id: 'jue28', date: 'Jueves 28 mayo', level: 'B2',
    dotClass: 'dot-b2', badgeClass: 'badge-b2',
    tema: 'Pretérito perfecto y pluscuamperfecto de subjuntivo',
    schedule: '11:00–13:00 estudio · 14:30–17:30 concordancia · 17:30–19:30 ejercicios tipo examen · 21:30–22:30 repaso total',
    week: 'Semana B2 · 25–31 mayo'
  },
  {
    id: 'vie29', date: 'Viernes 29 mayo', level: 'B2',
    dotClass: 'dot-b2', badgeClass: 'badge-b2',
    tema: 'La impersonalidad',
    schedule: '11:00–13:00 estudio · 14:30–17:30 ejercicios · 17:30–19:00 pasiva con se · 19:00–20:00 gimnasio · 21:30–22:30 test',
    week: 'Semana B2 · 25–31 mayo'
  },
  {
    id: 'sab30', date: 'Sábado 30 mayo', level: 'B2',
    dotClass: 'dot-b2', badgeClass: 'badge-b2',
    tema: 'Oración simple y compuesta: parataxis e hipotaxis',
    schedule: '11:00–13:00 estudio · 14:30–17:30 análisis sintáctico · 17:30–20:00 repaso libre',
    week: 'Semana B2 · 25–31 mayo'
  },
  {
    id: 'dom31', date: 'Domingo 31 mayo', level: 'B2',
    dotClass: 'dot-rev', badgeClass: 'badge-b2',
    tema: 'REVISIÓN SEMANA 3 + simulación parcial escrita',
    schedule: '11:00–13:00 repaso · 14:30–16:30 simulación parcial · 16:30–18:30 corrección y lagunas',
    week: 'Semana B2 · 25–31 mayo'
  },

  // ── SETTIMANA B2-b (1–7 giugno) ──────────────────────────────────
  {
    id: 'lun01', date: 'Lunes 1 junio', level: 'B2',
    dotClass: 'dot-b2', badgeClass: 'badge-b2',
    tema: 'Oraciones coordinadas + oraciones optativo-desiderativas',
    schedule: '11:00–13:00 estudio · 14:30–17:30 desiderativas · 17:30–19:00 ejercicios · 19:00–20:00 gimnasio · 21:30–22:30 tarjetas',
    week: 'Semana B2 · 1–7 junio'
  },
  {
    id: 'mar02', date: 'Martes 2 junio', level: 'B2',
    dotClass: 'dot-b2', badgeClass: 'badge-b2',
    tema: 'Oraciones sustantivas',
    schedule: '11:00–13:00 estudio · 14:30–17:30 ejercicios · 17:30–19:30 lectura auténtica · 21:30–22:30 test',
    week: 'Semana B2 · 1–7 junio'
  },
  {
    id: 'mie03', date: 'Miércoles 3 junio', level: 'B2',
    dotClass: 'dot-b2', badgeClass: 'badge-b2',
    tema: 'Oraciones adjetivas de relativo',
    schedule: '11:00–13:00 estudio · 14:30–17:30 ejercicios · 17:30–19:00 relativas con preposición · 19:00–20:00 gimnasio · 21:30–22:30 test',
    week: 'Semana B2 · 1–7 junio'
  },
  {
    id: 'jue04', date: 'Jueves 4 junio', level: 'B2',
    dotClass: 'dot-b2', badgeClass: 'badge-b2',
    tema: 'Oraciones adverbiales causales y modales',
    schedule: '11:00–13:00 estudio · 14:30–17:30 ejercicios · 17:30–19:30 repaso · 21:30–22:30 test',
    week: 'Semana B2 · 1–7 junio'
  },
  {
    id: 'vie05', date: 'Viernes 5 junio', level: 'B2',
    dotClass: 'dot-b2', badgeClass: 'badge-b2',
    tema: 'Oraciones adverbiales hipotéticas y concesivas',
    schedule: '11:00–13:00 estudio · 14:30–17:30 ejercicios · 17:30–19:00 test simulado · 19:00–20:00 gimnasio · 21:30–22:30 repaso',
    week: 'Semana B2 · 1–7 junio'
  },
  {
    id: 'sab06', date: 'Sábado 6 junio', level: 'B2',
    dotClass: 'dot-b2', badgeClass: 'badge-b2',
    tema: 'Oraciones comparativas + el discurso referido',
    schedule: '11:00–13:00 estudio · 14:30–17:30 estilo indirecto · 17:30–20:00 repaso libre',
    week: 'Semana B2 · 1–7 junio'
  },
  {
    id: 'dom07', date: 'Domingo 7 junio', level: 'B2',
    dotClass: 'dot-rev', badgeClass: 'badge-b2',
    tema: 'SIMULACIÓN COMPLETA DE LA PRUEBA ESCRITA (3,5 horas)',
    schedule: '11:00–12:30 gramática/sintaxis · 14:30–15:30 traducción · 15:30–17:00 producción escrita · corrección total',
    week: 'Semana B2 · 1–7 junio'
  },

  // ── REPASO FINAL (8–9 giugno) ─────────────────────────────────────
  {
    id: 'lun08', date: 'Lunes 8 junio', level: 'REPASO',
    dotClass: 'dot-rep', badgeClass: 'badge-rep',
    tema: 'Repaso dirigido: verbos de cambio + subjuntivo + discurso referido',
    schedule: '11:00–13:00 verbos de cambio · 14:30–17:00 discurso referido · 17:00–19:00 tarjetas + test · 19:00–20:00 gimnasio · 21:30–22:30 lagunas',
    week: 'Repaso final · 8–9 junio'
  },
  {
    id: 'mar09', date: 'Martes 9 junio', level: 'REPASO',
    dotClass: 'dot-rep', badgeClass: 'badge-rep',
    tema: 'Repaso final ligero + preparación mental',
    schedule: '11:00–12:30 tabla sinóptica · 14:30–16:00 lectura + análisis · 16:00–17:30 puntos débiles · 17:30–18:30 relax',
    week: 'Repaso final · 8–9 junio'
  }
];

// Group days by week for sidebar rendering
const WEEK_GROUPS = [
  { label: 'Semana B1 · 18–24 mayo',   ids: ['lun18','mar19','mie20','jue21','vie22','sab23','dom24'] },
  { label: 'Semana B2 · 25–31 mayo',   ids: ['lun25','mar26','mie27','jue28','vie29','sab30','dom31'] },
  { label: 'Semana B2 · 1–7 junio',    ids: ['lun01','mar02','mie03','jue04','vie05','sab06','dom07'] },
  { label: 'Repaso final · 8–9 junio', ids: ['lun08','mar09'] }
];
