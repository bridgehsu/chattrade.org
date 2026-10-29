# ChatTrade · chattrade-workspace 知识库

VitePress 中文文档站，域名 `chattrade.org`。内容只描述 **chattrade-workspace** 内工程：

| 工程 | 说明 |
| --- | --- |
| `chattrade-web` | 桌面端 Web 客户端 |
| `chattrade-mobile` | 手机端 / H5 / Capacitor |
| `chattrade.org` | 本知识库 |

与 **tgex.net** 及其它交易所模版文档无关，请勿混用。

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

构建产物在 `dist/`。`navigation.json`、`structure.json`、`content-map.json` 由 `npm run gen` 生成，不要手改。

文档源码使用 `序号.标题` 目录，例如 `docs/07.策略与回测/01.策略中心与IDE.md`。对外 URL 为 `/pages/0701`。修改目录后运行 `npm run gen`。

## 用 GitHub Pages 部署

工作流：`.github/workflows/build.yml`。推送到 `main` 后自动检查、构建并用 **GitHub Actions** 发布 Pages。

### 1. 准备独立仓库（必做）

当前本地 `origin` 若仍指向 `tgex.net`，需要换成 ChatTrade 专用仓库，例如：

```sh
# 在 GitHub 上新建空仓库 bridgehsu/chattrade.org（不要勾选自动加 README）
git remote remove origin
git remote add origin https://github.com/bridgehsu/chattrade.org.git
git add -A
git commit -m "docs: publish ChatTrade workspace knowledge base"
git push -u origin main
```

不要把 ChatTrade 文档推回 `tgex.net` 仓库。

### 2. 打开 GitHub Pages（关键）

仓库 **Settings → Pages**：

**推荐（Actions）：**

1. **Build and deployment → Source** 选 **GitHub Actions**。
2. Custom domain 填 `chattrade.org`，DNS 就绪后勾选 **Enforce HTTPS**。

**备用（分支发布）：**

若暂时不能用 Actions 发布，把 Source 改为 **Deploy from a branch**，Branch 选 **`gh-pages`**、目录 **`/ (root)`**。  
工作流会把 VitePress 的 `dist/` 推到 `gh-pages`。

**不要**选 `main` + `/docs` 或 `main` 根目录。那样会走 Jekyll，把 Markdown 当正文，`<HomePage />` 不会编译，首页只剩仓库名标题。

### 3. 域名与 base 路径

默认工作流配置（适合自定义域名根路径）：

| 变量 | 值 | 含义 |
| --- | --- | --- |
| `CUSTOM_DOMAIN` | `chattrade.org` | 写入 `dist/CNAME`，SEO 用 `https://chattrade.org` |
| `DOCS_BASE` | `/` | VitePress `base` |

若暂时不用自定义域名，改为项目页地址：

1. 把 `CUSTOM_DOMAIN` 改成空字符串。
2. 把 `DOCS_BASE` 改成 `/chattrade.org/`（与仓库名一致，两端斜杠保留）。
3. 站点地址变为 `https://<user>.github.io/chattrade.org/`。

### 4. DNS（仅自定义域名）

在域名服务商添加 GitHub Pages 要求的记录，例如：

- `A` / `AAAA` 到 GitHub Pages IP，或
- `CNAME` 到 `<user>.github.io`

以 [GitHub Pages 自定义域名文档](https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site) 为准。仓库里的 `CNAME` 文件不能代替 DNS。

### 5. 验证

1. Actions 中 `Build and Deploy ChatTrade Docs` 成功。
2. 打开首页与 `/pages/0101` 深链接。
3. 搜索、移动端布局、404 页正常。

## 内容边界

只覆盖工作区工程说明；不含生产密钥、真实账号与 tgex.net 内容。
