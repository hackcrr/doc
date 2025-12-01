# 权限矩阵

## 概述

本文档详细说明 Database API 的权限体系，包括角色定义、权限分配和访问控制规则。

## 权限体系结构

### 权限层级
1. **接口权限** - 控制对特定 API 端点的访问
2. **数据库权限** - 控制对具体数据库的访问级别
3. **数据权限** - 控制对数据的操作类型

## 角色定义

### 角色列表

| 角色 | 级别 | 描述 | 适用用户 |
|------|------|------|----------|
| `readonly` | 1 | 只读权限 | 数据分析师、报表用户 |
| `operator` | 2 | 操作员权限 | 数据录入员、运营人员 |
| `user` | 3 | 普通用户 | 一般系统用户 |
| `admin` | 4 | 管理员 | 系统管理员 |
| `superadmin` | 5 | 超级管理员 | 系统超级管理员 |

## 接口权限矩阵

### 健康检查
| 端点 | 方法 | readonly | operator | user | admin | superadmin |
|------|------|----------|----------|------|-------|------------|
| `/health` | GET | ✅ | ✅ | ✅ | ✅ | ✅ |

### 数据库管理
| 端点 | 方法 | readonly | operator | user | admin | superadmin |
|------|------|----------|----------|------|-------|------------|
| `/create` | POST | ❌ | ❌ | ✅ | ✅ | ✅ |
| `/databases` | GET | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/database/{db_name}` | DELETE | ❌ | ❌ | ❌ | ✅ | ✅ |
| `/database/{db_name}/info` | GET | ✅ | ✅ | ✅ | ✅ | ✅ |

### 表操作
| 端点 | 方法 | readonly | operator | user | admin | superadmin |
|------|------|----------|----------|------|-------|------------|
| `/database/{db_name}/tables` | GET | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/database/{db_name}/table` | POST | ❌ | ✅ | ✅ | ✅ | ✅ |
| `/database/{db_name}/table/{table_name}/structure` | GET | ✅ | ✅ | ✅ | ✅ | ✅ |

### 数据操作
| 端点 | 方法 | readonly | operator | user | admin | superadmin |
|------|------|----------|----------|------|-------|------------|
| `/database/{db_name}/table/{table_name}/data` | POST | ❌ | ✅ | ✅ | ✅ | ✅ |
| `/database/{db_name}/table/{table_name}/data` | GET | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/database/{db_name}/query` | POST | ✅ | ✅ | ✅ | ✅ | ✅ |

### 批量操作
| 端点 | 方法 | readonly | operator | user | admin | superadmin |
|------|------|----------|----------|------|-------|------------|
| `/database/{db_name}/batch/update` | POST | ❌ | ✅ | ✅ | ✅ | ✅ |
| `/database/{db_name}/batch/delete` | POST | ❌ | ✅ | ✅ | ✅ | ✅ |
| `/database/{db_name}/export` | POST | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/database/{db_name}/import` | POST | ❌ | ✅ | ✅ | ✅ | ✅ |

### 备份恢复
| 端点 | 方法 | readonly | operator | user | admin | superadmin |
|------|------|----------|----------|------|-------|------------|
| `/database/{db_name}/backup` | POST | ❌ | ✅ | ✅ | ✅ | ✅ |
| `/database/{db_name}/backups` | GET | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/backup/{filename}` | GET | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/backup/{filename}` | DELETE | ❌ | ❌ | ✅ | ✅ | ✅ |

