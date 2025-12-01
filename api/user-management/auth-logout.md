# 用户登出

## 端点信息

<ApiEndpoint method="POST" path="/auth/logout" requiresAuth />
<!-- ```http
Authorization: Bearer your_api_key
``` -->

用户登出接口，禁用当前使用的 API 密钥。

## 权限要求
- `auth` 权限

## 请求

### 请求头
| 头部 | 值 | 必填 |
|------|-----|------|
| `Authorization` | `Bearer your_api_key` | 是 |
| `Content-Type` | `application/json` | 否 |

## 响应

### 成功响应

**状态码:** `200 OK`

```json
{
  "success": true,
  "message": "登出成功"
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

## 使用示例

### cURL 示例

```bash
# 用户登出
curl -X POST "https://dbapi.muzilix.cn/auth/logout" \
  -H "Authorization: Bearer your_api_key"

# 使用环境变量中的 API 密钥登出
curl -X POST "https://dbapi.muzilix.cn/auth/logout" \
  -H "Authorization: Bearer $API_KEY"
```

### Python 示例

```python
import requests
import os

def user_logout(api_key):
    """用户登出"""
    url = "https://dbapi.muzilix.cn/auth/logout"
    headers = {"Authorization": f"Bearer {api_key}"}
    
    try:
        response = requests.post(url, headers=headers)
        result = response.json()
        
        if response.status_code == 200:
            return {
                "success": True,
                "message": result["message"]
            }
        else:
            return {
                "success": False,
                "error": result.get("error", "登出失败")
            }
            
    except Exception as e:
        return {
            "success": False,
            "error": f"请求失败: {str(e)}"
        }

def logout_and_cleanup(api_key, token_file=".api_token"):
    """登出并清理本地凭证"""
    result = user_logout(api_key)
    
    if result["success"]:
        # 删除本地保存的令牌文件
        if os.path.exists(token_file):
            os.remove(token_file)
            print(f"🗑️  已删除本地令牌文件: {token_file}")
        
        # 清理环境变量（如果设置了）
        if 'API_KEY' in os.environ:
            del os.environ['API_KEY']
            print("🗑️  已清除环境变量中的API密钥")
        
        print("✅ 登出成功")
        return True
    else:
        print(f"❌ 登出失败: {result['error']}")
        return False

def secure_logout_handler(api_key):
    """安全的登出处理"""
    print("🔒 正在执行安全登出...")
    
    # 首先验证令牌是否有效
    verify_url = "https://dbapi.muzilix.cn/auth/profile"
    headers = {"Authorization": f"Bearer {api_key}"}
    
    try:
        verify_response = requests.get(verify_url, headers=headers, timeout=5)
        if verify_response.status_code == 200:
            user_info = verify_response.json()["user"]
            print(f"👤 当前用户: {user_info['username']}")
            
            # 执行登出
            return logout_and_cleanup(api_key)
        else:
            print("⚠️  API密钥已失效，直接清理本地凭证")
            return logout_and_cleanup(api_key)
            
    except requests.exceptions.Timeout:
        print("⏰ 验证超时，尝试直接登出...")
        return logout_and_cleanup(api_key)
    except Exception as e:
        print(f"⚠️  验证失败: {str(e)}，尝试直接登出...")
        return logout_and_cleanup(api_key)

def logout_from_file(token_file=".api_token"):
    """从文件读取API密钥并登出"""
    try:
        with open(token_file, 'r') as f:
            api_key = f.read().strip()
        
        return secure_logout_handler(api_key)
        
    except FileNotFoundError:
        print("❌ 令牌文件不存在，无需登出")
        return False
    except Exception as e:
        print(f"❌ 读取令牌文件失败: {str(e)}")
        return False

# 使用示例
if __name__ == "__main__":
    # 方式1: 直接提供API密钥登出
    # api_key = "your_api_key_here"
    # secure_logout_handler(api_key)
    
    # 方式2: 从文件登出（推荐）
    logout_from_file()
    
    # 方式3: 交互式登出
    # api_key = input("请输入要登出的API密钥: ").strip()
    # if api_key:
    #     secure_logout_handler(api_key)
```

### JavaScript 示例

```javascript
// 用户登出函数
async function userLogout(apiKey) {
    try {
        const response = await fetch('https://dbapi.muzilix.cn/auth/logout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });
        
        const result = await response.json();
        
        if (response.ok) {
            // 清理本地存储
            localStorage.removeItem('api_key');
            localStorage.removeItem('user_info');
            
            console.log('✅ 登出成功');
            return result;
        } else {
            console.error('❌ 登出失败:', result.error);
            return null;
        }
    } catch (error) {
        console.error('❌ 请求失败:', error);
        return null;
    }
}

// 安全的登出处理
async function secureLogout() {
    const apiKey = localStorage.getItem('api_key');
    const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
    
    if (!apiKey) {
        console.log('⚠️ 未找到API密钥，无需登出');
        return;
    }
    
    if (userInfo.username) {
        console.log(`👤 当前用户: ${userInfo.username}`);
    }
    
    // 确认登出
    if (confirm('确定要登出吗？')) {
        const result = await userLogout(apiKey);
        if (result) {
            // 额外的清理操作
            sessionStorage.clear();
            console.log('🗑️ 已清理所有本地存储');
        }
    }
}

// 使用示例
// secureLogout();
```

## 登出机制说明

### 1. 密钥禁用
- 将当前使用的 API 密钥标记为禁用状态
- 密钥不会被删除，保留审计记录
- 禁用后的密钥无法再用于 API 调用

### 2. 会话管理
- 支持多个活跃的 API 密钥
- 登出只影响当前使用的密钥
- 其他密钥仍可正常使用

### 3. 审计记录
- 记录登出操作到审计日志
- 包含用户ID、时间和IP地址
- 用于安全审计和追踪

## 安全最佳实践

### 1. 定期登出
```python
def auto_logout_after_inactivity(api_key, inactivity_minutes=60):
    """在闲置后自动登出"""
    import time
    last_activity = time.time()
    
    # 模拟活动检测
    def check_activity():
        nonlocal last_activity
        current_time = time.time()
        if current_time - last_activity > inactivity_minutes * 60:
            print("🕒 检测到闲置，自动登出...")
            user_logout(api_key)
            return True
        return False
    
    # 更新活动时间
    def update_activity():
        nonlocal last_activity
        last_activity = time.time()
    
    return check_activity, update_activity

# 使用示例
# check_activity, update_activity = auto_logout_after_inactivity(api_key)
# 在每次API调用后调用 update_activity()
# 定期检查 check_activity()
```

### 2. 多设备管理
```python
def logout_all_sessions(admin_api_key, target_user_id):
    """登出用户的所有会话（管理员功能）"""
    # 注意：这需要管理员权限和相应的API端点
    # 这里只是概念示例
    print(f"正在登出用户 {target_user_id} 的所有会话...")
    # 实现会调用管理员API来禁用用户的所有API密钥
```

## 错误处理

### 网络问题
- 实现重试机制
- 超时处理
- 优雅降级

### 密钥失效
- 自动清理本地存储
- 提供重新登录指引
- 保持用户体验

## 相关链接

- [用户登录](auth-login.md) - 用户登录认证
- [用户注册](auth-register.md) - 新用户注册
- [个人信息](auth-profile.md) - 获取用户信息
- [API密钥管理](../user-management/admin-api-keys.md) - 管理API密钥