/* ============================================
   竹竹的游乐场 - 共享脚本
   ============================================ */

const ZZ = (() => {
  let audioCtx = null;

  function getAudioCtx() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // ---- 音效 ----
  function playTone(freq, duration, type = 'sine', vol = 0.25) {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  }

  function playBubble() {
    playTone(800 + Math.random() * 400, 0.15, 'sine', 0.12);
    setTimeout(() => playTone(1200 + Math.random() * 300, 0.1, 'sine', 0.08), 50);
  }

  function playPop() {
    playTone(300, 0.08, 'square', 0.15);
    setTimeout(() => playTone(150, 0.06, 'square', 0.1), 20);
  }

  function playFirework() {
    playTone(600, 0.3, 'sawtooth', 0.08);
    setTimeout(() => {
      for (let i = 0; i < 5; i++) {
        setTimeout(() => playTone(800 + Math.random() * 800, 0.15, 'sine', 0.06), i * 30);
      }
    }, 100);
  }

  function playPianoNote(noteIdx) {
    const baseFreq = 261.63; // C4
    const freq = baseFreq * Math.pow(2, noteIdx / 12);
    playTone(freq, 0.6, 'triangle', 0.3);
  }

  function playAnimalSound(idx) {
    const sounds = [
      () => { playTone(400, 0.15, 'sawtooth', 0.1); setTimeout(() => playTone(350, 0.2, 'sawtooth', 0.12), 150); },
      () => { playTone(700, 0.3, 'sine', 0.1); setTimeout(() => playTone(600, 0.25, 'sine', 0.08), 200); },
      () => { playTone(150, 0.5, 'sawtooth', 0.15); },
      () => { playTone(250, 0.15, 'square', 0.1); setTimeout(() => playTone(300, 0.2, 'square', 0.12), 150); },
      () => { for (let i = 0; i < 3; i++) setTimeout(() => playTone(500 + i * 100, 0.08, 'square', 0.08), i * 80); },
      () => { playTone(800, 0.1, 'sine', 0.1); setTimeout(() => playTone(1000, 0.08, 'sine', 0.08), 100); setTimeout(() => playTone(1200, 0.06, 'sine', 0.06), 200); },
      () => { playTone(200, 0.3, 'triangle', 0.1); setTimeout(() => playTone(250, 0.25, 'triangle', 0.08), 250); },
      () => { playTone(180, 0.4, 'sawtooth', 0.12); setTimeout(() => playTone(220, 0.35, 'sawtooth', 0.1), 300); },
    ];
    if (sounds[idx]) sounds[idx]();
  }

  function playCheer() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((f, i) => setTimeout(() => playTone(f, 0.2, 'triangle', 0.15), i * 100));
  }

  // ---- 语音 ----
  function speak(text) {
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'zh-CN';
      u.rate = 0.7;
      u.pitch = 1.3;
      speechSynthesis.speak(u);
    }
  }

  // ---- 鼓励语 ----
  const cheers = [
    '竹竹好棒！', '竹竹真厉害！', '竹竹加油！',
    '竹竹太厉害了！', '竹竹最棒！', '竹竹真聪明！',
    '哇！竹竹！', '竹竹再来！',
  ];

  function showEncouragement() {
    const el = document.createElement('div');
    el.className = 'encouragement';
    el.textContent = cheers[Math.floor(Math.random() * cheers.length)];
    el.style.left = (20 + Math.random() * 60) + 'vw';
    el.style.top = (30 + Math.random() * 30) + 'vh';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1500);
  }

  let cheerCounter = 0;
  function maybeCheer(every = 8) {
    cheerCounter++;
    if (cheerCounter % every === 0) {
      showEncouragement();
      playCheer();
    }
  }

  // ---- 通用工具 ----
  function randColor() {
    const colors = ['#FF6B9D','#42A5F5','#FF9800','#66BB6A','#AB47BC','#FF7043','#26C6DA','#FDD835'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function resizeCanvas(canvas) {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    return { w: window.innerWidth, h: window.innerHeight };
  }

  // ---- 震动反馈 ----
  function vibrate(ms = 30) {
    if (navigator.vibrate) navigator.vibrate(ms);
  }

  return {
    getAudioCtx, playTone, playBubble, playPop, playFirework,
    playPianoNote, playAnimalSound, playCheer, speak,
    showEncouragement, maybeCheer, randColor, rand,
    resizeCanvas, vibrate, cheers,
    resetCheerCounter: () => { cheerCounter = 0; }
  };
})();
