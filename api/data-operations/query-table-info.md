# 获取表信息

## 端点信息

<ApiEndpoint method="GET" path="/database/{db_name}/tables-info"/>

获取数据库中所有表的详细信息，包括表结构、统计信息等，用于辅助 SQL 查询编写。

## 权限要求
- `tables_info` 权限
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

## 响应

### 成功响应
**状态码:** `200 OK`

```json
{
  "database": "my_database",
  "tables": [
    {
      "table_name": "users",
      "columns": [
        {
          "field": "id",
          "type": "int(11)",
          "null": "NO",
          "key": "PRI",
          "default": null,
          "extra": "auto_increment"
        },
        {
          "field": "name",
          "type": "varchar(100)",
          "null": "NO",
          "key": "",
          "default": null,
          "extra": ""
        },
        {
          "field": "email",
          "type": "varchar(255)",
          "null": "YES",
          "key": "UNI",
          "default": null,
          "extra": ""
        }
      ],
      "statistics": {
        "row_count": 1500,
        "data_size": 384000,
        "index_size": 102400,
        "create_time": "2024-01-15T10:30:00"
      }
    },
    {
      "table_name": "orders",
      "columns": [
        {
          "field": "id",
          "type": "int(11)",
          "null": "NO",
          "key": "PRI",
          "default": null,
          "extra": "auto_increment"
        },
        {
          "field": "user_id",
          "type": "int(11)",
          "null": "NO",
          "key": "MUL",
          "default": null,
          "extra": ""
        },
        {
          "field": "amount",
          "type": "decimal(10,2)",
          "null": "NO",
          "key": "",
          "default": null,
          "extra": ""
        }
      ],
      "statistics": {
        "row_count": 5000,
        "data_size": 1024000,
        "index_size": 204800,
        "create_time": "2024-01-16T09:15:00"
      }
    }
  ],
  "count": 2
}
```

### 响应字段说明

#### 数据库信息
| 字段 | 类型 | 说明 |
|------|------|------|
| `database` | string | 数据库名称 |
| `count` | integer | 表数量 |

#### 表信息
| 字段 | 类型 | 说明 |
|------|------|------|
| `table_name` | string | 表名称 |
| `columns` | array | 列定义列表 |
| `statistics` | object | 表统计信息 |

#### 列信息
| 字段 | 类型 | 说明 |
|------|------|------|
| `field` | string | 列名称 |
| `type` | string | 数据类型 |
| `null` | string | 是否允许 NULL |
| `key` | string | 索引类型 |
| `default` | string | 默认值 |
| `extra` | string | 额外信息 |

#### 统计信息
| 字段 | 类型 | 说明 |
|------|------|------|
| `row_count` | integer | 行数估算 |
| `data_size` | integer | 数据大小（字节） |
| `index_size` | integer | 索引大小（字节） |
| `create_time` | string | 表创建时间 |

## 使用示例

### cURL 示例
```bash
curl -X GET https://dbapi.muzilix.cn/database/my_database/tables-info \
  -H "Authorization: Bearer your_api_key"
```

### Python 示例
```python
def get_tables_info(api_key, db_name):
    url = f"https://dbapi.muzilix.cn/database/{db_name}/tables-info"
    headers = {"Authorization": f"Bearer {api_key}"}
    
    response = requests.get(url, headers=headers)
    return response.json()

# 使用示例
tables_info = get_tables_info("your_api_key", "ecommerce")
print(f"数据库 {tables_info['database']} 包含 {tables_info['count']} 个表")

for table in tables_info["tables"]:
    print(f"\n📊 表: {table['table_name']}")
    print(f"   行数: {table['statistics']['row_count']}")
    print(f"   大小: {table['statistics']['data_size'] + table['statistics']['index_size']} 字节")
    print("   字段:")
    for column in table["columns"]:
        key_info = f" ({column['key']})" if column['key'] else ""
        print(f"     - {column['field']} {column['type']}{key_info}")
```

## 应用场景

### 1. SQL 查询辅助
获取表结构信息，帮助编写正确的 SQL 查询：
```python
# 在编写 JOIN 查询前了解表结构
tables_info = get_tables_info(api_key, "my_app")

users_columns = [col["field"] for col in tables_info["tables"][0]["columns"]]
orders_columns = [col["field"] for col in tables_info["tables"][1]["columns"]]

print("Users 表字段:", users_columns)
print("Orders 表字段:", orders_columns)
```

### 2. 数据模型分析
分析数据库中的数据模型关系：
```python
def analyze_data_model(tables_info):
    """分析数据模型"""
    for table in tables_info["tables"]:
        primary_keys = [col for col in table["columns"] if col["key"] == "PRI"]
        foreign_keys = [col for col in table["columns"] if col["key"] == "MUL" and col["field"].endswith("_id")]
        
        print(f"\n表: {table['table_name']}")
        if primary_keys:
            print(f"  主键: {[pk['field'] for pk in primary_keys]}")
        if foreign_keys:
            print(f"  外键: {[fk['field'] for fk in foreign_keys]}")
```

### 3. 文档生成
自动生成数据库文档：
```python
def generate_database_docs(tables_info):
    """生成数据库文档"""
    docs = f"# 数据库: {tables_info['database']}\n\n"
    
    for table in tables_info["tables"]:
        docs += f"## 表: {table['table_name']}\n\n"
        docs += f"- 行数: {table['statistics']['row_count']}\n"
        docs += f"- 创建时间: {table['statistics']['create_time']}\n\n"
        
        docs += "### 字段结构\n\n"
        docs += "| 字段名 | 类型 | 允许空 | 键 | 默认值 | 额外 |\n"
        docs += "|--------|------|--------|----|--------|------|\n"
        
        for column in table["columns"]:
            docs += f"| {column['field']} | {column['type']} | {column['null']} | {column['key']} | {column['default']} | {column['extra']} |\n"
        
        docs += "\n"
    
    return docs
```

## 相关链接

- [数据操作总览](../data-operations/index.md)
- [查询数据](query-data.md)
- [执行SQL查询](execute-query.md)
- [查询示例](/examples/query-examples.md)
- [表操作](../table-operations/)