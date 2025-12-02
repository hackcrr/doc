# API 密钥管理

## 端点信息

<ApiEndpoint method="GET" path="/admin/api-keys"/>

列出所有 API 密钥信息。

```http
POST /admin/api-keys/{api_key}/revoke
Authorization: Bearer your_api_key
```

撤销指定的 API 密钥。

```http
GET /admin/api-keys/{user_id}
Authorization: Bearer your_api_key
```

获取指定用户的所有 API 密钥。

## 权限要求
- `user_management` 权限

## 请求

### 列出所有 API 密钥

#### 请求头
| 头部 | 值 | 必填 |
|------|-----|------|
| `Authorization` | `Bearer your_api_key` | 是 |

### 撤销 API 密钥

#### 请求头
| 头部 | 值 | 必填 |
|------|-----|------|
| `Authorization` | `Bearer your_api_key` | 是 |

#### 路径参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `api_key` | string | 是 | 要撤销的 API 密钥 |

### 获取用户 API 密钥

#### 请求头
| 头部 | 值 | 必填 |
|------|-----|------|
| `Authorization` | `Bearer your_api_key` | 是 |

#### 路径参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `user_id` | string | 是 | 用户 ID |

## 响应

### 列出 API 密钥成功响应

**状态码:** `200 OK`

```json
{
  "success": true,
  "api_keys": [
    {
      "api_key_display": "wB8xR2qZ...yZ8",
      "api_key_full": "wB8xR2qZ9kL3mN7pV1sT5uY4aB6cD8eF0gH2jK4lM6nP8rQ0tS2vU4wX6yZ8",
      "user_id": "user_1705734000_abc123",
      "username": "admin",
      "description": "默认管理员密钥",
      "is_active": true,
      "created_at": "2024-01-20T10:00:00",
      "last_used": "2024-01-20T15:30:00",
      "expires_at": null
    },
    {
      "api_key_display": "aB3cD5eF...hJ9",
      "api_key_full": "aB3cD5eF7gH9jK1lM3nP5rQ7tS9vU1wX3yZ5aB7cD9eF1gH3jK5lM7nP9",
      "user_id": "user_1705734100_def456",
      "username": "operator1",
      "description": "操作员密钥",
      "is_active": true,
      "created_at": "2024-01-20T11:00:00",
      "last_used": "2024-01-20T14:20:00",
      "expires_at": null
    }
  ],
  "total": 2,
  "security_note": "完整API密钥仅用于初始配置，请妥善保管"
}
```

### 撤销 API 密钥成功响应

**状态码:** `200 OK`

```json
{
  "success": true,
  "message": "API密钥已撤销"
}
```

### 获取用户 API 密钥成功响应

**状态码:** `200 OK`

```json
{
  "success": true,
  "api_keys": [
    {
      "api_key_display": "wB8xR2qZ...yZ8",
      "api_key_full": "wB8xR2qZ9kL3mN7pV1sT5uY4aB6cD8eF0gH2jK4lM6nP8rQ0tS2vU4wX6yZ8",
      "description": "默认管理员密钥",
      "is_active": true,
      "created_at": "2024-01-20T10:00:00",
      "last_used": "2024-01-20T15:30:00"
    }
  ],
  "user_id": "user_1705734000_abc123",
  "username": "admin",
  "total": 1
}
```

### 错误响应

**API 密钥不存在:**
```json
{
  "error": "API密钥不存在"
}
```

**用户不存在:**
```json
{
  "error": "用户不存在"
}
```

## 响应字段说明

### API 密钥信息
| 字段 | 类型 | 说明 |
|------|------|------|
| `api_key_display` | string | 部分显示的 API 密钥（安全考虑） |
| `api_key_full` | string | 完整的 API 密钥 |
| `user_id` | string | 所属用户 ID |
| `username` | string | 所属用户名 |
| `description` | string | 密钥描述 |
| `is_active` | boolean | 是否激活 |
| `created_at` | string | 创建时间 |
| `last_used` | string | 最后使用时间 |
| `expires_at` | string | 过期时间 |

## 使用示例

### cURL 示例

```bash
# 列出所有 API 密钥
curl -X GET "https://dbapi.muzilix.cn/admin/api-keys" \
  -H "Authorization: Bearer your_api_key"

# 撤销指定的 API 密钥
curl -X POST "https://dbapi.muzilix.cn/admin/api-keys/wB8xR2qZ9kL3mN7pV1sT5uY4aB6cD8eF0gH2jK4lM6nP8rQ0tS2vU4wX6yZ8/revoke" \
  -H "Authorization: Bearer your_api_key"

# 获取指定用户的所有 API 密钥
curl -X GET "https://dbapi.muzilix.cn/admin/api-keys/user_1705734000_abc123" \
  -H "Authorization: Bearer your_api_key"
```

### Python 示例

