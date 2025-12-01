# 表操作

## 概述

表操作 API 提供数据库表的管理功能，包括创建表、查看表列表、获取表结构信息等操作。

## 接口列表

### 表管理
- [`GET /database/{db_name}/tables`](list-tables.md) - 获取数据库中的所有表
- [`POST /database/{db_name}/table`](create-table.md) - 创建新表
- [`GET /database/{db_name}/table/{table_name}/structure`](table-structure.md) - 获取表结构信息

## 通用要求

### 认证
所有表操作接口都需要认证：
```http
Authorization: Bearer your_api_key
```

### 权限要求
- 查看表列表：`list_tables` 权限 + 数据库 `read` 权限
- 创建表：`create_table` 权限 + 数据库 `write` 权限  
- 查看表结构：`table_structure` 权限 + 数据库 `read` 权限

### 命名规范
- 表名只能包含字母、数字和下划线
- 不能是纯数字
- 遵循 MySQL 表命名规范

## 使用流程

### 1. 查看表列表
```bash
GET /database/{db_name}/tables → 获取表列表
```

### 2. 创建表结构
```bash
POST /database/{db_name}/table → 定义表结构 → 创建成功
```

### 3. 查看表详情
```bash
GET /database/{db_name}/table/{table_name}/structure → 获取完整表结构
```

## 错误处理

### 常见错误码
| 状态码 | 说明 |
|--------|------|
| 400 | 表名称格式错误或参数无效 |
| 401 | 认证失败 |
| 403 | 权限不足 |
| 404 | 数据库或表不存在 |
| 409 | 表已存在 |
| 429 | 操作频率超限 |

### 错误响应示例
```json
{
  "error": "表名称只能包含字母、数字和下划线"
}
```

## 操作限制

### 频率限制
- 创建表：20次/分钟
- 其他操作：根据默认限流规则

### 表结构限制
- 支持所有 MySQL 数据类型
- 支持约束和索引定义
- 支持表引擎和字符集设置

## 数据类型支持

### 常用数据类型
- **数值类型**: INT, BIGINT, DECIMAL, FLOAT, DOUBLE
- **字符串类型**: VARCHAR, TEXT, CHAR
- **日期时间**: DATE, DATETIME, TIMESTAMP, TIME
- **二进制类型**: BLOB, LONGBLOB

### 约束支持
- PRIMARY KEY
- FOREIGN KEY
- UNIQUE
- NOT NULL
- AUTO_INCREMENT
- DEFAULT values

## 下一步

- 📋 查看 [表列表](list-tables.md)
- ➕ 学习 [创建表](create-table.md)
- 🔍 了解 [表结构](table-structure.md)
- 📊 查看 [数据操作](../data-operations/)