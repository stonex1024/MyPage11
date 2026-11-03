# 拾光 · 我们的爱情纪念册

一个以奶油白、雾粉和浅酒红为主色的爱情纪念册。用樱花、两个人的名字、在一起的计时、共同足迹和一封情书，收藏属于你们的日常。原生 HTML5、CSS3、JavaScript 与 Leaflet，无构建步骤，可直接发布到 GitHub Pages。

这是独立的新项目，发布时仅使用 `personal-homepage` 目录内的文件。

## 功能

- 首屏柔粉樱花背景与双人名字，动态展示从指定纪念日开始累计的天、小时、分钟、秒。
- 花瓣与心形微光、首屏轻点爱心，以及章节进入视野的轻柔过渡；装饰特效提供独立开关，尊重系统“减少动态效果”偏好。
- 右下角背景音乐开关：默认关闭，点击开启循环播放，再次点击暂停。
- 交互式地图与旅行地点卡片，点击标记可阅读地点、日期和备注。
- 图文时间轴，支持分类筛选、图片懒加载、点击查看大图和原生 HTML5 视频播放。
- 手机、平板和桌面布局；键盘焦点样式与减少动态效果偏好适配。
- 纪念日、两个人的名字、情书、地点和共同记录使用独立 JSON 文件配置。

页面中的“你 / 我”、纪念日期、情书与旅行故事均为示例文案，不代表真实个人经历。上线前可替换成你们自己的名字、照片与记录。

## 本地预览

使用 HTTP 服务预览，避免浏览器限制 `file://` 页面读取 JSON。安装 Node.js 后，在本项目目录打开终端执行：

```powershell
cd D:\SHHL_MES_NEW\personal-homepage
npx --yes serve . --listen 4173
```

打开 `http://localhost:4173`，按 `Ctrl+C` 停止服务。`serve` 仅用于本地预览，线上部署无需 Node.js。

如果电脑已安装 Python，也可以在本项目目录执行：

```powershell
py -m http.server 4173 --bind 127.0.0.1
```

## 目录与配置

```text
personal-homepage/
├── index.html                 页面结构
├── assets/                    样式、图片、视频、音频、字体及 Leaflet
│   └── js/
│       ├── app.js             计时、地图、回忆与音乐
│       └── effects.js         花瓣、爱心、特效开关及入场过渡
├── config/
│   ├── site.json              双人名字、情书、纪念日、背景及地图底图
│   ├── places.json            地点坐标、访问日期和备注
│   └── memories.json          图文与视频时间轴
├── .nojekyll                  禁用 Jekyll 处理
├── ASSETS.md                  素材来源和第三方许可证
└── README.md
```

### 1. 修改双人名字、情书与纪念日

编辑 `config/site.json`：

| 字段 | 用途 |
| --- | --- |
| `title` | 浏览器标签页标题 |
| `name` / `bio` | 站点名称和两个人的简短介绍 |
| `couple.firstName` / `couple.secondName` | 首屏双人名字，默认“你”和“我”，可改为彼此的名字或昵称 |
| `letter.greeting` / `letter.signature` | 情书称呼与落款，默认“亲爱的你：”和“永远偏爱你的我” |
| `startDate` | 计时起点，使用带时区的 ISO 时间，例如 `2024-02-14T00:00:00+08:00` |
| `music.src` / `music.title` / `music.volume` | BGM 文件路径、曲目名称、音量（0～1，默认 0.3） |
| `hero.eyebrow` / `hero.title` / `hero.subtitle` | 首屏英文小标题、主标题和介绍 |
| `hero.backgroundImage` | 背景图路径；设为 `""` 时只显示渐变 |
| `hero.backgroundGradient` | CSS 渐变值，例如 `linear-gradient(135deg, #fbe9ed, #fff5ed)` |
| `hero.caption` | 首屏配图短句 |
| `map.center` / `map.zoom` | 地图默认中心 `[纬度, 经度]` 和缩放级别；有地点时自动调整到全部地点的视野 |
| `map.tileUrl` / `map.attribution` | 地图瓦片地址及对应署名，默认使用不需 API Key 的 OpenStreetMap.de 服务 |
| `about.title` / `about.text` | 情书区域的标题和正文 |

