/* ============================================
   竹竹的游乐场 - 英语小游戏共享脚本
   ============================================ */

const EnglishGames = (() => {
  const SPEAK_OPTS = { lang: 'en-US', rate: 0.72, pitch: 1.18, volume: 1 };

  const packs = {
    words: [
      { emoji: '🐶', word: 'dog', hint: 'woof woof', color: '#FFF8E1' },
      { emoji: '🐱', word: 'cat', hint: 'meow meow', color: '#E3F2FD' },
      { emoji: '⚽', word: 'ball', hint: 'roll roll', color: '#F3E5F5' },
      { emoji: '🍎', word: 'apple', hint: 'yummy fruit', color: '#FBE9E7' },
      { emoji: '🚗', word: 'car', hint: 'go go', color: '#E8F5E9' },
      { emoji: '🥛', word: 'milk', hint: 'drink drink', color: '#E1F5FE' },
    ],
    animals: [
      { emoji: '🐶', word: 'dog', hint: 'woof', soundIndex: 0, color: '#FFF3E0' },
      { emoji: '🐱', word: 'cat', hint: 'meow', soundIndex: 1, color: '#E3F2FD' },
      { emoji: '🐮', word: 'cow', hint: 'moo', soundIndex: 2, color: '#EFEBE9' },
      { emoji: '🐸', word: 'frog', hint: 'ribbit', soundIndex: 4, color: '#E8F5E9' },
    ],
    colors: [
      { word: 'red', emoji: '🎈', color: '#EF5350', soft: '#FFCDD2' },
      { word: 'blue', emoji: '🎈', color: '#42A5F5', soft: '#BBDEFB' },
      { word: 'yellow', emoji: '🎈', color: '#FBC02D', soft: '#FFF9C4' },
      { word: 'green', emoji: '🎈', color: '#66BB6A', soft: '#C8E6C9' },
    ],
    actions: [
      { emoji: '👏', word: 'clap', hint: 'tap after you clap', color: '#FFF3E0' },
      { emoji: '👋', word: 'wave', hint: 'wave hello', color: '#E8F5E9' },
      { emoji: '🦘', word: 'jump', hint: 'little jump', color: '#E3F2FD' },
      { emoji: '👃', word: 'touch nose', hint: 'find your nose', color: '#FCE4EC' },
    ],
    peekaboo: [
      { emoji: '🍎', word: 'apple', color: '#FBE9E7' },
      { emoji: '⚽', word: 'ball', color: '#E3F2FD' },
      { emoji: '🦆', word: 'duck', color: '#FFF8E1' },
      { emoji: '🧸', word: 'teddy', color: '#EFEBE9' },
      { emoji: '🚗', word: 'car', color: '#E8F5E9' },
      { emoji: '🐟', word: 'fish', color: '#E1F5FE' },
    ],
    feedRounds: [
      { animal: 'monkey', animalEmoji: '🐵', food: 'banana', foodEmoji: '🍌', color: '#FFF3E0' },
      { animal: 'rabbit', animalEmoji: '🐰', food: 'carrot', foodEmoji: '🥕', color: '#FCE4EC' },
      { animal: 'bear', animalEmoji: '🐻', food: 'apple', foodEmoji: '🍎', color: '#EFEBE9' },
      { animal: 'cat', animalEmoji: '🐱', food: 'milk', foodEmoji: '🥛', color: '#E3F2FD' },
    ],
    foods: [
      { word: 'banana', emoji: '🍌', color: '#FFF9C4' },
      { word: 'carrot', emoji: '🥕', color: '#FFE0B2' },
      { word: 'apple', emoji: '🍎', color: '#FFCDD2' },
      { word: 'milk', emoji: '🥛', color: '#E1F5FE' },
    ],
    routineRounds: [
      {
        scene: '🌞',
        title: 'Good morning',
        prompt: 'Open curtain',
        choices: [
          { word: 'curtain', emoji: '🪟', correct: true },
          { word: 'banana', emoji: '🍌', correct: false },
          { word: 'teddy', emoji: '🧸', correct: false },
        ],
        color: '#FFF8E1',
      },
      {
        scene: '🧼',
        title: 'Wash time',
        prompt: 'Wash hands',
        choices: [
          { word: 'soap', emoji: '🧼', correct: true },
          { word: 'book', emoji: '📘', correct: false },
          { word: 'ball', emoji: '⚽', correct: false },
        ],
        color: '#E1F5FE',
      },
      {
        scene: '🪥',
        title: 'Brush time',
        prompt: 'Brush teeth',
        choices: [
          { word: 'toothbrush', emoji: '🪥', correct: true },
          { word: 'apple', emoji: '🍎', correct: false },
          { word: 'car', emoji: '🚗', correct: false },
        ],
        color: '#F3E5F5',
      },
      {
        scene: '👟',
        title: 'Ready to go',
        prompt: 'Put on shoes',
        choices: [
          { word: 'shoes', emoji: '👟', correct: true },
          { word: 'milk', emoji: '🥛', correct: false },
          { word: 'fish', emoji: '🐟', correct: false },
        ],
        color: '#E8F5E9',
      },
    ],
    songs: [
      {
        name: 'Hello Song',
        emoji: '👋',
        intro: 'Say hello and wave.',
        lines: [
          { lyric: 'Hello hello', action: 'wave', choices: ['wave', 'jump', 'clap'] },
          { lyric: 'Clap with me', action: 'clap', choices: ['jump', 'clap', 'touch nose'] },
          { lyric: 'Bye bye now', action: 'wave', choices: ['wave', 'clap', 'stomp'] },
        ],
      },
      {
        name: 'If You Are Happy',
        emoji: '😊',
        intro: 'Choose the happy move.',
        lines: [
          { lyric: 'If you are happy, clap your hands', action: 'clap', choices: ['clap', 'wave', 'sleep'] },
          { lyric: 'If you are happy, stamp your feet', action: 'stamp', choices: ['touch nose', 'stamp', 'wave'] },
          { lyric: 'If you are happy, say hello', action: 'wave', choices: ['jump', 'wave', 'sit'] },
        ],
      },
    ],
  };

  function speakEnglish(text) {
    ZZ.speak(text, SPEAK_OPTS);
  }

  function shuffle(array) {
    return array
      .map(item => ({ item, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ item }) => item);
  }

  function setPrompt(kickerEl, textEl, hintEl, kicker, text, hint) {
    if (kickerEl) kickerEl.textContent = kicker || '';
    if (textEl) textEl.textContent = text || '';
    if (hintEl) hintEl.textContent = hint || '';
  }

  function rewardCard(el, points = 1) {
    const rect = el.getBoundingClientRect();
    ZZ.flyStar(rect.left + rect.width / 2, rect.top + 18, points);
    ZZ.vibrate(22);
    ZZ.maybeCheer(5);
  }

  function pulse(el, className, delay = 420) {
    el.classList.add(className);
    setTimeout(() => el.classList.remove(className), delay);
  }

  return {
    packs,
    speakEnglish,
    shuffle,
    setPrompt,
    rewardCard,
    pulse,
  };
})();
