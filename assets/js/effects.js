const hero = document.querySelector('#home');
const effects = document.querySelector('#romance-effects');
const toggle = document.querySelector('#effects-toggle');
const state = document.querySelector('#effects-state');
const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
const bursts = new Set();
let enabled = !motion.matches;
let heroVisible = true;

/** 为装饰粒子生成指定范围内的随机值。 */
function random(min, max) {
  return min + Math.random() * (max - min);
}

/** 固定生成少量花瓣与微光，运动交由 CSS 处理。 */
function createParticles() {
  for (let index = 0; index < 22; index += 1) {
    const particle = document.createElement('span');
    const petal = index < 14;
    particle.className = petal ? 'petal' : 'love-spark';
    particle.textContent = petal ? '' : '♡';
    const duration = random(petal ? 18 : 8, petal ? 30 : 14);
    const properties = {
      '--x': `${random(0, 100)}%`, '--y': `${random(12, 90)}%`,
      '--delay': `${-random(0, duration)}s`, '--duration': `${duration}s`,
      '--drift': `${random(-80, 80)}px`, '--size': `${random(9, 17)}px`,
      '--rotate': `${random(0, 360)}deg`,
    };
    Object.entries(properties).forEach(([key, value]) => particle.style.setProperty(key, value));
    effects.append(particle);
  }
}

/** 根据开关、系统偏好与页面可见性同步装饰状态。 */
function updateEffects() {
  const active = enabled && !motion.matches;
  const playing = active && heroVisible && !document.hidden;
  effects.hidden = !active;
  effects.classList.toggle('is-paused', !playing);
  toggle.disabled = motion.matches;
  toggle.title = motion.matches ? '系统已开启减少动态效果，浪漫特效已关闭' : '开启或关闭花瓣与心动特效';
  toggle.setAttribute('aria-pressed', String(active));
  state.textContent = active ? '特效 · 开' : '特效 · 关';
  bursts.forEach((burst) => {
    if (!active) burst.animation.cancel();
    else if (playing) burst.animation.play();
    else burst.animation.pause();
  });
}

/** 仅在首屏非交互区域轻点时散开小爱心，并限制同时存在的数量。 */
function scatterHearts(event) {
  if (!enabled || motion.matches || document.hidden || !heroVisible || event.button !== 0) return;
  if (event.target.closest('a, button, input, select, textarea, video, audio, summary, label, [contenteditable], [role="button"]')) return;
  if (bursts.size > 15) return;
  const bounds = effects.getBoundingClientRect();
  for (let index = 0; index < 5; index += 1) {
    const heart = document.createElement('span');
    heart.className = 'love-burst';
    heart.textContent = '♡';
    heart.style.cssText = `left:${event.clientX - bounds.left}px;top:${event.clientY - bounds.top}px;font-size:${random(16, 25)}px`;
    effects.append(heart);
    const animation = heart.animate([
      { opacity: 0.9, transform: 'translate(-50%, -50%) scale(.65)' },
      { opacity: 0, transform: `translate(calc(-50% + ${random(-75, 75)}px), ${random(-140, -65)}px) rotate(${random(-30, 30)}deg) scale(1.2)` },
    ], { duration: random(1000, 1600), easing: 'cubic-bezier(.15,.6,.3,1)', fill: 'forwards' });
    const burst = { animation, heart };
    bursts.add(burst);
    animation.onfinish = animation.oncancel = () => { heart.remove(); bursts.delete(burst); };
  }
}

/** 章节进入视野后显示一次，页面内容默认可见。 */
function setupReveals() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.remove('reveal-pending');
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0, rootMargin: '0px 0px -35px 0px' });
  document.querySelectorAll('.reveal').forEach((node) => {
    if (!motion.matches) node.classList.add('reveal-pending');
    observer.observe(node);
  });
}

createParticles();
setupReveals();
new IntersectionObserver(([entry]) => { heroVisible = entry.isIntersecting; updateEffects(); }).observe(hero);
toggle.addEventListener('click', () => { enabled = !enabled; updateEffects(); });
document.addEventListener('visibilitychange', updateEffects);
hero.addEventListener('pointerdown', scatterHearts);
motion.addEventListener('change', () => {
  if (motion.matches) enabled = false;
  document.querySelectorAll('.reveal-pending').forEach((node) => node.classList.remove('reveal-pending'));
  updateEffects();
});
updateEffects();
