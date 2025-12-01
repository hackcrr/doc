# 统计摘要

## 端点信息

```http
GET /stats/summary
Authorization: Bearer your_api_key
```

获取所有统计信息的汇总摘要，包括数据库、性能、API使用和系统统计的综合视图。

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
  "overview": {
    "database_count": 8,
    "total_connections": 12,
    "api_requests": 1250,
    "system_status": "healthy"
  },
  "database": {
    "timestamp": "2024-01-20T15:30:00",
    "database_count": 8,
    "total_size": 5368709120,
    "total_tables": 45,
    "databases": [
      {
        "name": "users_db",
        "size_bytes": 1572864000,
        "table_count": 8,
        "row_count": 150000
      }
    ]
  },
  "performance": {
    "timestamp": "2024-01-20T15:30:00",
    "connection_stats": {
      "threads_connected": 12,
      "max_used_connections": 25
    },
    "query_stats": {
      "total_queries": 15000,
      "slow_queries": 23
    }
  },
  "api_usage": {
    "timestamp": "2024-01-20T15:30:00",
    "total_requests": 1250,
    "user_requests": 890,
    "successful_requests": 865,
    "failed_requests": 25
  },
  "system": {
    "timestamp": "2024-01-20T15:30:00",
    "python_version": "3.9.7",
    "platform": "linux",
    "database_connections": 1,
    "api_status": "healthy",
    "database_status": "connected"
  },
  "health_summary": "数据库: 8个 | 连接数: 12 | 总请求: 1250"
}
```

### 部分统计获取失败响应

**状态码:** `200 OK`

```json
{
  "timestamp": "2024-01-20T15:30:00",
  "overview": {
    "database_count": 8,
    "total_connections": 12,
    "api_requests": 1250,
    "system_status": "healthy"
  },
  "database": {
    "timestamp": "2024-01-20T15:30:00",
    "database_count": 8,
    "total_size": 5368709120,
    "total_tables": 45
  },
  "performance": {
    "error": "获取失败"
  },
  "api_usage": {
    "timestamp": "2024-01-20T15:30:00",
    "total_requests": 1250,
    "user_requests": 890
  },
  "system": {
    "error": "获取失败"
  },
  "health_summary": "数据库: 8个 | 连接数: 12 | 总请求: 1250"
}
```

### 响应字段说明

#### 摘要概览
| 字段 | 类型 | 说明 |
|------|------|------|
| `timestamp` | string | 统计生成时间戳 |
| `overview` | object | 关键指标概览 |
| `health_summary` | string | 健康状态摘要文本 |

#### 概览信息
| 字段 | 类型 | 说明 |
|------|------|------|
| `database_count` | integer | 数据库数量 |
| `total_connections` | integer | 总连接数 |
| `api_requests` | integer | API 请求总数 |
| `system_status` | string | 系统状态 |

#### 详细统计
| 字段 | 类型 | 说明 |
|------|------|------|
| `database` | object | 数据库统计信息 |
| `performance` | object | 性能统计信息 |
| `api_usage` | object | API 使用统计信息 |
| `system` | object | 系统统计信息 |
| `error` | string | 统计获取错误信息 |

## 使用示例

### cURL 示例

```bash
curl -X GET "https://dbapi.muzilix.cn/stats/summary" \
  -H "Authorization: Bearer your_api_key"
```

### Python 示例

```python
import requests

def get_stats_summary(api_key):
    """获取统计摘要"""
    url = "https://dbapi.muzilix.cn/stats/summary"
    headers = {"Authorization": f"Bearer {api_key}"}
    
    response = requests.get(url, headers=headers)
    return response.json()

