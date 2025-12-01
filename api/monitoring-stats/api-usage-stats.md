# API 使用统计

## 端点信息

```http
GET /stats/api-usage
Authorization: Bearer your_api_key
```

获取 API 使用统计信息，用户只能看到自己的相关数据。

## 权限要求
- `monitoring` 权限

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
  "timestamp": "2024-01-20T15:30:00",
  "total_requests": 1250,
  "user_requests": 890,
  "successful_requests": 865,
  "failed_requests": 25,
  "endpoints": {
    "GET /database/production_db/tables": 45,
    "POST /database/production_db/query": 23,
    "GET /stats/database": 12,
    "POST /database/production_db/backup": 3
  },
  "methods": {
    "GET": 650,
    "POST": 210,
    "PUT": 25,
    "DELETE": 5
  },
  "status_codes": {
    "200": 865,
    "400": 15,
    "401": 5,
    "403": 3,
    "500": 2
  },
  "recent_activity": [
    {
      "timestamp": "20/Jan/2024:15:25:00 +0800",
      "method": "GET",
      "endpoint": "/database/production_db/tables",
      "status_code": 200,
      "raw_line": "192.168.1.100 - - [20/Jan/2024:15:25:00 +0800] \"GET /database/production_db/tables HTTP/1.1\" 200 1450"
    },
    {
      "timestamp": "20/Jan/2024:15:24:30 +0800",
      "method": "POST",
      "endpoint": "/database/production_db/query",
      "status_code": 200,
      "raw_line": "192.168.1.100 - - [20/Jan/2024:15:24:30 +0800] \"POST /database/production_db/query HTTP/1.1\" 200 890"
    }
  ],
  "user_specific": true,
  "log_encoding": "utf-8"
}
```

### 日志文件不存在响应

**状态码:** `200 OK`

```json
{
  "timestamp": "2024-01-20T15:30:00",
  "log_file_exists": false,
  "total_requests": 0,
  "user_requests": 0,
  "successful_requests": 0,
  "failed_requests": 0,
  "user_specific": true
}
```

### 响应字段说明

#### 统计概览
| 字段 | 类型 | 说明 |
|------|------|------|
| `timestamp` | string | 统计生成时间戳 |
| `total_requests` | integer | 系统总请求数 |
| `user_requests` | integer | 当前用户的请求数 |
| `successful_requests` | integer | 成功的请求数 (2xx, 3xx) |
| `failed_requests` | integer | 失败的请求数 (4xx, 5xx) |
| `user_specific` | boolean | 是否为用户特定数据 |

#### 端点使用统计
| 字段 | 类型 | 说明 |
|------|------|------|
| `endpoints` | object | 各端点的调用次数 |
| `methods` | object | 各HTTP方法的调用次数 |
| `status_codes` | object | 各状态码的出现次数 |

#### 日志信息
| 字段 | 类型 | 说明 |
|------|------|------|
| `log_file_exists` | boolean | 日志文件是否存在 |
| `log_encoding` | string | 日志文件编码格式 |
| `log_analysis_error` | string | 日志分析错误信息 |
| `recent_activity` | array | 最近活动记录 |

#### 活动记录
| 字段 | 类型 | 说明 |
|------|------|------|
| `timestamp` | string | 请求时间戳 |
| `method` | string | HTTP 方法 |
| `endpoint` | string | 请求端点 |
| `status_code` | integer | HTTP 状态码 |
| `raw_line` | string | 原始日志行（截断） |

## 使用示例

### cURL 示例

```bash
curl -X GET "https://dbapi.muzilix.cn/stats/api-usage" \
  -H "Authorization: Bearer your_api_key"
```

### Python 示例

```python
import requests
from datetime import datetime, timedelta

def get_api_usage_stats(api_key):
    """获取API使用统计"""
    url = "https://dbapi.muzilix.cn/stats/api-usage"
    headers = {"Authorization": f"Bearer {api_key}"}
    
    response = requests.get(url, headers=headers)
    return response.json()

