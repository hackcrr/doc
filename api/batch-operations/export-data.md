# 导出数据

## 端点信息

```http
POST /database/{db_name}/export
Authorization: Bearer your_api_key
Content-Type: application/json
```

将表中的数据导出为 CSV 或 JSON 格式文件。

## 权限要求
- `export_data` 权限
- 对目标数据库的 `read` 权限

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
  "table_name": "users",
  "format": "csv",
  "fields": ["id", "name", "email"],
  "where_conditions": "age > 18",
  "filename": "users_export"
}
```

### 请求字段说明

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|---------|------|
| `table_name` | string | 是 | - | 表名称 |
| `format` | string | 否 | `csv` | 导出格式：csv, json |
| `fields` | array | 否 | 所有字段 | 指定导出字段 |
| `where_conditions` | string | 否 | - | 筛选条件 |
| `filename` | string | 否 | 自动生成 | 导出文件名 |

## 响应

### 成功响应
**状态码:** `200 OK`

```json
{
  "success": true,
  "message": "数据导出完成，共导出 150 行数据",
  "database": "my_database",
  "table": "users",
  "format": "csv",
  "filename": "users_export_20240120_143000.csv",
  "filepath": "/exports/users_export_20240120_143000.csv",
  "row_count": 150,
  "download_url": "/download/export/users_export_20240120_143000.csv"
}
```

### 响应字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `success` | boolean | 操作是否成功 |
| `message` | string | 操作结果消息 |
| `database` | string | 数据库名称 |
| `table` | string | 表名称 |
| `format` | string | 导出格式 |
| `filename` | string | 生成的文件名 |
| `filepath` | string | 文件存储路径 |
| `row_count` | integer | 导出的行数 |
| `download_url` | string | 文件下载URL |

## 使用示例

### cURL 示例 - CSV 导出
```bash
curl -X POST https://dbapi.muzilix.cn/database/my_database/export \
  -H "Authorization: Bearer your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "table_name": "products",
    "format": "csv",
    "fields": ["id", "name", "price", "category"],
    "where_conditions": "status = '\''active'\''",
    "filename": "active_products"
  }'
```

### cURL 示例 - JSON 导出
```bash
curl -X POST https://dbapi.muzilix.cn/database/my_database/export \
  -H "Authorization: Bearer your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "table_name": "users",
    "format": "json", 
    "fields": ["id", "username", "email", "created_at"],
    "where_conditions": "last_login > '\''2024-01-01'\''",
    "filename": "recent_users"
  }'
```

### Python 示例
```python
def export_user_data(api_key, db_name):
    # 导出活跃用户数据为CSV
    export_config = {
        "table_name": "users",
        "format": "csv",
        "fields": ["id", "username", "email", "created_at", "last_login"],
        "where_conditions": "status = 'active' AND last_login > '2024-01-01'",
        "filename": "active_users_2024"
    }
    
    result = export_data(api_key, db_name, export_config)
    return result

def export_full_table_json(api_key, db_name, table_name):
    # 导出整个表为JSON
    export_config = {
        "table_name": table_name,
        "format": "json",
        "filename": f"{table_name}_full_export"
    }
    
    result = export_data(api_key, db_name, export_config)
    return result

# 使用示例
# 导出特定数据
result = export_user_data("your_api_key", "my_app")
if result["success"]:
    print(f"导出成功: {result['filename']}")
    print(f"下载链接: {result['download_url']}")
    print(f"导出行数: {result['row_count']}")

# 导出整个表
full_export = export_full_table_json("your_api_key", "inventory", "products")
```

## 导出格式说明

### CSV 格式
- 逗号分隔值
- 包含表头行
- UTF-8 编码
- 适合Excel和数据分析工具

**示例输出:**
```csv
id,name,email,created_at
1,张三,zhangsan@example.com,2024-01-15 10:30:00
2,李四,lisi@example.com,2024-01-16 14:20:00
```

### JSON 格式
- 标准JSON数组格式
- 美化输出（缩进2空格）
- UTF-8 编码
- 适合程序处理和API使用

**示例输出:**
```json
[
  {
    "id": 1,
    "name": "张三",
    "email": "zhangsan@example.com",
    "created_at": "2024-01-15T10:30:00"
  },
  {
    "id": 2,
    "name": "李四", 
    "email": "lisi@example.com",
    "created_at": "2024-01-16T14:20:00"
  }
]
```

## 筛选条件语法

### 简单条件
```
status = 'active'
age > 25
created_at > '2024-01-01'
```

### 复合条件
```
status = 'active' AND age BETWEEN 18 AND 65
category IN ('electronics', 'books') AND price > 100
name LIKE '%test%' OR description LIKE '%demo%'
```

### 多条件组合
```
(status = 'active' OR status = 'pending') 
AND created_at > '2024-01-01' 
AND (department = 'IT' OR department = 'Engineering')
```

## 文件管理

### 文件名生成
如果未指定文件名，自动生成格式：
```
{db_name}_{table_name}_export_{timestamp}.{format}
```

### 文件存储
- 存储目录：`/exports`
- 自动创建存储目录
- 文件权限：644

### 文件访问
通过下载端点访问导出文件：
```
GET /download/export/{filename}
```

## 限制说明

### 操作限制
- 频率限制：10次/小时
- 最大行数：受系统内存限制
- 文件大小限制：受磁盘空间限制

### 字段验证
- 只能导出表中存在的字段
- 字段名自动验证和转义
- 条件表达式安全验证

## 相关链接

- [批量操作总览](../batch-operations/index.md)
- [数据导入](import-data.md)
- [下载导出文件](download-export.md)
- [查询数据](../data-operations/query-data.md)