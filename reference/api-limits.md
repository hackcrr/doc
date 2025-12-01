# API 限制说明

## 概述

本文档详细说明 Database API 的各项限制，包括频率限制、配额限制和安全限制，帮助您合理使用 API 资源。

## 频率限制

### 全局限制

| 限制类型 | 限制值 | 时间窗口 | 说明 |
|----------|--------|----------|------|
| 每日请求 | 200 次 | 24 小时 | 单个用户每日总请求次数 |
| 每小时请求 | 50 次 | 1 小时 | 单个用户每小时请求次数 |
| 并发请求 | 5 个 | 实时 | 单个用户同时处理的请求数 |

### 接口级别限制

#### 数据库管理
| 接口 | 方法 | 限制 | 时间窗口 | 说明 |
|------|------|------|----------|------|
| `/create` | POST | 10 次 | 1 分钟 | 创建数据库频率限制 |
| `/database/{db_name}` | DELETE | 5 次 | 1 分钟 | 删除数据库频率限制 |

#### 数据操作
| 接口 | 方法 | 限制 | 时间窗口 | 说明 |
|------|------|------|----------|------|
| `/database/{db_name}/table` | POST | 20 次 | 1 分钟 | 创建表频率限制 |
| `/database/{db_name}/table/{table_name}/data` | POST | 100 次 | 1 分钟 | 插入数据频率限制 |
| `/database/{db_name}/table/{table_name}/data` | GET | 200 次 | 1 小时 | 查询数据频率限制 |
| `/database/{db_name}/query` | POST | 50 次 | 1 小时 | 执行查询频率限制 |

#### 批量操作
| 接口 | 方法 | 限制 | 时间窗口 | 说明 |
|------|------|------|----------|------|
| `/database/{db_name}/batch/update` | POST | 30 次 | 1 小时 | 批量更新频率限制 |
| `/database/{db_name}/batch/delete` | POST | 20 次 | 1 小时 | 批量删除频率限制 |
| `/database/{db_name}/export` | POST | 10 次 | 1 小时 | 数据导出频率限制 |
| `/database/{db_name}/import` | POST | 10 次 | 1 小时 | 数据导入频率限制 |

#### 备份恢复
| 接口 | 方法 | 限制 | 时间窗口 | 说明 |
|------|------|------|----------|------|
| `/database/{db_name}/backup` | POST | 3 次 | 1 小时 | 备份操作频率限制 |
| `/backup/{filename}` | DELETE | 10 次 | 1 分钟 | 删除备份频率限制 |
| `/database/{db_name}/backup/auto` | POST | 1 次 | 1 天 | 自动备份配置限制 |

#### 用户管理
| 接口 | 方法 | 限制 | 时间窗口 | 说明 |
|------|------|------|----------|------|
| `/auth/register` | POST | 5 次 | 1 分钟 | 用户注册频率限制 |
| `/auth/login` | POST | 10 次 | 1 分钟 | 登录尝试频率限制 |

## 配额限制

### 数据库限制
| 限制项 | 限制值 | 说明 |
|--------|--------|------|
| 数据库数量 | 50 个 | 单个用户最多创建的数据库数 |
| 数据库名称长度 | 64 字符 | 数据库名称最大长度 |
| 表数量 | 1000 个 | 单个数据库最多表数 |
| 表名称长度 | 64 字符 | 表名称最大长度 |

### 数据操作限制
| 限制项 | 限制值 | 说明 |
|--------|--------|------|
| 单次插入行数 | 1000 行 | 单次插入操作的最大行数 |
| 批量操作行数 | 1000 行 | 批量更新/删除的最大行数 |
| 查询返回行数 | 1000 行 | 单次查询返回的最大行数 |
| 分页大小 | 100 行 | 分页查询每页最大行数 |
| 导出文件大小 | 100 MB | 单次导出数据最大大小 |

### 备份限制
| 限制项 | 限制值 | 说明 |
|--------|--------|------|
| 备份文件数量 | 10 个 | 每个用户最多保留的备份文件数 |
| 备份文件大小 | 无限制 | 备份文件大小限制 |
| 备份保留时间 | 30 天 | 自动清理超过30天的备份 |

### SQL 查询限制
| 限制项 | 限制值 | 说明 |
|--------|--------|------|
| 查询超时时间 | 30 秒 | SQL 查询执行最长时间 |
| 查询长度 | 5000 字符 | SQL 语句最大长度 |
| 子查询深度 | 3 层 | 最大嵌套子查询深度 |
| 结果集大小 | 10 MB | 单次查询返回数据最大大小 |

## 安全限制

### 输入验证限制
| 限制项 | 限制值 | 说明 |
|--------|--------|------|
| 数据库名称 | 字母、数字、下划线 | 数据库名称字符限制 |
| 表名称 | 字母、数字、下划线 | 表名称字符限制 |
| 字段名称 | 字母、数字、下划线 | 字段名称字符限制 |
| 用户名 | 3-50 位字母、数字、下划线 | 用户名格式限制 |
| 密码长度 | 最少 6 位 | 密码最小长度 |

