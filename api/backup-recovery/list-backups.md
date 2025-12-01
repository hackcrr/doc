# 获取备份列表

## 端点信息

```http
GET /database/{db_name}/backups
Authorization: Bearer your_api_key
```

获取指定数据库的所有备份文件列表和信息。

## 权限要求
- `list_backups` 权限
- 对目标数据库的 `read` 权限

## 请求

### 请求头
| 头部 | 值 | 必填 |
|------|-----|------|
| `Authorization` | `Bearer your_api_key` | 是 |

### 路径参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `db_name` | string | 是 | 数据库名称 |

## 响应

### 成功响应
**状态码:** `200 OK`

```json
{
  "database": "my_database",
  "backup_count": 3,
  "backups": [
    {
      "filename": "admin_my_database_manual_backup_2024_20240120_143000.sql.gz",
      "filepath": "/backups/admin_my_database_manual_backup_2024_20240120_143000.sql.gz",
      "size": 1572864,
      "size_human": "1.50 MB",
      "created_time": "2024-01-20T14:30:00",
      "modified_time": "2024-01-20T14:35:00",
      "compressed": true,
      "backup_type": "manual",
      "timestamp": "20240120_143000"
    },
    {
      "filename": "admin_my_database_auto_backup_20240119_020000.sql",
      "filepath": "/backups/admin_my_database_auto_backup_20240119_020000.sql",
      "size": 2097152,
      "size_human": "2.00 MB",
      "created_time": "2024-01-19T02:00:00",
      "modified_time": "2024-01-19T02:05:00",
      "compressed": false,
      "backup_type": "auto",
      "timestamp": "20240119_020000"
    }
  ]
}
```

### 响应字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `database` | string | 数据库名称 |
| `backup_count` | integer | 备份文件数量 |
| `backups` | array | 备份文件列表 |

#### 备份文件信息
| 字段 | 类型 | 说明 |
|------|------|------|
| `filename` | string | 备份文件名 |
| `filepath` | string | 文件完整路径 |
| `size` | integer | 文件大小（字节） |
| `size_human` | string | 人类可读的文件大小 |
| `created_time` | string | 文件创建时间 |
| `modified_time` | string | 文件修改时间 |
| `compressed` | boolean | 是否压缩 |
| `backup_type` | string | 备份类型 |
| `timestamp` | string | 时间戳标识 |

## 使用示例

### cURL 示例
```bash
curl -X GET https://dbapi.muzilix.cn/database/my_database/backups \
  -H "Authorization: Bearer your_api_key"
```

### Python 示例
```python
def list_database_backups(api_key, db_name):
    """获取数据库备份列表"""
    url = f"https://dbapi.muzilix.cn/database/{db_name}/backups"
    headers = {"Authorization": f"Bearer {api_key}"}
    
    response = requests.get(url, headers=headers)
    return response.json()

def analyze_backup_storage(api_key, db_name):
    """分析备份存储使用情况"""
    backups_data = list_database_backups(api_key, db_name)
    
    if "error" in backups_data:
        print(f"错误: {backups_data['error']}")
        return
    
    print(f"数据库: {backups_data['database']}")
    print(f"备份数量: {backups_data['backup_count']}")
    
    total_size = 0
    compressed_count = 0
    
    print("\n📊 备份文件列表:")
    for backup in backups_data["backups"]:
        print(f"\n📁 {backup['filename']}")
        print(f"   大小: {backup['size_human']}")
        print(f"   类型: {backup['backup_type']}")
        print(f"   压缩: {'是' if backup['compressed'] else '否'}")
        print(f"   创建时间: {backup['created_time']}")
        
        total_size += backup["size"]
        if backup["compressed"]:
            compressed_count += 1
    
    print(f"\n📈 统计信息:")
    print(f"   总存储空间: {format_size(total_size)}")
    print(f"   压缩备份: {compressed_count}/{backups_data['backup_count']}")

# 使用示例
backups = list_database_backups("your_api_key", "production_db")
analyze_backup_storage("your_api_key", "production_db")
```

## 备份类型说明

### 备份类型识别
从文件名解析备份类型：
- `manual` - 手动创建的备份
- `auto` - 自动备份任务创建
- `pre_deployment` - 部署前备份
- 其他自定义类型

### 文件命名模式
备份文件遵循特定命名模式，便于识别：
```
{用户名}_{数据库名}_{类型}_{时间戳}.{扩展名}
```

## 备份管理

### 存储分析
```python
def find_largest_backups(api_key, db_name, limit=5):
    """查找最大的备份文件"""
    backups_data = list_database_backups(api_key, db_name)
    
    if "error" in backups_data:
        return []
    
    # 按文件大小排序
    sorted_backups = sorted(backups_data["backups"], key=lambda x: x["size"], reverse=True)
    return sorted_backups[:limit]

def find_old_backups(api_key, db_name, days_threshold=30):
    """查找旧的备份文件"""
    backups_data = list_database_backups(api_key, db_name)
    
    if "error" in backups_data:
        return []
    
    from datetime import datetime, timedelta
    cutoff_date = datetime.now() - timedelta(days=days_threshold)
    
    old_backups = []
    for backup in backups_data["backups"]:
        created_time = datetime.fromisoformat(backup["created_time"].replace('Z', '+00:00'))
        if created_time < cutoff_date:
            old_backups.append(backup)
    
    return old_backups

# 使用示例
largest_backups = find_largest_backups("your_api_key", "analytics_db", 3)
print("最大的备份文件:")
for backup in largest_backups:
    print(f"  {backup['filename']} - {backup['size_human']}")

old_backups = find_old_backups("your_api_key", "analytics_db", 60)
print(f"\n超过60天的旧备份: {len(old_backups)} 个")
```

### 备份清理建议
```python
def suggest_backup_cleanup(api_key, db_name):
    """提供备份清理建议"""
    backups_data = list_database_backups(api_key, db_name)
    
    if "error" in backups_data:
        return
    
    total_count = backups_data["backup_count"]
    max_backups = 10  # 建议保留的最大备份数
    
    if total_count > max_backups:
        print(f"⚠️  备份数量 ({total_count}) 超过建议值 ({max_backups})")
        
        # 按时间排序，建议删除最旧的
        sorted_backups = sorted(backups_data["backups"], key=lambda x: x["created_time"])
        old_backups = sorted_backups[:total_count - max_backups]
        
        print("建议删除的旧备份:")
        for backup in old_backups:
            print(f"  - {backup['filename']} ({backup['created_time']})")

# 使用示例
suggest_backup_cleanup("your_api_key", "production_db")
```

## 文件信息

### 时间信息
- `created_time`: 文件创建时间（ISO 8601 格式）
- `modified_time`: 最后修改时间
- `timestamp`: 从文件名提取的时间戳标识

### 大小信息
- `size`: 原始字节数
- `size_human`: 格式化的大小（KB, MB, GB）

## 相关链接

- [备份恢复总览](../backup-recovery/index.md)
- [创建备份](backup-database.md)
- [下载备份](download-backup.md)
- [删除备份](delete-backup.md)
- [备份状态](backup-status.md)