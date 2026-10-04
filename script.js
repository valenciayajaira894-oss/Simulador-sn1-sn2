/* ==========================================================================
   SN1 VS SN2: REACTION RACE - CÓDIGO JS COMPLETO
   ========================================================================== */

/* 1. CONFIGURACIÓN DE LA CARRERA */
const GAME_CONFIG = {
  maxPositions: 10,
  carAnimationDurationMs: 800,
  soundEnabled: true,
  standardAdvance: 1,
  challengeAdvance: 2
};

/* 2. BANCO DE PREGUNTAS (11 EN TOTAL: 9 NORMALES + 2 DESAFÍO) */
const QUESTION_BANK = [
  {
    id: 1,
    isChallenge: false,
    text: "1. ¿Qué tipo de sustrato favorece más una reacción SN1?",
    options: ["A) Primario", "B) Secundario", "C) Terciario", "D) Metilo"],
    correctIndex: 2,
    mechanism: "SN1",
    advance: 1,
    explanation: "Los sustratos terciarios favorecen SN1 porque pueden formar carbocationes terciarios relativamente estables."
  },
  {
    id: 2,
    isChallenge: false,
    text: "2. ¿Qué tipo de sustrato favorece más una reacción SN2?",
    options: ["A) Terciario", "B) Secundario", "C) Primario", "D) Ninguno"],
    correctIndex: 2,
    mechanism: "SN2",
    advance: 1,
    explanation: "Los sustratos primarios presentan menor impedimento estérico y permiten el ataque directo del nucleófilo."
  },
  {
    id: 3,
    isChallenge: false,
    text: "3. ¿Qué tipo de nucleófilo favorece SN2?",
    options: ["A) Nucleófilo fuerte", "B) Nucleófilo muy débil", "C) Carbocatión", "D) Grupo saliente"],
    correctIndex: 0,
    mechanism: "SN2",
    advance: 1,
    explanation: "En SN2 el nucleófilo participa directamente en el paso determinante de la velocidad, por lo que un nucleófilo fuerte favorece el mecanismo."
  },
  {
    id: 4,
    isChallenge: false,
    text: "4. ¿Qué disolvente favorece generalmente SN1?",
    options: ["A) Polar aprótico", "B) Polar prótico", "C) No polar", "D) Gas"],
    correctIndex: 1,
    mechanism: "SN1",
    advance: 1,
    explanation: "Los disolventes polares próticos ayudan a estabilizar especies cargadas y favorecen la formación del carbocatión."
  },
  {
    id: 5,
    isChallenge: false,
    text: "5. ¿Qué disolvente favorece generalmente SN2?",
    options: ["A) Polar prótico", "B) Polar aprótico", "C) Agua", "D) Etanol"],
    correctIndex: 1,
    mechanism: "SN2",
    advance: 1,
    explanation: "Los disolventes polares apróticos suelen favorecer la reactividad del nucleófilo y, por tanto, SN2."
  },
  {
    id: 6,
    isChallenge: false,
    text: "6. ¿Cuántas etapas principales tiene una reacción SN1?",
    options: ["A) Una", "B) Dos", "C) Tres", "D) Cuatro"],
    correctIndex: 1,
    mechanism: "SN1",
    advance: 1,
    explanation: "SN1 ocurre principalmente en dos etapas: formación del carbocatión y posterior ataque del nucleófilo."
  },
  {
    id: 7,
    isChallenge: false,
    text: "7. ¿Cuántas etapas tiene una reacción SN2?",
    options: ["A) Una", "B) Dos", "C) Tres", "D) Cuatro"],
    correctIndex: 0,
    mechanism: "SN2",
    advance: 1,
    explanation: "SN2 es un proceso concertado de una sola etapa; el nucleófilo ataca mientras el grupo saliente abandona."
  },
  {
    id: 8,
    isChallenge: false,
    text: "8. ¿Qué ocurre con la configuración espacial en SN2?",
    options: [
      "A) No cambia.",
      "B) Se produce inversión de configuración.",
      "C) Se forma un carbocatión.",
      "D) Se forman dos carbocationes."
    ],
    correctIndex: 1,
    mechanism: "SN2",
    advance: 1,
    explanation: "El nucleófilo ataca por el lado opuesto al grupo saliente, provocando inversión de configuración o inversión de Walden."
  },
  {
    id: 9,
    isChallenge: false,
    text: "9. ¿Por qué SN1 puede producir productos con diferentes configuraciones?",
    options: [
      "A) Porque el nucleófilo siempre ataca por atrás.",
      "B) Porque se forma un carbocatión aproximadamente plano.",
      "C) Porque no existe grupo saliente.",
      "D) Porque SN1 ocurre en una sola etapa."
    ],
    correctIndex: 1,
    mechanism: "SN1",
    advance: 1,
    explanation: "El carbocatión es aproximadamente plano, por lo que el nucleófilo puede atacar por cualquiera de sus caras."
  },
  {
    id: 10,
    isChallenge: true,
    text: "10. DESAFÍO: Sustrato terciario + Nucleófilo fuerte + Disolvente polar prótico. ¿Qué mecanismo es el preferido?",
    options: ["A) SN1", "B) SN2"],
    correctIndex: 0,
    mechanism: "SN1",
    advance: 2,
    explanation: "Aunque un nucleófilo fuerte favorece SN2, el sustrato terciario y el disolvente polar prótico favorecen fuertemente SN1. En conjunto, SN1 es el mecanismo preferente."
  },
  {
    id: 11,
    isChallenge: true,
    text: "11. DESAFÍO: Sustrato primario + Nucleófilo fuerte + Disolvente polar aprótico. ¿Qué mecanismo es el preferido?",
    options: ["A) SN1", "B) SN2"],
    correctIndex: 1,
    mechanism: "SN2",
    advance: 2,
    explanation: "El sustrato primario presenta poco impedimento estérico, el nucleófilo es fuerte y el disolvente es polar aprótico, por lo que SN2 es favorecida."
  }
];

