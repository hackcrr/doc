# 删除备份文件

## 端点信息

```http
DELETE /backup/{filename}
Authorization: Bearer your_api_key
```

删除指定的数据库备份文件。

## 权限要求
- `delete_backup` 权限
- 对备份文件所属数据库的 `write` 权限

## 请求

### 请求头
| 头部 | 值 | 必填 |
|------|-----|------|
| `Authorization` | `Bearer your_api_key` | 是 |

### 路径参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `filename` | string | 是 | 备份文件名 |

## 响应

### 成功响应
**状态码:** `200 OK`

```json
{
  "success": true,
  "message": "备份文件 admin_my_database_backup_20240120.sql.gz 已删除"
}
```

### 响应字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `success` | boolean | 操作是否成功 |
| `message` | string | 操作结果消息 |

## 使用示例

### cURL 示例
```bash
curl -X DELETE https://dbapi.muzilix.cn/backup/admin_my_database_backup_20240120.sql.gz \
  -H "Authorization: Bearer your_api_key"
```

### Python 示例
```python
def delete_backup_file(api_key, filename):
    """删除备份文件"""
    url = f"https://dbapi.muzilix.cn/backup/{filename}"
    headers = {"Authorization": f"Bearer {api_key}"}
    
    response = requests.delete(url, headers=headers)
    return response.json()

def cleanup_old_backups(api_key, db_name, days_threshold=30):
    """清理旧的备份文件"""
    # 获取备份列表
    backups_data = list_database_backups(api_key, db_name)
    
    if "error" in backups_data:
        return {"success": False, "error": backups_data["error"]}
    
    from datetime import datetime, timedelta
    cutoff_date = datetime.now() - timedelta(days=days_threshold)
    
    deleted_files = []
    errors = []
    
    for backup in backups_data["backups"]:
        created_time = datetime.fromisoformat(backup["created_time"].replace('Z', '+00:00'))
        
        if created_time < cutoff_date:
            print(f"删除旧备份: {backup['filename']} ({backup['created_time']})")
            result = delete_backup_file(api_key, backup["filename"])
            
            if result["success"]:
                deleted_files.append(backup["filename"])
            else:
                errors.append(f"{backup['filename']}: {result.get('error', '未知错误')}")
    
    return {
        "success": True,
        "deleted_count": len(deleted_files),
        "deleted_files": deleted_files,
        "errors": errors
    }

# 使用示例
# 删除特定备份文件
result = delete_backup_file("your_api_key", "admin_production_backup_20231201.sql.gz")
if result["success"]:
    print(f"删除成功: {result['message']}")

# 自动清理旧备份
cleanup_result = cleanup_old_backups("your_api_key", "production_db", days_threshold=60)
if cleanup_result["success"]:
    print(f"清理完成: 删除了 {cleanup_result['deleted_count']} 个旧备份")
    if cleanup_result["errors"]:
        print("删除失败的文件:")
        for error in cleanup_result["errors"]:
            print(f"  - {error}")
```

### JavaScript 示例
```javascript
async function deleteBackupFile(apiKey, filename) {
    const response = await fetch(`https://dbapi.muzilix.cn/backup/${filename}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${apiKey}`
        }
    });
    
    return await response.json();
}

// 使用示例
deleteBackupFile('your_api_key', 'admin_myapp_backup_20231215.sql.gz')
    .then(result => {
        if (result.success) {
            console.log('备份文件删除成功:', result.message);
        } else {
            console.log('删除失败:', result.error);
        }
    });
```

## 备份保留策略

### 基于时间的清理
```python
def implement_retention_policy(api_key, db_name):
    """实施备份保留策略"""
    backups_data = list_database_backups(api_key, db_name)
    
    if "error" in backups_data:
        return
    
    # 保留策略配置
    retention_rules = [
        {"days": 7, "keep": "all"},      # 7天内：保留所有备份
        {"days": 30, "keep": "daily"},   # 30天内：保留每日备份
        {"days": 365, "keep": "weekly"}, # 1年内：保留每周备份
        {"days": 9999, "keep": "monthly"} # 超过1年：保留每月备份
    ]
    
    from datetime import datetime, timedelta
    now = datetime.now()
    
    backups_by_date = {}
    for backup in backups_data["backups"]:
        created_time = datetime.fromisoformat(backup["created_time"].replace('Z', '+00:00'))
        date_key = created_time.date().isoformat()
        
        if date_key not in backups_by_date:
            backups_by_date[date_key] = []
        backups_by_date[date_key].append(backup)
    
    # 应用保留策略
    files_to_keep = set()
    
    for rule in retention_rules:
        cutoff_date = now - timedelta(days=rule["days"])
        
        for date_str, backups in backups_by_date.items():
            backup_date = datetime.fromisoformat(date_str).date()
            if backup_date >= cutoff_date.date():
                if rule["keep"] == "all":
                    files_to_keep.update(b["filename"] for b in backups)
                elif rule["keep"] == "daily":
                    # 保留每天的最新备份
                    latest = max(backups, key=lambda x: x["created_time"])
                    files_to_keep.add(latest["filename"])
                # 可以扩展其他保留策略
    
    # 删除不在保留列表中的文件
    deleted_count = 0
    for backup in backups_data["backups"]:
        if backup["filename"] not in files_to_keep:
            result = delete_backup_file(api_key, backup["filename"])
            if result["success"]:
                deleted_count += 1
                print(f"删除: {backup['filename']}")
    
    print(f"备份保留策略执行完成，删除了 {deleted_count} 个文件")
