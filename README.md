## 简介

本仓库是 **数据库管理 API** 的文档站点，基于 **VitePress** 构建，主要用于说明一个支持 MySQL 的数据库管理服务，包括：

- **数据库 / 表 / 数据操作**（CRUD、复杂查询、批量导入导出等）
- **备份与恢复**（自动备份、备份状态、备份任务列表等）
- **监控统计**（数据库统计、性能、查询分析、API 使用、系统状态等）
- **用户与权限管理**（认证、角色、权限矩阵、管理员功能等）
- **AI 增强 (Beta)**（AI 路由、AI 执行、自然语言执行等实验性能力）

线上文档地址（如已部署）：`https://doc.muzilix.cn`

## 本地开发

在项目根目录 `doc/` 下执行：

```bash
# 安装依赖
npm install

# 启动本地文档站（默认端口 3000，在 config.mts 中配置）
npm run docs:dev

# 构建静态站点
npm run docs:build

# 预览构建结果
npm run docs:preview
```

启动后在浏览器打开终端输出的本地地址（例如 `http://localhost:3000`），即可查看文档。

## 目录结构

```text
doc
├─ .vitepress/          # VitePress 配置与主题
│  ├─ components/       # 自定义组件（如 ApiEndpoint.vue）
│  ├─ theme/            # 主题入口与样式
│  ├─ types/            # TypeScript 类型与 API_ENDPOINTS 定义
│  └─ config.mts        # VitePress 站点配置
├─ api/                 # 按模块划分的 API 文档
│  ├─ backup-recovery/  # 备份与恢复相关接口
│  ├─ batch-operations/ # 批量操作相关接口
│  ├─ data-operations/  # 数据操作相关接口
│  ├─ database-management/ # 数据库管理相关接口
│  ├─ health/           # 健康检查接口
│  ├─ monitoring-stats/ # 监控统计相关接口
│  ├─ table-operations/ # 表操作相关接口
│  ├─ user-management/  # 用户与权限管理相关接口
│  ├─ ai-beta/          # AI 增强 (Beta) 实验性接口文档
│  └─ index.md          # API 总览与分类入口
├─ guide/               # 使用指南（快速开始、认证、安全、最佳实践等）
├─ examples/            # 使用示例（查询示例等）
├─ reference/           # 参考手册（错误码、权限矩阵、SQL 指南、API 限制等）
├─ api-examples.md      # 综合 API 调用示例
├─ index.md             # 文档首页（Home）
├─ markdown-examples.md # Markdown 书写示例
├─ package.json         # 项目配置与脚本
└─ package-lock.json    # 依赖锁定文件
```

## 主要文档入口

- **首页**：`/`（项目介绍与核心功能）
- **使用指南**：`/guide/`（快速开始、认证、安全、最佳实践）
- **API 参考**：`/api/`（所有接口分类与链接）
- **AI 增强 (Beta)**：`/api/` 中的 “AI 增强 (Beta)” 分组以及 `/api/ai-beta/*` 文档
- **示例**：`/examples/query-examples`
- **参考手册**：`/reference/`

## 备注

- AI 相关接口目前标记为 **Beta**，默认仅建议在测试环境或内网环境中使用。
- 如果你新增了接口或文档，请同步更新：
  - `api/index.md` 中的接口列表
  - `.vitepress/config.mts` 中的侧边栏配置
  - `.vitepress/types/api.ts` 中的 `API_ENDPOINTS` 定义（如需要在组件中复用）