### API 密钥限制
| 限制项 | 限制值 | 说明 |
|--------|--------|------|
| API 密钥数量 | 5 个 | 单个用户最多活跃的 API 密钥数 |
| 密钥长度 | 32 字符 | API 密钥固定长度 |
| 密钥有效期 | 永不过期 | API 密钥默认有效期 |

## 监控和统计限制

### 数据保留
| 数据类型 | 保留时间 | 说明 |
|----------|----------|------|
| 审计日志 | 90 天 | 用户操作日志保留时间 |
| 性能统计 | 30 天 | 性能指标数据保留时间 |
| 错误日志 | 30 天 | 错误记录保留时间 |
| 备份文件 | 30 天 | 备份文件保留时间 |

## 处理限制策略

### 频率限制响应
当触发频率限制时，API 返回：
```json
{
  "error": "频率限制超出",
  "error_code": "RATE_LIMIT_EXCEEDED",
  "retry_after": 60,
  "limits": {
    "limit": 50,
    "remaining": 0,
    "reset_time": "2024-01-20T16:00:00"
  }
}
```

### Python 处理示例
```python
import requests
import time
from datetime import datetime

class APIClient:
    def __init__(self, api_key, base_url="https://dbapi.muzilix.cn"):
        self.api_key = api_key
        self.base_url = base_url
        self.headers = {"Authorization": f"Bearer {api_key}"}
    
    def make_request_with_retry(self, method, endpoint, data=None, max_retries=3):
        """带重试的请求处理"""
        url = f"{self.base_url}{endpoint}"
        
        for attempt in range(max_retries):
            try:
                if method.upper() == "GET":
                    response = requests.get(url, headers=self.headers)
                else:
                    response = requests.post(url, json=data, headers=self.headers)
                
                if response.status_code == 429:  # 频率限制
                    retry_after = int(response.headers.get('Retry-After', 60))
                    print(f"频率限制，等待 {retry_after} 秒后重试...")
                    time.sleep(retry_after)
                    continue
                
                return response.json()
                
            except requests.exceptions.RequestException as e:
                if attempt == max_retries - 1:
                    raise e
                time.sleep(2 ** attempt)  # 指数退避
        
        return {"error": "超过最大重试次数"}
    
    def get_rate_limit_info(self):
        """获取频率限制信息"""
        # 通过响应头获取限制信息
        url = f"{self.base_url}/databases"
        response = requests.get(url, headers=self.headers)
        
        limits = {
            "limit": response.headers.get("X-RateLimit-Limit"),
            "remaining": response.headers.get("X-RateLimit-Remaining"), 
            "reset": response.headers.get("X-RateLimit-Reset")
        }
        
        return limits
```

### 优化请求模式
```python
class OptimizedAPIClient:
    def __init__(self, api_key):
        self.api_key = api_key
        self.client = APIClient(api_key)
        self.request_times = []
    
    def check_rate_limit(self, window_minutes=60, max_requests=50):
        """检查当前频率限制状态"""
        now = time.time()
        window_start = now - (window_minutes * 60)
        
        # 清理过期记录
        self.request_times = [t for t in self.request_times if t > window_start]
        
        if len(self.request_times) >= max_requests:
            oldest_request = min(self.request_times)
            wait_time = oldest_request + (window_minutes * 60) - now
            return False, wait_time
        
        return True, 0
    
    def make_optimized_request(self, method, endpoint, data=None):
        """优化后的请求，自动避免频率限制"""
        can_proceed, wait_time = self.check_rate_limit()
        
        if not can_proceed:
            print(f"接近频率限制，等待 {wait_time:.1f} 秒")
            time.sleep(wait_time)
        
        self.request_times.append(time.time())
        return self.client.make_request_with_retry(method, endpoint, data)
```

## 批量操作优化

### 分批处理大量数据
```python
def batch_insert_data(api_key, db_name, table_name, data, batch_size=100):
    """分批插入大量数据"""
    client = APIClient(api_key)
    
    for i in range(0, len(data), batch_size):
        batch = data[i:i + batch_size]
        
        result = client.make_optimized_request(
            "POST",
            f"/database/{db_name}/table/{table_name}/data",
            {"data": batch}
        )
        
        if "error" in result:
            print(f"批次 {i//batch_size + 1} 插入失败: {result['error']}")
            # 可以选择继续或终止
            continue
        
        print(f"批次 {i//batch_size + 1} 插入成功: {len(batch)} 行")
        
        # 避免频率限制，小批量延迟
        if len(data) > batch_size:
            time.sleep(1)
```

