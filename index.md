---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "数据库管理 API"
  text: "专业的 MySQL 数据库管理接口"
  tagline: 提供完整的数据库 CRUD 操作、备份恢复、监控统计等功能
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/quick-start
    - theme: alt
      text: API 文档
      link: /api/

features:
  - title: 完整的数据库管理
    details: 支持数据库创建、删除、表管理、数据操作等完整功能
    icon: 🗄️
  - title: 安全的权限控制
    details: 基于角色的权限管理系统，支持细粒度的数据库访问控制
    icon: 🔒
  - title: 实时监控统计
    details: 提供数据库性能监控、API 使用统计、系统状态等实时数据
    icon: 📊
  - title: 备份与恢复
    details: 支持自动备份、手动备份、备份下载和恢复功能
    icon: 💾
  - title: 批量操作
    details: 支持批量插入、更新、删除、数据导入导出等高效操作
    icon: ⚡
  - title: RESTful API
    details: 标准的 RESTful 接口设计，支持 JSON 格式数据交换
    icon: 🔄
---

## 核心功能

### 🛡️ 安全认证
- JWT Token 认证机制
- 基于角色的权限控制 (readonly, operator, admin, superadmin)
- API 密钥管理
- 操作审计日志

### 📊 数据操作
- 完整的 CRUD 操作
- 复杂查询支持
- 事务处理
- 数据导入导出 (CSV/JSON)

### 🔧 管理功能
- 多数据库支持
- 用户管理
- 备份策略配置
- 性能监控

### 🚀 快速开始

```bash
# 1. 测试连接
curl -X GET https://dbapi.muzilix.cn/health \

# 2. 注册用户
curl -X POST "https://dbapi.muzilix.cn/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "password": "password123",
    "email": "user@example.com"
  }'
# 3. 获取 API 密钥
curl -X POST https://dbapi.muzilix.cn/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'