示例起点只用于演示。将 `startDate` 换成你们想纪念的日期，保留 `+08:00` 表示北京时间。计时器使用绝对时间差，其他时区的访问者看到同一段累计时长；若起点在未来，累计数字为零。

修改名字和情书时，保留现有 JSON 结构，例如：

```json
"couple": { "firstName": "你的名字", "secondName": "TA的名字" },
"letter": { "greeting": "亲爱的你：", "signature": "永远偏爱你的我" }
```

情书正文放在 `about.text`。本地标题字体包含当前中文标题与英文手写短句；新昵称或新文案中未包含的文字会使用系统字体回退。

替换首屏照片时，将新文件放在 `assets/images/`，再修改 `hero.backgroundImage`。仅用渐变的配置示例：

```json
"backgroundImage": "",
"backgroundGradient": "linear-gradient(135deg, #fbe9ed 0%, #fff5ed 58%, #f8e0e7 100%)"
```

### 2. 更换背景音乐

将有使用授权的 MP3 文件放入 `assets/audio/`，修改 `config/site.json` 的 `music`：

```json
"music": {
  "src": "assets/audio/bgm.mp3",
  "title": "我的背景音乐",
  "volume": 0.3
}
```

音乐默认关闭，由访客点击右下角开关启动，开启后循环播放，再次点击暂停；刷新页面后恢复关闭。这样也符合浏览器对有声自动播放的限制。音乐在首次点击时加载，不拖慢首屏。部分手机浏览器使用设备音量控制实际音量。若更换曲目，请同步更新页脚的音乐署名和 `ASSETS.md`。

### 3. 添加旅行地点

在 `config/places.json` 数组中添加一个对象：

```json
{
  "id": "hangzhou",
  "name": "杭州",
  "region": "浙江 · 西湖",
  "coordinates": [30.2431, 120.1500],
  "visitedAt": "2024-10-03",
  "note": "牵着你的手绕湖慢慢走，把桂花香和这个下午一起收藏。"
}
```

`id` 在地点列表中保持唯一，用于关联时间轴。`coordinates` 顺序是**纬度在前、经度在后**，采用 WGS84 坐标；高德、百度地图提供的坐标不能直接当作 WGS84 使用。`visitedAt` 使用 `YYYY-MM-DD`。地图的标记和弹窗直接来自这些数据。

### 4. 添加图文记录

在 `config/memories.json` 数组中添加一个对象：

```json
{
  "id": "a-spring-day",
  "date": "2026-04-12",
  "placeId": "hangzhou",
  "category": "旅行",
  "title": "和你一起，把春天装进口袋",
  "description": "我们沿着湖边走了很久，留下一个不着急的下午。",
  "tags": ["牵手散步", "我们的日常"],
  "media": {
    "type": "image",
    "src": "assets/images/my-photo.jpg",
    "alt": "春日湖边的树影与步道"
  }
}
```

`id` 保持唯一；`placeId` 填对应地点的 `id`，不关联地点时填空字符串 `""`。`category` 是筛选分类，示例使用“旅行”“日常”“影像”，新增分类会自动出现在筛选栏；`tags` 用于卡片标签。`alt` 描述图片或视频内容，方便使用辅助工具的访客理解。记录会按 `date` 从新到旧排列。

使用视频时，将 `media` 改为：

```json
{
  "type": "video",
  "src": "assets/videos/my-video.mp4",
  "poster": "assets/images/my-video-cover.jpg",
  "alt": "记录春日花朵的短视频"
}
```

视频使用原生播放控件，不自动播放。配置中的所有示例文案、地点和日期都可以修改，摄影素材用于氛围展示，并非示例城市的实地拍摄记录。

### 5. 浪漫特效与减少动态效果

`assets/js/effects.js` 管理首屏花瓣、心形微光、轻点爱心和章节入场过渡。页面上的特效开关可关闭花瓣与心动装饰，音乐由另一个独立开关控制。轻点首屏空白区域会散开少量爱心，按钮、链接与媒体控件不会触发。

