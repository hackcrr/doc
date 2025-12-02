# 导入数据

## 端点信息

<ApiEndpoint method="POST" path="/database/{db_name}/import"/>

将 JSON 数据导入到指定表中。

## 权限要求
- `import_data` 权限
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
  "table_name": "users",
  "format": "json",
  "data": [
    {
      "name": "张三",
      "email": "zhangsan@example.com",
      "age": 25
    },
    {
      "name": "李四",
      "email": "lisi@example.com", 
      "age": 30
    }
  ],
  "on_duplicate": "ignore"
}
```

### 请求字段说明

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|---------|------|
| `table_name` | string | 是 | - | 表名称 |
| `format` | string | 否 | `json` | 数据格式（目前仅支持json） |
| `data` | array | 是 | - | 要导入的数据列表 |
| `on_duplicate` | string | 否 | `ignore` | 重复数据处理：ignore, update, error |

## 响应

### 成功响应
**状态码:** `200 OK`

```json
{
  "success": true,
  "message": "数据导入完成: 成功 2 条, 失败 0 条",
  "database": "my_database",
  "table": "users",
  "statistics": {
    "total": 2,
    "successful": 2,
    "failed": 0
  },
  "on_duplicate": "ignore"
}
```

### 包含错误的响应
```json
{
  "success": true,
  "message": "数据导入完成: 成功 1 条, 失败 1 条",
  "database": "my_database",
  "table": "users",
  "statistics": {
    "total": 2,
    "successful": 1,
    "failed": 1
  },
  "on_duplicate": "ignore",
  "errors": [
    "第2条记录导入失败: 唯一键冲突"
  ]
}
```

### 响应字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `success` | boolean | 操作是否成功 |
| `message` | string | 操作结果消息 |
| `database` | string | 数据库名称 |
| `table` | string | 表名称 |
| `statistics` | object | 导入统计信息 |
| `on_duplicate` | string | 重复数据处理策略 |
| `errors` | array | 错误信息列表（如有） |

#### 统计信息
| 字段 | 类型 | 说明 |
|------|------|------|
| `total` | integer | 总记录数 |
| `successful` | integer | 成功导入数 |
| `failed` | integer | 导入失败数 |

## 使用示例

### cURL 示例
```bash
curl -X POST https://dbapi.muzilix.cn/database/my_database/import \
  -H "Authorization: Bearer your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "table_name": "products",
    "data": [
      {
        "name": "笔记本电脑",
        "price": 5999.99,
        "category": "electronics",
        "stock": 50
      },
      {
        "name": "无线鼠标",
        "price": 89.99,
        "category": "electronics", 
        "stock": 100
      }
    ],
    "on_duplicate": "update"
  }'
```

### Python 示例
```python
def import_user_data(api_key, db_name, users_data):
    """导入用户数据"""
    import_config = {
        "table_name": "users",
        "data": users_data,
        "on_duplicate": "update"
    }
    
    result = import_data(api_key, db_name, import_config)
    return result

def import_from_json_file(api_key, db_name, table_name, json_file_path):
    """从JSON文件导入数据"""
    with open(json_file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    import_config = {
        "table_name": table_name,
        "data": data,
        "on_duplicate": "ignore"
    }
    
    result = import_data(api_key, db_name, import_config)
    return result

# 使用示例
# 直接导入数据
users = [
    {
        "username": "user1",
        "email": "user1@example.com",
        "full_name": "用户一",
        "age": 28
    },
    {
        "username": "user2", 
        "email": "user2@example.com",
        "full_name": "用户二",
        "age": 32
    }
]

result = import_user_data("your_api_key", "my_app", users)
if result["success"]:
    stats = result["statistics"]
    print(f"导入完成: 成功 {stats['successful']}/{stats['total']}")

# 从文件导入
file_result = import_from_json_file("your_api_key", "inventory", "products", "products_data.json")
```

## 重复数据处理策略

### ignore（忽略）
忽略重复记录，只插入不存在的记录
```sql
INSERT IGNORE INTO table (...) VALUES (...)
```

### update（更新）
更新重复记录的字段
```sql
INSERT INTO table (...) VALUES (...) ON DUPLICATE KEY UPDATE ...
```

### error（报错）
遇到重复记录时返回错误
```sql
INSERT INTO table (...) VALUES (...)
```

## 数据格式要求

### 字段一致性
所有记录必须具有相同的字段结构：
```json
[
  {"name": "A", "email": "a@test.com", "age": 25},
  {"name": "B", "email": "b@test.com", "age": 30}
  // 所有记录必须包含相同的字段
]
```

### 数据类型支持
- **字符串**: 直接插入
- **数字**: 自动转换为对应数值类型
- **布尔值**: 转换为 1/0
- **null**: 插入 NULL 值
- **日期时间**: 支持标准格式字符串

### 字段验证
- 只能插入表中存在的字段
- 缺失字段使用默认值或 NULL
- 字段名大小写敏感

## 批量导入优化

### 性能特性
- 使用批量插入优化
- 自动事务处理
- 错误记录继续处理

### 内存管理
- 流式处理大数据集
- 自动内存使用优化
- 超时和错误处理

## 限制说明

### 操作限制
- 频率限制：10次/小时
- 单次最大记录数：受系统配置限制
- 需要数据库写权限

### 数据验证
- 字段存在性验证
- 数据类型兼容性检查
- 唯一约束冲突处理

## 相关链接

- [批量操作总览](../batch-operations/index.md)
- [数据导出](export-data.md)
- [批量更新](batch-update.md)
- [插入数据](../data-operations/insert-data.md)