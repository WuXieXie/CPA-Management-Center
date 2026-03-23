# 该项目对原项目的修改
1.新增了对配额本地长久化存储的支持（项目重部署或者手动清理页面缓存则失效）  
2.认证文件页新增了刷新配额按钮，可以获取401和配额状态。  
3.认证文件页对按钮进行了描述优化，新增筛选，便于管理失效状态账户。  
4.配色进行了调整。  
>该项目主要改动均针对于Codex优化，不确保对其他来源文件管理的完全生效。


# 以下内容为原项目文档内容，供查阅参考。
# CLI Proxy API 管理中心

用于管理与故障排查 **CLI Proxy API** 的单文件 Web UI（React + TypeScript），通过 **Management API** 完成配置、凭据、日志与统计等管理操作。

**项目文档**: https://github.com/WuXieXie/Cli-Proxy-API-Management-Center  
**该项目基于**：https://github.com/router-for-me/CLIProxyAPI  
**CLI Proxy API 主项目**: https://github.com/router-for-me/CLIProxyAPI  
**最低版本要求**: ≥ 6.8.0（推荐 ≥ 6.8.15）

从 6.0.19 版本开始，Web UI 随主程序一起提供；服务运行后，通过 API 端口上的 `/management.html` 访问它。

## 这是什么

- 本仓库只包含 Web 管理界面本身，通过 CLI Proxy API 的 **Management API**（`/v0/management`）读取/修改配置、上传凭据、查看日志与使用统计。
- 它 **不是** 代理本体，不参与流量转发。

## 快速开始

### 方式 A：使用 CLI Proxy API 自带的 Web UI

1. 启动 CLI Proxy API 服务
2. 打开 `http://<host>:<api_port>/management.html`
3. 输入管理密钥并连接

页面会根据当前地址自动推断 API 地址，也支持手动修改。

### 方式 B：本地开发

```bash
npm install
npm run dev
```

打开 `http://localhost:5173`，再连接到你的 CLI Proxy API 后端实例。

### 方式 C：构建单文件 HTML

```bash
npm install
npm run build
```

- 构建产物：`dist/index.html`
- 发布流程中会重命名为 `management.html`
- 本地预览：`npm run preview`

提示：直接用 `file://` 打开 `dist/index.html` 可能遇到浏览器 CORS 限制，建议通过静态服务器访问。

## 连接说明

### API 地址

以下格式均可，Web UI 会自动归一化：

- `localhost:8317`
- `http://192.168.1.10:8317`
- `https://example.com:8317`
- `http://example.com:8317/v0/management`

### 管理密钥

管理密钥会以如下方式随请求发送：

- `Authorization: Bearer <MANAGEMENT_KEY>`

这与 Web UI 中 `API Keys` 页面管理的代理 `api-keys` 不同，后者用于代理对外接口的客户端鉴权。

### 远程管理

从非 localhost 浏览器访问时，服务端通常需要开启远程管理，例如 `allow-remote-management: true`。

## 功能一览

- **仪表盘**：连接状态、服务版本/构建时间、关键数量概览、可用模型概览
- **基础设置**：调试、代理 URL、请求重试、配额回退、使用统计、请求日志、文件日志、WebSocket 鉴权
- **API Keys**：管理代理 `api-keys`
- **AI 提供商**：Gemini/Codex/Claude/Vertex/OpenAI 兼容提供商/Ampcode 等配置
- **认证文件**：上传/下载/删除 JSON 凭据、筛选搜索、runtime-only 标记、OAuth 排除模型、模型别名映射
- **OAuth**：发起 OAuth/设备码流程、轮询状态、处理回调参数
- **配额管理**：查看和刷新 Claude、Antigravity、Codex、Gemini CLI、Kimi 等额度信息
- **使用统计**：请求量、Token、RPM/TPM、模型维度统计、费用估算
- **配置文件**：在线编辑 `/config.yaml`
- **日志**：增量拉取、自动刷新、搜索、隐藏管理流量、清空日志、下载错误日志
- **系统信息**：快捷链接、模型分组展示、版本检查

## 近期改动

- **认证文件管理增强**：新增账号筛选、独立 `message` 筛选、快捷消息筛选（`usage_limit_reached` / `invalidated`），并支持同时匹配额度卡片中的配额内容
- **配额刷新能力增强**：支持单账号刷新配额、批量刷新选中配额，并将配额结果持久化到浏览器本地缓存
- **批量操作增强**：新增页头快捷按钮，支持全选/取消选择、删除选中、刷新选中配额；Codex 过滤下的批量删除文案调整为“清空 Codex”
- **认证文件卡片优化**：缩小卡片尺寸与高度，普通模式下自适应填满面板，每页最多不超过 16 个账户，非简略模式额外多展示一行
- **版本展示修正**：管理中心版本在系统信息页统一显示为 `V1.1.3`
- **构建产物增强**：支持构建单文件版本，便于发布为 `management.html`

## 技术栈

- React 19 + TypeScript 5.9
- Vite 7
- Zustand
- Axios
- react-router-dom v7
- Chart.js
- CodeMirror 6
- SCSS Modules
- i18next

## 多语言支持

当前界面支持：

- 简体中文（zh-CN）
- English（en）
- Русский（ru）

## 构建与发布

- Vite 输出单文件 `dist/index.html`
- 打 `vX.Y.Z` 标签会触发 `.github/workflows/release.yml` 发布 `dist/management.html`
- UI 版本号在构建期注入，优先级为：`VERSION` 环境变量 -> git tag -> `package.json`

## 安全提示

- 管理密钥会存入浏览器 `localStorage`，并做轻量混淆；仍应视为敏感信息
- 开启远程管理时请谨慎评估暴露面，建议使用独立浏览器配置进行管理

## 常见问题

- **无法连接 / 401**：确认 API 地址与管理密钥，远程访问时确认服务端已开启远程管理
- **日志页面不显示**：需要在基础设置中开启写入日志文件
- **部分功能提示不支持**：通常是后端版本较旧或接口未启用
- **OpenAI 提供商测试失败**：浏览器侧测试受网络与 CORS 影响，不等于服务端不可用

## 开发命令

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run format
npm run type-check
```

## 许可证

MIT