开启系统“减少动态效果”时，浪漫装饰默认关闭，特效按钮保持禁用；入场内容直接显示。离开首屏或切到后台时，首屏装饰会暂停以减少无效动画。页面内容不依赖这些特效读取或浏览。

## GitHub Pages 部署

### 方式一：网页上传

1. 登录 GitHub，新建一个仓库，例如 `personal-homepage`。使用 GitHub Free 时选择 **Public**。
2. 将本项目**目录里面的内容**上传至仓库根目录，让根目录直接包含 `index.html`、资源文件夹和配置文件夹。不要把整个 `personal-homepage` 文件夹作为额外的一层上传。
3. 保留空文件 `.nojekyll`，用于关闭 Jekyll 处理。确认图片、视频以及 Leaflet 文件都已上传。
4. 进入仓库 **Settings → Pages**。
5. 在 **Build and deployment → Source** 中选择 **Deploy from a branch**。
6. 在 **Branch** 中选择 **main** 和 **/(root)**，点击 **Save**。
7. 在 **Actions** 页面查看 `pages build and deployment`，等待部署成功。
8. 返回 **Settings → Pages**，点击生成的链接。普通项目仓库地址为 `https://你的用户名.github.io/personal-homepage/`。

如果需要地址为 `https://你的用户名.github.io/`，把仓库命名为 `你的用户名.github.io`；发布步骤相同。

### 方式二：用 Git 推送

先在 GitHub 建立一个**空仓库**，不要预先勾选初始化 README。然后在本项目目录执行以下命令，将示例用户名替换为自己的 GitHub 用户名：

```powershell
cd D:\SHHL_MES_NEW\personal-homepage
git init
git add .
git commit -m "Create personal homepage"
git branch -M main
git remote add origin https://github.com/你的用户名/personal-homepage.git
git push -u origin main
```

推送后，按方式一的第 4～8 步开启 GitHub Pages。无需设置构建命令、安装生产依赖或配置服务器路由。

### 更新页面

修改 JSON、替换照片或视频，再提交到 `main` 分支，GitHub Pages 会重新发布。在 GitHub 网页里编辑配置文件并提交也可以。若仍看到旧内容，先确认 Actions 部署已成功，再刷新浏览器缓存。

所有页面资源使用相对路径，可同时支持用户名主页和带仓库名的项目主页。导航使用页面锚点，不依赖服务器端路由。

## 内容与素材约定

- 图片推荐压缩到 1 MB 以内；封面建议 1600～2400 像素宽，记录照片约 1000～1400 像素宽。
- 视频推荐使用 H.264 编码的 MP4，保持短小并提供封面。GitHub 普通仓库单文件上限为 100 MiB，长视频建议使用允许公开访问的外部媒体服务。
- 本地资源路径相对于 `index.html`，如 `assets/images/my-photo.jpg`；不要以 `/assets/` 开头，以兼容仓库子路径。
- JSON 使用双引号，不支持注释或末尾多余逗号。文本内容使用纯文本，不需要写 HTML。
- 计时器按访问者设备的当前系统时间计算；起始时间应包含时区。累计一天等于 24 小时。
- 地图瓦片需要网络，图片、示例视频与 Leaflet 已保存到本地；第三方来源与许可证见 [ASSETS.md](ASSETS.md)。

## 常见问题

**本地打开页面后没有内容？** 通过 HTTP 服务打开，检查浏览器地址是否为 `http://localhost:4173`，而不是直接双击 HTML。

**GitHub Pages 显示 404？** 检查发布分支和目录，确认所选目录的根部有 `index.html`，并等待 Actions 部署完成。

**只有图片或配置文件 404？** 检查文件名大小写和相对路径。GitHub Pages 对大小写敏感，Windows 本地通常不敏感。

**地图底图没有显示？** 检查网络能否访问配置中的瓦片服务，或切换为你可访问且允许此用途的地图服务，并保留服务署名。

**修改时间后秒数不正确？** 使用带时区的起始时间，例如 `2024-05-20T00:00:00+08:00`，并检查设备时间。该页面不请求服务器时间。