```python
import requests
import json
from typing import List, Dict, Optional
from datetime import datetime

class APIKeyManager:
    def __init__(self, api_key: str, base_url: str = "https://dbapi.muzilix.cn"):
        self.api_key = api_key
        self.base_url = base_url
        self.headers = {"Authorization": f"Bearer {api_key}"}
    
    def list_all_api_keys(self) -> Optional[Dict]:
        """列出所有 API 密钥"""
        url = f"{self.base_url}/admin/api-keys"
        
        try:
            response = requests.get(url, headers=self.headers)
            result = response.json()
            
            if response.status_code == 200:
                return result
            else:
                print(f"❌ 获取API密钥列表失败: {result.get('error')}")
                return None
                
        except Exception as e:
            print(f"❌ 请求失败: {str(e)}")
            return None
    
    def revoke_api_key(self, api_key_to_revoke: str) -> bool:
        """撤销 API 密钥"""
        url = f"{self.base_url}/admin/api-keys/{api_key_to_revoke}/revoke"
        
        try:
            response = requests.post(url, headers=self.headers)
            result = response.json()
            
            if response.status_code == 200:
                print(f"✅ API密钥已撤销")
                return True
            else:
                print(f"❌ 撤销API密钥失败: {result.get('error')}")
                return False
                
        except Exception as e:
            print(f"❌ 请求失败: {str(e)}")
            return False
    
    def get_user_api_keys(self, user_id: str) -> Optional[Dict]:
        """获取指定用户的所有 API 密钥"""
        url = f"{self.base_url}/admin/api-keys/{user_id}"
        
        try:
            response = requests.get(url, headers=self.headers)
            result = response.json()
            
            if response.status_code == 200:
                return result
            else:
                print(f"❌ 获取用户API密钥失败: {result.get('error')}")
                return None
                
        except Exception as e:
            print(f"❌ 请求失败: {str(e)}")
            return None
    
    def display_api_keys_table(self):
        """以表格形式显示 API 密钥列表"""
        result = self.list_all_api_keys()
        
        if not result or not result.get("success"):
            return
        
        api_keys = result.get("api_keys", [])
        
        print("🔑 API 密钥管理")
        print("=" * 120)
        print(f"{'用户':<12} {'密钥(部分)':<20} {'描述':<20} {'状态':<8} {'创建时间':<19} {'最后使用':<19}")
        print("-" * 120)
        
        for key in api_keys:
            username = key["username"]
            api_key_display = key["api_key_display"]
            description = key["description"] or "无描述"
            status = "✅ 激活" if key["is_active"] else "❌ 禁用"
            created_at = key["created_at"][:19].replace('T', ' ') if key["created_at"] else "N/A"
            last_used = key["last_used"][:19].replace('T', ' ') if key["last_used"] else "从未使用"
            
            print(f"{username:<12} {api_key_display:<20} {description:<20} {status:<8} {created_at:<19} {last_used:<19}")
        
        print(f"\n总计: {len(api_keys)} 个API密钥")
        
        # 显示统计信息
        active_keys = sum(1 for key in api_keys if key["is_active"])
        inactive_keys = len(api_keys) - active_keys
        
        print(f"激活: {active_keys}, 禁用: {inactive_keys}")
    
    def find_inactive_keys(self, days_threshold: int = 30) -> List[Dict]:
        """查找长期未使用的 API 密钥"""
        result = self.list_all_api_keys()
        
        if not result or not result.get("success"):
            return []
        
        api_keys = result.get("api_keys", [])
        inactive_keys = []
        
        for key in api_keys:
            if not key["is_active"]:
                continue
                
            if key["last_used"]:
                last_used = datetime.fromisoformat(key["last_used"].replace('Z', '+00:00'))
                days_since_use = (datetime.now().astimezone() - last_used).days
                
                if days_since_use > days_threshold:
                    inactive_keys.append({
                        "api_key": key["api_key_full"],
                        "username": key["username"],
                        "last_used": key["last_used"],
                        "days_inactive": days_since_use
                    })
        
        return inactive_keys
    
    def bulk_revoke_inactive_keys(self, days_threshold: int = 90) -> int:
        """批量撤销长期未使用的 API 密钥"""
        inactive_keys = self.find_inactive_keys(days_threshold)
        revoked_count = 0
        
        if not inactive_keys:
            print(f"✅ 没有找到超过 {days_threshold} 天未使用的API密钥")
            return 0
        
        print(f"🔍 找到 {len(inactive_keys)} 个超过 {days_threshold} 天未使用的API密钥:")
        
        for key in inactive_keys:
            print(f"   - {key['username']}: 最后使用 {key['days_inactive']} 天前")
            
            confirm = input(f"确认撤销 {key['username']} 的API密钥? (y/N): ").strip().lower()
            if confirm == 'y':
                if self.revoke_api_key(key['api_key']):
                    revoked_count += 1
        
        print(f"✅ 已撤销 {revoked_count} 个长期未使用的API密钥")
        return revoked_count

def interactive_api_key_management():
    """交互式 API 密钥管理"""
    api_key = input("请输入管理员API密钥: ").strip()
    manager = APIKeyManager(api_key)
    
    while True:
        print("\n🔑 API 密钥管理系统")
        print("1. 查看所有 API 密钥")
        print("2. 撤销 API 密钥")
        print("3. 查看用户 API 密钥")
        print("4. 查找长期未使用的密钥")
        print("5. 批量撤销长期未使用的密钥")
        print("6. 退出")
        
        choice = input("请选择操作 (1-6): ").strip()
        
        if choice == "1":
            manager.display_api_keys_table()
        
        elif choice == "2":
            api_key_to_revoke = input("要撤销的完整 API 密钥: ").strip()
            confirm = input(f"确认撤销该 API 密钥? (y/N): ").strip().lower()
            
            if confirm == "y":
                manager.revoke_api_key(api_key_to_revoke)
            else:
                print("操作已取消")
        
        elif choice == "3":
            user_id = input("用户 ID: ").strip()
            result = manager.get_user_api_keys(user_id)
            
            if result and result.get("success"):
                keys = result.get("api_keys", [])
                username = result.get("username", "未知用户")
                
                print(f"\n👤 用户 {username} 的 API 密钥:")
                for key in keys:
                    status = "激活" if key["is_active"] else "禁用"
                    print(f"   - {key['api_key_display']} ({status}) - {key['description']}")
            else:
                print("❌ 获取用户API密钥失败")
        
        elif choice == "4":
            days = input("未使用天数阈值 [30]: ").strip()
            days_threshold = int(days) if days.isdigit() else 30
            
            inactive_keys = manager.find_inactive_keys(days_threshold)
            
            if inactive_keys:
                print(f"\n🔍 超过 {days_threshold} 天未使用的 API 密钥:")
                for key in inactive_keys:
                    print(f"   - {key['username']}: {key['days_inactive']} 天未使用")
            else:
                print(f"✅ 没有找到超过 {days_threshold} 天未使用的API密钥")
        
        elif choice == "5":
            days = input("未使用天数阈值 [90]: ").strip()
            days_threshold = int(days) if days.isdigit() else 90
            
            manager.bulk_revoke_inactive_keys(days_threshold)
        
        elif choice == "6":
            print("退出 API 密钥管理系统")
            break
        
        else:
            print("❌ 无效选择")

# 使用示例
if __name__ == "__main__":
    # 方式1: 直接使用
    # manager = APIKeyManager("your_admin_api_key")
    # manager.display_api_keys_table()
    
    # 方式2: 查找长期未使用的密钥
    # manager = APIKeyManager("your_admin_api_key")
    # inactive_keys = manager.find_inactive_keys(30)
    # for key in inactive_keys:
    #     print(f"{key['username']}: {key['days_inactive']}天未使用")
    
    # 方式3: 交互式管理
    interactive_api_key_management()
```