/* 3. SINTETIZADOR DE SONIDO (WEB AUDIO API) */
class SoundEngine {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }

  playSelect() {
    if (!GAME_CONFIG.soundEnabled || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  playCorrect() {
    if (!GAME_CONFIG.soundEnabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
    osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.35);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(now + 0.35);
  }

  playIncorrect() {
    if (!GAME_CONFIG.soundEnabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.setValueAtTime(180, now + 0.15);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(now + 0.3);
  }

  playEngineRev() {
    if (!GAME_CONFIG.soundEnabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, now);
    osc.frequency.exponentialRampToValueAtTime(350, now + 0.4);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.8);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.8);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(now + 0.8);
  }

  playVictory() {
    if (!GAME_CONFIG.soundEnabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.15, now + i * 0.12);
      gain.gain.linearRampToValueAtTime(0.01, now + i * 0.12 + 0.4);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 0.4);
    });
  }
}

const sounds = new SoundEngine();

/* 4. ESTADO DE LA SIMULACIÓN */
const gameState = {
  currentQuestionIndex: 0,
  sn1Pos: 0,
  sn2Pos: 0,
  correctAnswersCount: 0,
  selectedOptionIndex: null,
  isAnswerSubmitted: false,
  raceFinished: false
};

/* 5. ELEMENTOS DEL DOM */
const DOM = {
  welcomeScreen: document.getElementById('welcome-screen'),
  mainSimulation: document.getElementById('main-simulation'),
  btnStartSim: document.getElementById('btn-start-sim'),
  btnAudioToggle: document.getElementById('btn-audio-toggle'),
  audioStatusText: document.getElementById('audio-status-text'),
  btnRestartApp: document.getElementById('btn-restart-app'),
  
  // Pista
  carSn1: document.getElementById('car-sn1'),
  carSn2: document.getElementById('car-sn2'),
  popSn1: document.getElementById('pop-sn1'),
  popSn2: document.getElementById('pop-sn2'),
  sn1PosText: document.getElementById('sn1-pos-text'),
  sn2PosText: document.getElementById('sn2-pos-text'),

  // Preguntas
  questionNumberTag: document.getElementById('question-number-tag'),
  questionTypeTag: document.getElementById('question-type-tag'),
  questionText: document.getElementById('question-text'),
  optionsContainer: document.getElementById('options-container'),
  btnSubmitAnswer: document.getElementById('btn-submit-answer'),
  feedbackPanel: document.getElementById('feedback-panel'),
  feedbackStatus: document.getElementById('feedback-status'),
  feedbackExplanation: document.getElementById('feedback-explanation'),
  feedbackAdvInfo: document.getElementById('feedback-adv-info'),
  btnNextQuestion: document.getElementById('btn-next-question'),

  // Motor de reacción
  selectSubstrate: document.getElementById('select-substrate'),
  selectNucleophile: document.getElementById('select-nucleophile'),
  selectSolvent: document.getElementById('select-solvent'),
  selectLeaving: document.getElementById('select-leaving'),
  btnAnalyzeReaction: document.getElementById('btn-analyze-reaction'),

  // Predicción
  scoreSn1Val: document.getElementById('score-sn1-val'),
  scoreSn2Val: document.getElementById('score-sn2-val'),
  predWinnerText: document.getElementById('pred-winner-text'),
  predExplanationText: document.getElementById('pred-explanation-text'),
  mechAnimContainer: document.getElementById('mechanism-animation-container'),

  // Modal
  resultsModal: document.getElementById('results-modal'),
  finalWinnerTitle: document.getElementById('final-winner-title'),
  finalWinnerSubtitle: document.getElementById('final-winner-subtitle'),
  statCorrect: document.getElementById('stat-correct'),
  statSn1Pos: document.getElementById('stat-sn1-pos'),
  statSn2Pos: document.getElementById('stat-sn2-pos'),
  finalChemSummary: document.getElementById('final-chem-summary'),
  btnRestartGame: document.getElementById('btn-restart-game')
};

