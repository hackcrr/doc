# 用户管理

## 端点信息

<ApiEndpoint method="GET" path="/admin/users"/>

列出所有用户信息。

<ApiEndpoint method="POST" path="/admin/users"/>

创建新用户。

<ApiEndpoint method="PUT" path="/admin/users/{user_id}"/>

更新用户信息。

<ApiEndpoint method="DELETE" path="/admin/users/{user_id}"/>

删除用户。

## 权限要求
- `user_management` 权限

## 请求

### 列出用户

#### 请求头
| 头部 | 值 | 必填 |
|------|-----|------|
| `Authorization` | `Bearer your_api_key` | 是 |

### 创建用户

#### 请求头
| 头部 | 值 | 必填 |
|------|-----|------|
| `Authorization` | `Bearer your_api_key` | 是 |
| `Content-Type` | `application/json` | 是 |

#### 请求体
| 字段 | 类型 | 必填 | 说明 | 可选值 |
|------|------|------|------|--------|
| `username` | string | 是 | 用户名 | 3-50位字母、数字、下划线 |
| `password` | string | 是 | 密码 | 最少6位 |
| `role` | string | 否 | 用户角色 | `readonly`, `operator`, `user`, `admin`, `superadmin` |
| `permissions` | array | 否 | 自定义权限列表 | 权限名称数组 |

#### 请求示例
```json
{
  "username": "new_operator",
  "password": "securepassword123",
  "role": "operator",
  "permissions": ["backup_database", "import_data"]
}
```

### 更新用户

#### 请求头
| 头部 | 值 | 必填 |
|------|-----|------|
| `Authorization` | `Bearer your_api_key` | 是 |
| `Content-Type` | `application/json` | 是 |

#### 路径参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `user_id` | string | 是 | 用户ID |

#### 请求体
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `role` | string | 否 | 用户角色 |
| `permissions` | array | 否 | 权限列表 |
| `is_active` | boolean | 否 | 账户是否激活 |

#### 请求示例
```json
{
  "role": "admin",
  "permissions": ["all"],
  "is_active": true
}
```

### 删除用户

#### 请求头
| 头部 | 值 | 必填 |
|------|-----|------|
| `Authorization` | `Bearer your_api_key` | 是 |

#### 路径参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `user_id` | string | 是 | 用户ID |

## 响应

### 列出用户成功响应

**状态码:** `200 OK`

```json
{
  "success": true,
  "users": [
    {
      "user_id": "user_1705734000_abc123",
      "username": "admin",
      "role": "superadmin",
      "is_active": true,
      "created_at": "2024-01-20T10:00:00",
      "created_by": "system",
      "last_login": "2024-01-20T15:30:00"
    },
    {
      "user_id": "user_1705734100_def456",
      "username": "operator1",
      "role": "operator",
      "is_active": true,
      "created_at": "2024-01-20T11:00:00",
      "created_by": "admin",
      "last_login": "2024-01-20T14:20:00"
    }
  ],
  "total": 2
}
```

### 创建用户成功响应

**状态码:** `201 Created`

```json
{
  "success": true,
  "message": "用户创建成功",
  "user": {
    "user_id": "user_1705734200_ghi789",
    "username": "new_operator",
    "role": "operator",
    "permissions": ["backup_database", "import_data"]
  }
}
```

### 更新用户成功响应

**状态码:** `200 OK`

```json
{
  "success": true,
  "message": "用户信息更新成功",
  "user": {
    "user_id": "user_1705734100_def456",
    "username": "operator1",
    "role": "admin",
    "is_active": true,
    "permissions": ["all"]
  }
}
```

### 删除用户成功响应

**状态码:** `200 OK`

```json
{
  "success": true,
  "message": "用户删除成功"
}
```

### 错误响应

**用户名已存在:**
```json
{
  "error": "用户名已存在"
}
```

**无效的角色:**
```json
{
  "error": "无效的角色，可选: readonly, operator, user, admin, superadmin"
}
```

**不能修改自己的角色:**
```json
{
  "error": "不能修改自己的角色"
}
```

**不能禁用自己的账户:**
```json
{
  "error": "不能禁用自己的账户"
}
```

