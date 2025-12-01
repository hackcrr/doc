# 下载备份文件

## 端点信息

```http
GET /backup/{filename}
Authorization: Bearer your_api_key
```

下载指定的数据库备份文件。

## 权限要求
- `download_backup` 权限
- 对备份文件所属数据库的 `read` 权限

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

返回文件流下载，包含适当的 Content-Type 和 Content-Disposition 头部。

### 响应头示例
**压缩文件 (.gz):**
```
Content-Type: application/gzip
Content-Disposition: attachment; filename="backup_20240120.sql.gz"
Content-Length: 1572864
```

**未压缩文件 (.sql):**
```
Content-Type: application/sql
Content-Disposition: attachment; filename="backup_20240120.sql"  
Content-Length: 2097152
```

## 使用示例

### cURL 示例
```bash
# 下载压缩备份文件
curl -X GET https://dbapi.muzilix.cn/backup/admin_my_database_backup_20240120_143000.sql.gz \
  -H "Authorization: Bearer your_api_key" \
  -o downloaded_backup.sql.gz

# 下载未压缩备份文件
curl -X GET https://dbapi.muzilix.cn/backup/admin_my_database_backup_20240119_020000.sql \
  -H "Authorization: Bearer your_api_key" \
  -o downloaded_backup.sql
```

### Python 示例
```python
def download_backup_file(api_key, filename, save_path=None):
    """下载备份文件"""
    url = f"https://dbapi.muzilix.cn/backup/{filename}"
    headers = {"Authorization": f"Bearer {api_key}"}
    
    response = requests.get(url, headers=headers, stream=True)
    
    if response.status_code == 200:
        if save_path is None:
            save_path = filename
        
        with open(save_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        return {"success": True, "file_path": save_path, "size": os.path.getsize(save_path)}
    else:
        return {"success": False, "error": response.json().get('error')}

def download_latest_backup(api_key, db_name):
    """下载最新的备份文件"""
    # 首先获取备份列表
    backups_data = list_database_backups(api_key, db_name)
    
    if "error" in backups_data or backups_data["backup_count"] == 0:
        return {"success": False, "error": "没有找到备份文件"}
    
    # 按创建时间排序，获取最新的备份
    latest_backup = sorted(backups_data["backups"], key=lambda x: x["created_time"], reverse=True)[0]
    filename = latest_backup["filename"]
    
    # 下载文件
    return download_backup_file(api_key, filename, f"latest_{db_name}_backup.sql.gz")

# 使用示例
# 下载特定备份文件
result = download_backup_file("your_api_key", "admin_production_backup_20240120.sql.gz")
if result["success"]:
    print(f"备份文件已下载: {result['file_path']} ({result['size']} 字节)")

# 下载最新备份
latest_result = download_latest_backup("your_api_key", "production_db")
if latest_result["success"]:
    print(f"最新备份已下载: {latest_result['file_path']}")
```

### JavaScript 示例
```javascript
async function downloadBackupFile(apiKey, filename) {
    const response = await fetch(`https://dbapi.muzilix.cn/backup/${filename}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${apiKey}`
        }
    });
    
    if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        return { success: true, size: blob.size };
    } else {
        const error = await response.json();
        return { success: false, error: error.error };
    }
}

// 使用示例
downloadBackupFile('your_api_key', 'admin_myapp_backup_20240120.sql.gz')
    .then(result => {
        if (result.success) {
            console.log(`备份文件下载成功，大小: ${result.size} 字节`);
        } else {
            console.log('下载失败:', result.error);
        }
    });
```

## 文件类型处理

### 压缩文件 (.sql.gz)
- **Content-Type**: `application/gzip`
- **文件扩展名**: `.sql.gz`
- **解压命令**: `gzip -d filename.sql.gz`

### 未压缩文件 (.sql)
- **Content-Type**: `application/sql`
- **文件扩展名**: `.sql`
- **直接可读**: 文本格式 SQL 文件

## 安全验证

### 文件名验证
- 防止路径遍历攻击 (`../`)
- 只允许有效的备份文件名
- 文件扩展名安全检查

### 权限检查
- 验证用户对备份文件的访问权限
- 检查数据库读取权限
- 用户隔离：只能下载自己的备份文件

## 备份文件使用

### 直接查看 SQL 文件
```bash
# 查看未压缩备份内容
head -n 50 backup_file.sql

# 查看压缩备份内容
zcat backup_file.sql.gz | head -n 50
```

### 恢复到 MySQL 数据库
```bash
# 恢复未压缩备份
mysql -u username -p database_name < backup_file.sql

# 恢复压缩备份
gzip -dc backup_file.sql.gz | mysql -u username -p database_name
```

### Python 恢复工具
```python
def restore_from_backup(mysql_config, backup_file_path):
    """从备份文件恢复数据库"""
    import subprocess
    
    if backup_file_path.endswith('.gz'):
        # 压缩文件恢复
        cmd = f"gzip -dc {backup_file_path} | mysql -h {mysql_config['host']} -u {mysql_config['user']} -p{mysql_config['password']} {mysql_config['database']}"
    else:
        # 未压缩文件恢复
        cmd = f"mysql -h {mysql_config['host']} -u {mysql_config['user']} -p{mysql_config['password']} {mysql_config['database']} < {backup_file_path}"
    
    try:
        result = subprocess.run(cmd, shell=True, check=True, capture_output=True, text=True)
        return {"success": True, "message": "数据库恢复成功"}
    except subprocess.CalledProcessError as e:
        return {"success": False, "error": f"恢复失败: {e.stderr}"}

# 使用示例
mysql_config = {
    'host': 'localhost',
    'user': 'root', 
    'password': 'password',
    'database': 'my_database'
}

restore_result = restore_from_backup(mysql_config, 'downloaded_backup.sql.gz')
```

## 批量下载工具

```python
def download_all_backups(api_key, db_name, output_dir="backups"):
    """下载数据库的所有备份文件"""
    import os
    
    # 创建输出目录
    os.makedirs(output_dir, exist_ok=True)
    
    # 获取备份列表
    backups_data = list_database_backups(api_key, db_name)
    
    if "error" in backups_data:
        return {"success": False, "error": backups_data["error"]}
    
    downloaded_files = []
    
    for backup in backups_data["backups"]:
        filename = backup["filename"]
        save_path = os.path.join(output_dir, filename)
        
        print(f"下载: {filename}...")
        result = download_backup_file(api_key, filename, save_path)
        
        if result["success"]:
            downloaded_files.append({
                "filename": filename,
                "path": save_path,
                "size": result["size"]
            })
            print(f"  完成: {result['size']} 字节")
        else:
            print(f"  失败: {result['error']}")
    
    return {
        "success": True,
        "downloaded_count": len(downloaded_files),
        "total_count": backups_data["backup_count"],
        "files": downloaded_files
    }

# 使用示例
result = download_all_backups("your_api_key", "important_db", "backup_archive")
if result["success"]:
    print(f"下载完成: {result['downloaded_count']}/{result['total_count']} 个文件")
```

## 相关链接

- [备份恢复总览](../backup-recovery/index.md)
- [备份列表](list-backups.md)
- [创建备份](backup-database.md)
- [删除备份](delete-backup.md)
- [备份状态](backup-status.md)