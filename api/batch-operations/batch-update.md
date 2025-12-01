# 批量更新数据

## 端点信息

```http
POST /database/{db_name}/batch/update
Authorization: Bearer your_api_key
Content-Type: application/json
```

批量更新表中的多条数据，支持不同的更新条件和值。

## 权限要求
- `batch_update` 权限
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
  "updates": [
    {
      "where": {"id": 1},
      "set": {"name": "新名字", "age": 30}
    },
    {
      "where": {"id": 2},
      "set": {"name": "另一个名字", "status": "inactive"}
    }
  ],
  "batch_size": 100
}
```

### 请求字段说明

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|---------|------|
| `table_name` | string | 是 | - | 表名称 |
| `updates` | array | 是 | - | 更新操作列表 |
| `batch_size` | integer | 否 | 100 | 批量大小，最大1000 |

### 更新操作字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `where` | object | 是 | 更新条件 |
| `set` | object | 是 | 要设置的字段值 |

## 响应

### 成功响应
**状态码:** `200 OK`

```json
{
  "success": true,
  "message": "批量更新完成: 成功 2 条, 失败 0 条",
  "database": "my_database",
  "table": "users",
  "statistics": {
    "total": 2,
    "successful": 2,
    "failed": 0
  }
}
```

### 包含错误的响应
```json
{
  "success": true,
  "message": "批量更新完成: 成功 1 条, 失败 1 条",
  "database": "my_database",
  "table": "users",
  "statistics": {
    "total": 2,
    "successful": 1,
    "failed": 1
  },
  "errors": [
    "第2条更新失败: 字段 'invalid_field' 不存在"
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
| `statistics` | object | 操作统计信息 |
| `errors` | array | 错误信息列表（如有） |

#### 统计信息
| 字段 | 类型 | 说明 |
|------|------|------|
| `total` | integer | 总操作数 |
| `successful` | integer | 成功操作数 |
| `failed` | integer | 失败操作数 |

## 使用示例

### cURL 示例
```bash
curl -X POST https://dbapi.muzilix.cn/database/my_database/batch/update \
  -H "Authorization: Bearer your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "table_name": "products",
    "updates": [
      {
        "where": {"category": "electronics"},
        "set": {"discount": 0.1, "updated_at": "2024-01-20 10:00:00"}
      },
      {
        "where": {"price": 0},
        "set": {"status": "inactive", "reason": "价格为零"}
      }
    ],
    "batch_size": 50
  }'
```

### Python 示例
```python
def batch_update_products(api_key, db_name):
    updates = {
        "table_name": "products",
        "updates": [
            {
                "where": {"category": "electronics", "status": "active"},
                "set": {"price": "price * 0.9", "updated_at": "NOW()"}
            },
            {
                "where": {"stock_quantity": 0},
                "set": {"status": "out_of_stock", "restock_date": "2024-02-01"}
            },
            {
                "where": {"created_at": "2023-01-01"},
                "set": {"is_legacy": True, "notes": "2023年老产品"}
            }
        ],
        "batch_size": 100
    }
    
    result = batch_update_data(api_key, db_name, updates)
    return result

# 使用示例
result = batch_update_products("your_api_key", "inventory")
if result["success"]:
    stats = result["statistics"]
    print(f"批量更新完成: 成功 {stats['successful']}/{stats['total']}")
    if "errors" in result:
        for error in result["errors"]:
            print(f"错误: {error}")
```

## 条件表达式

### 简单条件
```json
{
  "where": {"id": 1},
  "set": {"name": "新名称"}
}
```

### 多条件组合
```json
{
  "where": {"status": "active", "age": 25},
  "set": {"level": "premium", "points": 1000}
}
```

### 复杂条件
```json
{
  "where": {"department": "IT", "salary": 50000},
  "set": {"bonus": 5000, "review_date": "2024-06-01"}
}
```

## 更新值类型

### 直接值更新
```json
{
  "set": {"name": "新名字", "age": 30, "active": true}
}
```

### 表达式更新
```json
{
  "set": {"balance": "balance + 100", "login_count": "login_count + 1"}
}
```

### 混合更新
```json
{
  "set": {
    "name": "更新名称",
    "version": "version + 1",
    "updated_at": "NOW()"
  }
}
```

## 限制说明

### 操作限制
- 单次最大更新数：1000 条
- 频率限制：30次/小时
- 批量大小：最大 1000

### 字段验证
- 只能更新表中存在的字段
- 条件字段必须存在
- 数据类型自动验证

## 相关链接

- [批量操作总览](../batch-operations/index.md)
- [批量删除](batch-delete.md)
- [数据导入](import-data.md)
- [数据导出](export-data.md)