/* 6. INICIALIZACIÓN Y EVENT LISTENERS */
document.addEventListener('DOMContentLoaded', () => {
  initEventListeners();
  analyzeReactionEngine(); // Inicializar motor con valores por defecto
});

function initEventListeners() {
  DOM.btnStartSim.addEventListener('click', () => {
    sounds.init();
    sounds.playSelect();
    DOM.welcomeScreen.classList.add('hidden');
    DOM.mainSimulation.classList.remove('hidden');
    loadQuestion(0);
  });

  DOM.btnAudioToggle.addEventListener('click', () => {
    GAME_CONFIG.soundEnabled = !GAME_CONFIG.soundEnabled;
    DOM.audioStatusText.textContent = GAME_CONFIG.soundEnabled ? 'Sonido ON' : 'Sonido OFF';
    DOM.btnAudioToggle.textContent = GAME_CONFIG.soundEnabled ? '🔊 Sonido ON' : '🔇 Sonido OFF';
  });

  DOM.btnRestartApp.addEventListener('click', resetFullGame);
  DOM.btnRestartGame.addEventListener('click', resetFullGame);

  DOM.btnSubmitAnswer.addEventListener('click', handleSubmitAnswer);
  DOM.btnNextQuestion.addEventListener('click', handleNextQuestion);

  DOM.btnAnalyzeReaction.addEventListener('click', () => {
    sounds.init();
    sounds.playSelect();
    analyzeReactionEngine();
  });
}

/* 7. FUNCIONES DE PREGUNTAS Y RESPUESTAS */
function loadQuestion(index) {
  gameState.currentQuestionIndex = index;
  gameState.selectedOptionIndex = null;
  gameState.isAnswerSubmitted = false;

  const q = QUESTION_BANK[index];

  DOM.questionNumberTag.textContent = `Pregunta ${index + 1} de ${QUESTION_BANK.length}`;
  
  if (q.isChallenge) {
    DOM.questionTypeTag.textContent = `⚡ PREGUNTA DESAFÍO (+2 Avance)`;
    DOM.questionTypeTag.className = 'q-type-challenge';
  } else {
    DOM.questionTypeTag.textContent = `Mecanismo: ${q.mechanism}`;
    DOM.questionTypeTag.className = 'q-type-normal';
  }

  DOM.questionText.textContent = q.text;
  DOM.optionsContainer.innerHTML = '';
  DOM.feedbackPanel.classList.add('hidden');
  DOM.btnSubmitAnswer.disabled = true;

  q.options.forEach((optText, optIdx) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = optText;
    btn.addEventListener('click', () => selectOption(optIdx));
    DOM.optionsContainer.appendChild(btn);
  });
}

