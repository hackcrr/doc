# 查询数据

## 端点信息

<ApiEndpoint method="GET" path="/database/{db_name}/table/{table_name}/data"/>

查询指定表中的数据，支持分页、字段选择、条件过滤和排序。

## 权限要求
- `query_data` 权限
- 对目标数据库的 `read` 权限

## 请求

### 请求头
| 头部 | 值 | 必填 |
|------|-----|------|
| `Authorization` | `Bearer your_api_key` | 是 |

### 路径参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `db_name` | string | 是 | 数据库名称 |
| `table_name` | string | 是 | 表名称 |

### 查询参数
| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|---------|------|
| `page` | integer | 否 | 1 | 页码 |
| `page_size` | integer | 否 | 20 | 每页大小，最大100 |
| `fields` | string | 否 | * | 指定返回字段，逗号分隔 |
| `where` | string | 否 | - | 筛选条件 |
| `order_by` | string | 否 | - | 排序字段 |
| `order` | string | 否 | asc | 排序方式：asc/desc |

## 响应

### 成功响应
**状态码:** `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "张三",
      "email": "zhangsan@example.com",
      "age": 25,
      "created_at": "2024-01-01T10:00:00"
    },
    {
      "id": 2, 
      "name": "李四",
      "email": "lisi@example.com",
      "age": 30,
      "created_at": "2024-01-02T14:30:00"
    }
  ],
  "pagination": {
    "page": 1,
    "page_size": 20,
    "total_count": 150,
    "total_pages": 8,
    "has_prev": false,
    "has_next": true
  },
  "query_info": {
    "sql": "SELECT * FROM `users` LIMIT 0, 20",
    "database": "my_database",
    "table": "users"
  }
}
```

### 响应字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `success` | boolean | 操作是否成功 |
| `data` | array | 查询结果数据 |
| `pagination` | object | 分页信息 |
| `query_info` | object | 查询信息 |

#### 分页信息
| 字段 | 类型 | 说明 |
|------|------|------|
| `page` | integer | 当前页码 |
| `page_size` | integer | 每页大小 |
| `total_count` | integer | 总记录数 |
| `total_pages` | integer | 总页数 |
| `has_prev` | boolean | 是否有上一页 |
| `has_next` | boolean | 是否有下一页 |

## 使用示例

### cURL 示例 - 基础查询
```bash
curl -X GET "https://dbapi.muzilix.cn/database/my_database/table/users/data" \
  -H "Authorization: Bearer your_api_key"
```

### cURL 示例 - 带参数查询
```bash
curl -X GET "https://dbapi.muzilix.cn/database/my_database/table/users/data?page=2&page_size=10&fields=id,name,email&order_by=created_at&order=desc" \
  -H "Authorization: Bearer your_api_key"
```

### cURL 示例 - 条件查询
```bash
curl -X GET "https://dbapi.muzilix.cn/database/my_database/table/users/data?where=age>25%20AND%20name%20LIKE%20'%25张%25'" \
  -H "Authorization: Bearer your_api_key"
```

### Python 示例
```python
def query_table_data(api_key, db_name, table_name, params=None):
    url = f"https://dbapi.muzilix.cn/database/{db_name}/table/{table_name}/data"
    headers = {"Authorization": f"Bearer {api_key}"}
    
    response = requests.get(url, headers=headers, params=params)
    return response.json()

# 基础查询
result = query_table_data("your_api_key", "my_app", "users")
print(f"获取到 {len(result['data'])} 条数据")

# 分页查询
params = {"page": 1, "page_size": 10, "order_by": "created_at", "order": "desc"}
result = query_table_data("your_api_key", "my_app", "users", params)

# 字段选择和条件查询
params = {
    "fields": "id,name,email",
    "where": "age > 25 AND status = 'active'",
    "page_size": 5
}
result = query_table_data("your_api_key", "my_app", "users", params)
```

## 查询参数详解

### 字段选择 (`fields`)
指定返回的字段，多个字段用逗号分隔：
```
fields=id,name,email,created_at
```

### 条件过滤 (`where`)
使用 SQL WHERE 子句语法进行过滤：
```
where=age > 25
where=name LIKE '%张%' AND status = 'active'
where=created_at > '2024-01-01'
```

### 排序控制 (`order_by`, `order`)
指定排序字段和方向：
```
order_by=created_at&order=desc
order_by=name,age&order=asc,desc
```

### 分页控制 (`page`, `page_size`)
控制返回数据量和页码：
```
page=2&page_size=50
```

## 条件表达式示例

### 比较操作
```
age = 25
age > 18
salary <= 5000
name != '张三'
```

### 逻辑操作
```
age > 18 AND status = 'active'
role = 'admin' OR role = 'manager'
NOT is_deleted
```

### 模糊查询
```
name LIKE '%张%'
email LIKE 'user%@example.com'
```

### IN 查询
```
id IN (1, 2, 3, 4)
status IN ('active', 'pending')
```

## 限制说明

### 查询限制
- 最大页大小：100 条
- 频率限制：200次/小时
- 条件复杂度：受系统安全限制

### 字段验证
- 只能查询表中存在的字段
- 字段名会自动验证和转义

## 相关链接

- [数据操作总览](../data-operations/index.md)
- [插入数据](insert-data.md)
- [执行SQL查询](execute-query.md)
- [表结构](../table-operations/table-structure.md)