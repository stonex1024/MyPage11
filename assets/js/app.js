const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const dateFormatter = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric', month: '2-digit', day: '2-digit',
});

/** 获取页面中约定的唯一元素。 */
const select = (selector) => document.querySelector(selector);

/** 创建使用纯文本内容的元素。 */
function element(tag, className, text = '') {
  const node = document.createElement(tag);
  node.className = className;
  node.textContent = text;
  return node;
}

/** 将配置中的日期显示为本地日历日期，避免日期跨时区偏移。 */
function formatDate(date) {
  return dateFormatter.format(new Date(`${date.slice(0, 10)}T00:00:00`)).replaceAll('/', '.');
}

/** 从网络边界读取 JSON 配置，并保留可定位的请求错误。 */
async function loadConfig(name) {
  const response = await fetch(`config/${name}.json`);
  if (!response.ok) throw new Error(`${name}.json: HTTP ${response.status}`);
  return response.json();
}

/** 将真实时间差拆分为累计天数及小时、分钟、秒。 */
function elapsedTime(startTime, now) {
  const seconds = Math.max(0, Math.floor((now - startTime) / 1000));
  return {
    days: Math.floor(seconds / 86400),
    hours: Math.floor(seconds / 3600) % 24,
    minutes: Math.floor(seconds / 60) % 60,
    seconds: seconds % 60,
  };
}

/** 设置站点文案及可切换的图片或渐变背景。 */
function renderSite(site) {
  document.title = site.title;
  const content = {
    '#brand-name': site.name,
    '#hero-eyebrow': site.hero.eyebrow,
    '#hero-title': site.hero.title,
    '#hero-subtitle': site.hero.subtitle,
    '#hero-caption': site.hero.caption,
    '#about-title': site.about.title,
    '#about-text': site.about.text,
    '#profile-name': site.name,
    '#profile-bio': site.bio,
    '#couple-first': site.couple.firstName,
    '#couple-second': site.couple.secondName,
    '#letter-greeting': site.letter.greeting,
    '#letter-signature': site.letter.signature,
    '#footer-year': new Date().getFullYear(),
  };
  Object.entries(content).forEach(([selector, value]) => {
    select(selector).textContent = value;
  });
  select('#home').style.background = site.hero.backgroundGradient;
  const background = select('#hero-background');
  background.hidden = !site.hero.backgroundImage;
  if (site.hero.backgroundImage) background.src = site.hero.backgroundImage;
  select('#start-date').dateTime = site.startDate;
  select('#start-date').textContent = formatDate(site.startDate);
}

/** 以系统时间更新计时器，标签页恢复时立即校准。 */
function startTimer(startDate) {
  const startTime = new Date(startDate).getTime();
  const digits = [...document.querySelectorAll('[data-unit]')];

  /** 仅为数值变化的单元执行轻柔过渡。 */
  function updateTimer() {
    const now = Date.now();
    const elapsed = elapsedTime(startTime, now);
    digits.forEach((digit) => {
      const value = String(elapsed[digit.dataset.unit]).padStart(digit.dataset.unit === 'days' ? 4 : 2, '0');
      if (digit.textContent === value) return;
      digit.textContent = value;
      if (!reducedMotion) {
        digit.animate([
          { opacity: 0.4, transform: 'translateY(7px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ], { duration: 360, easing: 'cubic-bezier(.2,.7,.3,1)' });
      }
    });
    select('#timer-state').textContent = now < startTime ? '等待与你相遇的那一天' : '时间往前，爱意不减';
  }

  updateTimer();
  window.setInterval(updateTimer, 1000);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) updateTimer();
  });
}

/** 为地点构建可安全展示的地图气泡。 */
function createPopup(place) {
  const popup = element('div', 'place-popup');
  popup.append(
    element('h3', '', `${place.name} · ${place.region}`),
    element('p', 'place-popup-date', formatDate(place.visitedAt)),
    element('p', 'place-popup-note', place.note),
  );
  return popup;
}

