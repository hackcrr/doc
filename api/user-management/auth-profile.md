# 用户个人信息

## 端点信息

<ApiEndpoint method="GET" path="/auth/profile"/>

获取当前认证用户的详细信息。

## 权限要求
- `auth` 权限

## 请求

### 请求头
| 头部 | 值 | 必填 |
|------|-----|------|
| `Authorization` | `Bearer your_api_key` | 是 |

## 响应

### 成功响应

**状态码:** `200 OK`

```json
{
  "success": true,
  "user": {
    "user_id": "user_1705734000_abc123",
    "username": "admin",
    "role": "superadmin",
    "permissions": ["all"],
    "created_at": "2024-01-20T10:00:00",
    "last_login": "2024-01-20T15:30:00"
  }
}
```

### 认证失败

**状态码:** `401 Unauthorized`

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

## 响应字段说明

### 用户信息
| 字段 | 类型 | 说明 |
|------|------|------|
| `user_id` | string | 用户唯一标识 |
| `username` | string | 用户名 |
| `role` | string | 用户角色 |
| `permissions` | array | 用户权限列表 |
| `created_at` | string | 账户创建时间 |
| `last_login` | string | 最后登录时间 |

## 使用示例

### cURL 示例

```bash
# 获取用户信息
curl -X GET "https://dbapi.muzilix.cn/auth/profile" \
  -H "Authorization: Bearer your_api_key"

# 使用环境变量中的 API 密钥
curl -X GET "https://dbapi.muzilix.cn/auth/profile" \
  -H "Authorization: Bearer $API_KEY"
```

### Python 示例

```python
import requests
import json
from datetime import datetime

def get_user_profile(api_key):
    """获取用户个人信息"""
    url = "https://dbapi.muzilix.cn/auth/profile"
    headers = {"Authorization": f"Bearer {api_key}"}
    
    try:
        response = requests.get(url, headers=headers)
        result = response.json()
        
        if response.status_code == 200:
            return {
                "success": True,
                "user_info": result["user"]
            }
        else:
            return {
                "success": False,
                "error": result.get("error", "获取用户信息失败")
            }
            
    except Exception as e:
        return {
            "success": False,
            "error": f"请求失败: {str(e)}"
        }

def display_user_profile(api_key):
    """显示用户个人信息"""
    result = get_user_profile(api_key)
    
    if result["success"]:
        user = result["user_info"]
        
        print("👤 用户个人信息")
        print("=" * 40)
        print(f"   用户ID: {user['user_id']}")
        print(f"   用户名: {user['username']}")
        print(f"   角色: {user['role']}")
        
        # 格式化时间
        created_at = user.get('created_at')
        last_login = user.get('last_login')
        
        if created_at:
            created_time = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
            print(f"   注册时间: {created_time.strftime('%Y-%m-%d %H:%M:%S')}")
        
        if last_login:
            login_time = datetime.fromisoformat(last_login.replace('Z', '+00:00'))
            print(f"   最后登录: {login_time.strftime('%Y-%m-%d %H:%M:%S')}")
        
        # 权限显示
        permissions = user.get('permissions', [])
        print(f"   权限数量: {len(permissions)}")
        
        if permissions:
            print(f"   权限列表:")
            for perm in sorted(permissions):
                print(f"     - {perm}")
        
        return user
    else:
        print(f"❌ 获取用户信息失败: {result['error']}")
        return None

def check_permission(api_key, required_permission):
    """检查用户是否拥有特定权限"""
    result = get_user_profile(api_key)
    
    if not result["success"]:
        return False
    
    user = result["user_info"]
    permissions = user.get('permissions', [])
    
    # 超级管理员拥有所有权限
    if 'all' in permissions:
        return True
    
    return required_permission in permissions

def get_user_role(api_key):
    """获取用户角色"""
    result = get_user_profile(api_key)
    
    if result["success"]:
        return result["user_info"]["role"]
    else:
        return None

def validate_api_key(api_key):
    """验证 API 密钥是否有效"""
    result = get_user_profile(api_key)
    
    if result["success"]:
        user = result["user_info"]
        return {
            "valid": True,
            "username": user["username"],
            "role": user["role"]
        }
    else:
        return {
            "valid": False,
            "error": result["error"]
        }

def user_profile_summary(api_key):
    """用户信息摘要"""
    result = get_user_profile(api_key)
    
    if result["success"]:
        user = result["user_info"]
        
        summary = {
            "username": user["username"],
            "role": user["role"],
            "permissions_count": len(user.get("permissions", [])),
            "is_superadmin": "all" in user.get("permissions", [])
        }
        
        return summary
    else:
        return None

# 使用示例
if __name__ == "__main__":
    # 从环境变量或文件读取 API 密钥
    API_KEY = "your_api_key_here"  # 在实际使用中从安全的地方获取
    
    # 显示用户信息
    user_info = display_user_profile(API_KEY)
    
    if user_info:
        print(f"\n📊 用户信息摘要:")
        print(f"   用户名: {user_info['username']}")
        print(f"   角色: {user_info['role']}")
        
        # 检查特定权限
        if check_permission(API_KEY, "user_management"):
            print("   🔧 拥有用户管理权限")
        
        if check_permission(API_KEY, "backup_database"):
            print("   💾 拥有数据库备份权限")
        
        # 验证 API 密钥
        validation = validate_api_key(API_KEY)
        if validation["valid"]:
            print(f"   ✅ API 密钥有效 - 用户: {validation['username']}")
```

