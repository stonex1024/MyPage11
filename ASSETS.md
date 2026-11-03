# 素材与第三方依赖

页面中的照片、文案与旅行日期为演示内容，可直接替换成自己的记录；照片不代表示例坐标的实地拍摄。

## 摄影素材

以下图片已下载到项目内，浏览页面时不再请求图片源站。原始摄影来自 [Unsplash](https://unsplash.com/)，使用规则见 [Unsplash License](https://unsplash.com/license)。

| 文件 | 内容 | 原始素材 |
| --- | --- | --- |
| `assets/images/hero.jpg` | 海边粉紫色日落，2200 像素宽 | [Unsplash 原图](https://images.unsplash.com/photo-1475924156734-496f6cac6ec1) |
| `assets/images/coast.jpg` | 同一海边日落的 1200 像素版本 | [Unsplash 原图](https://images.unsplash.com/photo-1475924156734-496f6cac6ec1) |
| `assets/images/city.jpg` | 上海黄浦江畔的城市晚霞 | [Unsplash 原图](https://images.unsplash.com/photo-1548919973-5cef591cdbc9) |
| `assets/images/lake.jpg` | 山湖与木屋 | [Unsplash 原图](https://images.unsplash.com/photo-1470770841072-f978cf4d019e) |
| `assets/images/flowers.jpg` | 粉色樱花 | [Unsplash 原图](https://images.unsplash.com/photo-1462275646964-a0e3386b89fa) |

## 视频素材

`assets/videos/flowers.mp4` 为 MDN 交互式示例提供的花朵视频，来自其 CC0 视频目录：[视频源文件](https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4)。约 1.1 MB，适合用于验证原生 HTML5 视频播放。正式发布时可换成自己的 H.264 / MP4 视频，并同步修改时间轴配置和封面图。

## 地图库与地图数据

- [Leaflet 1.9.4](https://leafletjs.com/) 的 JS 与 CSS 已保存至 `assets/vendor/leaflet/`，采用 BSD 2-Clause License；许可证保留于同目录的 `LICENSE`。
- 底图瓦片需要联网加载，具体服务地址和署名见 `config/site.json` 的 `map`。默认使用不需要 API Key 的 [OpenStreetMap.de](https://www.openstreetmap.de/) 社区瓦片服务和 OpenStreetMap 数据，保留双方署名。该公共服务无可用性保证，大流量站点应改用合适的商业服务或自托管瓦片。也可按网络情况将地址改为 `https://tile.openstreetmap.org/{z}/{x}/{y}.png`；使用该地址时须遵守 [OpenStreetMap 瓦片使用政策](https://operations.osmfoundation.org/policies/tiles/)。
- 默认标记使用页面自定义的 `divIcon`，无需请求 Leaflet 默认标记图片。

## 字体

`assets/fonts/noto-serif-sc-title.ttf` 来自 [Google Fonts 的 Noto Serif SC](https://fonts.google.com/noto/specimen/Noto+Serif+SC)，为爱情纪念册首页、章节标题与回忆卡片标题的精简子集，字重 400，约 31 KB。字体许可证为 SIL Open Font License 1.1，原文保留在 `assets/fonts/OFL.txt`。

`assets/fonts/love-script.ttf` 来自 [Google Fonts 的 Dancing Script](https://fonts.google.com/specimen/Dancing+Script)，字重 400，约 10 KB，用于英文手写短句。子集包括 “Always you.”、“You & me, always.”、“The story of us.”、“Two hearts, one home.”、“A little love letter.” 和 “Forever starts with you.”。字体许可证同为 SIL Open Font License 1.1，保留在 `assets/fonts/OFL-DancingScript.txt`。

字体已保存到本地，不依赖访客访问 Google Fonts。未包含的文字使用 CSS 指定的系统字体回退；更换标题或名字后如需统一字体，可自行换成完整字体或重新生成所需文字子集。

## 背景音乐

`assets/audio/bgm.mp3` 为 **Gymnopedie No. 1**，Kevin MacLeod 演奏/录音、Erik Satie 作曲，官方标注时长 3 分 07 秒，ISRC 为 `USUAN1100787`。

- [官方曲目页](https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1100787)
- [官方音频文件](https://incompetech.com/music/royalty-free/mp3-royaltyfree/Gymnopedie%20No%201.mp3)
- [官网许可说明](https://incompetech.com/music/royalty-free/licenses/)
- 许可：[Creative Commons Attribution 4.0 International（CC BY 4.0）](https://creativecommons.org/licenses/by/4.0/)

官网许可页允许免费使用，要求在作品中署名。曲目仅更名为 `bgm.mp3`，未剪辑或改编。页面应保留曲名、Kevin MacLeod、来源与许可链接；完整署名另存于 [assets/audio/ATTRIBUTION.md](assets/audio/ATTRIBUTION.md)。

> "Gymnopedie No. 1" Kevin MacLeod (incompetech.com)  
> Licensed under Creative Commons: By Attribution 4.0 License  
> https://creativecommons.org/licenses/by/4.0/

项目没有接入 AI 图片生成服务，以上图片均为摄影素材。
