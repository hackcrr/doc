# 获取表结构

## 端点信息

<ApiEndpoint method="GET" path="/database/{db_name}/table/{table_name}/structure" />

获取指定表的完整结构信息，包括列定义、索引和表统计信息。

## 权限要求
- `table_structure` 权限
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

## 响应

### 成功响应
**状态码:** `200 OK`

```json
{
  "database": "my_database",
  "table": "users",
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
  "create_sql": "CREATE TABLE `users` (...)",
  "statistics": {
    "row_count": 1500,
    "avg_row_length": 256,
    "data_size": 384000,
    "index_size": 102400,
    "create_time": "2024-01-15T10:30:00",
    "update_time": "2024-01-20T14:25:00"
  }
}
```

### 响应字段说明

#### 表信息
| 字段 | 类型 | 说明 |
|------|------|------|
| `database` | string | 数据库名称 |
| `table` | string | 表名称 |
| `create_sql` | string | 完整的 CREATE TABLE SQL |

#### 列信息
| 字段 | 类型 | 说明 |
|------|------|------|
| `field` | string | 列名称 |
| `type` | string | 数据类型 |
| `null` | string | 是否允许 NULL |
| `key` | string | 索引类型 (PRI, UNI, MUL) |
| `default` | string | 默认值 |
| `extra` | string | 额外信息 |

#### 统计信息
| 字段 | 类型 | 说明 |
|------|------|------|
| `row_count` | integer | 行数估算 |
| `avg_row_length` | integer | 平均行长度 |
| `data_size` | integer | 数据大小（字节） |
| `index_size` | integer | 索引大小（字节） |
| `create_time` | string | 表创建时间 |
| `update_time` | string | 最后更新时间 |

## 使用示例
::: code-group
<!-- ### cURL 示例 -->
```bash[cURL 示例 ]
curl -X GET https://dbapi.muzilix.cn/database/my_database/table/users/structure \
  -H "Authorization: Bearer your_api_key"
```

<!-- ### Python 示例 -->
```python[Python 示例]
def get_table_info(api_key, db_name, table_name):
    url = f"https://dbapi.muzilix.cn/database/{db_name}/table/{table_name}/structure"
    headers = {"Authorization": f"Bearer {api_key}"}
    
    response = requests.get(url, headers=headers)
    return response.json()

# 使用示例
table_info = get_table_info("your_api_key", "ecommerce", "orders")
print(f"表: {table_info['table']}")
print(f"行数: {table_info['statistics']['row_count']}")
print("列信息:")
for column in table_info["columns"]:
    print(f"  {column['field']} ({column['type']}) - {column['key'] or '无索引'}")
```
:::
## 列键类型说明

### 键类型含义
- `PRI` - 主键 (Primary Key)
- `UNI` - 唯一索引 (Unique Index)  
- `MUL` - 普通索引 (Multiple)
- 空字符串 - 无索引

### 额外信息说明
- `auto_increment` - 自增列
- `on update CURRENT_TIMESTAMP` - 自动更新时间戳
- 空字符串 - 无额外属性

## 相关链接

- [表操作总览](../table-operations/index.md)
- [表列表](list-tables.md)
- [创建表](create-table.md)
- [数据操作](../data-operations/)