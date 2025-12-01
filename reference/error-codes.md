# 错误代码参考

## 概述

本文档提供 Database API 中所有错误代码的详细说明、可能原因和解决方案。

## 错误代码分类

### 4xx - 客户端错误

#### 认证错误 (401)

| 错误代码 | HTTP 状态码 | 说明 | 可能原因 | 解决方案 |
|----------|-------------|------|----------|----------|
| `AUTH_REQUIRED` | 401 | 需要认证 | 未提供 API 密钥 | 在请求头中添加 `Authorization: Bearer your_api_key` |
| `INVALID_API_KEY` | 401 | 无效的 API 密钥 | API 密钥错误或已撤销 | 检查 API 密钥是否正确，或重新登录获取新密钥 |
| `USER_DISABLED` | 401 | 用户账户已被禁用 | 用户账户被管理员禁用 | 联系系统管理员启用账户 |
| `INVALID_CREDENTIALS` | 401 | 用户名或密码错误 | 登录凭据不正确 | 检查用户名和密码，或使用密码重置功能 |

#### 权限错误 (403)

| 错误代码 | HTTP 状态码 | 说明 | 可能原因 | 解决方案 |
|----------|-------------|------|----------|----------|
| `PERMISSION_DENIED` | 403 | 权限不足 | 用户没有执行该操作的权限 | 检查用户权限，或联系管理员授予相应权限 |
| `DATABASE_ACCESS_DENIED` | 403 | 没有访问该数据库的权限 | 用户没有目标数据库的访问权限 | 联系管理员授予数据库访问权限 |
| `OPERATION_NOT_ALLOWED` | 403 | 操作不被允许 | 尝试执行不允许的操作 | 检查操作是否符合用户角色权限 |

#### 请求错误 (400)

| 错误代码 | HTTP 状态码 | 说明 | 可能原因 | 解决方案 |
|----------|-------------|------|----------|----------|
| `INVALID_REQUEST` | 400 | 请求格式错误 | 请求体格式不正确或缺少必需字段 | 检查请求格式和必需字段 |
| `INVALID_DATABASE_NAME` | 400 | 无效的数据库名称 | 数据库名称包含非法字符或格式不正确 | 数据库名称只能包含字母、数字和下划线 |
| `INVALID_TABLE_NAME` | 400 | 无效的表名称 | 表名称包含非法字符或格式不正确 | 表名称只能包含字母、数字和下划线 |
| `USERNAME_EXISTS` | 400 | 用户名已存在 | 注册时用户名已被占用 | 选择其他用户名 |
| `INVALID_USERNAME` | 400 | 无效的用户名 | 用户名格式不符合要求 | 用户名必须为3-50位字母、数字、下划线 |
| `WEAK_PASSWORD` | 400 | 密码强度不足 | 密码长度不足6位 | 使用至少6位字符的密码 |
| `INVALID_ROLE` | 400 | 无效的用户角色 | 指定的用户角色不存在 | 使用有效的角色：readonly, operator, user, admin, superadmin |
| `INVALID_PERMISSION_LEVEL` | 400 | 无效的权限级别 | 数据库权限级别不正确 | 使用有效的权限级别：read, write, admin |

#### 资源冲突 (409)

| 错误代码 | HTTP 状态码 | 说明 | 可能原因 | 解决方案 |
|----------|-------------|------|----------|----------|
| `DATABASE_EXISTS` | 409 | 数据库已存在 | 尝试创建已存在的数据库 | 使用其他数据库名称或删除现有数据库 |
| `TABLE_EXISTS` | 409 | 表已存在 | 尝试创建已存在的表 | 使用其他表名称或删除现有表 |
| `DUPLICATE_KEY` | 409 | 唯一键冲突 | 插入的数据违反唯一性约束 | 检查数据是否重复，或更新现有记录 |

### 5xx - 服务器错误

#### 数据库错误 (500)

| 错误代码 | HTTP 状态码 | 说明 | 可能原因 | 解决方案 |
|----------|-------------|------|----------|----------|
| `DATABASE_CONNECTION_FAILED` | 500 | 数据库连接失败 | 数据库服务不可用或配置错误 | 检查数据库服务状态和连接配置 |
| `QUERY_EXECUTION_FAILED` | 500 | 查询执行失败 | SQL 查询语法错误或执行超时 | 检查 SQL 语法，优化查询性能 |
| `BACKUP_FAILED` | 500 | 备份操作失败 | 备份过程中出现错误 | 检查磁盘空间和备份配置，重试操作 |
| `RESTORE_FAILED` | 500 | 恢复操作失败 | 恢复过程中出现错误 | 检查备份文件完整性和数据库状态 |

