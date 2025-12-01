# 备份恢复

## 概述

备份恢复 API 提供数据库的备份创建、管理、下载和恢复功能，支持手动备份、自动备份策略和备份状态监控。

## 接口列表

### 备份管理
- [`POST /database/{db_name}/backup`](backup-database.md) - 创建数据库备份
- [`GET /database/{db_name}/backups`](list-backups.md) - 获取备份列表
- [`GET /backup/{filename}`](download-backup.md) - 下载备份文件
- [`DELETE /backup/{filename}`](delete-backup.md) - 删除备份文件

### 备份状态
- [`GET /database/{db_name}/backup/{backup_id}/status`](backup-status.md) - 获取备份任务状态
- [`GET /database/{db_name}/backup/tasks`](backup-status.md) - 获取备份任务列表

### 自动备份
- [`POST /database/{db_name}/backup/auto`](auto-backup.md) - 配置自动备份

## 通用要求

### 认证
所有备份恢复接口都需要认证：
```http
Authorization: Bearer your_api_key
```

### 权限要求
- 创建备份：`backup_database` 权限 + 数据库 `write` 权限
- 查看备份：`list_backups` 权限 + 数据库 `read` 权限
- 下载备份：`download_backup` 权限 + 数据库 `read` 权限
- 删除备份：`delete_backup` 权限 + 数据库 `write` 权限
- 自动备份：`auto_backup` 权限 + 数据库 `write` 权限

## 备份类型

### 手动备份
- 按需创建数据库备份
- 支持自定义备份名称
- 可选择压缩和内容选项

### 自动备份
- 基于计划的定期备份
- 支持每日、每周、每月策略
- 自动清理旧备份文件

## 备份方法

### Python 备份
- 纯 Python 实现，不依赖外部工具
- 生成标准 SQL 格式备份
- 支持数据和结构分离备份

### mysqldump 备份
- 使用 MySQL 官方工具
- 高性能备份大型数据库
- 支持高级备份选项

## 备份文件

### 文件格式
- **未压缩**: `.sql` - 纯文本 SQL 文件
- **压缩**: `.sql.gz` - Gzip 压缩的 SQL 文件

### 文件命名
备份文件遵循统一的命名规范：
```
{用户名}_{数据库名}_{备份名}_{时间戳}.sql[.gz]
```

### 存储管理
- 存储目录：`/backups`
- 自动文件清理
- 用户隔离存储

## 备份选项

### 内容选项
- 包含表数据
- 包含表结构
- 包含存储过程和函数

### 压缩选项
- 启用 Gzip 压缩
- 减少存储空间占用
- 保持文件完整性

## 状态监控

### 备份状态
- `started` - 备份任务已启动
- `processing` - 备份进行中
- `completed` - 备份完成
- `failed` - 备份失败

### 任务跟踪
- 实时备份进度监控
- 备份任务历史记录
- 错误日志和诊断信息

## 安全特性

### 访问控制
- 用户只能访问自己的备份文件
- 数据库权限验证
- 文件下载权限检查

### 操作保护
- 备份文件完整性验证
- 操作频率限制
- 敏感信息保护

## 限制说明

### 操作限制
- 备份创建：3次/小时
- 自动备份：1次/天
- 文件下载：受网络带宽限制

### 存储限制
- 每个用户最大备份文件数：10个
- 自动清理旧备份文件
- 磁盘空间监控

## 下一步

- 💾 学习 [创建备份](backup-database.md)
- 📋 查看 [备份列表](list-backups.md)
- ⬇️ 了解 [下载备份](download-backup.md)
- 🗑️ 了解 [删除备份](delete-backup.md)
- 🔄 配置 [自动备份](auto-backup.md)
- 📊 监控 [备份状态](backup-status.md)