**不能删除自己的账户:**
```json
{
  "error": "不能删除自己的账户"
}
```

**用户不存在:**
```json
{
  "error": "用户不存在"
}
```

## 响应字段说明

### 用户信息
| 字段 | 类型 | 说明 |
|------|------|------|
| `user_id` | string | 用户唯一标识 |
| `username` | string | 用户名 |
| `role` | string | 用户角色 |
| `is_active` | boolean | 账户是否激活 |
| `created_at` | string | 创建时间 |
| `created_by` | string | 创建者 |
| `last_login` | string | 最后登录时间 |
| `permissions` | array | 权限列表 |

## 使用示例

### cURL 示例

```bash
# 列出所有用户
curl -X GET "https://dbapi.muzilix.cn/admin/users" \
  -H "Authorization: Bearer your_api_key"

# 创建新用户
curl -X POST "https://dbapi.muzilix.cn/admin/users" \
  -H "Authorization: Bearer your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "new_user",
    "password": "password123",
    "role": "operator"
  }'

# 更新用户
curl -X PUT "https://dbapi.muzilix.cn/admin/users/user_1705734100_def456" \
  -H "Authorization: Bearer your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "admin",
    "is_active": true
  }'

# 删除用户
curl -X DELETE "https://dbapi.muzilix.cn/admin/users/user_1705734100_def456" \
  -H "Authorization: Bearer your_api_key"
```

### Python 示例

