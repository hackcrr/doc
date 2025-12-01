# 安全指南

## 概述

本文档提供数据库管理 API 的安全配置、最佳实践和风险防范指南，帮助您安全地部署和使用 API 服务。

## 认证安全

### API 密钥管理

#### 密钥生成与存储
```python
# API 密钥使用加密安全随机数生成
def generate_api_key(self) -> str:
    """生成API密钥"""
    return secrets.token_urlsafe(32)  # 256位安全随机数
```

**安全要求：**
- 🔑 **密钥长度**: 最小 32 字符
- 🔄 **随机性**: 使用加密安全随机数生成器
- 💾 **存储**: 数据库中加密存储
- 🗑️ **生命周期**: 支持密钥撤销和过期

#### 密钥使用规范
```bash
# 正确用法 - 使用 Bearer Token
curl -H "Authorization: Bearer your_api_key_here" ...

# 错误用法 - 直接暴露在URL中
curl http://api.com/endpoint?api_key=xxx  # ❌ 不安全！
```

### 密码安全

#### 密码哈希
```python
def hash_password(self, password: str) -> str:
    """哈希密码（加盐）"""
    salt = "database_api_salt_2024"  # 生产环境应使用随机盐
    return hashlib.sha256((password + salt).encode()).hexdigest()
```

**密码策略：**
- ✅ 最小长度：6 字符
- ✅ 必须包含字母和数字
- ❌ 禁止使用常见弱密码
- 🔄 支持定期密码更换

## 权限安全

### 基于角色的访问控制 (RBAC)

#### 权限级别定义
```python
PERMISSION_LEVELS = {
    'readonly': 1,      # 只读权限
    'operator': 2,      # 操作权限（查询、插入）
    'admin': 3,         # 管理员权限（全部操作）
    'superadmin': 4     # 超级管理员（包括用户管理）
}
```

#### 权限验证装饰器
```python
def require_permission(permission_name):
    """要求特定权限的装饰器"""
    def decorator(f):
        @wraps(f)
        @require_auth
        def decorated_function(*args, **kwargs):
            user_info = getattr(request, 'user', {})
            user_permissions = user_info.get('permissions', [])
            
            # 超级管理员拥有所有权限
            if 'all' in user_permissions:
                return f(*args, **kwargs)
            
            # 检查权限
            if permission_name not in user_permissions:
                return jsonify({'error': '权限不足'}), 403
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator
```

### 数据库权限隔离

#### 权限检查机制
```python
def check_database_permission(self, user_id: str, database_name: str, required_permission: str = 'read') -> bool:
    """检查用户对数据库的权限"""
    # 1. 验证用户角色
    # 2. 检查数据库级权限
    # 3. 验证权限级别
```

**权限级别映射：**
- `read` → 查询操作
- `write` → 插入、更新、删除
- `admin` → 表结构修改、备份操作

## 输入验证与 SQL 注入防护

### 数据库名称验证
```python
def validate_database_name(db_name: str) -> bool:
    """验证数据库名称格式"""
    if not db_name or not isinstance(db_name, str):
        return False
    # 允许字母、数字、下划线，且不能是纯数字
    return db_name.replace('_', '').isalnum() and not db_name.isdigit()
```

### SQL 查询安全验证
```python
def validate_sql_security(sql: str, query_type: str) -> dict:
    """验证SQL语句的安全性"""
    
    # 禁止的SQL关键字（写操作）
    forbidden_keywords = [
        'INSERT', 'UPDATE', 'DELETE', 'DROP', 'TRUNCATE', 'CREATE', 
        'ALTER', 'GRANT', 'REVOKE', 'REPLACE', 'MERGE', 'LOCK', 'UNLOCK'
    ]
    
    # 检查是否包含禁止的关键字
    for keyword in forbidden_keywords:
        if f' {keyword} ' in f' {sql_upper} ':
            return {
                'valid': False,
                'reason': f'检测到禁止的操作: {keyword}'
            }
    
    # 限制查询长度和复杂度
    if len(sql) > 5000:
        return {'valid': False, 'reason': 'SQL语句过长'}
    
    return {'valid': True}
```

### 参数化查询
```python
# 安全：使用参数化查询
cursor.execute("SELECT * FROM users WHERE name = %s AND age > %s", (name, min_age))

# 危险：字符串拼接（容易SQL注入）
cursor.execute(f"SELECT * FROM users WHERE name = '{name}'")  # ❌ 不安全！
```

## 速率限制

### 全局限流配置
```python
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://",
)
```

### 端点级限流
```python
@app.route('/create', methods=['POST'])
@limiter.limit("10 per minute")  # 创建数据库频率限制
def create_database():
    # ...

@app.route('/database/<db_name>/backup', methods=['POST'])
@limiter.limit("3 per hour")  # 备份操作频率限制
def backup_database(db_name: str):
    # ...
```

