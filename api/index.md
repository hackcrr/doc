# API 参考

## 概述

数据库管理 API 提供完整的 MySQL 数据库操作接口，支持数据库管理、表操作、数据查询、备份恢复等功能。

## 快速开始

### 基础请求格式
```http
GET /health
Authorization: Bearer your_api_key
Content-Type: application/json
```

### 响应格式
```json
{
  "success": true,
  "data": {...},
  "message": "操作成功"
}
```

## API 分类

### 🔍 健康检查
- [`GET /health`](health/health-check.md) - 服务健康状态检查

### 🗄️ 数据库管理
- [`POST /create`](database-management/create-database.md) - 创建数据库
- [`GET /databases`](database-management/list-databases.md) - 列出所有数据库  
- [`DELETE /database/{db_name}`](database-management/delete-database.md) - 删除数据库
- [`GET /database/{db_name}/info`](database-management/database-info.md) - 数据库详细信息
<!-- - [`GET /debug/database/{db_name}`](database-management/debug-database.md) - 调试数据库信息 -->

### 📊 表操作
- [`GET /database/{db_name}/tables`](table-operations/list-tables.md) - 获取数据库表列表
- [`POST /database/{db_name}/table`](table-operations/create-table.md) - 创建数据表
- [`GET /database/{db_name}/table/{table_name}/structure`](table-operations/table-structure.md) - 获取表结构

### 💾 数据操作
- [`POST /database/{db_name}/table/{table_name}/data`](data-operations/insert-data.md) - 插入数据
- [`GET /database/{db_name}/table/{table_name}/data`](data-operations/query-data.md) - 查询数据
- [`POST /database/{db_name}/query`](data-operations/execute-query.md) - 执行SQL查询
- [`GET /database/{db_name}/tables-info`](data-operations/query-table-info.md) - 获取所有表信息

### ⚡ 批量操作
- [`POST /database/{db_name}/batch/update`](batch-operations/batch-update.md) - 批量更新数据
- [`POST /database/{db_name}/batch/delete`](batch-operations/batch-delete.md) - 批量删除数据
- [`POST /database/{db_name}/export`](batch-operations/export-data.md) - 导出数据(CSV/JSON)
- [`POST /database/{db_name}/import`](batch-operations/import-data.md) - 导入数据
- [`GET /download/export/{filename}`](batch-operations/download-export.md) - 下载导出文件

### 💽 备份恢复
- [`POST /database/{db_name}/backup`](backup-recovery/backup-database.md) - 创建数据库备份
- [`GET /database/{db_name}/backups`](backup-recovery/list-backups.md) - 获取备份列表
- [`GET /backup/{filename}`](backup-recovery/download-backup.md) - 下载备份文件
- [`DELETE /backup/{filename}`](backup-recovery/delete-backup.md) - 删除备份文件
- [`POST /database/{db_name}/backup/auto`](backup-recovery/auto-backup.md) - 配置自动备份
- [`GET /database/{db_name}/backup/{backup_id}/status`](backup-recovery/backup-status.md) - 备份任务状态
- [`GET /database/{db_name}/backup/tasks`](backup-recovery/backup-status.md) - 备份任务列表

### 📈 监控统计
- [`GET /stats/database`](monitoring-stats/database-stats.md) - 数据库统计概览
- [`GET /stats/database/{db_name}`](monitoring-stats/database-stats.md) - 单个数据库统计
- [`GET /stats/performance`](monitoring-stats/performance-stats.md) - 数据库性能统计
- [`GET /stats/query-analysis`](monitoring-stats/query-analysis.md) - 查询分析统计
- [`GET /stats/api-usage`](monitoring-stats/api-usage-stats.md) - API使用统计
- [`GET /stats/system`](monitoring-stats/system-stats.md) - 系统统计信息
- [`GET /stats/summary`](monitoring-stats/stats-summary.md) - 统计摘要

### 👥 用户管理
#### 认证相关
- [`POST /auth/login`](user-management/auth-login.md) - 用户登录
- [`POST /auth/register`](user-management/auth-register.md) - 用户注册
- [`POST /auth/logout`](user-management/auth-logout.md) - 用户登出
- [`GET /auth/profile`](user-management/auth-profile.md) - 获取用户信息
- [`POST /auth/change-password`](user-management/change-password.md) - 修改密码

#### 管理员功能
- [`POST /admin/users`](user-management/admin-users.md) - 创建用户
- [`GET /admin/users`](user-management/admin-users.md) - 列出所有用户
- [`PUT /admin/users/{user_id}`](user-management/admin-users.md) - 更新用户信息
- [`DELETE /admin/users/{user_id}`](user-management/admin-users.md) - 删除用户
- [`GET /admin/api-keys`](user-management/admin-api-keys.md) - 列出API密钥
- [`POST /admin/users/{user_id}/reset-password`](user-management/admin-users.md) - 重置用户密码
- [`POST /admin/database-permissions`](user-management/database-permissions.md) - 授予数据库权限

#### 用户功能
- [`GET /user/databases`](user-management/database-permissions.md) - 获取用户数据库列表

<!-- ### 🛠️ 工具接口
- [`GET /database/{db_name}/tables-info`](tools/tables-info.md) - 获取表信息(辅助SQL编写)
- [`GET /database/{db_name}/query-examples`](tools/query-examples.md) - 获取查询示例 -->

## 通用规范

### 认证方式
```http
Authorization: Bearer your_api_key
```

### 错误响应
```json
{
  "error": "错误描述",
  "code": "错误代码(可选)"
}
```

### 分页响应
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "page_size": 20,
    "total_count": 100,
    "total_pages": 5
  }
}
```

## 状态码说明

| 状态码 | 说明 |
|--------|------|
| 200 | 成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 认证失败 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 409 | 资源冲突 |
| 429 | 请求过于频繁 |
| 500 | 服务器内部错误 |

## 下一步

- 📖 查看 [使用指南](/guide/)
- 🔧 学习 [使用示例](/examples/query-examples.md)
- 📚 参考 [完整文档](/reference/)