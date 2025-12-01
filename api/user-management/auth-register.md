# 用户注册

## 端点信息

<ApiEndpoint method="POST" path="/auth/register" />
<!-- ```http
Content-Type: application/json
``` -->

用户自助注册接口，创建新用户账户并返回 API 密钥。

## 权限要求
- 无需认证（公开接口）

## 请求

### 请求头
| 头部 | 值 | 必填 |
|------|-----|------|
| `Content-Type` | `application/json` | 是 |

### 请求体
| 字段 | 类型 | 必填 | 说明 | 验证规则 |
|------|------|------|------|----------|
| `username` | string | 是 | 用户名 | 3-50位字母、数字、下划线 |
| `password` | string | 是 | 密码 | 最少6位 |
| `email` | string | 否 | 邮箱地址 | 可选 |

### 请求示例
```json
{
  "username": "newuser",
  "password": "password123",
  "email": "user@example.com"
}
```

## 响应

### 成功响应

**状态码:** `201 Created`

```json
{
  "success": true,
  "message": "注册成功",
  "user": {
    "user_id": "user_1705734000_abc123",
    "username": "newuser",
    "role": "user",
    "permissions": [
      "register",
      "auth",
      "list_own_databases",
      "create_database"
    ]
  },
  "api_key": "wB8xR2qZ9kL3mN7pV1sT5uY4aB6cD8eF0gH2jK4lM6nP8rQ0tS2vU4wX6yZ8"
}
```

### 用户名已存在

**状态码:** `400 Bad Request`

```json
{
  "error": "用户名已存在"
}
```

### 用户名格式错误

**状态码:** `400 Bad Request`

```json
{
  "error": "用户名只能包含字母、数字和下划线，长度3-50位"
}
```

### 密码强度不足

**状态码:** `400 Bad Request`

```json
{
  "error": "密码长度至少6位"
}
```

### 请求体无效

**状态码:** `400 Bad Request`

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

### 注册结果
| 字段 | 类型 | 说明 |
|------|------|------|
| `success` | boolean | 注册是否成功 |
| `message` | string | 注册结果消息 |
| `api_key` | string | API 访问密钥 |

### 用户信息
| 字段 | 类型 | 说明 |
|------|------|------|
| `user_id` | string | 用户唯一标识 |
| `username` | string | 用户名 |
| `role` | string | 用户角色（默认为 user） |
| `permissions` | array | 用户权限列表 |

## 使用示例

### cURL 示例

```bash
# 用户注册
curl -X POST "https://dbapi.muzilix.cn/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "password": "password123",
    "email": "user@example.com"
  }'

# 注册并保存 API 密钥
export API_KEY=$(curl -s -X POST "https://dbapi.muzilix.cn/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"username":"newuser","password":"password123"}' | jq -r '.api_key')
```

### Python 示例

