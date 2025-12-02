# 批量删除数据

## 端点信息

<ApiEndpoint method="POST" path="/database/{db_name}/batch/delete"/>

批量删除表中的数据，支持条件删除和 ID 列表删除。

## 权限要求
- `batch_delete` 权限
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

### 请求体 - 条件删除
```json
{
  "table_name": "users",
  "conditions": [
    {"field": "status", "operator": "=", "value": "inactive"},
    {"field": "age", "operator": "<", "value": 18}
  ],
  "confirm": true
}
```

### 请求体 - ID 列表删除
```json
{
  "table_name": "users",
  "id_list": [1, 2, 3, 4, 5],
  "id_field": "id",
  "confirm": true
}
```

### 请求字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `table_name` | string | 是 | 表名称 |
| `conditions` | array | 条件必填 | 删除条件列表 |
| `id_list` | array | ID必填 | 要删除的ID列表 |
| `id_field` | string | ID必填 | ID字段名称，默认"id" |
| `confirm` | boolean | 是 | 确认删除操作 |

### 条件字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `field` | string | 是 | 字段名称 |
| `operator` | string | 是 | 操作符：=, !=, <, >, <=, >=, LIKE, IN |
| `value` | any | 是 | 条件值 |

## 响应

### 成功响应
**状态码:** `200 OK`

```json
{
  "success": true,
  "message": "批量删除完成，共删除 150 行数据",
  "database": "my_database",
  "table": "users",
  "affected_rows": 150,
  "sql": "DELETE FROM `users` WHERE status = 'inactive' AND age < 18"
}
```

### 响应字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `success` | boolean | 操作是否成功 |
| `message` | string | 操作结果消息 |
| `database` | string | 数据库名称 |
| `table` | string | 表名称 |
| `affected_rows` | integer | 删除的行数 |
| `sql` | string | 执行的SQL语句 |

## 使用示例

### cURL 示例 - 条件删除
```bash
curl -X POST https://dbapi.muzilix.cn/database/my_database/batch/delete \
  -H "Authorization: Bearer your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "table_name": "logs",
    "conditions": [
      {"field": "created_at", "operator": "<", "value": "2023-01-01"},
      {"field": "level", "operator": "=", "value": "debug"}
    ],
    "confirm": true
  }'
```

### cURL 示例 - ID 列表删除
```bash
curl -X POST https://dbapi.muzilix.cn/database/my_database/batch/delete \
  -H "Authorization: Bearer your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "table_name": "temp_data",
    "id_list": [101, 102, 103, 104, 105],
    "id_field": "temp_id",
    "confirm": true
  }'
```

### Python 示例
```python
def cleanup_old_data(api_key, db_name):
    # 条件删除示例 - 清理过期日志
    condition_delete = {
        "table_name": "access_logs",
        "conditions": [
            {"field": "created_at", "operator": "<", "value": "2023-12-01"},
            {"field": "user_id", "operator": "=", "value": "guest"}
        ],
        "confirm": True
    }
    
    result = batch_delete_data(api_key, db_name, condition_delete)
    return result

def remove_temp_records(api_key, db_name, record_ids):
    # ID列表删除示例 - 删除临时记录
    id_delete = {
        "table_name": "temp_uploads",
        "id_list": record_ids,
        "id_field": "upload_id", 
        "confirm": True
    }
    
    result = batch_delete_data(api_key, db_name, id_delete)
    return result

# 使用示例
# 条件删除
cleanup_result = cleanup_old_data("your_api_key", "analytics")
print(f"清理了 {cleanup_result['affected_rows']} 条旧日志")

# ID列表删除  
ids_to_delete = [201, 202, 203, 204]
delete_result = remove_temp_records("your_api_key", "file_storage", ids_to_delete)
print(f"删除了 {delete_result['affected_rows']} 个临时文件记录")
```

## 条件操作符

### 比较操作符
```json
{"field": "age", "operator": ">", "value": 30}
{"field": "salary", "operator": "<=", "value": 50000}
{"field": "status", "operator": "!=", "value": "active"}
```

### 匹配操作符
```json
{"field": "name", "operator": "LIKE", "value": "%test%"}
{"field": "email", "operator": "LIKE", "value": "%@example.com"}
```

### IN 操作符
```json
{"field": "category", "operator": "IN", "value": ["electronics", "books"]}
{"field": "id", "operator": "IN", "value": [1, 2, 3, 4, 5]}
```

## 多条件组合

### AND 条件
多个条件默认使用 AND 连接：
```json
"conditions": [
  {"field": "status", "operator": "=", "value": "inactive"},
  {"field": "last_login", "operator": "<", "value": "2023-01-01"},
  {"field": "email_verified", "operator": "=", "value": false}
]
```

生成的 SQL：
```sql
DELETE FROM table 
WHERE status = 'inactive' 
  AND last_login < '2023-01-01' 
  AND email_verified = false
```

## 安全确认

### 确认机制
所有删除操作必须显式设置 `"confirm": true`，否则操作会被拒绝。

### 影响行数预估
在执行删除前，系统会先查询受影响的行数，确保操作符合预期。

## 限制说明

### 操作限制
- 频率限制：20次/小时
- ID列表最大长度：受系统配置限制
- 需要显式确认

### 安全保护
- 不能删除系统表
- 条件字段必须存在
- 操作需要数据库写权限

## 相关链接

- [批量操作总览](../batch-operations/index.md)
- [批量更新](batch-update.md)
- [数据导出](export-data.md)
- [备份恢复](../backup-recovery/)