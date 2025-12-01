# 自动备份配置

## 端点信息

```http
POST /database/{db_name}/backup/auto
Authorization: Bearer your_api_key
Content-Type: application/json
```

配置数据库的自动备份策略。

## 权限要求
- `auto_backup` 权限
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
  "schedule": "daily",
  "retention_days": 30,
  "compress": true,
  "backup_name": "auto_backup"
}
```

### 请求字段说明

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|---------|------|
| `schedule` | string | 是 | - | 备份计划：daily, weekly, monthly |
| `retention_days` | integer | 否 | 30 | 备份保留天数 |
| `compress` | boolean | 否 | true | 是否压缩备份文件 |
| `backup_name` | string | 否 | auto | 备份名称前缀 |

## 响应

### 成功响应
**状态码:** `200 OK`

```json
{
  "success": true,
  "message": "自动备份配置已保存",
  "config": {
    "database": "my_database",
    "schedule": "daily",
    "retention_days": 30,
    "enabled": true,
    "next_backup_time": "2024-01-21T02:00:00",
    "compress": true,
    "backup_name": "auto_backup"
  }
}
```

### 响应字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `success` | boolean | 操作是否成功 |
| `message` | string | 操作结果消息 |
| `config` | object | 自动备份配置信息 |

#### 配置信息
| 字段 | 类型 | 说明 |
|------|------|------|
| `database` | string | 数据库名称 |
| `schedule` | string | 备份计划 |
| `retention_days` | integer | 保留天数 |
| `enabled` | boolean | 是否启用 |
| `next_backup_time` | string | 下次备份时间 |
| `compress` | boolean | 是否压缩 |
| `backup_name` | string | 备份名称 |

## 使用示例

### cURL 示例

**每日备份配置:**
```bash
curl -X POST https://dbapi.muzilix.cn/database/my_database/backup/auto \
  -H "Authorization: Bearer your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "schedule": "daily",
    "retention_days": 30,
    "compress": true,
    "backup_name": "daily_auto"
  }'
```

**每周备份配置:**
```bash
curl -X POST https://dbapi.muzilix.cn/database/my_database/backup/auto \
  -H "Authorization: Bearer your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "schedule": "weekly",
    "retention_days": 90,
    "compress": true,
    "backup_name": "weekly_auto"
  }'
```

### Python 示例
```python
def configure_auto_backup(api_key, db_name, config):
    """配置自动备份"""
    url = f"https://dbapi.muzilix.cn/database/{db_name}/backup/auto"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    response = requests.post(url, headers=headers, json=config)
    return response.json()

def setup_production_backup_strategy(api_key):
    """设置生产环境备份策略"""
    # 关键业务数据库 - 每日备份，保留90天
    critical_dbs = ["users_db", "orders_db", "payments_db"]
    
    for db_name in critical_dbs:
        config = {
            "schedule": "daily",
            "retention_days": 90,
            "compress": True,
            "backup_name": f"prod_daily_{db_name}"
        }
        
        result = configure_auto_backup(api_key, db_name, config)
        if result["success"]:
            print(f"✅ {db_name}: 自动备份配置成功")
        else:
            print(f"❌ {db_name}: 配置失败 - {result.get('error')}")

def setup_development_backup_strategy(api_key):
    """设置开发环境备份策略"""
    # 开发数据库 - 每周备份，保留30天
    dev_dbs = ["dev_users", "dev_analytics", "test_data"]
    
    for db_name in dev_dbs:
        config = {
            "schedule": "weekly", 
            "retention_days": 30,
            "compress": True,
            "backup_name": f"dev_weekly_{db_name}"
        }
        
        result = configure_auto_backup(api_key, db_name, config)
        if result["success"]:
            print(f"✅ {db_name}: 开发环境备份配置成功")