### 监控统计
| 端点 | 方法 | readonly | operator | user | admin | superadmin |
|------|------|----------|----------|------|-------|------------|
| `/stats/database` | GET | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/stats/performance` | GET | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/stats/query-analysis` | GET | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/stats/api-usage` | GET | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/stats/system` | GET | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/stats/summary` | GET | ✅ | ✅ | ✅ | ✅ | ✅ |

### 用户认证
| 端点 | 方法 | readonly | operator | user | admin | superadmin |
|------|------|----------|----------|------|-------|------------|
| `/auth/register` | POST | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/auth/login` | POST | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/auth/logout` | POST | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/auth/profile` | GET | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/auth/change-password` | POST | ✅ | ✅ | ✅ | ✅ | ✅ |

### 用户管理
| 端点 | 方法 | readonly | operator | user | admin | superadmin |
|------|------|----------|----------|------|-------|------------|
| `/admin/users` | GET | ❌ | ❌ | ❌ | ✅ | ✅ |
| `/admin/users` | POST | ❌ | ❌ | ❌ | ✅ | ✅ |
| `/admin/users/{user_id}` | PUT | ❌ | ❌ | ❌ | ✅ | ✅ |
| `/admin/users/{user_id}` | DELETE | ❌ | ❌ | ❌ | ✅ | ✅ |
| `/admin/api-keys` | GET | ❌ | ❌ | ❌ | ✅ | ✅ |
| `/admin/database-permissions` | POST | ❌ | ❌ | ❌ | ✅ | ✅ |

## 数据库权限级别

### 权限级别定义

| 级别 | 权限 | 描述 | 允许的操作 |
|------|------|------|------------|
| `read` | 只读 | 数据查询权限 | 查询数据、查看结构、导出数据 |
| `write` | 读写 | 数据操作权限 | 所有读权限 + 插入、更新、删除数据 |
| `admin` | 管理 | 完全控制权限 | 所有读写权限 + 删除数据库、备份恢复 |

### 数据库操作权限矩阵

| 操作 | read | write | admin |
|------|------|-------|-------|
| 查询数据 | ✅ | ✅ | ✅ |
| 查看表结构 | ✅ | ✅ | ✅ |
| 导出数据 | ✅ | ✅ | ✅ |
| 插入数据 | ❌ | ✅ | ✅ |
| 更新数据 | ❌ | ✅ | ✅ |
| 删除数据 | ❌ | ✅ | ✅ |
| 创建表 | ❌ | ✅ | ✅ |
| 删除表 | ❌ | ❌ | ✅ |
| 备份数据库 | ❌ | ✅ | ✅ |
| 删除数据库 | ❌ | ❌ | ✅ |
| 授予权限 | ❌ | ❌ | ✅ |

## 默认权限配置

### readonly 角色
```json
{
  "permissions": [
    "register",
    "auth", 
    "list_own_databases",
    "database_info",
    "list_tables",
    "table_structure",
    "query_data",
    "execute_query",
    "export_data",
    "monitoring",
    "tables_info",
    "query_examples"
  ]
}
```

### operator 角色
```json
{
  "permissions": [
    "register",
    "auth",
    "list_own_databases", 
    "create_database",
    "database_info",
    "list_tables",
    "table_structure",
    "query_data",
    "execute_query",
    "insert_data",
    "export_data",
    "create_table",
    "batch_update",
    "batch_delete", 
    "import_data",
    "backup_database",
    "list_backups",
    "download_backup",
    "monitoring",
    "tables_info",
    "query_examples"
  ]
}
```

### user 角色
```json
{
  "permissions": [
    "register",
    "auth",
    "list_own_databases",
    "create_database"
  ]
}
```

### admin 角色
```json
{
  "permissions": [
    "所有 operator 权限",
    "user_management"
  ]
}
```

### superadmin 角色
```json
{
  "permissions": [
    "all"
  ]
}
```

## 权限名称映射

### 接口权限名称
| 权限名称 | 对应接口 | 描述 |
|----------|----------|------|
| `create_database` | `POST /create` | 创建数据库 |
| `list_databases` | `GET /databases` | 列出数据库 |
| `delete_database` | `DELETE /database/{db_name}` | 删除数据库 |
| `database_info` | `GET /database/{db_name}/info` | 数据库信息 |
| `list_tables` | `GET /database/{db_name}/tables` | 列出表 |
| `create_table` | `POST /database/{db_name}/table` | 创建表 |
| `table_structure` | `GET /database/{db_name}/table/{table_name}/structure` | 表结构 |
| `insert_data` | `POST /database/{db_name}/table/{table_name}/data` | 插入数据 |
| `query_data` | `GET /database/{db_name}/table/{table_name}/data` | 查询数据 |
| `execute_query` | `POST /database/{db_name}/query` | 执行查询 |
| `batch_update` | `POST /database/{db_name}/batch/update` | 批量更新 |
| `batch_delete` | `POST /database/{db_name}/batch/delete` | 批量删除 |
| `export_data` | `POST /database/{db_name}/export` | 导出数据 |
| `import_data` | `POST /database/{db_name}/import` | 导入数据 |
| `backup_database` | `POST /database/{db_name}/backup` | 备份数据库 |
| `list_backups` | `GET /database/{db_name}/backups` | 列出备份 |
| `download_backup` | `GET /backup/{filename}` | 下载备份 |
| `delete_backup` | `DELETE /backup/{filename}` | 删除备份 |
| `monitoring` | 所有 `/stats/*` 接口 | 监控统计 |
| `user_management` | 所有 `/admin/*` 接口 | 用户管理 |

## 权限检查流程

### 1. 认证检查
```python
def require_auth(f):
    """认证装饰器"""
    def decorated_function(*args, **kwargs):
        api_key = extract_api_key(request)
        user_info = verify_api_key(api_key)
        if not user_info:
            return jsonify({'error': '需要认证'}), 401
        request.user = user_info
        return f(*args, **kwargs)
    return decorated_function
```

### 2. 权限检查
```python
def require_permission(permission_name):
    """权限检查装饰器"""
    def decorator(f):
        @require_auth
        def decorated_function(*args, **kwargs):
            user_permissions = request.user.get('permissions', [])
            
            # 超级管理员拥有所有权限
            if 'all' in user_permissions:
                return f(*args, **kwargs)
            
            # 检查特定权限
            if permission_name not in user_permissions:
                return jsonify({'error': '权限不足'}), 403
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator
```

### 3. 数据库权限检查
```python
def require_database_permission(permission_level='read'):
    """数据库权限检查"""
    def decorator(f):
        @require_auth
        def decorated_function(*args, **kwargs):
            db_name = kwargs.get('db_name')
            user_id = request.user['user_id']
            
            if not check_database_permission(user_id, db_name, permission_level):
                return jsonify({'error': '没有数据库访问权限'}), 403
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator
```

## 权限配置示例

### 创建用户并分配权限
```python
from admin_users import create_user

# 创建只读用户
create_user(
    username="report_user",
    password="secure_password",
    role="readonly"
)

# 创建操作员并授予额外权限
create_user(
    username="data_operator", 
    password="secure_password",
    role="operator",
    permissions=["backup_database", "import_data"]
)

# 创建管理员
create_user(
    username="system_admin",
    password="secure_password", 
    role="admin"
)
```

### 授予数据库权限
```python
from database_permissions import grant_database_permission

# 授予用户数据库读取权限
grant_database_permission(
    user_id="user_123456",
    database_name="analytics_db", 
    permission_level="read"
)

# 授予用户数据库管理权限
grant_database_permission(
    user_id="user_789012",
    database_name="production_db",
    permission_level="admin" 
)
```

## 最佳实践

### 1. 最小权限原则
- 为用户分配完成工作所需的最小权限
- 定期审查和调整权限配置
- 避免使用超级管理员进行日常操作

### 2. 权限分离
```python
# 好的实践：为不同职能创建专用用户
users = [
    {"username": "report_reader", "role": "readonly"},
    {"username": "data_writer", "role": "operator"}, 
    {"username": "backup_manager", "role": "operator", "permissions": ["backup_database"]}
]
```

### 3. 定期审计
```python
def audit_user_permissions():
    """权限审计"""
    from admin_users import list_users
    from admin_api_keys import list_all_api_keys
    
    users = list_users()
    api_keys = list_all_api_keys()
    
    print("🔍 权限审计报告")
    for user in users:
        print(f"用户: {user['username']} (角色: {user['role']})")
        # 检查权限配置是否合理
        # 生成审计报告
```

## 故障排除

### 常见权限问题

1. **权限不足错误**
   - 检查用户角色和权限配置
   - 验证数据库访问权限
   - 确认接口权限要求

2. **数据库访问被拒绝**
   - 检查数据库权限级别
   - 验证用户是否有目标数据库的权限
   - 确认权限级别是否足够

3. **操作被禁止**
   - 检查用户角色是否允许该操作
   - 验证自定义权限配置
   - 确认是否尝试执行管理员操作

### 调试工具
```python
def debug_permissions(api_key):
    """权限调试工具"""
    from auth_profile import get_user_profile
    from user_databases import get_user_databases
    
    # 获取用户信息
    profile = get_user_profile(api_key)
    if profile['success']:
        user = profile['user']
        print(f"用户: {user['username']}")
        print(f"角色: {user['role']}")
        print(f"权限: {user['permissions']}")
    
    # 获取可访问的数据库
    databases = get_user_databases(api_key)
    if databases['success']:
        print(f"可访问的数据库: {[db['name'] for db in databases['databases']]}")
```

## 相关链接

- [用户管理](/api/user-management/admin-users.md) - 用户和权限管理
- [API 密钥管理](/api/user-management/admin-api-keys.md) - API 密钥管理
- [数据库权限管理](/api/user-management/database-permissions.md) - 数据库级别权限
- [错误代码参考](error-codes.md) - 权限相关错误代码