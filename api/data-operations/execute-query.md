# 执行 SQL 查询

## 端点信息

```http
POST /database/{db_name}/query
Authorization: Bearer your_api_key
Content-Type: application/json
```

执行自定义 SQL 查询，支持 SELECT、EXPLAIN、DESCRIBE、SHOW 等只读操作。

## 权限要求
- `execute_query` 权限
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
  "sql": "SELECT * FROM users WHERE age > ?",
  "params": [18],
  "type": "select"
}
```

### 请求字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `sql` | string | 是 | SQL 查询语句 |
| `params` | array | 否 | 查询参数 |
| `type` | string | 是 | 查询类型：select/explain/describe/show |

## 响应

### SELECT 查询响应
**状态码:** `200 OK`

```json
{
  "success": true,
  "type": "select",
  "data": [
    {
      "id": 1,
      "name": "张三",
      "email": "zhangsan@example.com",
      "age": 25
    }
  ],
  "count": 1,
  "execution_time_ms": 15.23,
  "fields": ["id", "name", "email", "age"]
}
```

### EXPLAIN 查询响应
**状态码:** `200 OK`

```json
{
  "success": true,
  "type": "explain",
  "analysis": [
    {
      "id": 1,
      "select_type": "SIMPLE",
      "table": "users",
      "type": "ALL",
      "possible_keys": null,
      "key": null,
      "key_len": null,
      "ref": null,
      "rows": 1000,
      "Extra": "Using where"
    }
  ],
  "execution_time_ms": 5.67
}
```

### 响应字段说明

#### 通用字段
| 字段 | 类型 | 说明 |
|------|------|------|
| `success` | boolean | 操作是否成功 |
| `type` | string | 查询类型 |
| `execution_time_ms` | number | 执行时间（毫秒） |

#### SELECT 特定字段
| 字段 | 类型 | 说明 |
|------|------|------|
| `data` | array | 查询结果数据 |
| `count` | integer | 结果数量 |
| `fields` | array | 返回字段名称 |

#### EXPLAIN/DESCRIBE 特定字段
| 字段 | 类型 | 说明 |
|------|------|------|
| `analysis` | array | 分析结果 |

## 使用示例

### cURL 示例 - SELECT 查询
```bash
curl -X POST https://dbapi.muzilix.cn/database/my_database/query \
  -H "Authorization: Bearer your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "sql": "SELECT id, name, email FROM users WHERE age > ? AND status = ?",
    "params": [25, "active"],
    "type": "select"
  }'
```

### cURL 示例 - EXPLAIN 查询
```bash
curl -X POST https://dbapi.muzilix.cn/database/my_database/query \
  -H "Authorization: Bearer your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "sql": "EXPLAIN SELECT * FROM users WHERE name LIKE ?",
    "params": ["%张%"],
    "type": "explain"
  }'
```

### cURL 示例 - DESCRIBE 查询
```bash
curl -X POST https://dbapi.muzilix.cn/database/my_database/query \
  -H "Authorization: Bearer your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "sql": "DESCRIBE users",
    "type": "describe"
  }'
```

### Python 示例
```python
def execute_sql_query(api_key, db_name, sql, params=None, query_type="select"):
    url = f"https://dbapi.muzilix.cn/database/{db_name}/query"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "sql": sql,
        "type": query_type
    }
    
    if params:
        payload["params"] = params
    
    response = requests.post(url, headers=headers, json=payload)
    return response.json()

# SELECT 查询示例
result = execute_sql_query(
    "your_api_key", 
    "my_app", 
    "SELECT name, email, COUNT(*) as order_count FROM users u JOIN orders o ON u.id = o.user_id GROUP BY u.id HAVING order_count > ?",
    [5],
    "select"
)

# EXPLAIN 查询示例
result = execute_sql_query(
    "your_api_key",
    "my_app", 
    "EXPLAIN SELECT * FROM products WHERE price > ? AND category = ?",
    [100, "electronics"],
    "explain"
)
```

## 支持的查询类型

### SELECT
执行数据查询，返回结果集
```sql
SELECT * FROM table WHERE condition
SELECT column1, column2 FROM table ORDER BY column1
SELECT COUNT(*) as count FROM table GROUP BY category
```

### EXPLAIN
分析查询执行计划
```sql
EXPLAIN SELECT * FROM table WHERE condition
EXPLAIN FORMAT=JSON SELECT * FROM table
```

### DESCRIBE
查看表结构信息
```sql
DESCRIBE table_name
DESC table_name
```

### SHOW
显示数据库信息
```sql
SHOW TABLES
SHOW TABLE STATUS
SHOW CREATE TABLE table_name
```

## 参数化查询

### 使用问号占位符
```sql
SELECT * FROM users WHERE age > ? AND name LIKE ?
```

### 参数传递
```json
{
  "sql": "SELECT * FROM users WHERE age > ? AND name LIKE ?",
  "params": [25, "%张%"],
  "type": "select"
}
```

### 支持的数据类型
- 字符串、数字、布尔值
- 数组（用于 IN 查询）
- NULL 值

## 安全限制

### 禁止的操作
以下 SQL 关键字被禁止：
- INSERT, UPDATE, DELETE, DROP
- TRUNCATE, CREATE, ALTER
- GRANT, REVOKE, REPLACE
- MERGE, LOCK, UNLOCK

### 其他限制
- 最大查询长度：5000 字符
- 最大子查询深度：3 层
- 禁止访问系统表
- 禁止跨数据库查询

## 相关链接

- [数据操作总览](../data-operations/index.md)
- [查询数据](query-data.md)
- [查询示例](/examples/query-examples.md)
- [表信息](query-table-info.md)