def display_summary_dashboard(api_key):
    """显示统计摘要仪表板"""
    data = get_stats_summary(api_key)
    
    print("📊 系统统计摘要仪表板")
    print(f"   更新时间: {data['timestamp']}")
    print(f"   健康状态: {data['health_summary']}")
    
    # 概览信息
    overview = data.get('overview', {})
    print(f"\n📈 关键指标:")
    print(f"   📁 数据库: {overview.get('database_count', 0)} 个")
    print(f"   🔗 连接数: {overview.get('total_connections', 0)}")
    print(f"   📡 API请求: {overview.get('api_requests', 0):,} 次")
    print(f"   🖥️  系统状态: {overview.get('system_status', 'unknown')}")
    
    # 数据库统计
    db_stats = data.get('database', {})
    if 'error' not in db_stats:
        print(f"\n🗄️  数据库统计:")
        print(f"   总大小: {db_stats.get('total_size_human', 'N/A')}")
        print(f"   总表数: {db_stats.get('total_tables', 0)}")
    else:
        print(f"\n🗄️  数据库统计: 获取失败")
    
    # 性能统计
    perf_stats = data.get('performance', {})
    if 'error' not in perf_stats:
        query_stats = perf_stats.get('query_stats', {})
        print(f"\n⚡ 性能统计:")
        print(f"   总查询: {query_stats.get('total_queries', 0):,}")
        print(f"   慢查询: {query_stats.get('slow_queries', 0)}")
    else:
        print(f"\n⚡ 性能统计: 获取失败")
    
    # API使用统计
    api_stats = data.get('api_usage', {})
    if 'error' not in api_stats:
        print(f"\n📡 API使用统计:")
        print(f"   用户请求: {api_stats.get('user_requests', 0):,}")
        success_rate = (api_stats.get('successful_requests', 0) / api_stats.get('user_requests', 1)) * 100
        print(f"   成功率: {success_rate:.1f}%")
    else:
        print(f"\n📡 API使用统计: 获取失败")

def check_health_status(api_key):
    """检查系统健康状态"""
    data = get_stats_summary(api_key)
    
    issues = []
    
    # 检查数据库连接
    system_stats = data.get('system', {})
    if system_stats.get('database_status') != 'connected':
        issues.append("❌ 数据库连接异常")
    
    # 检查API错误率
    api_stats = data.get('api_usage', {})
    if 'error' not in api_stats:
        failed_requests = api_stats.get('failed_requests', 0)
        total_requests = api_stats.get('user_requests', 1)
        error_rate = (failed_requests / total_requests) * 100
        if error_rate > 5:
            issues.append(f"⚠️  API错误率过高: {error_rate:.1f}%")
    
    # 检查性能
    perf_stats = data.get('performance', {})
    if 'error' not in perf_stats:
        conn_stats = perf_stats.get('connection_stats', {})
        max_used = conn_stats.get('max_used_connections', 0)
        if max_used > 50:
            issues.append(f"🚨 连接数峰值过高: {max_used}")
    
    if issues:
        print("🚨 健康检查发现问题:")
        for issue in issues:
            print(f"   {issue}")
    else:
        print("✅ 系统运行正常")

# 使用示例
if __name__ == "__main__":
    API_KEY = "your_api_key"
    
    # 显示摘要仪表板
    display_summary_dashboard(API_KEY)
    print()
    
    # 健康状态检查
    check_health_status(API_KEY)
```

## 统计指标说明

### 关键指标概览
- **数据库数量**: 监控的数据库总数
- **连接数**: 当前数据库连接数量
- **API请求**: 系统处理的API请求总量
- **系统状态**: 整体系统健康状态

### 综合视图
统计摘要整合了四个核心维度的数据：
1. **数据库统计**: 存储容量和表数量
2. **性能统计**: 查询性能和连接状态
3. **API使用**: 请求量和成功率
4. **系统状态**: 运行环境和资源使用

### 健康摘要
- 提供简洁的系统状态概览
- 便于快速了解系统运行状况
- 适合集成到监控面板和告警系统

## 相关链接

- [监控统计总览](../monitoring-stats/index.md)
- [数据库统计](database-stats.md)
- [性能统计](performance-stats.md)
- [API使用统计](api-usage-stats.md)
- [系统统计](system-stats.md)