## 管理功能说明

### 1. 密钥安全
- 完整密钥仅在初始配置时显示
- 日常管理使用部分显示的密钥
- 支持密钥撤销而非删除
- 保留审计记录

### 2. 使用监控
- 记录最后使用时间
- 跟踪密钥活跃状态
- 支持基于时间的清理策略

### 3. 批量操作
- 查找长期未使用的密钥
- 批量撤销过期密钥
- 用户级别的密钥管理

## 安全最佳实践

### 1. 定期审查
```python
def monthly_key_audit(manager):
    """月度密钥审计"""
    print("🔍 执行月度 API 密钥审计...")
    
    # 查找90天未使用的密钥
    inactive_keys = manager.find_inactive_keys(90)
    
    if inactive_keys:
        print(f"发现 {len(inactive_keys)} 个长期未使用的密钥")
        # 可以发送通知或自动处理
    else:
        print("✅ 所有密钥都在正常使用")
```

### 2. 密钥轮换
```python
def enforce_key_rotation(manager, max_age_days=365):
    """强制执行密钥轮换"""
    result = manager.list_all_api_keys()
    
    if not result or not result.get("success"):
        return
    
    api_keys = result.get("api_keys", [])
    old_keys = []
    
    for key in api_keys:
        if key["is_active"] and key["created_at"]:
            created_at = datetime.fromisoformat(key["created_at"].replace('Z', '+00:00'))
            age_days = (datetime.now().astimezone() - created_at).days
            
            if age_days > max_age_days:
                old_keys.append({
                    "api_key": key["api_key_full"],
                    "username": key["username"],
                    "age_days": age_days
                })
    
    return old_keys
```

## 相关链接

- [用户管理](admin-users.md) - 用户账户管理
- [用户认证](auth-login.md) - 用户登录认证
- [权限说明](/reference/permission-matrix.md) - 详细权限说明