# 使用示例
setup_production_backup_strategy("your_api_key")
setup_development_backup_strategy("your_api_key")
```

## 备份计划选项

### daily（每日）
- 每天固定时间执行备份
- 适合关键业务数据
- 保留策略：7-90天

### weekly（每周）
- 每周执行一次备份
- 适合开发测试环境
- 保留策略：30-180天

### monthly（每月）
- 每月执行一次备份
- 适合归档数据
- 保留策略：90-365天

## 备份策略建议

### 生产环境策略
```python
def production_backup_policy():
    """生产环境备份策略建议"""
    return {
        "critical": {
            "schedule": "daily",
            "retention_days": 90,
            "description": "关键业务数据，每日备份保留3个月"
        },
        "important": {
            "schedule": "daily", 
            "retention_days": 30,
            "description": "重要数据，每日备份保留1个月"
        },
        "normal": {
            "schedule": "weekly",
            "retention_days": 90,
            "description": "普通数据，每周备份保留3个月"
        }
    }

# 应用生产环境策略
policy = production_backup_policy()
for db_category, config in policy.items():
    print(f"{db_category}: {config['description']}")
```

### 多层级备份策略
```python
def implement_tiered_backup_strategy(api_key, databases_config):
    """实施多层级备份策略"""
    results = []
    
    for db_name, strategy in databases_config.items():
        config = {
            "schedule": strategy["schedule"],
            "retention_days": strategy["retention_days"],
            "compress": True,
            "backup_name": f"{strategy['tier']}_{db_name}"
        }
        
        result = configure_auto_backup(api_key, db_name, config)
        results.append({
            "database": db_name,
            "strategy": strategy,
            "result": result
        })
    
    return results

# 配置示例
databases_config = {
    "production_users": {
        "tier": "critical",
        "schedule": "daily",
        "retention_days": 90
    },
    "production_analytics": {
        "tier": "important", 
        "schedule": "daily",
        "retention_days": 30
    },
    "development_test": {
        "tier": "normal",
        "schedule": "weekly",
        "retention_days": 30
    }
}

results = implement_tiered_backup_strategy("your_api_key", databases_config)
for result in results:
    status = "✅" if result["result"]["success"] else "❌"
    print(f"{status} {result['database']}: {result['strategy']['tier']}级备份")
```

## 监控和管理

### 备份策略检查
```python
def verify_backup_strategies(api_key, expected_strategies):
    """验证备份策略是否符合预期"""
    from datetime import datetime, timedelta
    
    issues = []
    
    for db_name, expected in expected_strategies.items():
        # 获取备份任务列表
        tasks = get_backup_tasks(api_key, db_name)
        
        if "error" in tasks:
            issues.append(f"{db_name}: 无法获取备份信息 - {tasks['error']}")
            continue
        
        completed_backups = [t for t in tasks["tasks"] if t["status"] == "completed"]
        
        if not completed_backups:
            issues.append(f"{db_name}: 没有完成的备份")
            continue
        
        # 检查最新备份时间
        latest_backup = max(completed_backups, key=lambda x: x.get("created_time", ""))
        backup_time = datetime.fromisoformat(latest_backup["created_time"].replace('Z', '+00:00'))
        
        # 根据预期策略检查时效性
        if expected["schedule"] == "daily":
            max_age = timedelta(days=1)
        elif expected["schedule"] == "weekly":
            max_age = timedelta(days=7)
        else:  # monthly
            max_age = timedelta(days=30)
        
        if datetime.now() - backup_time > max_age:
            issues.append(f"{db_name}: 备份已过期 ({backup_time.strftime('%Y-%m-%d %H:%M')})")
    
    return issues

# 使用示例
expected_strategies = {
    "production_db": {"schedule": "daily"},
    "analytics_db": {"schedule": "daily"},
    "archive_db": {"schedule": "weekly"}
}

issues = verify_backup_strategies("your_api_key", expected_strategies)
if issues:
    print("⚠️  备份策略问题:")
    for issue in issues:
        print(f"  - {issue}")
else:
    print("✅ 所有备份策略正常")
```

## 限制说明

### 操作限制
- 频率限制：1次/天
- 最大保留天数：365天
- 需要数据库写权限

### 系统要求
- 需要系统定时任务支持
- 足够的磁盘空间
- 稳定的网络连接

## 相关链接

- [备份恢复总览](../backup-recovery/index.md)
- [创建备份](backup-database.md)
- [备份状态](backup-status.md)
- [备份列表](list-backups.md)
- [监控统计](../../api/monitoring-stats/)