# 修改密码

## 端点信息

<ApiEndpoint method="POST" path="/auth/change-password"/>

修改当前用户的密码。

<ApiEndpoint method="POST" path="/admin/users/{user_id}/reset-password"/>

管理员重置用户密码。

## 权限要求

### 修改密码
- `auth` 权限

### 重置密码
- `user_management` 权限

## 请求

### 修改密码

#### 请求头
| 头部 | 值 | 必填 |
|------|-----|------|
| `Authorization` | `Bearer your_api_key` | 是 |
| `Content-Type` | `application/json` | 是 |

#### 请求体
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `current_password` | string | 是 | 当前密码 |
| `new_password` | string | 是 | 新密码（最少6位） |

#### 请求示例
```json
{
  "current_password": "old_password",
  "new_password": "new_secure_password123"
}
```

### 重置密码

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
| `new_password` | string | 是 | 新密码（最少6位） |

#### 请求示例
```json
{
  "new_password": "new_secure_password123"
}
```

## 响应

### 修改密码成功响应

**状态码:** `200 OK`

```json
{
  "success": true,
  "message": "密码修改成功"
}
```

### 重置密码成功响应

**状态码:** `200 OK`

```json
{
  "success": true,
  "message": "用户 admin 密码重置成功"
}
```

### 错误响应

**当前密码错误:**
```json
{
  "error": "当前密码错误"
}
```

**密码强度不足:**
```json
{
  "error": "新密码长度至少6位"
}
```

**用户不存在:**
```json
{
  "error": "用户不存在"
}
```

## 使用示例

### cURL 示例

```bash
# 修改当前用户密码
curl -X POST "https://dbapi.muzilix.cn/auth/change-password" \
  -H "Authorization: Bearer your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "current_password": "old_password",
    "new_password": "new_password123"
  }'

# 管理员重置用户密码
curl -X POST "https://dbapi.muzilix.cn/admin/users/user_1705734000_abc123/reset-password" \
  -H "Authorization: Bearer your_admin_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "new_password": "new_password123"
  }'
```

### Python 示例

```python
import requests

def change_password(api_key, current_password, new_password):
    """修改当前用户密码"""
    url = "https://dbapi.muzilix.cn/auth/change-password"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    data = {
        "current_password": current_password,
        "new_password": new_password
    }
    
    try:
        response = requests.post(url, json=data, headers=headers)
        result = response.json()
        
        if response.status_code == 200:
            print("✅ 密码修改成功")
            return True
        else:
            print(f"❌ 密码修改失败: {result.get('error')}")
            return False
    except Exception as e:
        print(f"❌ 请求失败: {str(e)}")
        return False

def reset_user_password(admin_api_key, user_id, new_password):
    """管理员重置用户密码"""
    url = f"https://dbapi.muzilix.cn/admin/users/{user_id}/reset-password"
    headers = {
        "Authorization": f"Bearer {admin_api_key}",
        "Content-Type": "application/json"
    }
    data = {
        "new_password": new_password
    }
    
    try:
        response = requests.post(url, json=data, headers=headers)
        result = response.json()
        
        if response.status_code == 200:
            print(f"✅ {result.get('message')}")
            return True
        else:
            print(f"❌ 重置密码失败: {result.get('error')}")
            return False
    except Exception as e:
        print(f"❌ 请求失败: {str(e)}")
        return False

# 使用示例
if __name__ == "__main__":
    # 修改当前用户密码
    api_key = "your_api_key"
    change_password(api_key, "old_password", "new_secure_password123")
    
    # 管理员重置用户密码
    admin_api_key = "your_admin_api_key"
    user_id = "user_1705734000_abc123"
    reset_user_password(admin_api_key, user_id, "new_secure_password123")
```

## 安全说明

### 密码要求
- 新密码长度至少6位
- 建议使用复杂密码
- 定期更换密码

### 权限控制
- 用户只能修改自己的密码
- 需要验证当前密码
- 管理员可以重置任何用户的密码

## 相关链接

- [用户登录](auth-login.md) - 用户登录认证
- [用户注册](auth-register.md) - 新用户注册
- [用户管理](admin-users.md) - 用户账户管理