# 插入数据

## 端点信息

<ApiEndpoint method="POST" path="/database/{db_name}/table/{table_name}/data"/>

向指定表中插入数据，支持单条插入和批量插入。

## 权限要求
- `insert_data` 权限
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
| `table_name` | string | 是 | 表名称 |

### 请求体 - 单条插入
```json
{
  "data": {
    "name": "张三",
    "email": "zhangsan@example.com",
    "age": 25,
    "created_at": "2024-01-01 10:00:00"
  }
}
```

### 请求体 - 批量插入
```json
{
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
  ]
}
```

### 请求字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `data` | object/array | 是 | 要插入的数据，支持对象或数组 |

## 响应

### 单条插入成功响应
**状态码:** `201 Created`

```json
{
  "success": true,
  "message": "数据插入成功",
  "database": "my_database",
  "table": "users",
  "inserted_id": 123,
  "affected_rows": 1
}
```

### 批量插入成功响应
**状态码:** `201 Created`

```json
{
  "success": true,
  "message": "批量数据插入成功",
  "database": "my_database", 
  "table": "users",
  "affected_rows": 2,
  "inserted_count": 2
}
```

### 响应字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `success` | boolean | 操作是否成功 |
| `message` | string | 成功消息 |
| `database` | string | 数据库名称 |
| `table` | string | 表名称 |
| `inserted_id` | integer | 单条插入时的自增ID |
| `affected_rows` | integer | 影响的行数 |
| `inserted_count` | integer | 批量插入时的插入数量 |

## 使用示例

### cURL 示例 - 单条插入
```bash
curl -X POST https://dbapi.muzilix.cn/database/my_database/table/users/data \
  -H "Authorization: Bearer your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "name": "王五",
      "email": "wangwu@example.com",
      "age": 28
    }
  }'
```

### cURL 示例 - 批量插入
```bash
curl -X POST https://dbapi.muzilix.cn/database/my_database/table/users/data \
  -H "Authorization: Bearer your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "data": [
      {
        "name": "赵六",
        "email": "zhaoliu@example.com",
        "age": 32
      },
      {
        "name": "钱七", 
        "email": "qianqi@example.com",
        "age": 35
      }
    ]
  }'
```

### Python 示例
```python
def insert_user_data(api_key, db_name, user_data):
    url = f"https://dbapi.muzilix.cn/database/{db_name}/table/users/data"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    # 单条插入
    if isinstance(user_data, dict):
        payload = {"data": user_data}
    # 批量插入  
    elif isinstance(user_data, list):
        payload = {"data": user_data}
    
    response = requests.post(url, headers=headers, json=payload)
    return response.json()

# 单条插入使用示例
user = {"name": "测试用户", "email": "test@example.com", "age": 25}
result = insert_user_data("your_api_key", "my_app", user)

# 批量插入使用示例  
users = [
    {"name": "用户1", "email": "user1@example.com", "age": 20},
    {"name": "用户2", "email": "user2@example.com", "age": 22}
]
result = insert_user_data("your_api_key", "my_app", users)
```

## 数据类型支持

### 自动类型转换
- **字符串**: 直接插入
- **数字**: 自动转换为对应数值类型
- **布尔值**: 转换为 1/0 或 TRUE/FALSE
- **日期时间**: 支持标准格式字符串

### 特殊值处理
- `null` - 插入 NULL 值
- 空字符串 - 插入空字符串
- 缺失字段 - 使用默认值或 NULL

## 限制说明

### 操作限制
- 频率限制：100次/分钟
- 批量插入最大行数：受系统配置限制
- 字段验证：只允许插入表中存在的字段

### 约束检查
- 主键冲突会返回错误
- 唯一约束冲突会返回错误
- 非空字段必须提供值

## 相关链接

- [数据操作总览](../data-operations/index.md)
- [查询数据](query-data.md)
- [批量操作](../batch-operations/)
- [表结构](../table-operations/table-structure.md)