function selectOption(optIdx) {
  if (gameState.isAnswerSubmitted) return;

  sounds.init();
  sounds.playSelect();

  gameState.selectedOptionIndex = optIdx;
  DOM.btnSubmitAnswer.disabled = false;

  const buttons = DOM.optionsContainer.querySelectorAll('.option-btn');
  buttons.forEach((btn, idx) => {
    if (idx === optIdx) {
      btn.classList.add('selected');
    } else {
      btn.classList.remove('selected');
    }
  });
}

function handleSubmitAnswer() {
  if (gameState.selectedOptionIndex === null || gameState.isAnswerSubmitted) return;

  gameState.isAnswerSubmitted = true;
  DOM.btnSubmitAnswer.disabled = true;

  const q = QUESTION_BANK[gameState.currentQuestionIndex];
  const isCorrect = (gameState.selectedOptionIndex === q.correctIndex);
  const buttons = DOM.optionsContainer.querySelectorAll('.option-btn');

  // Resaltar respuesta
  buttons.forEach((btn, idx) => {
    if (idx === q.correctIndex) {
      btn.classList.add('correct');
    } else if (idx === gameState.selectedOptionIndex && !isCorrect) {
      btn.classList.add('incorrect');
    }
    btn.style.pointerEvents = 'none';
  });

  // Feedback visual y sonido
  DOM.feedbackPanel.classList.remove('hidden');
  DOM.feedbackExplanation.textContent = q.explanation;

  if (isCorrect) {
    sounds.playCorrect();
    gameState.correctAnswersCount++;
    DOM.feedbackStatus.textContent = '¡CORRECTO! ✨';
    DOM.feedbackStatus.style.color = '#2D5A38';

    // Desplazar carro
    advanceCar(q.mechanism, q.advance);
    DOM.feedbackAdvInfo.textContent = `🏆 ¡Carro ${q.mechanism} avanza +${q.advance} posición(es)!`;
  } else {
    sounds.playIncorrect();
    DOM.feedbackStatus.textContent = 'INCORRECTO ❌';
    DOM.feedbackStatus.style.color = '#7A2838';
    DOM.feedbackAdvInfo.textContent = 'Ningún carro avanza esta ronda.';
  }
}

/* 8. MOVIMIENTO FÍSICO DE LOS CARROS */
function advanceCar(mechanism, steps) {
  let popElem, carElem;

  if (mechanism === 'SN1') {
    gameState.sn1Pos = Math.min(GAME_CONFIG.maxPositions, gameState.sn1Pos + steps);
    popElem = DOM.popSn1;
    carElem = DOM.carSn1;
    DOM.sn1PosText.textContent = `${gameState.sn1Pos}/${GAME_CONFIG.maxPositions}`;
  } else {
    gameState.sn2Pos = Math.min(GAME_CONFIG.maxPositions, gameState.sn2Pos + steps);
    popElem = DOM.popSn2;
    carElem = DOM.carSn2;
    DOM.sn2PosText.textContent = `${gameState.sn2Pos}/${GAME_CONFIG.maxPositions}`;
  }

  // Reproducir sonido de aceleración de motor
  sounds.playEngineRev();

  // Calcular porcentaje de desplazamiento (0 a 82% para no rebasar la meta)
  const targetPercent = (gameState.sn1Pos / GAME_CONFIG.maxPositions) * 82;
  const targetPercent2 = (gameState.sn2Pos / GAME_CONFIG.maxPositions) * 82;

  if (mechanism === 'SN1') {
    DOM.carSn1.style.left = `${targetPercent}%`;
  } else {
    DOM.carSn2.style.left = `${targetPercent2}%`;
  }

  // Animación del indicador flotante (+1 o +2)
  popElem.textContent = `+${steps}`;
  popElem.classList.add('show');
  setTimeout(() => {
    popElem.classList.remove('show');
  }, 1000);

  // Verificar si llegó a la meta
  if (gameState.sn1Pos >= GAME_CONFIG.maxPositions || gameState.sn2Pos >= GAME_CONFIG.maxPositions) {
    gameState.raceFinished = true;
  }
}