#### 系统错误 (500)

| 错误代码 | HTTP 状态码 | 说明 | 可能原因 | 解决方案 |
|----------|-------------|------|----------|----------|
| `INTERNAL_SERVER_ERROR` | 500 | 服务器内部错误 | 未预期的系统错误 | 查看服务器日志，联系管理员 |
| `SERVICE_UNAVAILABLE` | 503 | 服务暂时不可用 | 系统维护或过载 | 等待后重试，或联系管理员 |

### SQL 执行错误

#### 语法错误 (400)

| 错误代码 | HTTP 状态码 | 说明 | 可能原因 | 解决方案 |
|----------|-------------|------|----------|----------|
| `SQL_SYNTAX_ERROR` | 400 | SQL 语法错误 | SQL 语句语法不正确 | 检查 SQL 语法，参考 SQL 指南 |
| `UNKNOWN_COLUMN` | 400 | 未知的列 | 查询中引用了不存在的列 | 检查表结构，使用正确的列名 |
| `UNKNOWN_TABLE` | 400 | 未知的表 | 查询中引用了不存在的表 | 检查表名是否正确，或查看可用表列表 |
| `DATA_TYPE_MISMATCH` | 400 | 数据类型不匹配 | 插入的数据类型与列定义不匹配 | 检查数据类型，确保与表结构一致 |

#### 安全错误 (400)

| 错误代码 | HTTP 状态码 | 说明 | 可能原因 | 解决方案 |
|----------|-------------|------|----------|----------|
| `SQL_SECURITY_VIOLATION` | 400 | SQL 安全性验证失败 | 检测到禁止的 SQL 操作 | 只允许 SELECT、EXPLAIN、DESCRIBE、SHOW 操作 |
| `DANGEROUS_PATTERN_DETECTED` | 400 | 检测到危险的模式 | SQL 中包含危险的模式 | 避免使用系统表访问和危险操作 |

### 限制错误 (429)

| 错误代码 | HTTP 状态码 | 说明 | 可能原因 | 解决方案 |
|----------|-------------|------|----------|----------|
| `RATE_LIMIT_EXCEEDED` | 429 | 频率限制超出 | 短时间内请求过于频繁 | 降低请求频率，等待后重试 |
| `BACKUP_LIMIT_EXCEEDED` | 429 | 备份操作限制 | 备份操作过于频繁 | 备份操作限制为3次/小时 |
| `QUERY_LIMIT_EXCEEDED` | 429 | 查询操作限制 | 查询操作过于频繁 | 查询操作限制为200次/小时 |

## 错误处理示例

### Python 错误处理

```python
import requests
from typing import Optional, Dict

class APIErrorHandler:
    @staticmethod
    def handle_error(response: requests.Response) -> Optional[Dict]:
        """统一错误处理"""
        if response.status_code < 400:
            return None
        
        error_data = response.json()
        error_code = error_data.get('error_code', 'UNKNOWN_ERROR')
        error_message = error_data.get('error', '未知错误')
        
        # 根据错误代码采取不同策略
        if response.status_code == 401:
            print(f"认证错误: {error_message}")
            # 重新登录或刷新令牌
            return error_data
            
        elif response.status_code == 403:
            print(f"权限错误: {error_message}")
            # 检查权限或联系管理员
            return error_data
            
        elif response.status_code == 429:
            print(f"频率限制: {error_message}")
            # 实现指数退避重试
            return error_data
            
        elif response.status_code >= 500:
            print(f"服务器错误: {error_message}")
            # 记录日志并通知管理员
            return error_data
            
        else:
            print(f"客户端错误: {error_message}")
            # 检查请求格式和参数
            return error_data

def make_api_request(url: str, headers: dict, data: dict = None):
    """带错误处理的 API 请求"""
    try:
        if data:
            response = requests.post(url, json=data, headers=headers)
        else:
            response = requests.get(url, headers=headers)
        
        # 检查响应状态
        if response.status_code >= 400:
            error_info = APIErrorHandler.handle_error(response)
            if error_info:
                return {"success": False, "error": error_info}
        
        return {"success": True, "data": response.json()}
        
    except requests.exceptions.ConnectionError:
        return {"success": False, "error": "网络连接错误"}
    except requests.exceptions.Timeout:
        return {"success": False, "error": "请求超时"}
    except Exception as e:
        return {"success": False, "error": f"请求异常: {str(e)}"}
```

