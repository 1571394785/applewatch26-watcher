# Apple Watch — 精准时图（Wallpaper Engine 项目）

项目简介

这是一个为 Wallpaper Engine 制作的「Apple Watch 风格精准时图」桌面动态壁纸项目。使用网页（HTML/CSS/JavaScript）实现可视化时钟显示，便于在 Wallpaper Engine 中预览与自定义。

主要特性

- 以 Apple Watch 风格展示精准时间（时/分/秒、日期等）。
- 轻量级：使用原生前端技术（`index.html`、`style.css`、`script.js`）。
- 易于定制：样式和行为分离，修改 `style.css` 与 `script.js` 即可改变外观与功能。

文件说明

- `index.html` — 项目的入口页面，负责布局与挂载样式/脚本。
- `style.css` — 项目的样式表，控制外观（颜色、字体、位置、动画等）。
- `script.js` — 控制时钟逻辑与交互（更新时间、动画触发、可选配置项）。
- `project.json` — Wallpaper Engine 项目的元数据（项目名、预览设置等）。

如何在 Wallpaper Engine 中使用

1. 将整个项目文件夹放入 Wallpaper Engine 的项目目录（可选）：
   - Windows 下通常为 `Documents\My Wallpapers` 或 Wallpaper Engine 的自定义 projects 目录。
   - 也可以直接在 Wallpaper Engine 编辑器中选择“打开项目文件夹”（Open project / Import）并指向本目录。
2. 在 Wallpaper Engine 编辑器中打开 `index.html` 并点击预览（Play/Preview）。
3. 若要发布或应用为壁纸，按 Wallpaper Engine 的导出/发布流程进行（Engine 内的导出/上传操作）。

快速定制指南

- 修改颜色与字体：在 `style.css` 中查找主要变量或根选择器（例如 `:root` 或 `.watch`），调整颜色值与字体族。
- 改变时间格式：在 `script.js` 中查找生成时间字符串的部分（例如 `toLocaleTimeString` 或自定义格式函数），按需修改为 12/24 小时制、隐藏/显示秒等。
- 调整定位与缩放：在 `style.css` 修改容器宽高与 transform，或在 `index.html` 中添加 wrapper 以便在编辑器中缩放。
- 添加自定义交互：在 `script.js` 中添加事件监听（点击/悬停）以触发动画或切换样式。

建议与注意事项

- 预览性能：尽量避免在 `script.js` 中使用高频率重型计算（如每帧复杂布局），用 requestAnimationFrame 或限制更新频率来优化。动画尽量使用 CSS 动画/transform 以利用 GPU 加速。
- 字体与资源：若使用非系统字体，请把字体文件放入项目并在 `index.html` 中通过 `@font-face` 引入，保证 Wallpaper Engine 在其他机器上也能正确显示。
- 时间源与时区：当前实现一般使用本地系统时间；如需要多时区或 NTP 同步，需要额外逻辑与网络权限（在 Wallpaper Engine 中发布前请确认可用性）。

贡献与扩展

欢迎提交改进建议或 Pull Request（如果你在使用版本控制托管此项目）。建议的扩展方向：

- 多表盘样式切换（模拟不同 Apple Watch 表盘）。
- 夜间/低亮度模式自动切换。
- 可配置的主题与颜色面板（在 UI 中提供设置）。

许可证

本项目采用 MIT 许可证（如需其他许可证，请替换本节）。

联系方式

如需帮助或希望我为你做进一步定制（例如添加表盘、不同语言显示、动效优化），可以在仓库中留言或直接联系项目维护人。

---

