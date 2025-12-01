# 监控统计

## 概述

监控统计 API 提供数据库性能、系统状态、API 使用情况等全方位的监控和统计功能，帮助您了解系统运行状况和性能指标。

## 接口列表

### 数据库统计
- [`GET /stats/database`](database-stats.md) - 获取所有数据库统计概览
- [`GET /stats/database/{db_name}`](database-stats.md) - 获取单个数据库详细统计

### 性能监控
- [`GET /stats/performance`](performance-stats.md) - 获取数据库性能统计
- [`GET /stats/query-analysis`](query-analysis.md) - 获取查询分析统计

### 使用统计
- [`GET /stats/api-usage`](api-usage-stats.md) - 获取 API 使用统计
- [`GET /stats/system`](system-stats.md) - 获取系统统计信息
- [`GET /stats/summary`](stats-summary.md) - 获取统计摘要

## 通用要求

### 认证
所有监控统计接口都需要认证：
```http
Authorization: Bearer your_api_key
```

### 权限要求
- 所有监控统计接口都需要 `monitoring` 权限
- 需要对应数据库的 `read` 权限

## 监控维度

### 数据库层面
- 数据库大小和表数量统计
- 数据增长趋势分析
- 存储空间使用情况

### 性能层面
- 连接数和并发统计
- 查询性能分析
- 慢查询识别和优化

### 系统层面
- API 使用频率统计
- 错误率和响应时间
- 系统资源使用情况

## 数据来源

### 实时监控数据
- MySQL 性能模式 (Performance Schema)
- 系统状态变量
- API 访问日志
- 操作审计日志

### 统计计算
- 实时聚合计算
- 历史趋势分析
- 性能基准比较

## 使用场景

### 运维监控
- 实时数据库健康检查
- 性能瓶颈识别
- 容量规划支持

### 业务分析
- API 使用模式分析
- 用户行为统计
- 系统负载预测

### 故障诊断
- 异常检测和告警
- 性能问题排查
- 安全事件分析

## 数据时效性

### 实时数据
- 连接状态和活跃查询
- 当前系统负载
- 实时性能指标

### 近实时数据
- API 使用统计（分钟级）
- 查询性能分析
- 错误率统计

### 历史数据
- 长期趋势分析
- 容量规划数据
- 审计日志记录

## 安全特性

### 数据隔离
- 用户只能查看自己有权限的数据库统计
- API 使用统计按用户隔离
- 敏感信息脱敏处理

### 访问控制
- 监控数据访问权限验证
- 操作日志审计
- 敏感统计信息保护

## 性能考虑

### 查询优化
- 统计查询缓存
- 分页和限制返回数据量
- 异步统计计算

### 资源使用
- 监控数据采样
- 统计计算负载均衡
- 内存使用优化

## 下一步

- 📊 查看 [数据库统计](database-stats.md)
- ⚡ 了解 [性能统计](performance-stats.md)
- 🔍 分析 [查询分析](query-analysis.md)
- 📈 查看 [API 使用统计](api-usage-stats.md)
- 💻 获取 [系统统计](system-stats.md)
- 📋 查看 [统计摘要](stats-summary.md)