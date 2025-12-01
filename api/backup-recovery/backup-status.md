# 备份状态

## 端点信息

```http
GET /database/{db_name}/backup/{backup_id}/status
Authorization: Bearer your_api_key
```

获取指定备份任务的状态信息。

```http
GET /database/{db_name}/backup/tasks
Authorization: Bearer your_api_key
```

获取数据库的所有备份任务状态列表。

## 权限要求
- `backup_status` 权限
- 对目标数据库的 `read` 权限

## 请求

### 单个备份状态

#### 请求头
| 头部 | 值 | 必填 |
|------|-----|------|
| `Authorization` | `Bearer your_api_key` | 是 |

#### 路径参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `db_name` | string | 是 | 数据库名称 |
| `backup_id` | string | 是 | 备份任务ID |

### 备份任务列表

#### 请求头
| 头部 | 值 | 必填 |
|------|-----|------|
| `Authorization` | `Bearer your_api_key` | 是 |

#### 路径参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `db_name` | string | 是 | 数据库名称 |

## 响应

### 单个备份状态响应

**状态码:** `200 OK`

```json
{
  "status": "completed",
  "filename": "admin_my_database_backup_20240120_143000.sql.gz",
  "size": 1572864,
  "size_human": "1.50 MB",
  "created_time": "2024-01-20T14:30:00",
  "modified_time": "2024-01-20T14:35:00",
  "message": "备份已完成"
}
```

**备份进行中:**
```json
{
  "status": "processing",
  "filename": "admin_my_database_backup_20240120_143000.sql.gz",
  "message": "备份任务正在进行中，请稍后刷新查看"
}
```

### 备份任务列表响应

**状态码:** `200 OK`

```json
{
  "database": "my_database",
  "task_count": 3,
  "tasks": [
    {
      "backup_id": "admin_my_database_backup_20240120_143000.sql.gz",
      "filename": "admin_my_database_backup_20240120_143000.sql.gz",
      "status": "completed",
      "database": "my_database",
      "size": 1572864,
      "size_human": "1.50 MB",
      "created_time": "2024-01-20T14:30:00",
      "message": "备份已完成"
    },
    {
      "backup_id": "admin_my_database_backup_20240120_144500.sql.gz",
      "filename": "admin_my_database_backup_20240120_144500.sql.gz",
      "status": "processing",
      "database": "my_database",
      "message": "备份任务正在进行中"
    }
  ]
}
```

### 响应字段说明

#### 单个备份状态
| 字段 | 类型 | 说明 |
|------|------|------|
| `status` | string | 备份状态 |
| `filename` | string | 备份文件名 |
| `size` | integer | 文件大小（字节） |
| `size_human` | string | 人类可读的文件大小 |
| `created_time` | string | 创建时间 |
| `modified_time` | string | 修改时间 |
| `message` | string | 状态消息 |

#### 任务列表
| 字段 | 类型 | 说明 |
|------|------|------|
| `database` | string | 数据库名称 |
| `task_count` | integer | 任务数量 |
| `tasks` | array | 备份任务列表 |

#### 任务信息
| 字段 | 类型 | 说明 |
|------|------|------|
| `backup_id` | string | 备份任务ID |
| `filename` | string | 备份文件名 |
| `status` | string | 备份状态 |
| `database` | string | 数据库名称 |
| `size` | integer | 文件大小（如有） |
| `size_human` | string | 人类可读的文件大小 |
| `created_time` | string | 创建时间 |
| `message` | string | 状态消息 |

## 使用示例

### cURL 示例

**获取单个备份状态:**
```bash
curl -X GET https://dbapi.muzilix.cn/database/my_database/backup/admin_my_database_backup_20240120_143000.sql.gz/status \
  -H "Authorization: Bearer your_api_key"
```

**获取备份任务列表:**
```bash
curl -X GET https://dbapi.muzilix.cn/database/my_database/backup/tasks \
  -H "Authorization: Bearer your_api_key"
```

