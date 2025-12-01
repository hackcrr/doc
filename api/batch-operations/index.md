# 批量操作

## 概述

批量操作 API 提供高效的数据处理功能，支持批量更新、批量删除、数据导入导出等大规模数据操作。

## 接口列表

### 批量数据处理
- [`POST /database/{db_name}/batch/update`](batch-update.md) - 批量更新数据
- [`POST /database/{db_name}/batch/delete`](batch-delete.md) - 批量删除数据

### 数据导入导出
- [`POST /database/{db_name}/export`](export-data.md) - 导出数据为 CSV 或 JSON 格式
- [`POST /database/{db_name}/import`](import-data.md) - 从文件导入数据
- [`GET /download/export/{filename}`](download-export.md) - 下载导出的文件

## 通用要求

### 认证
所有批量操作接口都需要认证：
```http
Authorization: Bearer your_api_key
```

### 权限要求
- 批量更新：`batch_update` 权限 + 数据库 `write` 权限
- 批量删除：`batch_delete` 权限 + 数据库 `write` 权限
- 数据导出：`export_data` 权限 + 数据库 `read` 权限
- 数据导入：`import_data` 权限 + 数据库 `write` 权限

## 操作类型

### 批量更新
- 支持多条记录的条件更新
- 支持不同的更新条件组合
- 支持事务处理

### 批量删除
- 支持条件删除和 ID 列表删除
- 支持安全确认机制
- 自动统计影响行数

### 数据导出
- 支持 CSV 和 JSON 格式
- 支持字段选择和条件过滤
- 自动生成下载链接

### 数据导入
- 支持 JSON 数据直接导入
- 支持重复数据处理策略
- 支持批量插入优化

## 数据格式

### 批量操作格式
- JSON 数组格式的批量数据
- 统一的条件表达式语法
- 标准化的响应结构

### 文件格式支持
- **CSV**: 逗号分隔值文件
- **JSON**: JavaScript 对象表示法
- 自动格式检测和转换

## 性能特性

### 批量处理优势
- 减少网络请求次数
- 提高数据库操作效率
- 支持事务保证数据一致性

### 资源优化
- 分批次处理大数据量
- 内存使用优化
- 超时和错误处理

## 安全特性

### 操作确认
- 危险操作需要显式确认
- 操作前影响行数预估
- 备份建议提示

### 数据保护
- 导出数据访问控制
- 导入数据格式验证
- 文件大小和数量限制

## 下一步

- 🔄 学习 [批量更新](batch-update.md)
- 🗑️ 了解 [批量删除](batch-delete.md)
- 📤 查看 [数据导出](export-data.md)
- 📥 了解 [数据导入](import-data.md)