### 异步处理模式
```python
import asyncio
import aiohttp

class AsyncAPIClient:
    def __init__(self, api_key):
        self.api_key = api_key
        self.semaphore = asyncio.Semaphore(5)  # 控制并发数
    
    async def make_async_request(self, session, method, endpoint, data=None):
        """异步请求"""
        async with self.semaphore:  # 控制并发
            url = f"https://dbapi.muzilix.cn{endpoint}"
            headers = {"Authorization": f"Bearer {self.api_key}"}
            
            try:
                if method.upper() == "GET":
                    async with session.get(url, headers=headers) as response:
                        return await response.json()
                else:
                    async with session.post(url, json=data, headers=headers) as response:
                        return await response.json()
            except Exception as e:
                return {"error": str(e)}
    
    async def batch_async_operations(self, operations):
        """批量异步操作"""
        async with aiohttp.ClientSession() as session:
            tasks = []
            for op in operations:
                task = self.make_async_request(
                    session, op['method'], op['endpoint'], op.get('data')
                )
                tasks.append(task)
            
            results = await asyncio.gather(*tasks, return_exceptions=True)
            return results
```

## 监控和告警

### 限制使用监控
```python
class UsageMonitor:
    def __init__(self, api_key):
        self.api_key = api_key
        self.daily_usage = 0
        self.hourly_usage = 0
        self.last_reset = time.time()
    
    def track_usage(self):
        """跟踪使用情况"""
        current_time = time.time()
        
        # 每天重置
        if current_time - self.last_reset >= 86400:
            self.daily_usage = 0
            self.hourly_usage = 0
            self.last_reset = current_time
        # 每小时重置  
        elif current_time - self.last_reset >= 3600:
            self.hourly_usage = 0
        
        self.daily_usage += 1
        self.hourly_usage += 1
    
    def check_usage_limits(self):
        """检查使用限制"""
        warnings = []
        
        if self.daily_usage > 150:  # 接近每日限制
            warnings.append(f"每日使用量接近限制: {self.daily_usage}/200")
        
        if self.hourly_usage > 40:  # 接近每小时限制
            warnings.append(f"每小时使用量接近限制: {self.hourly_usage}/50")
        
        return warnings
    
    def get_usage_summary(self):
        """获取使用摘要"""
        return {
            "daily_usage": self.daily_usage,
            "hourly_usage": self.hourly_usage,
            "daily_remaining": 200 - self.daily_usage,
            "hourly_remaining": 50 - self.hourly_usage
        }
```

## 最佳实践

### 1. 合理规划请求频率
```python
# 好的实践：均匀分布请求
import time

def distributed_requests(operations):
    """均匀分布请求"""
    for i, operation in enumerate(operations):
        # 每10个请求暂停1秒
        if i > 0 and i % 10 == 0:
            time.sleep(1)
        
        # 执行操作
        execute_operation(operation)
```

### 2. 使用批量操作
```python
# 避免：多次单条插入
for item in data:
    insert_single_record(item)  # 触发频率限制

# 推荐：批量插入
batch_insert_data(data, batch_size=100)  # 更高效
```

### 3. 缓存频繁访问的数据
```python
import functools
import time

def cache_with_ttl(ttl_seconds=300):
    """带过期时间的缓存"""
    def decorator(func):
        cache = {}
        
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            key = str(args) + str(kwargs)
            
            if key in cache:
                result, timestamp = cache[key]
                if time.time() - timestamp < ttl_seconds:
                    return result
            
            result = func(*args, **kwargs)
            cache[key] = (result, time.time())
            return result
        
        return wrapper
    return decorator

# 使用缓存
@cache_with_ttl(ttl_seconds=300)  # 缓存5分钟
def get_database_info(api_key, db_name):
    """获取数据库信息（带缓存）"""
    client = APIClient(api_key)
    return client.make_request_with_retry("GET", f"/database/{db_name}/info")
```

## 故障排除

### 常见限制问题

1. **频率限制错误**
   ```python
   # 解决方案：实现重试机制
   def handle_rate_limit(func):
       @functools.wraps(func)
       def wrapper(*args, **kwargs):
           for attempt in range(3):
               try:
                   return func(*args, **kwargs)
               except RateLimitException as e:
                   if attempt == 2:
                       raise e
                   time.sleep(e.retry_after)
           return None
       return wrapper
   ```

2. **配额不足**
   ```python
   # 解决方案：清理不需要的资源
   def cleanup_old_resources(api_key):
       """清理旧资源释放配额"""
       # 删除旧备份
       # 清理临时表
       # 归档历史数据
       pass
   ```

3. **请求超时**
   ```python
   # 解决方案：优化查询和超时设置
   def optimize_query_performance():
       """优化查询性能"""
       # 使用索引
       # 减少返回字段
       # 添加查询条件
       # 使用分页
       pass
   ```

## 相关链接

- [错误代码参考](error-codes.md) - 限制相关错误代码
- [SQL 使用指南](sql-guide.md) - 查询性能优化
- [权限矩阵](permission-matrix.md) - 用户权限限制
- [监控统计](../api/monitoring-stats/index.md) - 使用情况监控