### 限流策略
| 端点 | 限制规则 | 目的 |
|------|----------|------|
| 用户注册 | 5/小时 | 防止批量注册 |
| 数据库创建 | 10/分钟 | 防止资源滥用 |
| 备份操作 | 3/小时 | 防止系统过载 |
| 数据导出 | 10/小时 | 保护数据安全 |
| SQL 查询 | 50/小时 | 防止数据库过载 |

## 数据保护

### 敏感数据脱敏
```python
# 在日志中脱敏敏感信息
safe_sql = sql.replace('\n', ' ').replace('\r', ' ').strip()
if len(safe_sql) > 200:
    safe_sql = safe_sql[:200] + '...'

app.logger.info(f"SQL查询执行成功: {db_name}, 类型: {query_type}, 返回行数: {len(data)}")
```

### 错误信息处理
```python
try:
    # 数据库操作
except pymysql.Error as e:
    # 对错误信息进行脱敏处理
    safe_error = f'SQL执行错误 (错误代码: {error_code})'
    app.logger.error(f"SQL执行失败: {error_code} - {error_message}")
    return jsonify({'error': safe_error}), 400
```

## 审计与日志

### 操作审计
```python
def log_audit(self, user_id: str, action: str, resource: str = None, details: str = None):
    """记录审计日志"""
    ip_address = request.remote_addr
    user_agent = request.headers.get('User-Agent', '')
    
    cursor.execute("""
        INSERT INTO audit_logs (user_id, action, resource, details, ip_address, user_agent)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (user_id, action, resource, details, ip_address, user_agent))
```

### 审计日志内容
- 👤 用户身份信息
- ⏰ 操作时间戳
- 🎯 操作类型和资源
- 🌐 客户端 IP 和 User-Agent
- 📝 操作详情（脱敏后）

## 网络安全

### CORS 配置
```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # 允许跨域请求，生产环境应限制域名
```

**生产环境推荐配置：**
```python
CORS(app, origins=[
    "https://your-frontend-domain.com",
    "https://admin.your-domain.com"
])
```

### 请求头安全
```python
@app.after_request
def apply_security_headers(response):
    """应用安全头部"""
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    return response
```

## 部署安全

### 环境配置
```bash
# api.env - 生产环境配置示例
DB_HOST=mysql.internal.company.com
DB_USER=api_service_user
DB_PASSWORD=strong_password_123
DB_PORT=3306

# 安全相关配置
SECRET_KEY=your_very_long_random_secret_key
BACKUP_DIR=/secure/backup/location
LOG_LEVEL=WARNING
```

### 文件权限
```python
# 备份目录安全配置
BACKUP_CONFIG = {
    'backup_dir': 'backups',
    'max_backup_files': 10,
    'backup_timeout': 300,
}

# 确保备份目录权限正确
os.makedirs(BACKUP_CONFIG['backup_dir'], exist_ok=True)
```

## 监控与告警

### 安全事件监控
```python
# 监控异常登录尝试
failed_attempts = 0
MAX_FAILED_ATTEMPTS = 5

def check_login_security(username, ip_address):
    """检查登录安全"""
    global failed_attempts
    if failed_attempts >= MAX_FAILED_ATTEMPTS:
        app.logger.warning(f"多次登录失败: {username} from {ip_address}")
        # 触发告警或临时封禁
```

### 关键指标监控
- 🔐 认证失败次数
- 🚫 权限拒绝次数
- ⚡ 速率限制触发
- 📊 异常操作模式
- 💾 备份操作状态

## 应急响应

### 安全事件处理流程

1. **检测**
   - 监控系统告警
   - 审计日志分析
   - 异常模式识别

2. **响应**
   - 立即撤销受影响密钥
   - 暂时禁用可疑账户
   - 保留相关日志证据

3. **恢复**
   - 修复安全漏洞
   - 重置受影响凭证
   - 更新安全策略

4. **复盘**
   - 分析根本原因
   - 改进防护措施
   - 更新应急预案

### 紧急操作命令
```bash
# 立即撤销所有活跃会话
UPDATE api_keys SET is_active = FALSE;

# 禁用特定用户
UPDATE users SET is_active = FALSE WHERE username = 'compromised_user';

# 查看最近安全事件
SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 100;
```

## 合规与最佳实践

### 数据保护法规
- 📜 **最小数据原则**: 只收集必要的数据
- 🔐 **加密存储**: 敏感数据必须加密
- 🗑️ **数据保留**: 定期清理过期数据
- 👁️ **访问日志**: 记录所有数据访问

### 定期安全检查清单
- [ ] 审查用户权限分配
- [ ] 轮换 API 密钥和密码
- [ ] 更新依赖包安全补丁
- [ ] 检查审计日志异常
- [ ] 验证备份完整性
- [ ] 测试应急响应流程

## 获取帮助

如果发现安全漏洞或需要安全支持，请联系：
- 📧 安全团队: security@your-company.com
- 🔔 紧急事件: +1-XXX-XXX-XXXX

**重要**: 请勿在公开渠道披露安全漏洞，通过安全渠道报告。