function handleNextQuestion() {
  if (gameState.raceFinished || gameState.currentQuestionIndex >= QUESTION_BANK.length - 1) {
    showFinalResults();
  } else {
    loadQuestion(gameState.currentQuestionIndex + 1);
  }
}

/* 9. MOTOR DE LA REACCIÓN Y PREDICCIÓN DINÁMICA */
function analyzeReactionEngine() {
  const sub = DOM.selectSubstrate.value;
  const nuc = DOM.selectNucleophile.value;
  const sol = DOM.selectSolvent.value;
  const lea = DOM.selectLeaving.value;

  let scoreSn1 = 0;
  let scoreSn2 = 0;

  // Cálculo de puntos
  if (sub === 'tertiary') scoreSn1 += 3;
  if (sub === 'secondary') { scoreSn1 += 1; scoreSn2 += 1; }
  if (sub === 'primary') scoreSn2 += 3;

  if (nuc === 'weak') scoreSn1 += 1;
  if (nuc === 'strong') scoreSn2 += 2;

  if (sol === 'polar_protic') scoreSn1 += 2;
  if (sol === 'polar_aprotic') scoreSn2 += 2;

  if (lea === 'good') { scoreSn1 += 1; scoreSn2 += 1; }

  DOM.scoreSn1Val.textContent = `${scoreSn1} pts`;
  DOM.scoreSn2Val.textContent = `${scoreSn2} pts`;

  let winner = '';
  let explanation = '';

  if (scoreSn1 > scoreSn2) {
    winner = 'Mecanismo Preferente: SN1 🎀';
    explanation = 'El sustrato con alto impedimento estérico (o estabilizador de carga) junto con un disolvente polar prótico favorecen fuertemente la formación del carbocatión (SN1).';
    renderMechanismAnimation('SN1');
  } else if (scoreSn2 > scoreSn1) {
    winner = 'Mecanismo Preferente: SN2 🌸';
    explanation = 'Un sustrato accesible con poco impedimento estérico, sumado a un nucleófilo fuerte y disolvente polar aprótico, favorecen el ataque directo en una sola etapa concertada (SN2).';
    renderMechanismAnimation('SN2');
  } else {
    winner = 'Condiciones Competitivas (SN1 / SN2)';
    explanation = 'Los factores están balanceados (ej. sustrato secundario). Ambos mecanismos pueden competir dependiendo exactamente de la temperatura y concentración.';
    renderMechanismAnimation('COMPETITIVE');
  }

  DOM.predWinnerText.textContent = winner;
  DOM.predExplanationText.textContent = explanation;
}