```python
import requests
import json
from typing import List, Dict, Optional

class UserManager:
    def __init__(self, api_key: str, base_url: str = "https://dbapi.muzilix.cn"):
        self.api_key = api_key
        self.base_url = base_url
        self.headers = {"Authorization": f"Bearer {api_key}"}
    
    def list_users(self) -> Optional[Dict]:
        """列出所有用户"""
        url = f"{self.base_url}/admin/users"
        
        try:
            response = requests.get(url, headers=self.headers)
            result = response.json()
            
            if response.status_code == 200:
                return result
            else:
                print(f"❌ 获取用户列表失败: {result.get('error')}")
                return None
                
        except Exception as e:
            print(f"❌ 请求失败: {str(e)}")
            return None
    
    def create_user(self, username: str, password: str, role: str = "user", 
                   permissions: List[str] = None) -> Optional[Dict]:
        """创建新用户"""
        url = f"{self.base_url}/admin/users"
        data = {
            "username": username,
            "password": password,
            "role": role
        }
        
        if permissions:
            data["permissions"] = permissions
        
        try:
            response = requests.post(url, json=data, headers=self.headers)
            result = response.json()
            
            if response.status_code == 201:
                print(f"✅ 用户创建成功: {username}")
                return result
            else:
                print(f"❌ 用户创建失败: {result.get('error')}")
                return None
                
        except Exception as e:
            print(f"❌ 请求失败: {str(e)}")
            return None
    
    def update_user(self, user_id: str, role: str = None, 
                   permissions: List[str] = None, is_active: bool = None) -> Optional[Dict]:
        """更新用户信息"""
        url = f"{self.base_url}/admin/users/{user_id}"
        data = {}
        
        if role:
            data["role"] = role
        if permissions is not None:
            data["permissions"] = permissions
        if is_active is not None:
            data["is_active"] = is_active
        
        try:
            response = requests.put(url, json=data, headers=self.headers)
            result = response.json()
            
            if response.status_code == 200:
                print(f"✅ 用户信息更新成功")
                return result
            else:
                print(f"❌ 用户信息更新失败: {result.get('error')}")
                return None
                
        except Exception as e:
            print(f"❌ 请求失败: {str(e)}")
            return None
    
    def delete_user(self, user_id: str) -> bool:
        """删除用户"""
        url = f"{self.base_url}/admin/users/{user_id}"
        
        try:
            response = requests.delete(url, headers=self.headers)
            result = response.json()
            
            if response.status_code == 200:
                print(f"✅ 用户删除成功")
                return True
            else:
                print(f"❌ 用户删除失败: {result.get('error')}")
                return False
                
        except Exception as e:
            print(f"❌ 请求失败: {str(e)}")
            return False
    
    def display_users_table(self):
        """以表格形式显示用户列表"""
        result = self.list_users()
        
        if not result or not result.get("success"):
            return
        
        users = result.get("users", [])
        
        print("👥 用户列表")
        print("=" * 100)
        print(f"{'用户名':<15} {'角色':<12} {'状态':<8} {'创建时间':<20} {'最后登录':<20} {'创建者':<10}")
        print("-" * 100)
        
        for user in users:
            username = user["username"]
            role = user["role"]
            status = "✅ 激活" if user["is_active"] else "❌ 禁用"
            created_at = user["created_at"][:19] if user["created_at"] else "N/A"
            last_login = user["last_login"][:19] if user["last_login"] else "从未登录"
            created_by = user["created_by"] or "system"
            
            print(f"{username:<15} {role:<12} {status:<8} {created_at:<20} {last_login:<20} {created_by:<10}")
        
        print(f"\n总计: {len(users)} 个用户")

def interactive_user_management():
    """交互式用户管理"""
    api_key = input("请输入管理员API密钥: ").strip()
    manager = UserManager(api_key)
    
    while True:
        print("\n🔧 用户管理系统")
        print("1. 查看用户列表")
        print("2. 创建新用户")
        print("3. 更新用户信息")
        print("4. 删除用户")
        print("5. 退出")
        
        choice = input("请选择操作 (1-5): ").strip()
        
        if choice == "1":
            manager.display_users_table()
        
        elif choice == "2":
            username = input("用户名: ").strip()
            password = input("密码: ").strip()
            role = input("角色 (readonly/operator/user/admin/superadmin) [user]: ").strip() or "user"
            
            print("自定义权限 (直接回车跳过，多个权限用逗号分隔):")
            permissions_input = input("权限: ").strip()
            permissions = [p.strip() for p in permissions_input.split(",")] if permissions_input else None
            
            manager.create_user(username, password, role, permissions)
        
        elif choice == "3":
            user_id = input("用户ID: ").strip()
            
            print("更新信息 (直接回车保持原值):")
            role = input("新角色: ").strip() or None
            is_active_input = input("激活状态 (true/false): ").strip().lower()
            is_active = {"true": True, "false": False}.get(is_active_input)
            
            print("自定义权限 (直接回车保持原值，多个权限用逗号分隔):")
            permissions_input = input("权限: ").strip()
            permissions = [p.strip() for p in permissions_input.split(",")] if permissions_input else None
            
            manager.update_user(user_id, role, permissions, is_active)
        
        elif choice == "4":
            user_id = input("要删除的用户ID: ").strip()
            confirm = input(f"确认删除用户 {user_id}? (y/N): ").strip().lower()
            
            if confirm == "y":
                manager.delete_user(user_id)
            else:
                print("操作已取消")
        
        elif choice == "5":
            print("退出用户管理系统")
            break
        
        else:
            print("❌ 无效选择")

# 使用示例
if __name__ == "__main__":
    # 方式1: 直接使用
    # manager = UserManager("your_admin_api_key")
    # manager.display_users_table()
    
    # 方式2: 创建测试用户
    # manager.create_user("test_operator", "testpass123", "operator", ["backup_database"])
    
    # 方式3: 交互式管理
    interactive_user_management()
```

## 管理功能说明

### 1. 用户角色管理
支持五种预定义角色：
- `readonly` - 只读权限
- `operator` - 操作员权限
- `user` - 普通用户（默认）
- `admin` - 管理员权限
- `superadmin` - 超级管理员

### 2. 权限控制
- 基于角色的默认权限
- 可自定义额外权限
- 权限去重和合并
- 超级管理员拥有所有权限

### 3. 安全限制
- 不能修改自己的角色
- 不能禁用自己的账户
- 不能删除自己的账户
- 操作审计日志记录

## 相关链接

- [用户认证](../user-management/auth-login.md) - 用户登录认证
- [API密钥管理](admin-api-keys.md) - 管理用户API密钥
- [权限说明](/reference/permission-matrix.md) - 详细权限说明
- [数据库权限](/api/user-management/database-permissions.md) - 数据库级别权限管理