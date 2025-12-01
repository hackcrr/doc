# 用户登录

## 端点信息

<ApiEndpoint method="POST" path="/auth/login" />
<!-- ```http
Content-Type: application/json
``` -->

用户登录接口，验证用户凭据并返回 API 密钥。

## 权限要求
- 无需认证（公开接口）

## 请求

### 请求头
| 头部 | 值 | 必填 |
|------|-----|------|
| `Content-Type` | `application/json` | 是 |

### 请求体
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `username` | string | 是 | 用户名 |
| `password` | string | 是 | 密码 |

### 请求示例
```json
{
  "username": "admin",
  "password": "your_password"
}
```

## 响应

### 成功响应

**状态码:** `200 OK`

```json
{
  "success": true,
  "message": "登录成功",
  "user": {
    "user_id": "user_1705734000_abc123",
    "username": "admin",
    "role": "superadmin",
    "permissions": ["all"]
  },
  "api_key": "wB8xR2qZ9kL3mN7pV1sT5uY4aB6cD8eF0gH2jK4lM6nP8rQ0tS2vU4wX6yZ8",
  "expires_in": "never"
}
```

### 用户名或密码错误

**状态码:** `401 Unauthorized**

```json
{
  "error": "用户名或密码错误"
}
```

### 账户被禁用

**状态码:** `401 Unauthorized**

```json
{
  "error": "账户已被禁用"
}
```

### 请求体无效

**状态码:** `400 Bad Request**

```json
{
  "error": "请求体不能为空"
}
```

```json
{
  "error": "用户名和密码不能为空"
}
```

## 响应字段说明

### 登录结果
| 字段 | 类型 | 说明 |
|------|------|------|
| `success` | boolean | 登录是否成功 |
| `message` | string | 登录结果消息 |
| `api_key` | string | API 访问密钥 |
| `expires_in` | string | 密钥有效期 |

### 用户信息
| 字段 | 类型 | 说明 |
|------|------|------|
| `user_id` | string | 用户唯一标识 |
| `username` | string | 用户名 |
| `role` | string | 用户角色 |
| `permissions` | array | 用户权限列表 |

## 使用示例

### cURL 示例

```bash
# 用户登录
curl -X POST "https://dbapi.muzilix.cn/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'

# 保存 API 密钥到环境变量
export API_KEY=$(curl -s -X POST "https://dbapi.muzilix.cn/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | jq -r '.api_key')
```

### Python 示例

```python
import requests
import json

def user_login(username, password):
    """用户登录"""
    url = "https://dbapi.muzilix.cn/auth/login"
    data = {
        "username": username,
        "password": password
    }
    
    try:
        response = requests.post(url, json=data)
        result = response.json()
        
        if response.status_code == 200:
            return {
                "success": True,
                "api_key": result["api_key"],
                "user_info": result["user"]
            }
        else:
            return {
                "success": False,
                "error": result.get("error", "登录失败")
            }
            
    except Exception as e:
        return {
            "success": False,
            "error": f"请求失败: {str(e)}"
        }

def login_and_save_token(username, password, token_file=".api_token"):
    """登录并保存令牌"""
    result = user_login(username, password)
    
    if result["success"]:
        # 保存 API 密钥到文件
        with open(token_file, 'w') as f:
            f.write(result["api_key"])
        
        user = result["user_info"]
        print(f"✅ 登录成功!")
        print(f"   用户: {user['username']}")
        print(f"   角色: {user['role']}")
        print(f"   权限: {', '.join(user['permissions'])}")
        print(f"   API 密钥已保存到: {token_file}")
        
        return result["api_key"]
    else:
        print(f"❌ 登录失败: {result['error']}")
        return None

def load_token_and_verify(token_file=".api_token"):
    """加载并验证令牌"""
    try:
        with open(token_file, 'r') as f:
            api_key = f.read().strip()
        
        # 验证令牌有效性
        url = "https://dbapi.muzilix.cn/auth/profile"
        headers = {"Authorization": f"Bearer {api_key}"}
        
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            user_info = response.json()["user"]
            print(f"✅ 令牌有效 - 用户: {user_info['username']}")
            return api_key
        else:
            print("❌ 令牌无效或已过期")
            return None
            
    except FileNotFoundError:
        print("❌ 令牌文件不存在")
        return None
    except Exception as e:
        print(f"❌ 令牌验证失败: {str(e)}")
        return None

# 使用示例
if __name__ == "__main__":
    # 方式1: 交互式登录
    username = input("用户名: ")
    password = input("密码: ")
    
    api_key = login_and_save_token(username, password)
    
    if api_key:
        # 使用保存的令牌
        print(f"\n使用保存的令牌进行API调用...")
        # 这里可以添加其他API调用代码
```

### JavaScript 示例

```javascript
// 用户登录函数
async function userLogin(username, password) {
    try {
        const response = await fetch('https://dbapi.muzilix.cn/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            // 保存 API 密钥到 localStorage
            localStorage.setItem('api_key', result.api_key);
            localStorage.setItem('user_info', JSON.stringify(result.user));
            
            console.log('✅ 登录成功:', result.user.username);
            return result;
        } else {
            console.error('❌ 登录失败:', result.error);
            return null;
        }
    } catch (error) {
        console.error('❌ 请求失败:', error);
        return null;
    }
}

// 使用示例
// userLogin('admin', 'admin123').then(result => {
//     if (result) {
//         // 登录成功，可以使用 result.api_key 进行后续API调用
//     }
// });
```

## 安全说明

### 密码安全
- 密码在传输过程中应使用 HTTPS
- 密码不会存储在客户端
- 建议定期更换密码

### API 密钥安全
- API 密钥相当于密码，请妥善保管
- 不要在代码中硬编码 API 密钥
- 建议使用环境变量或配置文件存储

### 会话管理
- API 密钥永不过期
- 用户可以随时撤销 API 密钥
- 支持多个活动的 API 密钥

## 错误处理

### 常见错误
- `400 Bad Request` - 请求格式错误
- `401 Unauthorized` - 认证失败
- `500 Internal Server Error` - 服务器内部错误

### 重试策略
- 对于网络错误，建议实现指数退避重试
- 对于认证错误，需要用户重新输入凭据

## 相关链接

- [用户注册](auth-register.md) - 新用户注册
- [用户登出](auth-logout.md) - 用户退出登录
- [个人信息](auth-profile.md) - 获取用户信息
- [修改密码](change-password.md) - 更改用户密码