/* 10. ANIMACIONES MOLECULARES SVG DINÁMICAS */
function renderMechanismAnimation(type) {
  let svgContent = '';

  if (type === 'SN1') {
    svgContent = `
      <svg viewBox="0 0 400 120" style="width:100%; height:100%;">
        <text x="20" y="30" font-size="12" fill="#E27D9A" font-weight="bold">Paso 1: Salida de X⁻ → Carbocatión Plano</text>
        <circle cx="80" cy="70" r="18" fill="#F4B6C2" />
        <text x="75" y="75" font-weight="bold" fill="#3F3A45">C⁺</text>
        <path d="M 100 70 L 130 70" stroke="#3F3A45" stroke-dasharray="3,3" />
        <circle cx="145" cy="70" r="12" fill="#C9B6E4" />
        <text x="140" y="74" font-size="10" fill="#FFF">X⁻</text>
        
        <text x="220" y="30" font-size="12" fill="#2D5A38" font-weight="bold">Paso 2: Ataque Nu⁻ (Ambas Caras)</text>
        <circle cx="300" cy="70" r="18" fill="#F4B6C2" />
        <text x="295" y="75" font-weight="bold" fill="#3F3A45">C</text>
        <path d="M 250 70 L 280 70" stroke="#AFCBFF" stroke-width="2" marker-end="url(#arrow)" />
        <circle cx="235" cy="70" r="12" fill="#AFCBFF" />
        <text x="228" y="74" font-size="10" fill="#3F3A45">Nu⁻</text>
      </svg>
    `;
  } else {
    svgContent = `
      <svg viewBox="0 0 400 120" style="width:100%; height:100%;">
        <text x="20" y="30" font-size="12" fill="#2B5B84" font-weight="bold">Ataque Dorsal Concertado (Inversión de Walden)</text>
        <!-- Nucleofilo atacando -->
        <circle cx="60" cy="70" r="14" fill="#AFCBFF" />
        <text x="52" y="74" font-size="10" font-weight="bold" fill="#3F3A45">Nu⁻</text>
        <path d="M 80 70 L 120 70" stroke="#3F3A45" stroke-width="2" />
        <!-- Carbon central -->
        <circle cx="140" cy="70" r="18" fill="#B8D8C0" />
        <text x="135" y="75" font-weight="bold" fill="#3F3A45">C</text>
        <!-- Grupo saliente saliendo -->
        <path d="M 160 70 L 200 70" stroke="#3F3A45" stroke-dasharray="3,3" />
        <circle cx="215" cy="70" r="14" fill="#F4B6C2" />
        <text x="210" y="74" font-size="10" fill="#3F3A45">X⁻</text>

        <text x="260" y="75" font-size="18" fill="#E27D9A">➔ ☂️ ➔</text>
        <text x="320" y="75" font-size="11" font-weight="bold" fill="#3F3A45">Inversión 100%</text>
      </svg>
    `;
  }

  DOM.mechAnimContainer.innerHTML = svgContent;
}

/* 11. RESULTADO FINAL Y REINICIO */
function showFinalResults() {
  sounds.playVictory();
  DOM.resultsModal.classList.remove('hidden');

  let winnerName = '';
  if (gameState.sn1Pos > gameState.sn2Pos) {
    winnerName = '¡GANADOR: SN1 🎀!';
    DOM.finalWinnerSubtitle.textContent = 'El mecanismo unimolecular tomó la delantera.';
  } else if (gameState.sn2Pos > gameState.sn1Pos) {
    winnerName = '¡GANADOR: SN2 🌸!';
    DOM.finalWinnerSubtitle.textContent = 'El mecanismo concertado bimolecular triunfó.';
  } else {
    winnerName = '¡EMPATE TÉCNICO!';
    DOM.finalWinnerSubtitle.textContent = 'Ambos vehículos alcanzaron el mismo avance.';
  }

  DOM.finalWinnerTitle.textContent = winnerName;
  DOM.statCorrect.textContent = `${gameState.correctAnswersCount}/${QUESTION_BANK.length}`;
  DOM.statSn1Pos.textContent = `${gameState.sn1Pos}/10`;
  DOM.statSn2Pos.textContent = `${gameState.sn2Pos}/10`;

  DOM.finalChemSummary.textContent = `Demostraste un excelente dominio cinético. Recuerda que la competencia entre SN1 y SN2 depende directamente de la estructura del sustrato, la fuerza del nucleófilo y la polaridad del disolvente.`;
}

function resetFullGame() {
  gameState.currentQuestionIndex = 0;
  gameState.sn1Pos = 0;
  gameState.sn2Pos = 0;
  gameState.correctAnswersCount = 0;
  gameState.selectedOptionIndex = null;
  gameState.isAnswerSubmitted = false;
  gameState.raceFinished = false;

  DOM.carSn1.style.left = '0%';
  DOM.carSn2.style.left = '0%';
  DOM.sn1PosText.textContent = '0/10';
  DOM.sn2PosText.textContent = '0/10';

  DOM.resultsModal.classList.add('hidden');
  loadQuestion(0);
}