### JavaScript 示例

```javascript
// 获取用户个人信息
async function getUserProfile(apiKey) {
    try {
        const response = await fetch('https://dbapi.muzilix.cn/auth/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });
        
        const result = await response.json();
        
        if (response.ok) {
            return {
                success: true,
                userInfo: result.user
            };
        } else {
            return {
                success: false,
                error: result.error || '获取用户信息失败'
            };
        }
    } catch (error) {
        return {
            success: false,
            error: `请求失败: ${error.message}`
        };
    }
}

// 显示用户信息
async function displayUserProfile(apiKey) {
    const result = await getUserProfile(apiKey);
    
    if (result.success) {
        const user = result.userInfo;
        
        console.log('👤 用户个人信息');
        console.log('========================================');
        console.log(`   用户ID: ${user.user_id}`);
        console.log(`   用户名: ${user.username}`);
        console.log(`   角色: ${user.role}`);
        
        if (user.created_at) {
            console.log(`   注册时间: ${new Date(user.created_at).toLocaleString()}`);
        }
        
        if (user.last_login) {
            console.log(`   最后登录: ${new Date(user.last_login).toLocaleString()}`);
        }
        
        const permissions = user.permissions || [];
        console.log(`   权限数量: ${permissions.length}`);
        
        if (permissions.length > 0) {
            console.log('   权限列表:');
            permissions.sort().forEach(perm => {
                console.log(`     - ${perm}`);
            });
        }
        
        return user;
    } else {
        console.error(`❌ 获取用户信息失败: ${result.error}`);
        return null;
    }
}

// 检查权限
async function checkPermission(apiKey, requiredPermission) {
    const result = await getUserProfile(apiKey);
    
    if (!result.success) {
        return false;
    }
    
    const permissions = result.userInfo.permissions || [];
    
    // 超级管理员拥有所有权限
    if (permissions.includes('all')) {
        return true;
    }
    
    return permissions.includes(requiredPermission);
}

// 使用示例
// const apiKey = localStorage.getItem('api_key');
// displayUserProfile(apiKey).then(user => {
//     if (user) {
//         console.log('用户信息加载完成');
//     }
// });
```

## 功能说明

### 1. 用户信息验证
- 验证 API 密钥的有效性
- 返回完整的用户信息
- 包含权限和角色数据

### 2. 权限检查
可用于在客户端进行权限预检查：
```python
# 在执行敏感操作前检查权限
if check_permission(api_key, "user_management"):
    # 执行用户管理操作
    pass
else:
    print("权限不足")
```

### 3. 会话监控
通过定期调用此接口：
- 监控用户会话状态
- 检测 API 密钥是否过期
- 获取最新的权限信息

## 使用场景

### 1. 应用启动时
```python
def initialize_application(api_key):
    """应用初始化"""
    user_info = get_user_profile(api_key)
    if user_info["success"]:
        print(f"欢迎回来，{user_info['user_info']['username']}!")
        # 根据权限初始化界面
        initialize_ui_based_on_permissions(user_info['user_info'])
    else:
        print("请重新登录")
```

### 2. 权限控制
```python
def create_permission_guard(api_key):
    """创建权限守卫"""
    user_profile = get_user_profile(api_key)
    
    def guard(required_permission):
        if not user_profile["success"]:
            return False
        
        permissions = user_profile["user_info"].get("permissions", [])
        return "all" in permissions or required_permission in permissions
    
    return guard

# 使用示例
# permission_guard = create_permission_guard(API_KEY)
# if permission_guard("backup_database"):
#     # 显示备份按钮
#     pass
```

## 相关链接

- [用户登录](auth-login.md) - 用户登录认证
- [用户注册](auth-register.md) - 新用户注册
- [用户登出](auth-logout.md) - 用户退出登录
- [权限说明](/reference/permission-matrix.md) - 详细权限说明