/** 初始化地图、地点列表和恢复全览操作。 */
function renderMap(config, places) {
  const map = L.map('map', { scrollWheelZoom: false, zoomControl: false }).setView(config.center, config.zoom);
  L.control.zoom({ position: 'bottomright' }).addTo(map);
  const tiles = L.tileLayer(config.tileUrl, {
    attribution: config.attribution, maxZoom: 19,
  }).addTo(map);
  tiles.on('tileerror', () => {
    select('#map-status').textContent = '底图暂时未能加载，仍可点击地点查看记录。';
    select('#map-status').hidden = false;
  });
  const markers = [];
  const buttons = [];
  select('#place-count').textContent = places.length;

  places.forEach((place, index) => {
    const marker = L.marker(place.coordinates, {
      title: place.name,
      alt: `${place.name}，${formatDate(place.visitedAt)}`,
      icon: L.divIcon({
        className: 'place-marker', html: `<span>${index + 1}</span>`,
        iconSize: [36, 36], iconAnchor: [18, 18], popupAnchor: [0, -22],
      }),
    }).addTo(map).bindPopup(createPopup(place));
    const button = element('button', 'place-button', `${String(index + 1).padStart(2, '0')}  ${place.name}`);
    button.type = 'button';
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', () => {
      map.flyTo(place.coordinates, 8, { animate: !reducedMotion, duration: 0.8 });
      marker.openPopup();
    });
    marker.on('popupopen', () => {
      buttons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      select('#map-caption').textContent = `${place.name} · ${formatDate(place.visitedAt)} · ${place.note}`;
    });
    select('#place-list').append(button);
    buttons.push(button);
    markers.push(marker);
  });

  /** 将全部地点纳入视野，并清除单个地点的选中状态。 */
  function showAllPlaces() {
    map.closePopup();
    buttons.forEach((button) => button.setAttribute('aria-pressed', 'false'));
    if (markers.length) map.fitBounds(L.featureGroup(markers).getBounds(), { padding: [46, 46], maxZoom: 7, animate: !reducedMotion });
    select('#map-caption').textContent = `${places.length} 个地方，都是我们爱过的风景。点击标记，重温那一天。`;
  }

  select('#reset-map').addEventListener('click', showAllPlaces);
  showAllPlaces();
}

/** 打开图片预览，让浏览器负责弹窗焦点与 Escape 关闭行为。 */
function openPhoto(memory) {
  select('#dialog-image').src = memory.media.src;
  select('#dialog-image').alt = memory.media.alt;
  select('#dialog-caption').textContent = `${memory.title} · ${formatDate(memory.date)}`;
  select('#photo-dialog').showModal();
}

/** 创建图片或带原生控件的视频区域。 */
function createMedia(memory) {
  const { media } = memory;
  const wrapper = element('div', 'memory-media');
  if (media.type === 'video') {
    const video = element('video', 'memory-video');
    video.controls = true;
    video.playsInline = true;
    video.preload = 'metadata';
    video.poster = media.poster;
    video.src = media.src;
    video.setAttribute('aria-label', media.alt);
    wrapper.append(video);
  } else {
    const button = element('button', 'memory-image-button');
    button.type = 'button';
    button.setAttribute('aria-label', `查看大图：${memory.title}`);
    const image = document.createElement('img');
    image.src = media.src;
    image.alt = media.alt;
    image.loading = 'lazy';
    image.decoding = 'async';
    image.width = 1000;
    image.height = 750;
    button.append(image);
    button.addEventListener('click', () => openPhoto(memory));
    wrapper.append(button);
  }
  wrapper.append(element('span', 'memory-category', memory.category));
  return wrapper;
}

/** 将一条 JSON 回忆渲染为图文卡片。 */
function createMemoryCard(memory, places) {
  const card = element('article', 'memory-card');
  const content = element('div', 'memory-content');
  const meta = element('div', 'memory-meta');
  const date = element('time', 'memory-date', formatDate(memory.date));
  date.dateTime = memory.date;
  const location = memory.placeId ? places.find((place) => place.id === memory.placeId).name : '生活的小角落';
  meta.append(date, element('span', 'memory-place', location));
  const tags = element('ul', 'memory-tags');
  memory.tags.forEach((tag) => tags.append(element('li', '', tag)));
  content.append(meta, element('h3', 'memory-title', memory.title), element('p', 'memory-description', memory.description), tags);
  card.append(createMedia(memory), content);
  return card;
}

