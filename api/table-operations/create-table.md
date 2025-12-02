# 创建表

## 端点信息

<ApiEndpoint method="POST" path="/database/{db_name}/table" />

在指定数据库中创建新表。

## 权限要求
- `create_table` 权限
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
  "columns": [
    {
      "name": "id",
      "type": "INT",
      "constraints": "AUTO_INCREMENT PRIMARY KEY"
    },
    {
      "name": "name", 
      "type": "VARCHAR(100)",
      "constraints": "NOT NULL"
    },
    {
      "name": "email",
      "type": "VARCHAR(255)", 
      "constraints": "UNIQUE"
    },
    {
      "name": "created_at",
      "type": "TIMESTAMP",
      "constraints": "DEFAULT CURRENT_TIMESTAMP"
    }
  ],
  "engine": "InnoDB",
  "charset": "utf8mb4"
}
```

### 请求字段说明

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|---------|------|
| `table_name` | string | 是 | - | 表名称 |
| `columns` | array | 是 | - | 列定义列表 |
| `engine` | string | 否 | `InnoDB` | 表存储引擎 |
| `charset` | string | 否 | `utf8mb4` | 表字符集 |

### 列定义字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | string | 是 | 列名称 |
| `type` | string | 是 | 数据类型 |
| `constraints` | string | 否 | 约束条件 |

## 响应

### 成功响应
**状态码:** `201 Created`

```json
{
  "success": true,
  "message": "表 users 创建成功",
  "database": "my_database",
  "table": "users",
  "sql": "CREATE TABLE `users` (\n  `id` INT AUTO_INCREMENT PRIMARY KEY,\n  `name` VARCHAR(100) NOT NULL,\n  `email` VARCHAR(255) UNIQUE,\n  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
}
```

## 使用示例
::: code-group
<!-- ### cURL 示例 -->
```bash[cURL 示例]
curl -X POST https://dbapi.muzilix.cn/database/my_database/table \
  -H "Authorization: Bearer your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "table_name": "products",
    "columns": [
      {
        "name": "id",
        "type": "INT", 
        "constraints": "AUTO_INCREMENT PRIMARY KEY"
      },
      {
        "name": "name",
        "type": "VARCHAR(200)",
        "constraints": "NOT NULL"
      },
      {
        "name": "price",
        "type": "DECIMAL(10,2)",
        "constraints": "NOT NULL"
      }
    ],
    "engine": "InnoDB",
    "charset": "utf8mb4"
  }'
```

<!-- ### Python 示例 -->
```python[Python 示例]
def create_user_table(api_key, db_name):
    table_definition = {
        "table_name": "users",
        "columns": [
            {
                "name": "id",
                "type": "INT",
                "constraints": "AUTO_INCREMENT PRIMARY KEY"
            },
            {
                "name": "username",
                "type": "VARCHAR(50)",
                "constraints": "NOT NULL UNIQUE"
            },
            {
                "name": "email",
                "type": "VARCHAR(100)",
                "constraints": "NOT NULL"
            },
            {
                "name": "created_at",
                "type": "TIMESTAMP",
                "constraints": "DEFAULT CURRENT_TIMESTAMP"
            }
        ],
        "engine": "InnoDB",
        "charset": "utf8mb4"
    }
    
    result = create_table(api_key, db_name, table_definition)
    return result
```
:::
## 支持的数据类型

### 数值类型
- `INT`, `BIGINT`, `SMALLINT`, `TINYINT`
- `DECIMAL(precision, scale)`, `FLOAT`, `DOUBLE`
- `BOOLEAN`

### 字符串类型
- `VARCHAR(length)`, `CHAR(length)`
- `TEXT`, `LONGTEXT`, `MEDIUMTEXT`
- `JSON`

### 日期时间类型
- `DATE`, `DATETIME`, `TIMESTAMP`
- `TIME`, `YEAR`

### 二进制类型
- `BLOB`, `LONGBLOB`, `MEDIUMBLOB`

## 支持的约束

### 常用约束
- `PRIMARY KEY` - 主键
- `AUTO_INCREMENT` - 自增
- `NOT NULL` - 非空
- `UNIQUE` - 唯一
- `DEFAULT value` - 默认值
- `FOREIGN KEY` - 外键

### 组合约束
```json
{
  "name": "user_id",
  "type": "INT", 
  "constraints": "NOT NULL AUTO_INCREMENT PRIMARY KEY"
}
```

## 表引擎选项

### 常用引擎
- `InnoDB` - 推荐，支持事务和外键
- `MyISAM` - 简单表，不支持事务
- `MEMORY` - 内存表，临时数据

## 字符集选项

### 推荐字符集
- `utf8mb4` - 完整 Unicode 支持
- `utf8` - 基本 Unicode 支持
- `latin1` - 西欧语言

## 相关链接

- [表操作总览](../table-operations/index.md)
- [表列表](list-tables.md)
- [表结构](table-structure.md)