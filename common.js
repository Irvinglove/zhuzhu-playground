/* ============================================
   竹竹的游乐场 - 共享脚本 v2
   ============================================ */

const ZZ = (() => {
  let audioCtx = null;

  function getAudioCtx() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  // ---- 基础音效 ----
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

  // 带频率滑动的高级音效
  function playSlide(startFreq, endFreq, duration, type = 'sine', vol = 0.2) {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(endFreq, ctx.currentTime + duration);
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  }

  // 噪声发生器
  function playNoise(duration, vol = 0.1) {
    const ctx = getAudioCtx();
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 3000;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start(ctx.currentTime);
  }

  // ---- 游戏音效（改进版） ----
  function playBubble() {
    const f1 = 600 + Math.random() * 400;
    playSlide(f1, f1 * 1.8, 0.12, 'sine', 0.1);
    setTimeout(() => playSlide(f1 * 1.5, f1 * 2.2, 0.08, 'sine', 0.06), 40);
  }

  function playPop() {
    playNoise(0.04, 0.12);
    playSlide(400, 80, 0.08, 'sine', 0.15);
  }

  function playFirework() {
    playSlide(800, 200, 0.5, 'sawtooth', 0.06);
    setTimeout(() => {
      for (let i = 0; i < 8; i++) {
        setTimeout(() => {
          const f = 600 + Math.random() * 1200;
          playSlide(f, f * 0.3, 0.3, 'sine', 0.04);
        }, i * 40);
      }
    }, 150);
  }

  function playPianoNote(noteIdx) {
    const baseFreq = 261.63;
    const freq = baseFreq * Math.pow(2, noteIdx / 12);
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    const gain2 = ctx.createGain();
    // 主音
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    // 泛音
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, ctx.currentTime);
    gain2.gain.setValueAtTime(0.08, ctx.currentTime);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 1.2);
    osc2.start(ctx.currentTime);
    osc2.stop(ctx.currentTime + 0.6);
  }

  // ---- 真实动物叫声（合成改进版） ----
  function playAnimalSound(idx) {
    const ctx = getAudioCtx();
    const sounds = [
      // 0: 狗 - 汪汪
      () => {
        for (let i = 0; i < 3; i++) {
          setTimeout(() => {
            playSlide(500, 300, 0.08, 'sawtooth', 0.15);
            playNoise(0.06, 0.08);
            setTimeout(() => playSlide(400, 250, 0.06, 'sawtooth', 0.1), 60);
          }, i * 180);
        }
      },
      // 1: 猫 - 喵～
      () => {
        playSlide(700, 500, 0.3, 'sine', 0.12);
        setTimeout(() => playSlide(500, 650, 0.25, 'sine', 0.08), 200);
        setTimeout(() => playSlide(600, 400, 0.2, 'sine', 0.05), 400);
      },
      // 2: 牛 - 哞～
      () => {
        playSlide(120, 100, 0.6, 'sawtooth', 0.12);
        setTimeout(() => playSlide(110, 90, 0.4, 'sawtooth', 0.08), 400);
      },
      // 3: 猪 - 哼哼
      () => {
        for (let i = 0; i < 2; i++) {
          setTimeout(() => {
            playSlide(280, 200, 0.12, 'square', 0.1);
            playNoise(0.08, 0.06);
          }, i * 200);
        }
      },
      // 4: 青蛙 - 呱呱
      () => {
        for (let i = 0; i < 3; i++) {
          setTimeout(() => {
            playSlide(600, 200, 0.06, 'square', 0.12);
            setTimeout(() => playSlide(300, 150, 0.04, 'sine', 0.08), 40);
          }, i * 120);
        }
      },
      // 5: 鸡 - 叽叽
      () => {
        for (let i = 0; i < 4; i++) {
          setTimeout(() => {
            playSlide(1200, 900, 0.05, 'sine', 0.1);
            setTimeout(() => playSlide(1000, 800, 0.03, 'sine', 0.06), 30);
          }, i * 80);
        }
      },
      // 6: 羊 - 咩～
      () => {
        playSlide(350, 280, 0.3, 'triangle', 0.1);
        setTimeout(() => playSlide(300, 350, 0.2, 'triangle', 0.08), 250);
        setTimeout(() => playSlide(320, 250, 0.25, 'triangle', 0.06), 450);
      },
      // 7: 熊猫 - 竹竹专属
      () => {
        playSlide(300, 500, 0.2, 'sine', 0.1);
        setTimeout(() => playSlide(500, 600, 0.15, 'sine', 0.08), 150);
        setTimeout(() => {
          playSlide(600, 400, 0.3, 'sine', 0.06);
          playNoise(0.05, 0.03);
        }, 300);
      },
    ];
    if (sounds[idx]) sounds[idx]();
  }

  function playCheer() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((f, i) => setTimeout(() => playTone(f, 0.25, 'triangle', 0.15), i * 100));
  }

  // 星星得分音效
  function playStar() {
    playSlide(880, 1760, 0.15, 'sine', 0.1);
    setTimeout(() => playSlide(1320, 1760, 0.1, 'sine', 0.08), 80);
  }

  // ---- 语音 ----
  function speak(text) {
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'zh-CN';
      u.rate = 0.65;
      u.pitch = 1.4;
      u.volume = 1;
      speechSynthesis.speak(u);
    }
  }

  // ---- 积分系统 ----
  const STAR_KEY = 'zhuzhu_stars';

  function getStars() {
    return parseInt(localStorage.getItem(STAR_KEY) || '0', 10);
  }

  function addStars(n) {
    const total = getStars() + n;
    localStorage.setItem(STAR_KEY, String(total));
    // 更新所有星星显示
    document.querySelectorAll('.star-count').forEach(el => {
      el.textContent = total;
    });
    playStar();
    return total;
  }

  function updateStarDisplay() {
    document.querySelectorAll('.star-count').forEach(el => {
      el.textContent = getStars();
    });
  }

  // 星星飞出动画
  function flyStar(x, y, n = 1) {
    addStars(n);
    for (let i = 0; i < n; i++) {
      const el = document.createElement('div');
      el.className = 'star-fly';
      el.textContent = '⭐';
      el.style.left = x + 'px';
      el.style.top = y + 'px';
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 800);
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

  function vibrate(ms = 30) {
    if (navigator.vibrate) navigator.vibrate(ms);
  }

  return {
    getAudioCtx, playTone, playSlide, playNoise,
    playBubble, playPop, playFirework, playPianoNote,
    playAnimalSound, playCheer, playStar, speak,
    showEncouragement, maybeCheer, randColor, rand,
    resizeCanvas, vibrate, cheers,
    resetCheerCounter: () => { cheerCounter = 0; },
    getStars, addStars, updateStarDisplay, flyStar,
  };
})();