/** 展示按日期倒序的回忆，并连接类别筛选及图片预览。 */
function renderMemories(memories, places) {
  const categories = ['全部', ...new Set(memories.map((memory) => memory.category))];
  const sorted = [...memories].sort((a, b) => b.date.localeCompare(a.date));
  const buttons = [];

  /** 切换类别时停止旧视频，更新卡片与可访问的筛选状态。 */
  function filterMemories(category) {
    select('#memories').querySelectorAll('video').forEach((video) => video.pause());
    const visible = sorted.filter((memory) => category === '全部' || memory.category === category);
    select('#memories').replaceChildren(...visible.map((memory) => createMemoryCard(memory, places)));
    select('#memory-count').textContent = visible.length;
    select('#empty-state').hidden = visible.length > 0;
    buttons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.filter === category)));
  }

  categories.forEach((category) => {
    const button = element('button', 'filter-button', category);
    button.type = 'button';
    button.dataset.filter = category;
    button.setAttribute('aria-controls', 'memories');
    button.addEventListener('click', () => filterMemories(category));
    buttons.push(button);
    select('#memory-filters').append(button);
  });
  select('#close-dialog').addEventListener('click', () => select('#photo-dialog').close());
  select('#photo-dialog').addEventListener('click', (event) => {
    if (event.target === select('#photo-dialog')) select('#photo-dialog').close();
  });
  filterMemories('全部');
}

/** 保持顶部导航可读，并标识当前浏览的章节。 */
function setupNavigation() {
  const header = select('.site-header');
  const navLinks = [...document.querySelectorAll('[data-nav]')];

  /** 根据滚动位置切换导航栏背景。 */
  function updateHeader() {
    header.classList.toggle('is-scrolled', window.scrollY > 36);
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        const active = link.hash === `#${entry.target.id}`;
        link.classList.toggle('is-active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-15% 0px -60% 0px' });
  navLinks.forEach((link) => observer.observe(select(link.hash)));
}

/** 由访客主动开启循环背景音乐，并以真实播放事件同步开关。 */
function setupMusic(music) {
  const audio = select('#background-music');
  const toggle = select('#music-toggle');
  const status = select('#music-status');
  audio.src = music.src;
  audio.volume = music.volume;
  toggle.title = music.title;
  select('#music-player').hidden = false;

  /** 显示播放或暂停状态，避免开关与音频状态不一致。 */
  function updateMusicState() {
    toggle.setAttribute('aria-pressed', String(!audio.paused));
    select('#music-state').textContent = audio.paused ? '音乐 · 关' : '音乐 · 开';
  }

  /** 在媒体加载边界给出可重试提示。 */
  function showMusicError() {
    audio.pause();
    status.textContent = '音乐暂时无法播放，请检查网络后点击重试。';
    status.hidden = false;
  }

  /** 点击开启或暂停，加载失败后允许重新请求音乐。 */
  function toggleMusic() {
    status.hidden = true;
    if (!audio.paused) {
      audio.pause();
      return;
    }
    if (audio.error) audio.load();
    audio.play().catch((error) => {
      if (error.name !== 'AbortError') showMusicError();
    });
  }

  audio.addEventListener('playing', updateMusicState);
  audio.addEventListener('pause', updateMusicState);
  audio.addEventListener('error', showMusicError);
  toggle.addEventListener('click', toggleMusic);
}

/** 并行读取独立配置，然后启动页面各个展示模块。 */
async function initialize() {
  const [site, places, memories] = await Promise.all([
    loadConfig('site'), loadConfig('places'), loadConfig('memories'),
  ]);
  renderSite(site);
  startTimer(site.startDate);
  renderMemories(memories, places);
  setupNavigation();
  setupMusic(site.music);
  renderMap(site.map, places);
}

initialize().catch((error) => {
  select('#app-error').textContent = '页面内容暂时未能加载。请通过 HTTP 服务访问，并检查 config 目录中的 JSON 文件。';
  select('#app-error').hidden = false;
  console.error(error);
});