def analyze_api_usage(api_key):
    """分析API使用情况"""
    data = get_api_usage_stats(api_key)
    
    if not data.get('log_file_exists', True):
        print("❌ 日志文件不存在")
        return
    
    print("📊 API 使用统计报告")
    print(f"   生成时间: {data['timestamp']}")
    
    # 请求统计
    print(f"\n📈 请求统计:")
    print(f"   系统总请求: {data['total_requests']:,}")
    print(f"   用户请求: {data['user_requests']:,}")
    print(f"   成功率: {data['successful_requests']/data['user_requests']*100:.1f}%")
    print(f"   失败请求: {data['failed_requests']}")
    
    # 端点使用情况
    endpoints = data.get('endpoints', {})
    if endpoints:
        print(f"\n🔗 最常用端点:")
        sorted_endpoints = sorted(endpoints.items(), key=lambda x: x[1], reverse=True)[:5]
        for endpoint, count in sorted_endpoints:
            print(f"   {endpoint}: {count} 次")
    
    # HTTP方法分布
    methods = data.get('methods', {})
    if methods:
        print(f"\n🛠️ HTTP方法分布:")
        for method, count in methods.items():
            percentage = count / data['user_requests'] * 100
            print(f"   {method}: {count} 次 ({percentage:.1f}%)")
    
    # 状态码分布
    status_codes = data.get('status_codes', {})
    if status_codes:
        print(f"\n📋 状态码分布:")
        for code, count in status_codes.items():
            print(f"   {code}: {count} 次")
    
    # 最近活动
    recent_activity = data.get('recent_activity', [])
    if recent_activity:
        print(f"\n🔄 最近活动 (最近 {len(recent_activity)} 条):")
        for activity in recent_activity[:3]:  # 只显示最近3条
            status_icon = "✅" if 200 <= activity['status_code'] < 300 else "❌"
            print(f"   {status_icon} {activity['timestamp']} {activity['method']} {activity['endpoint']} -> {activity['status_code']}")

def monitor_api_errors(api_key):
    """监控API错误情况"""
    data = get_api_usage_stats(api_key)
    
    status_codes = data.get('status_codes', {})
    error_codes = {code: count for code, count in status_codes.items() 
                  if int(code) >= 400}
    
    if error_codes:
        print("🚨 API错误统计:")
        total_errors = sum(error_codes.values())
        error_rate = total_errors / data['user_requests'] * 100
        
        for code, count in error_codes.items():
            print(f"   {code}错误: {count} 次")
        
        print(f"   总错误率: {error_rate:.1f}%")
        
        if error_rate > 5:
            print("⚠️  错误率较高，建议检查系统状态")
    else:
        print("✅ 未发现API错误")

def endpoint_performance_report(api_key):
    """端点性能报告"""
    data = get_api_usage_stats(api_key)
    
    # 分析高频端点
    endpoints = data.get('endpoints', {})
    if endpoints:
        print("📈 高频端点报告:")
        top_endpoints = sorted(endpoints.items(), key=lambda x: x[1], reverse=True)[:10]
        
        for i, (endpoint, count) in enumerate(top_endpoints, 1):
            print(f"   {i:2d}. {endpoint}: {count} 次")
            
            # 简单的负载评估
            if count > 100:
                print("      🔥 高频调用端点")
            elif count > 50:
                print("      ⚡ 中频调用端点")
            else:
                print("      💤 低频调用端点")

# 使用示例
if __name__ == "__main__":
    API_KEY = "your_api_key"
    
    # 基本使用统计
    analyze_api_usage(API_KEY)
    
    # 错误监控
    monitor_api_errors(API_KEY)
    
    # 端点性能报告
    endpoint_performance_report(API_KEY)
```

## 统计指标说明

### 请求统计
- **系统总请求数**: 所有用户的API调用总数
- **用户请求数**: 当前认证用户的API调用次数
- **成功率**: 2xx和3xx状态码的请求比例
- **错误率**: 4xx和5xx状态码的请求比例

### 端点分析
- **高频端点**: 识别最常用的API功能
- **方法分布**: 了解读写操作的比例
- **状态码分布**: 监控API的健康状况

### 活动监控
- **最近请求**: 查看最近的API调用记录
- **错误追踪**: 识别频繁出错的端点
- **使用模式**: 分析用户的使用习惯

## 相关链接

- [监控统计总览](../monitoring-stats/index.md)
- [数据库统计](database-stats.md)
- [性能统计](performance-stats.md)
- [查询分析](query-analysis.md)