### Python 示例
```python
def get_backup_status(api_key, db_name, backup_id):
    """获取备份任务状态"""
    url = f"https://dbapi.muzilix.cn/database/{db_name}/backup/{backup_id}/status"
    headers = {"Authorization": f"Bearer {api_key}"}
    
    response = requests.get(url, headers=headers)
    return response.json()

def get_backup_tasks(api_key, db_name):
    """获取备份任务列表"""
    url = f"https://dbapi.muzilix.cn/database/{db_name}/backup/tasks"
    headers = {"Authorization": f"Bearer {api_key}"}
    
    response = requests.get(url, headers=headers)
    return response.json()

def monitor_backup_progress(api_key, db_name, backup_id, max_attempts=30, interval=10):
    """监控备份进度"""
    import time
    
    for attempt in range(max_attempts):
        status = get_backup_status(api_key, db_name, backup_id)
        
        if status["status"] == "completed":
            print(f"✅ 备份完成: {status['filename']} ({status['size_human']})")
            return status
        elif status["status"] == "failed":
            print(f"❌ 备份失败: {status.get('message', '未知错误')}")
            return status
        else:
            print(f"⏳ 备份进行中... ({attempt + 1}/{max_attempts}) - {status['message']}")
            
            if attempt < max_attempts - 1:
                time.sleep(interval)
    
    print("⏰ 备份监控超时")
    return {"status": "timeout", "message": "监控超时"}

# 使用示例
# 监控特定备份
backup_id = "admin_production_backup_20240120_143000.sql.gz"
status = monitor_backup_progress("your_api_key", "production_db", backup_id)

# 查看所有备份任务
tasks = get_backup_tasks("your_api_key", "production_db")
print(f"数据库 {tasks['database']} 有 {tasks['task_count']} 个备份任务")

for task in tasks["tasks"]:
    status_icon = "✅" if task["status"] == "completed" else "⏳" if task["status"] == "processing" else "❌"
    size_info = f" - {task['size_human']}" if "size_human" in task else ""
    print(f"{status_icon} {task['filename']}{size_info}")
```

## 备份状态说明

### 状态类型
- `started` - 备份任务已启动
- `processing` - 备份执行中
- `completed` - 备份完成
- `failed` - 备份失败
- `timeout` - 备份超时

### 状态转换
```
started → processing → completed
                ↓
              failed
```

## 备份监控工具

### 实时监控面板
```python
def create_backup_dashboard(api_key, db_names):
    """创建备份监控面板"""
    print("🔍 备份监控面板")
    print("=" * 80)
    
    for db_name in db_names:
        tasks = get_backup_tasks(api_key, db_name)
        
        if "error" in tasks:
            print(f"❌ {db_name}: 获取任务失败 - {tasks['error']}")
            continue
        
        completed = [t for t in tasks["tasks"] if t["status"] == "completed"]
        processing = [t for t in tasks["tasks"] if t["status"] == "processing"]
        failed = [t for t in tasks["tasks"] if t["status"] == "failed"]
        
        print(f"\n📊 数据库: {db_name}")
        print(f"   总计: {tasks['task_count']} 个任务")
        print(f"   ✅ 完成: {len(completed)}")
        print(f"   ⏳ 进行中: {len(processing)}")
        print(f"   ❌ 失败: {len(failed)}")
        
        # 显示最新备份
        if completed:
            latest = max(completed, key=lambda x: x.get("created_time", ""))
            print(f"   最新备份: {latest['filename']} ({latest.get('size_human', 'N/A')})")

# 使用示例
databases = ["production_db", "analytics_db", "backup_db"]
create_backup_dashboard("your_api_key", databases)
```

### 备份健康检查
```python
def check_backup_health(api_key, db_name, expected_frequency_hours=24):
    """检查备份健康状况"""
    from datetime import datetime, timedelta
    
    tasks = get_backup_tasks(api_key, db_name)
    
    if "error" in tasks:
        return {"healthy": False, "error": tasks["error"]}
    
    completed_backups = [t for t in tasks["tasks"] if t["status"] == "completed"]
    
    if not completed_backups:
        return {"healthy": False, "message": "没有找到完成的备份"}
    
    # 找到最新备份
    latest_backup = max(completed_backups, key=lambda x: x.get("created_time", ""))
    latest_time = datetime.fromisoformat(latest_backup["created_time"].replace('Z', '+00:00'))
    
    # 检查备份时效性
    time_since_last_backup = datetime.now() - latest_time
    is_fresh = time_since_last_backup < timedelta(hours=expected_frequency_hours)
    
    health_status = {
        "healthy": is_fresh,
        "latest_backup": latest_backup["filename"],
        "backup_time": latest_backup["created_time"],
        "hours_since_backup": round(time_since_last_backup.total_seconds() / 3600, 1),
        "expected_frequency_hours": expected_frequency_hours,
        "total_backups": len(completed_backups)
    }
    
    if not is_fresh:
        health_status["warning"] = f"备份已过期 {health_status['hours_since_backup']} 小时"
    
    return health_status

# 使用示例
health = check_backup_health("your_api_key", "production_db", expected_frequency_hours=24)
if health["healthy"]:
    print(f"✅ 备份健康: 最新备份 {health['latest_backup']} ({health['hours_since_backup']} 小时前)")
else:
    print(f"⚠️  {health['warning']}")
```

## 错误处理

### 备份不存在
```json
{
  "status": "not_found",
  "message": "备份任务不存在"
}
```

### 权限不足
```json
{
  "error": "没有访问该备份的权限"
}
```

## 相关链接

- [备份恢复总览](../backup-recovery/index.md)
- [创建备份](backup-database.md)
- [备份列表](list-backups.md)
- [下载备份](download-backup.md)
- [删除备份](delete-backup.md)