# 数据库权限管理

## 端点信息

```http
POST /admin/database-permissions
Authorization: Bearer your_api_key
Content-Type: application/json
```

授予用户数据库权限。

```http
GET /user/databases
Authorization: Bearer your_api_key
```

获取当前用户有权限访问的数据库列表。

## 权限要求

### 授予权限
- `user_management` 权限

### 获取数据库列表
- `auth` 权限

## 请求

### 授予数据库权限

#### 请求头
| 头部 | 值 | 必填 |
|------|-----|------|
| `Authorization` | `Bearer your_api_key` | 是 |
| `Content-Type` | `application/json` | 是 |

#### 请求体
| 字段 | 类型 | 必填 | 说明 | 可选值 |
|------|------|------|------|--------|
| `user_id` | string | 是 | 用户ID | |
| `database_name` | string | 是 | 数据库名称 | |
| `permission_level` | string | 是 | 权限级别 | `read`, `write`, `admin` |

#### 请求示例
```json
{
  "user_id": "user_1705734100_def456",
  "database_name": "production_db",
  "permission_level": "write"
}
```

### 获取用户数据库列表

#### 请求头
| 头部 | 值 | 必填 |
|------|-----|------|
| `Authorization` | `Bearer your_api_key` | 是 |

## 响应

### 授予权限成功响应

**状态码:** `200 OK`

```json
{
  "success": true,
  "message": "已为用户授予 production_db 数据库的 write 权限"
}
```

### 获取数据库列表成功响应

**状态码:** `200 OK`

```json
{
  "success": true,
  "databases": [
    {
      "name": "production_db",
      "size_bytes": 1572864000,
      "size_human": "1.46 GB",
      "table_count": 8
    },
    {
      "name": "analytics_db",
      "size_bytes": 536870912,
      "size_human": "512.00 MB",
      "table_count": 5
    }
  ],
  "total": 2
}
```

### 错误响应

**无效的权限级别:**
```json
{
  "error": "权限级别必须是 read, write 或 admin"
}
```

**授予权限失败:**
```json
{
  "error": "授予权限失败"
}
```

## 响应字段说明

### 数据库信息
| 字段 | 类型 | 说明 |
|------|------|------|
| `name` | string | 数据库名称 |
| `size_bytes` | integer | 数据库大小（字节） |
| `size_human` | string | 人类可读的数据库大小 |
| `table_count` | integer | 表数量 |

## 权限级别说明

### read (只读)
- 查询数据
- 查看表结构
- 导出数据
- 查看备份

### write (读写)
- 包含所有读权限
- 插入、更新、删除数据
- 创建表
- 执行查询

### admin (管理员)
- 包含所有读写权限
- 删除数据库
- 备份数据库
- 管理数据库权限

## 使用示例

### cURL 示例

```bash
# 授予用户数据库权限
curl -X POST "https://dbapi.muzilix.cn/admin/database-permissions" \
  -H "Authorization: Bearer your_admin_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user_1705734100_def456",
    "database_name": "production_db",
    "permission_level": "write"
  }'

# 获取当前用户的数据库列表
curl -X GET "https://dbapi.muzilix.cn/user/databases" \
  -H "Authorization: Bearer your_api_key"
```

### Python 示例

```python
import requests

def grant_database_permission(admin_api_key, user_id, database_name, permission_level):
    """授予用户数据库权限"""
    url = "https://dbapi.muzilix.cn/admin/database-permissions"
    headers = {
        "Authorization": f"Bearer {admin_api_key}",
        "Content-Type": "application/json"
    }
    data = {
        "user_id": user_id,
        "database_name": database_name,
        "permission_level": permission_level
    }
    
    try:
        response = requests.post(url, json=data, headers=headers)
        result = response.json()
        
        if response.status_code == 200:
            print(f"✅ {result.get('message')}")
            return True
        else:
            print(f"❌ 授予权限失败: {result.get('error')}")
            return False
    except Exception as e:
        print(f"❌ 请求失败: {str(e)}")
        return False

def get_user_databases(api_key):
    """获取用户有权限的数据库列表"""
    url = "https://dbapi.muzilix.cn/user/databases"
    headers = {"Authorization": f"Bearer {api_key}"}
    
    try:
        response = requests.get(url, headers=headers)
        result = response.json()
        
        if response.status_code == 200:
            return result
        else:
            print(f"❌ 获取数据库列表失败: {result.get('error')}")
            return None
    except Exception as e:
        print(f"❌ 请求失败: {str(e)}")
        return None

def display_user_databases(api_key):
    """显示用户的数据库列表"""
    result = get_user_databases(api_key)
    
    if result and result.get("success"):
        databases = result.get("databases", [])
        
        print("🗄️  可访问的数据库")
        print("=" * 60)
        for db in databases:
            print(f"📁 {db['name']}")
            print(f"   大小: {db['size_human']}")
            print(f"   表数: {db['table_count']}")
            print()
        
        print(f"总计: {len(databases)} 个数据库")
    else:
        print("❌ 无法获取数据库列表")

# 使用示例
if __name__ == "__main__":
    # 授予权限（管理员）
    admin_api_key = "your_admin_api_key"
    grant_database_permission(
        admin_api_key, 
        "user_1705734100_def456", 
        "production_db", 
        "write"
    )
    
    # 查看数据库列表（普通用户）
    user_api_key = "your_user_api_key"
    display_user_databases(user_api_key)
```

## 权限体系说明

### 超级管理员
- 自动拥有所有数据库的所有权限
- 不需要显式授予权限
- 可以管理所有用户的权限

### 普通用户
- 默认只能访问自己创建的数据库
- 需要管理员授予其他数据库的权限
- 权限按数据库级别控制

### 权限继承
- 高级权限包含低级权限的所有能力
- `admin` > `write` > `read`
- 权限可以随时调整和撤销

## 相关链接

- [用户管理](admin-users.md) - 用户账户管理
- [API密钥管理](admin-api-keys.md) - API密钥管理
- [数据库管理](../database-management/index.md) - 数据库操作指南
- [权限说明](/reference/permission-matrix.md) - 详细权限说明