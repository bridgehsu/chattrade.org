# TGEX · 交易所设计与业务流程

VitePress 1.6.4 中文文档站，目标域名 `tgex.net`。正文聚焦业务规则、设计架构与流程，不展开具体源码。

## 本地运行

```sh
npm ci
npm run dev
```

## 验证与构建

```sh
npm run check
npm run build
npm run preview
```

构建产物在 `dist/`。源文件在 `docs/`，导航在 `docs/.vitepress/navigation.json`。`content-map.json` 是内容索引，新增页面时需同步更新。首页组件和主题位于 `docs/.vitepress/theme/`。

## GitHub 自动构建

工作流位于 `.github/workflows/build.yml`。推送到 `main`、向 `main` 提交 Pull Request 时自动运行，也可以在 GitHub Actions 页面手动触发。

构建顺序：Node.js 22 → `npm ci` → `npm run check` → `npm run build`。成功后上传 `dist/`，产物名为 `tgex-dist-提交SHA`，保留 14 天，可在对应运行页面的 Artifacts 中下载。

查看运行记录：https://github.com/bridgehsu/tgex.net/actions/workflows/build.yml

本工作流负责检查与构建。自动部署到服务器或绑定 `tgex.net` 需要另行配置目标托管服务。

## 内容边界

60 篇文档覆盖 18 个栏目。模块映射、现货订单类型和状态、订单簿结构及部分期权状态已对照工程检查；业务图为流程抽象，一致性、安全和恢复设计不代表生产功能已完成审计。示例价格、收益与费率仅用于演算。

不包含项目原有账号、内部服务地址、密钥或真实业务数据。接口章节说明协议语义，不虚构尚未核实的接口路径。

## 部署到 tgex.net

1. 将 `dist/` 上传到支持静态文件的托管服务。
2. 在托管侧绑定 `tgex.net`，按服务商要求设置 A、AAAA 或 CNAME 记录。
3. 配置 TLS 证书和 HTTP 到 HTTPS 跳转。
4. 支持 `/spot/flows` 这样的无扩展名路由：先尝试同名 `.html`，未找到时返回 `404.html`，不要把所有未知路径重写成首页。
5. 验证首页、文档深链接、搜索、移动端和 404。

Sitemap 已使用 `https://tgex.net`。写入域名元数据不代表已注册域名或完成 DNS 绑定。Sites 预览发布默认保留私有访问范围。

Nginx 参考配置位于 `deploy/nginx.conf`，域名与证书需在你的托管环境完成配置。
