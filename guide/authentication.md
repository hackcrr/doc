# 认证与权限

## 概述

数据库管理 API 使用基于令牌 (Token) 的认证系统，所有 API 请求都需要在请求头中包含有效的认证信息。

## 认证方式

### Bearer Token 认证

在请求头中添加 `Authorization` 字段：

```http
Authorization: Bearer YOUR_API_KEY
```

或者直接使用 API 密钥：

```http
Authorization: YOUR_API_KEY
```

### 获取 API 密钥

#### 用户登录

```http
POST /auth/login
Content-Type: application/json

{
  "username": "your_username",
  "password": "your_password"
}
```

**响应示例：**
```json
{
  "success": true,
  "message": "登录成功",
  "user": {
    "user_id": "user_1704067890_admin",
    "username": "admin",
    "role": "superadmin",
    "permissions": ["all"]
  },
  "api_key": "abc123def456ghi789jkl012mno345pqr678stu901"
}
```

#### 用户注册

```http
POST /auth/register
Content-Type: application/json

{
  "username": "new_user",
  "password": "secure_password",
  "email": "user@example.com"
}
```

**响应示例：**
```json
{
  "success": true,
  "message": "注册成功",
  "user": {
    "user_id": "user_1704067890_xyz789",
    "username": "new_user",
    "role": "user",
    "permissions": ["register", "auth", "list_own_databases", "create_database"]
  },
  "api_key": "xyz123abc456def789ghi012jkl345mno678pqr901"
}
```

## 权限系统

### 用户角色

系统定义了四种用户角色，具有不同的权限级别：

| 角色 | 权限级别 | 描述 | 默认权限 |
|------|----------|------|----------|
| `readonly` | 1 | 只读权限，只能查询数据 | 基础查询权限 |
| `operator` | 2 | 操作权限，可以查询和插入数据 | 完整的用户操作权限 |
| `admin` | 3 | 管理员权限，可以管理数据库 | 包含用户管理权限 |
| `superadmin` | 4 | 超级管理员，可以管理用户和系统 | 所有权限 |

### 权限列表

#### 基础用户权限
```python
USER_BASIC_PERMISSIONS = [
    'register', 'auth', 'list_own_databases', 'create_database',
    'database_info', 'list_tables', 'table_structure', 'query_data', 
    'execute_query', 'insert_data', 'export_data', 'create_table',
    'batch_update', 'batch_delete', 'import_data', 'backup_database',
    'list_backups', 'download_backup', 'monitoring', 'tables_info', 
    'query_examples'
]
```

#### 各角色默认权限
- **user**: 基础用户权限
- **readonly**: 只读权限子集
- **operator**: 基础用户权限
- **admin**: 基础用户权限 + 用户管理权限
- **superadmin**: 所有权限

## 数据库权限

除了系统级别的权限，还有数据库级别的访问控制：

### 权限级别
- `read`: 只读权限 - 可以查询数据
- `write`: 读写权限 - 可以插入、更新、删除数据
- `admin`: 完全控制权限 - 可以创建表、备份等管理操作

### 权限检查流程
1. 验证用户身份和系统权限
2. 检查用户对目标数据库的访问权限
3. 验证操作所需的权限级别
4. 执行操作或返回权限错误

## API 端点权限映射

| 端点 | 方法 | 所需权限 | 描述 |
|------|------|----------|------|
| `/auth/login` | POST | None | 用户登录 |
| `/auth/register` | POST | None | 用户注册 |
| `/auth/logout` | POST | `auth` | 用户登出 |
| `/auth/profile` | GET | `auth` | 获取用户信息 |
| `/create` | POST | `create_database` | 创建数据库 |
| `/databases` | GET | `list_databases` | 列出数据库 |
| `/database/{db_name}` | DELETE | `delete_database` | 删除数据库 |
| `/database/{db_name}/info` | GET | `database_info` | 数据库信息 |
| `/database/{db_name}/tables` | GET | `list_tables` | 列出表 |
| `/database/{db_name}/table` | POST | `create_table` | 创建表 |

*完整权限映射请参考权限矩阵文档*

## 错误处理

### 认证错误

**401 Unauthorized**
```json
{
  "error": "需要认证，请提供API密钥"
}
```

```json
{
  "error": "无效的API密钥"
}
```

### 权限错误

**403 Forbidden**
```json
{
  "error": "权限不足"
}
```

```json
{
  "error": "没有访问该数据库的权限"
}
```

### 其他错误

**400 Bad Request**
```json
{
  "error": "用户名和密码不能为空"
}
```

```json
{
  "error": "用户名已存在"
}
```

## 使用示例

### 1. 基础认证流程

```bash
# 1. 用户登录获取 API 密钥
curl -X POST https://dbapi.muzilix.cn/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'

# 2. 使用 API 密钥访问受保护端点
curl -X GET https://dbapi.muzilix.cn/databases \
  -H "Authorization: Bearer abc123def456ghi789"
```

### 2. 权限验证示例

```python
import requests

# 设置 API 密钥
API_KEY = "your_api_key_here"
headers = {"Authorization": f"Bearer {API_KEY}"}

# 尝试访问需要特定权限的端点
response = requests.get(
    "https://dbapi.muzilix.cn/databases",
    headers=headers
)

if response.status_code == 403:
    print("权限不足：需要 list_databases 权限")
elif response.status_code == 200:
    print("访问成功")
```

## 安全最佳实践

### 1. API 密钥管理
- 🔐 **不要将 API 密钥提交到版本控制系统**
- 🔄 **定期轮换 API 密钥**
- 🗑️ **及时撤销不再使用的密钥**
- 🌐 **使用环境变量存储敏感信息**

### 2. 密码安全
- 🔒 **密码长度至少 6 位**
- ⚡ **使用强密码策略**
- 📧 **注册时提供有效的邮箱地址**

### 3. 权限管理
- 📋 **遵循最小权限原则**
- 👥 **定期审查用户权限**
- 🗄️ **按需分配数据库访问权限**

### 4. 审计与监控
- 📊 **启用操作审计日志**
- 🔍 **定期检查 API 使用统计**
- 🚨 **监控异常访问模式**

## 故障排除

### 常见问题

1. **认证失败**
   - 检查 API 密钥是否正确
   - 验证密钥是否已过期或被撤销
   - 确认用户名和密码正确

2. **权限不足**
   - 检查用户角色和权限设置
   - 确认对目标数据库的访问权限
   - 联系管理员提升权限级别

3. **数据库访问被拒绝**
   - 验证数据库名称是否正确
   - 检查用户是否被授予数据库访问权限
   - 确认权限级别是否足够执行操作

### 获取帮助

如果遇到认证或权限问题，请联系系统管理员或参考：
- [错误码参考](/reference/error-codes)
- [权限矩阵](/reference/permission-matrix)
- [API 限制说明](/reference/api-limits)