```

### 基于数量的清理
```python
def keep_latest_backups(api_key, db_name, max_count=10):
    """保留最新的 N 个备份文件"""
    backups_data = list_database_backups(api_key, db_name)
    
    if "error" in backups_data or backups_data["backup_count"] <= max_count:
        return {"success": True, "message": "无需清理"}
    
    # 按创建时间排序
    sorted_backups = sorted(backups_data["backups"], key=lambda x: x["created_time"], reverse=True)
    
    # 保留最新的 max_count 个文件
    backups_to_keep = sorted_backups[:max_count]
    backups_to_delete = sorted_backups[max_count:]
    
    deleted_files = []
    for backup in backups_to_delete:
        result = delete_backup_file(api_key, backup["filename"])
        if result["success"]:
            deleted_files.append(backup["filename"])
    
    return {
        "success": True,
        "kept_count": len(backups_to_keep),
        "deleted_count": len(deleted_files),
        "deleted_files": deleted_files
    }

# 使用示例
result = keep_latest_backups("your_api_key", "production_db", max_count=5)
if result["success"]:
    print(f"保留策略执行完成: 保留 {result['kept_count']} 个，删除 {result['deleted_count']} 个")
```

## 安全保护

### 操作验证
- 文件名格式验证，防止路径遍历
- 用户权限验证，只能删除自己的备份
- 文件存在性检查

### 限制说明
- 频率限制：10次/分钟
- 需要明确的删除权限
- 操作不可逆

## 批量删除管理

```python
def interactive_backup_cleanup(api_key, db_name):
    """交互式备份清理工具"""
    backups_data = list_database_backups(api_key, db_name)
    
    if "error" in backups_data:
        print(f"错误: {backups_data['error']}")
        return
    
    print(f"数据库 '{db_name}' 的备份文件:")
    print("-" * 80)
    
    for i, backup in enumerate(backups_data["backups"], 1):
        print(f"{i:2d}. {backup['filename']}")
        print(f"     大小: {backup['size_human']}, 创建时间: {backup['created_time']}")
    
    print("\n请输入要删除的备份编号（多个编号用逗号分隔，或 'all' 删除所有）:")
    selection = input().strip()
    
    if selection.lower() == 'all':
        # 删除所有备份
        confirm = input("确认删除所有备份？(y/N): ")
        if confirm.lower() == 'y':
            return delete_all_backups(api_key, db_name)
        else:
            print("操作取消")
            return
    
    try:
        indices = [int(idx.strip()) - 1 for idx in selection.split(',')]
        selected_backups = [backups_data["backups"][i] for i in indices if 0 <= i < len(backups_data["backups"])]
        
        if not selected_backups:
            print("没有选择有效的备份文件")
            return
        
        print("\n将要删除以下备份文件:")
        for backup in selected_backups:
            print(f"  - {backup['filename']}")
        
        confirm = input("\n确认删除？(y/N): ")
        if confirm.lower() == 'y':
            deleted_count = 0
            for backup in selected_backups:
                result = delete_backup_file(api_key, backup["filename"])
                if result["success"]:
                    print(f"✓ 已删除: {backup['filename']}")
                    deleted_count += 1
                else:
                    print(f"✗ 删除失败: {backup['filename']} - {result.get('error')}")
            
            print(f"\n删除完成: {deleted_count}/{len(selected_backups)} 个文件")
        
    except ValueError:
        print("输入格式错误")

# 使用示例
# interactive_backup_cleanup("your_api_key", "test_db")
```

## 相关链接

- [备份恢复总览](../backup-recovery/index.md)
- [备份列表](list-backups.md)
- [创建备份](backup-database.md)
- [下载备份](download-backup.md)
- [备份状态](backup-status.md)