# 创建数据库备份

## 端点信息

```http
POST /database/{db_name}/backup
Authorization: Bearer your_api_key
Content-Type: application/json
```

创建指定数据库的备份，支持多种备份方法和选项。

## 权限要求
- `backup_database` 权限
- 对目标数据库的 `write` 权限

## 请求

### 请求头
| 头部 | 值 | 必填 |
|------|-----|------|
| `Authorization` | `Bearer your_api_key` | 是 |
| `Content-Type` | `application/json` | 是 |

### 路径参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `db_name` | string | 是 | 数据库名称 |

### 请求体
```json
{
  "backup_name": "manual_backup_2024",
  "compress": true,
  "include_data": true,
  "include_structure": true,
  "method": "auto"
}
```

### 请求字段说明

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|---------|------|
| `backup_name` | string | 否 | 自动生成 | 备份名称 |
| `compress` | boolean | 否 | `true` | 是否压缩备份文件 |
| `include_data` | boolean | 否 | `true` | 是否包含数据 |
| `include_structure` | boolean | 否 | `true` | 是否包含表结构 |
| `method` | string | 否 | `auto` | 备份方法：auto, python, mysqldump |

## 响应

### 成功响应
**状态码:** `202 Accepted`

```json
{
  "success": true,
  "message": "备份任务已启动",
  "backup": {
    "backup_id": "admin_my_database_manual_backup_2024_20240120_143000.sql.gz",
    "database": "my_database",
    "filename": "admin_my_database_manual_backup_2024_20240120_143000.sql.gz",
    "status": "started",
    "method": "python",
    "start_time": "2024-01-20T14:30:00",
    "backup_path": "/backups/admin_my_database_manual_backup_2024_20240120_143000.sql.gz",
    "compress": true
  }
}
```

### 响应字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `success` | boolean | 操作是否成功 |
| `message` | string | 操作结果消息 |
| `backup` | object | 备份任务信息 |

#### 备份任务信息
| 字段 | 类型 | 说明 |
|------|------|------|
| `backup_id` | string | 备份任务ID |
| `database` | string | 数据库名称 |
| `filename` | string | 备份文件名 |
| `status` | string | 备份状态 |
| `method` | string | 使用的备份方法 |
| `start_time` | string | 开始时间 |
| `backup_path` | string | 备份文件路径 |
| `compress` | boolean | 是否压缩 |

## 使用示例

### cURL 示例 - 基础备份
```bash
curl -X POST https://dbapi.muzilix.cn/database/my_database/backup \
  -H "Authorization: Bearer your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "backup_name": "pre_deployment",
    "compress": true
  }'
```

### cURL 示例 - 高级选项
```bash
curl -X POST https://dbapi.muzilix.cn/database/my_database/backup \
  -H "Authorization: Bearer your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "backup_name": "structure_only",
    "compress": false,
    "include_data": false,
    "include_structure": true,
    "method": "python"
  }'
```

### Python 示例
```python
def create_database_backup(api_key, db_name, backup_config=None):
    """创建数据库备份"""
    url = f"https://dbapi.muzilix.cn/database/{db_name}/backup"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    if backup_config is None:
        backup_config = {}
    
    response = requests.post(url, headers=headers, json=backup_config)
    return response.json()

# 基础备份
basic_backup = create_database_backup("your_api_key", "production_db")

# 自定义备份
custom_backup = create_database_backup("your_api_key", "analytics_db", {
    "backup_name": "weekly_full",
    "compress": True,
    "include_data": True,
    "include_structure": True,
    "method": "auto"
})

# 仅结构备份
structure_backup = create_database_backup("your_api_key", "development_db", {
    "backup_name": "schema_only",
    "include_data": False,
    "include_structure": True
})
```

## 备份方法

### auto（自动选择）
系统自动选择可用的备份方法：
- 优先使用 `mysqldump`（如果可用）
- 回退到 `python` 方法

### python（Python 实现）
使用纯 Python 实现的备份：
- 不依赖外部工具
- 生成标准 SQL 格式
- 支持所有 MySQL 功能

### mysqldump（MySQL 工具）
使用 MySQL 官方工具：
- 高性能备份
- 支持高级选项
- 需要系统安装 mysqldump

## 备份内容

### 完整备份
包含数据库的所有内容：
- 表结构（CREATE TABLE）
- 表数据（INSERT 语句）
- 存储过程和函数
- 事件和触发器

### 结构备份
仅包含数据库结构：
- 表结构定义
- 索引和约束
- 存储过程定义
- 不包含实际数据

### 数据备份
仅包含表数据：
- 所有表的 INSERT 语句
- 不包含表结构定义
- 适合数据迁移

## 文件命名规则

### 自动生成格式
```
{用户名}_{数据库名}_backup_{时间戳}.{扩展名}
```

### 自定义名称格式
```
{用户名}_{数据库名}_{备份名}_{时间戳}.{扩展名}
```

### 扩展名
- 未压缩: `.sql`
- 压缩: `.sql.gz`

## 备份状态

### 任务状态
- `started` - 备份任务已接受
- `processing` - 备份执行中
- `completed` - 备份完成
- `failed` - 备份失败

### 状态检查
备份任务提交后，使用以下接口检查状态：
```http
GET /database/{db_name}/backup/{backup_id}/status
```

## 限制说明

### 操作限制
- 频率限制：3次/小时
- 备份超时：300秒（5分钟）
- 文件大小：受磁盘空间限制

### 系统要求
- Python 备份：无需额外依赖
- mysqldump 备份：需要系统安装 MySQL 客户端工具

## 相关链接

- [备份恢复总览](../backup-recovery/index.md)
- [备份状态](backup-status.md)
- [备份列表](list-backups.md)
- [下载备份](download-backup.md)