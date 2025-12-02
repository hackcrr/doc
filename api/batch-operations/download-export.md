# 下载导出文件

## 端点信息

<ApiEndpoint method="GET" path="/download/export/{filename}"/>

下载通过导出功能生成的数据文件。

## 权限要求
- `export_data` 权限

## 请求

### 请求头
| 头部 | 值 | 必填 |
|------|-----|------|
| `Authorization` | `Bearer your_api_key` | 是 |

### 路径参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `filename` | string | 是 | 导出文件名 |

## 响应

### 成功响应
**状态码:** `200 OK`

返回文件流下载，包含适当的 Content-Type 和 Content-Disposition 头部。

### 响应头示例
```
Content-Type: text/csv
Content-Disposition: attachment; filename="users_export_20240120.csv"
Content-Length: 2048
```

## 使用示例

### cURL 示例
```bash
# 下载CSV文件
curl -X GET https://dbapi.muzilix.cn/download/export/users_export_20240120_143000.csv \
  -H "Authorization: Bearer your_api_key" \
  -o downloaded_file.csv

# 下载JSON文件  
curl -X GET https://dbapi.muzilix.cn/download/export/products_export_20240120_150000.json \
  -H "Authorization: Bearer your_api_key" \
  -o downloaded_file.json
```

### Python 示例
```python
def download_export_file(api_key, filename, save_path=None):
    """下载导出文件"""
    url = f"https://dbapi.muzilix.cn/download/export/{filename}"
    headers = {"Authorization": f"Bearer {api_key}"}
    
    response = requests.get(url, headers=headers, stream=True)
    
    if response.status_code == 200:
        if save_path is None:
            save_path = filename
        
        with open(save_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        return {"success": True, "file_path": save_path}
    else:
        return {"success": False, "error": response.json().get('error')}

# 使用示例
# 下载文件并保存
result = download_export_file("your_api_key", "users_export_20240120.csv", "local_users.csv")
if result["success"]:
    print(f"文件已下载: {result['file_path']}")

# 结合导出功能使用
def export_and_download(api_key, db_name, export_config):
    """导出数据并立即下载"""
    # 1. 执行导出
    export_result = export_data(api_key, db_name, export_config)
    
    if not export_result["success"]:
        return export_result
    
    # 2. 下载文件
    filename = export_result["filename"]
    download_result = download_export_file(api_key, filename)
    
    return {
        "export": export_result,
        "download": download_result
    }

# 完整流程示例
export_config = {
    "table_name": "users",
    "format": "csv",
    "fields": ["id", "name", "email"],
    "filename": "user_export"
}

result = export_and_download("your_api_key", "my_app", export_config)
```

### JavaScript 示例
```javascript
async function downloadExportFile(apiKey, filename) {
    const response = await fetch(`https://dbapi.muzilix.cn/download/export/${filename}`, {
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
        return { success: true };
    } else {
        const error = await response.json();
        return { success: false, error: error.error };
    }
}

// 使用示例
downloadExportFile('your_api_key', 'products_export_20240120.csv')
    .then(result => {
        if (result.success) {
            console.log('文件下载成功');
        } else {
            console.log('下载失败:', result.error);
        }
    });
```

## 文件类型支持

### CSV 文件
- **Content-Type**: `text/csv`
- **文件扩展名**: `.csv`
- **编码**: UTF-8

### JSON 文件
- **Content-Type**: `application/json`
- **文件扩展名**: `.json`
- **编码**: UTF-8

## 安全特性

### 文件验证
- 验证文件名格式，防止路径遍历攻击
- 只允许下载导出目录中的文件
- 文件类型安全检查

### 访问控制
- 需要有效的 API 密钥
- 需要导出数据权限
- 文件访问日志记录

## 错误处理

### 文件不存在
```json
{
  "error": "文件不存在"
}
```

### 无效的文件名
```json
{
  "error": "无效的文件名"
}
```

### 权限不足
```json
{
  "error": "权限不足"
}
```

## 文件管理

### 存储位置
导出文件存储在服务器的 `exports` 目录中：
```
/exports/
  ├── users_export_20240120_143000.csv
  ├── products_export_20240120_150000.json
  └── orders_export_20240121_093000.csv
```

### 文件名格式
导出文件遵循统一的命名规范：
```
{自定义前缀}_{时间戳}.{格式}
```

### 文件清理
建议定期清理旧的导出文件以释放磁盘空间。

## 使用场景

### 1. 自动化数据备份
```python
def automated_backup(api_key, db_name, tables):
    """自动化数据备份流程"""
    backup_files = []
    
    for table in tables:
        # 导出每个表的数据
        export_config = {
            "table_name": table,
            "format": "json",
            "filename": f"backup_{table}_{datetime.now().strftime('%Y%m%d')}"
        }
        
        export_result = export_data(api_key, db_name, export_config)
        if export_result["success"]:
            # 下载备份文件
            download_result = download_export_file(api_key, export_result["filename"])
            if download_result["success"]:
                backup_files.append(export_result["filename"])
    
    return backup_files
```

### 2. 数据迁移工具
```python
def migrate_data(source_api_key, target_api_key, db_name, table_name):
    """数据迁移工具"""
    # 从源系统导出数据
    export_config = {
        "table_name": table_name,
        "format": "json",
        "filename": f"migration_{table_name}"
    }
    
    export_result = export_data(source_api_key, db_name, export_config)
    if not export_result["success"]:
        return {"error": "导出失败"}
    
    # 下载导出文件
    filename = export_result["filename"]
    download_result = download_export_file(source_api_key, filename, "temp_migration.json")
    if not download_result["success"]:
        return {"error": "下载失败"}
    
    # 读取数据并导入到目标系统
    with open("temp_migration.json", 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    import_result = import_data(target_api_key, db_name, {
        "table_name": table_name,
        "data": data,
        "on_duplicate": "ignore"
    })
    
    # 清理临时文件
    os.remove("temp_migration.json")
    
    return import_result
```

## 相关链接

- [批量操作总览](../batch-operations/index.md)
- [数据导出](export-data.md)
- [数据导入](import-data.md)
- [导出权限](/guide/authentication.md)