### 重试策略

```python
import time
import random

def retry_on_failure(func, max_retries=3, base_delay=1):
    """错误重试装饰器"""
    def wrapper(*args, **kwargs):
        for attempt in range(max_retries):
            try:
                result = func(*args, **kwargs)
                if result.get('success'):
                    return result
                
                # 检查是否可重试的错误
                error = result.get('error', {})
                if isinstance(error, dict):
                    error_code = error.get('error_code')
                    status_code = error.get('status_code', 500)
                    
                    # 只对服务器错误和频率限制进行重试
                    if status_code >= 500 or status_code == 429:
                        if attempt < max_retries - 1:
                            delay = base_delay * (2 ** attempt) + random.random()
                            print(f"重试 {attempt + 1}/{max_retries}, 等待 {delay:.2f}秒")
                            time.sleep(delay)
                            continue
                
                return result
                
            except Exception as e:
                if attempt == max_retries - 1:
                    return {"success": False, "error": f"最终失败: {str(e)}"}
                
                delay = base_delay * (2 ** attempt) + random.random()
                print(f"异常重试 {attempt + 1}/{max_retries}, 等待 {delay:.2f}秒")
                time.sleep(delay)
        
        return {"success": False, "error": "超过最大重试次数"}
    return wrapper
```

## 常见问题解决

### 1. 认证问题
**问题**: 收到 `AUTH_REQUIRED` 或 `INVALID_API_KEY` 错误
**解决**:
```python
# 重新获取 API 密钥
from auth_login import user_login

def refresh_api_key(username, password):
    result = user_login(username, password)
    if result['success']:
        new_api_key = result['api_key']
        # 更新配置中的 API 密钥
        update_config('api_key', new_api_key)
        return new_api_key
    return None
```

### 2. 权限问题
**问题**: 收到 `PERMISSION_DENIED` 错误
**解决**:
```python
# 检查当前用户权限
from auth_profile import get_user_profile, check_permission

def verify_permission(api_key, required_permission):
    has_permission = check_permission(api_key, required_permission)
    if not has_permission:
        print(f"需要权限: {required_permission}")
        # 联系管理员授予权限
        return False
    return True
```

### 3. 频率限制问题
**问题**: 收到 `RATE_LIMIT_EXCEEDED` 错误
**解决**:
```python
# 实现指数退避重试
@retry_on_failure
def make_rate_limited_request(url, headers):
    return make_api_request(url, headers)
```

### 4. 数据库连接问题
**问题**: 收到 `DATABASE_CONNECTION_FAILED` 错误
**解决**:
```python
# 检查数据库状态
def check_database_health(api_key):
    from health_check import health_check
    result = health_check(api_key)
    if not result['success']:
        print("数据库服务异常，请联系管理员")
        return False
    return True
```

## 调试技巧

### 1. 启用详细日志
```python
import logging
import http.client

# 启用 HTTP 调试日志
http.client.HTTPConnection.debuglevel = 1
logging.basicConfig()
logging.getLogger().setLevel(logging.DEBUG)
requests_log = logging.getLogger("requests.packages.urllib3")
requests_log.setLevel(logging.DEBUG)
requests_log.propagate = True
```

### 2. 请求/响应记录
```python
def debug_api_call(url, headers, data=None):
    print(f"请求 URL: {url}")
    print(f"请求头: {headers}")
    if data:
        print(f"请求体: {data}")
    
    if data:
        response = requests.post(url, json=data, headers=headers)
    else:
        response = requests.get(url, headers=headers)
    
    print(f"响应状态: {response.status_code}")
    print(f"响应内容: {response.text}")
    
    return response
```

## 联系支持

如果遇到未列出的错误或无法解决的问题，请：

1. 查看服务器日志获取详细错误信息
2. 提供完整的错误响应和请求信息
3. 联系系统管理员提供技术支持

## 相关链接

- [API 限制说明](api-limits.md) - 频率限制和配额详情
- [权限矩阵](permission-matrix.md) - 权限配置参考
- [SQL 使用指南](sql-guide.md) - SQL 查询最佳实践