```python
import requests
import re

def validate_username(username):
    """验证用户名格式"""
    return re.match(r'^[a-zA-Z0-9_]{3,50}$', username) is not None

def validate_password(password):
    """验证密码强度"""
    return len(password) >= 6

def user_register(username, password, email=None):
    """用户注册"""
    url = "https://dbapi.muzilix.cn/auth/register"
    data = {
        "username": username,
        "password": password
    }
    
    if email:
        data["email"] = email
    
    # 客户端验证
    if not validate_username(username):
        return {
            "success": False,
            "error": "用户名只能包含字母、数字和下划线，长度3-50位"
        }
    
    if not validate_password(password):
        return {
            "success": False,
            "error": "密码长度至少6位"
        }
    
    try:
        response = requests.post(url, json=data)
        result = response.json()
        
        if response.status_code == 201:
            return {
                "success": True,
                "api_key": result["api_key"],
                "user_info": result["user"]
            }
        else:
            return {
                "success": False,
                "error": result.get("error", "注册失败")
            }
            
    except Exception as e:
        return {
            "success": False,
            "error": f"请求失败: {str(e)}"
        }

def interactive_register():
    """交互式用户注册"""
    print("=== 用户注册 ===")
    
    while True:
        username = input("请输入用户名 (3-50位字母、数字、下划线): ").strip()
        if validate_username(username):
            break
        print("❌ 用户名格式不正确，请重新输入")
    
    while True:
        password = input("请输入密码 (最少6位): ").strip()
        if validate_password(password):
            break
        print("❌ 密码长度不足，请重新输入")
    
    confirm_password = input("请确认密码: ").strip()
    if password != confirm_password:
        print("❌ 两次输入的密码不一致")
        return None
    
    email = input("请输入邮箱地址 (可选): ").strip() or None
    
    print("⏳ 注册中...")
    result = user_register(username, password, email)
    
    if result["success"]:
        user = result["user_info"]
        print(f"\n✅ 注册成功!")
        print(f"   用户ID: {user['user_id']}")
        print(f"   用户名: {user['username']}")
        print(f"   角色: {user['role']}")
        print(f"   权限: {', '.join(user['permissions'])}")
        print(f"   API密钥: {result['api_key']}")
        
        # 保存 API 密钥到文件
        save_api_key(result['api_key'], username)
        return result['api_key']
    else:
        print(f"\n❌ 注册失败: {result['error']}")
        return None

def save_api_key(api_key, username, filename=".api_keys"):
    """保存 API 密钥到文件"""
    try:
        with open(filename, 'a') as f:
            f.write(f"{username}: {api_key}\n")
        print(f"🔐 API密钥已保存到: {filename}")
    except Exception as e:
        print(f"⚠️  保存API密钥失败: {str(e)}")

def batch_register(users_data):
    """批量用户注册（用于测试或初始化）"""
    results = []
    
    for user_data in users_data:
        print(f"注册用户: {user_data['username']}")
        result = user_register(
            user_data['username'],
            user_data['password'],
            user_data.get('email')
        )
        
        if result['success']:
            print(f"  ✅ 成功")
            results.append({
                'username': user_data['username'],
                'api_key': result['api_key']
            })
        else:
            print(f"  ❌ 失败: {result['error']}")
            results.append({
                'username': user_data['username'],
                'error': result['error']
            })
    
    return results

# 使用示例
if __name__ == "__main__":
    # 方式1: 交互式注册
    api_key = interactive_register()
    
    # 方式2: 直接注册
    # result = user_register("testuser", "testpass123", "test@example.com")
    # if result["success"]:
    #     print(f"注册成功，API密钥: {result['api_key']}")
    
    # 方式3: 批量注册（测试用）
    # test_users = [
    #     {"username": "user1", "password": "pass123", "email": "user1@example.com"},
    #     {"username": "user2", "password": "pass123", "email": "user2@example.com"},
    #     {"username": "user3", "password": "pass123", "email": "user3@example.com"}
    # ]
    # batch_register(test_users)
```

### JavaScript 示例

```javascript
// 用户注册函数
async function userRegister(username, password, email = null) {
    // 客户端验证
    if (!/^[a-zA-Z0-9_]{3,50}$/.test(username)) {
        throw new Error('用户名只能包含字母、数字和下划线，长度3-50位');
    }
    
    if (password.length < 6) {
        throw new Error('密码长度至少6位');
    }
    
    try {
        const data = { username, password };
        if (email) data.email = email;
        
        const response = await fetch('https://dbapi.muzilix.cn/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (response.status === 201) {
            // 保存用户信息到 localStorage
            localStorage.setItem('api_key', result.api_key);
            localStorage.setItem('user_info', JSON.stringify(result.user));
            
            return result;
        } else {
            throw new Error(result.error || '注册失败');
        }
    } catch (error) {
        throw new Error(`注册失败: ${error.message}`);
    }
}

// 使用示例
// userRegister('newuser', 'password123', 'user@example.com')
//   .then(result => {
//       console.log('注册成功:', result.user.username);
//   })
//   .catch(error => {
//       console.error('注册失败:', error.message);
//   });
```

## 注册流程说明

### 1. 用户验证
- 用户名格式验证
- 密码强度验证
- 用户名唯一性检查

### 2. 账户创建
- 生成唯一用户ID
- 设置默认角色（user）
- 分配基础权限

### 3. 权限分配
新用户自动获得以下基础权限：
- `register` - 注册权限
- `auth` - 认证权限
- `list_own_databases` - 查看自有数据库
- `create_database` - 创建数据库

### 4. API 密钥生成
- 自动生成32位安全API密钥
- 立即返回给用户
- 可用于后续API调用

## 安全说明

### 数据保护
- 密码使用加盐哈希存储
- 用户名和邮箱唯一性约束
- 传输建议使用HTTPS

### 权限控制
- 新用户为普通用户角色
- 只能访问自有数据库
- 需要管理员授予额外权限

## 错误处理

### 客户端验证
建议在调用API前进行客户端验证：
- 用户名格式检查
- 密码强度验证
- 必填字段检查

### 服务器错误
- `400` - 客户端输入错误
- `500` - 服务器内部错误
- 详细的错误消息说明

## 相关链接

- [用户登录](auth-login.md) - 用户登录认证
- [用户管理](../user-management/admin-users.md) - 管理员用户管理
- [权限说明](/reference/permission-matrix.md) - 详细权限说明