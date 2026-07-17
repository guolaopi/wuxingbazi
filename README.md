# 五行八字

根据出生日期推算八字五行以及十星的纯前端项目。

计算八字使用 [lunisolar](https://github.com/waterbeside/lunisolar) 项目。

## 开发

需要 Node.js 14.18 或更高版本。

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
```

构建完成后会自动清空 `docs`、复制 `dist` 的全部内容，并将
`docs/index.html` 中的 `/assets/` 资源路径改为 `/wuxingbazi/assets/`，用于 GitHub Pages 发布。

运行测试：

```bash
npm test
```
