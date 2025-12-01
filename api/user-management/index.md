# 用户管理

## 概述

用户管理 API 提供完整的用户认证、权限管理和访问控制功能，支持多角色权限体系、API 密钥管理和数据库级别的权限控制。

## 接口列表

### 用户认证
- [`POST /auth/register`](auth-register.md) - 用户自助注册
- [`POST /auth/login`](auth-login.md) - 用户登录
- [`POST /auth/logout`](auth-logout.md) - 用户登出
- [`GET /auth/profile`](auth-profile.md) - 获取当前用户信息
- [`POST /auth/change-password`](change-password.md) - 修改密码

### 用户管理（管理员）
- [`POST /admin/users`](admin-users.md) - 创建用户
- [`GET /admin/users`](admin-users.md) - 列出所有用户
- [`PUT /admin/users/{user_id}`](admin-users.md) - 更新用户信息
- [`DELETE /admin/users/{user_id}`](admin-users.md) - 删除用户
- [`POST /admin/users/{user_id}/reset-password`](change-password.md) - 重置用户密码

### API 密钥管理
- [`GET /admin/api-keys`](admin-api-keys.md) - 列出所有 API 密钥
- [`POST /admin/api-keys/{api_key}/revoke`](admin-api-keys.md) - 撤销 API 密钥
- [`GET /admin/api-keys/{user_id}`](admin-api-keys.md) - 获取用户 API 密钥

### 权限管理
- [`POST /admin/database-permissions`](database-permissions.md) - 授予数据库权限
- [`GET /user/databases`](database-permissions.md) - 获取用户数据库列表

### 系统管理
- [`GET /admin/system-stats`](admin-users.md) - 获取系统统计信息（管理员视图）
- [`GET /admin/users/search`](admin-users.md) - 搜索用户

## 通用要求

### 认证
所有用户管理接口都需要认证：
```http
Authorization: Bearer your_api_key
```

### 权限要求
- 用户注册：无需认证（公开接口）
- 用户登录：无需认证（公开接口）
- 个人信息：`auth` 权限
- 用户管理：`user_management` 权限
- API 密钥管理：`user_management` 权限
- 权限分配：`user_management` 权限

## 用户角色体系

### 角色定义
| 角色 | 权限级别 | 描述 |
|------|----------|------|
| `readonly` | 1 | 只读权限，仅能查询数据 |
| `operator` | 2 | 操作权限，可查询和插入数据 |
| `user` | 2 | 普通用户，可管理自己的数据库 |
| `admin` | 3 | 管理员，可管理用户和所有数据库 |
| `superadmin` | 4 | 超级管理员，拥有所有权限 |

### 默认权限
每个角色都有预设的权限集合，管理员可以额外授予特定权限。

## 认证机制

### API 密钥认证
- 32位 URL 安全令牌
- Bearer Token 格式支持
- 自动失效和更新机制
- 使用记录审计

### 密码安全
- SHA-256 加盐哈希
- 密码强度验证
- 定期密码更新
- 密码重置功能

## 权限控制

### 接口权限
基于端点的细粒度权限控制，每个 API 端点都有对应的权限要求。

### 数据库权限
三级数据库访问权限：
- `read` - 只读访问
- `write` - 读写访问
- `admin` - 完全控制

### 权限继承
- 角色默认权限
- 额外授予权限
- 权限去重和合并

## 用户管理功能

### 自助服务
- 用户注册和账户激活
- 个人信息管理
- 密码修改和重置
- API 密钥生成

### 管理功能
- 用户创建和删除
- 角色分配和权限管理
- 账户状态控制
- 操作审计日志

## API 密钥管理

### 密钥特性
- 自动生成安全密钥
- 密钥描述和标签
- 启用/禁用控制
- 最后使用时间记录

### 安全措施
- 密钥部分显示
- 自动撤销机制
- 使用频率监控
- 异常访问检测

## 审计日志

### 操作记录
- 用户登录和登出
- 权限变更记录
- 敏感操作追踪
- API 密钥使用

### 安全监控
- 失败登录尝试
- 权限变更审计
- 异常行为检测
- 系统访问统计

## 数据库集成

### 用户存储
- 专用认证数据库 (`api_auth`)
- 用户信息加密存储
- 外键约束和完整性
- 事务安全操作

### 权限存储
- 角色权限映射
- 用户特定权限
- 数据库访问权限
- 权限授予记录

## 安全特性

### 数据保护
- 密码加盐哈希
- API 密钥安全存储
- 敏感信息脱敏
- 数据传输加密

### 访问控制
- 基于角色的权限
- 数据库级别权限
- 接口级别权限
- IP 地址和用户代理记录

## 限制说明

### 操作限制
- 用户注册：频率限制
- 密码重置：安全验证
- API 密钥创建：数量限制
- 权限变更：审计记录

### 安全限制
- 会话超时控制
- 并发连接限制
- 失败尝试锁定
- 密钥轮换策略

## 默认配置

### 初始管理员
系统首次启动时自动创建默认管理员：
- 用户名：`admin`
- 密码：`admin123`
- 角色：`superadmin`

### 默认权限
新用户注册时自动获得基本权限，包括自助服务和基础数据库操作权限。

## 下一步

- 👤 学习 [用户认证](auth-login.md)
- 📝 了解 [用户注册](auth-register.md)
- 🔐 掌握 [密码管理](change-password.md)
- 👥 查看 [用户管理](admin-users.md)
- 🔑 管理 [API 密钥](admin-api-keys.md)
- 🎯 配置 [数据库权限](database-permissions.md)