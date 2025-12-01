# 数据操作

## 概述

数据操作 API 提供数据库表中数据的增删改查功能，支持单条和批量操作、复杂查询以及数据导入导出。

## 接口列表

### 基础数据操作
- [`POST /database/{db_name}/table/{table_name}/data`](insert-data.md) - 插入数据
- [`GET /database/{db_name}/table/{table_name}/data`](query-data.md) - 查询数据

### 高级查询
- [`POST /database/{db_name}/query`](execute-query.md) - 执行自定义 SQL 查询
- [`GET /database/{db_name}/tables-info`](query-table-info.md) - 获取所有表信息（辅助 SQL 编写）

### 工具接口
- [`GET /database/{db_name}/query-examples`](/examples/query-examples.md) - 获取查询示例

## 通用要求

### 认证
所有数据操作接口都需要认证：
```http
Authorization: Bearer your_api_key
```

### 权限要求
- 插入数据：`insert_data` 权限 + 数据库 `write` 权限
- 查询数据：`query_data` 权限 + 数据库 `read` 权限
- 执行查询：`execute_query` 权限 + 数据库 `read` 权限
- 表信息查询：`tables_info` 权限 + 数据库 `read` 权限

## 操作类型

### 单条操作
- 插入单条记录
- 查询单条或多条记录
- 简单条件过滤

### 批量操作
- 批量插入多条记录
- 分页查询大量数据
- 复杂查询条件

### 高级功能
- 自定义 SQL 查询（只读）
- 字段选择和数据过滤
- 排序和分页控制

## 数据格式

### 请求数据格式
- JSON 对象或数组
- 支持嵌套数据结构
- 自动类型转换

### 响应数据格式
- 统一 JSON 响应结构
- 分页信息（如适用）
- 错误信息标准化

## 查询能力

### 基础查询
- 全表查询
- 字段选择
- 条件过滤
- 排序分页

### 高级查询
- 多表连接
- 聚合函数
- 分组统计
- 子查询支持

## 安全特性

### 输入验证
- SQL 注入防护
- 数据类型验证
- 查询复杂度限制

### 权限控制
- 数据库级权限检查
- 操作类型权限验证
- 查询结果过滤

## 下一步

- ➕ 学习 [插入数据](insert-data.md)
- 🔍 查看 [数据查询](query-data.md)
- ⚡ 了解 [SQL 查询](execute-query.md)
- 📊 获取 [表信息](query-table-info.md)