# 查询分析统计

## 端点信息

```http
GET /stats/query-analysis
Authorization: Bearer your_api_key
```

获取数据库查询性能监控和慢查询分析信息。

## 权限要求
- `monitoring` 权限
- 对目标数据库的 `read` 权限

## 请求

### 请求头
| 头部 | 值 | 必填 |
|------|-----|------|
| `Authorization` | `Bearer your_api_key` | 是 |

### 查询参数
| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|---------|------|
| `db_name` | string | 否 | 空 | 指定数据库名称，过滤特定数据库的查询 |
| `limit` | integer | 否 | 10 | 返回的慢查询数量限制 |

## 响应

### 成功响应

**状态码:** `200 OK`

```json
{
  "timestamp": "2024-01-20T15:30:00",
  "query_stats": {
    "total_queries": 15000,
    "slow_queries": 23,
    "queries_per_second": 45.7,
    "select_queries": 12000,
    "insert_queries": 1500,
    "update_queries": 800,
    "delete_queries": 700
  },
  "slow_queries": [
    {
      "database": "users_db",
      "query_time": 5.234,
      "lock_time": 0.123,
      "rows_sent": 1000,
      "rows_examined": 50000,
      "sql_text": "SELECT * FROM large_table WHERE status = 'active'...",
      "start_time": "2024-01-20T14:25:00"
    }
  ],
  "connection_stats": {
    "total_connections": 15,
    "active_connections": 3,
    "max_used_connections": 25
  },
  "active_connections": [
    {
      "id": 123,
      "user": "api_user",
      "host": "192.168.1.100:54321",
      "db": "users_db",
      "command": "Query",
      "time": 5,
      "state": "Sending data",
      "info": "SELECT * FROM users WHERE age > 30"
    }
  ]
}
```

### 慢查询日志未启用响应

**状态码:** `200 OK`

```json
{
  "timestamp": "2024-01-20T15:30:00",
  "slow_log_available": false,
  "slow_log_error": "(1054, \"Unknown column 'sql_text' in 'field list'\")",
  "active_connections": [...],
  "connection_stats": {...}
}
```

### 响应字段说明

#### 基本信息
| 字段 | 类型 | 说明 |
|------|------|------|
| `timestamp` | string | 统计生成时间戳 |
| `slow_log_available` | boolean | 慢查询日志是否可用 |
| `slow_log_error` | string | 慢查询日志错误信息（如果不可用） |

#### 查询统计
| 字段 | 类型 | 说明 |
|------|------|------|
| `total_queries` | integer | 总查询次数 |
| `slow_queries` | integer | 慢查询次数 |
| `queries_per_second` | number | 每秒查询数 |
| `select_queries` | integer | SELECT 查询次数 |
| `insert_queries` | integer | INSERT 查询次数 |
| `update_queries` | integer | UPDATE 查询次数 |
| `delete_queries` | integer | DELETE 查询次数 |

#### 慢查询详情
| 字段 | 类型 | 说明 |
|------|------|------|
| `database` | string | 查询所在的数据库名称 |
| `query_time` | number | 查询执行时间（秒） |
| `lock_time` | number | 锁等待时间（秒） |
| `rows_sent` | integer | 返回给客户端的行数 |
| `rows_examined` | integer | 服务器扫描的行数 |
| `sql_text` | string | SQL查询语句（截断显示） |
| `start_time` | string | 查询开始时间戳 |

#### 连接统计
| 字段 | 类型 | 说明 |
|------|------|------|
| `total_connections` | integer | 当前总连接数 |
| `active_connections` | integer | 活跃连接数 |
| `max_used_connections` | integer | 历史最大连接数 |

#### 活跃连接详情
| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | integer | 连接ID |
| `user` | string | 数据库用户名 |
| `host` | string | 客户端主机地址 |
| `db` | string | 当前使用的数据库 |
| `command` | string | 执行的命令类型 |
| `time` | integer | 命令执行时间（秒） |
| `state` | string | 连接当前状态 |
| `info` | string | 正在执行的SQL语句 |

## 使用示例

### cURL 示例

**获取所有数据库查询分析:**
```bash
curl -X GET "https://dbapi.muzilix.cn/stats/query-analysis" \
  -H "Authorization: Bearer your_api_key"
```

**获取特定数据库查询分析:**
```bash
curl -X GET "https://dbapi.muzilix.cn/stats/query-analysis?db_name=users_db&limit=20" \
  -H "Authorization: Bearer your_api_key"
```

### Python 示例

```python
import requests
import time
from datetime import datetime

def get_query_analysis(api_key, db_name=None, limit=10):
    """获取查询分析统计信息"""
    url = "https://dbapi.muzilix.cn/stats/query-analysis"
    params = {}
    
    if db_name:
        params['db_name'] = db_name
    if limit:
        params['limit'] = limit
    
    headers = {"Authorization": f"Bearer {api_key}"}
    
    response = requests.get(url, params=params, headers=headers)
    return response.json()

def analyze_slow_queries(api_key, db_name=None):
    """分析慢查询性能"""
    data = get_query_analysis(api_key, db_name, limit=50)
    
    if not data.get('success', True):
        print(f"错误: {data.get('error', '未知错误')}")
        return
    
    print("📊 查询性能分析报告")
    print(f"   生成时间: {data['timestamp']}")
    
    # 查询统计
    query_stats = data.get('query_stats', {})
    if query_stats:
        print(f"\n📈 查询统计:")
        print(f"   总查询次数: {query_stats.get('total_queries', 0):,}")
        print(f"   慢查询次数: {query_stats.get('slow_queries', 0):,}")
        print(f"   每秒查询数: {query_stats.get('queries_per_second', 0):.1f}")
        print(f"   SELECT 查询: {query_stats.get('select_queries', 0):,}")
        print(f"   INSERT 查询: {query_stats.get('insert_queries', 0):,}")
        print(f"   UPDATE 查询: {query_stats.get('update_queries', 0):,}")
        print(f"   DELETE 查询: {query_stats.get('delete_queries', 0):,}")
    
    # 慢查询分析
    slow_queries = data.get('slow_queries', [])
    if slow_queries:
        print(f"\n⚠️  慢查询分析 (共 {len(slow_queries)} 个):")
        for i, query in enumerate(slow_queries, 1):
            print(f"   {i}. 数据库: {query['database']}")
            print(f"      执行时间: {query['query_time']:.3f}s")
            print(f"      锁等待: {query['lock_time']:.3f}s")
            print(f"      扫描/返回: {query['rows_examined']:,}/{query['rows_sent']:,}")
            print(f"      SQL: {query['sql_text'][:100]}...")
            print(f"      时间: {query['start_time']}")
            print()
    else:
        print("\n✅ 未发现慢查询")
    
    # 连接统计
    conn_stats = data.get('connection_stats', {})
    if conn_stats:
        print(f"\n🔗 连接统计:")
        print(f"   总连接数: {conn_stats.get('total_connections', 0)}")
        print(f"   活跃连接: {conn_stats.get('active_connections', 0)}")
        print(f"   最大连接: {conn_stats.get('max_used_connections', 0)}")
    
    # 活跃连接
    active_conns = data.get('active_connections', [])
    if active_conns:
        print(f"\n🔄 活跃连接 (共 {len(active_conns)} 个):")
        for conn in active_conns:
            if conn['time'] > 10:  # 长时间运行的连接
                print(f"   ⚠️ 连接 {conn['id']} 运行 {conn['time']}s: {conn['info']}")

def monitor_query_performance(api_key, db_name, threshold_seconds=1.0):
    """监控查询性能并设置告警"""
    data = get_query_analysis(api_key, db_name)
    
    slow_queries = data.get('slow_queries', [])
    critical_slow_queries = [
        q for q in slow_queries 
        if q['query_time'] > threshold_seconds
    ]
    
    if critical_slow_queries:
        print(f"🚨 性能告警: 发现 {len(critical_slow_queries)} 个超过 {threshold_seconds}秒 的慢查询")
        for query in critical_slow_queries:
            print(f"   - {query['query_time']:.2f}s: {query['sql_text'][:80]}...")
    
    # 连接池使用率告警
    conn_stats = data.get('connection_stats', {})
    total_conns = conn_stats.get('total_connections', 0)
    active_conns = conn_stats.get('active_connections', 0)
    
    if total_conns > 0 and active_conns / total_conns > 0.8:
        print(f"🚨 连接池告警: 使用率 {active_conns/total_conns:.1%}")

def performance_trend_analysis(api_key, db_name, interval_minutes=5):
    """性能趋势分析"""
    print("📈 性能趋势分析中...")
    
    # 模拟多次采样分析趋势
    samples = []
    for i in range(6):  # 采样6次
        data = get_query_analysis(api_key, db_name)
        
        query_stats = data.get('query_stats', {})
        slow_count = len(data.get('slow_queries', []))
        active_conns = data.get('connection_stats', {}).get('active_connections', 0)
        
        samples.append({
            'timestamp': data['timestamp'],
            'slow_queries': slow_count,
            'active_connections': active_conns,
            'qps': query_stats.get('queries_per_second', 0)
        })
        
        if i < 5:  # 不是最后一次采样
            time.sleep(interval_minutes * 60)
    
    # 分析趋势
    print("\n📊 趋势分析结果:")
    first = samples[0]
    last = samples[-1]
    
    slow_change = last['slow_queries'] - first['slow_queries']
    conn_change = last['active_connections'] - first['active_connections']
    qps_change = last['qps'] - first['qps']
    
    print(f"   慢查询变化: {slow_change:+d}")
    print(f"   活跃连接变化: {conn_change:+d}")
    print(f"   QPS 变化: {qps_change:+.1f}")

# 使用示例
if __name__ == "__main__":
    API_KEY = "your_api_key"
    
    # 基本查询分析
    analyze_slow_queries(API_KEY, "production_db")
    
    # 性能监控
    monitor_query_performance(API_KEY, "production_db", threshold_seconds=2.0)
    
    # 趋势分析（需要较长时间）
    # performance_trend_analysis(API_KEY, "production_db")
```

## 监控指标说明

### 查询性能指标
- **慢查询阈值**: 默认超过10秒的查询被认为是慢查询
- **查询类型分布**: 分析各类查询的比例，识别性能瓶颈
- **QPS (Queries Per Second)**: 每秒查询数，反映数据库负载

### 连接池指标
- **活跃连接数**: 当前正在执行查询的连接数量
- **连接使用率**: 活跃连接占总连接数的比例
- **最大连接数**: 历史最高连接使用量

### 慢查询分析要点
- **执行时间**: 识别最耗时的查询
- **锁等待时间**: 分析并发性能问题
- **扫描行数**: 识别全表扫描等低效查询
- **返回行数**: 分析查询效率

## 最佳实践

### 1. 定期监控
```python
def setup_performance_monitoring(api_key, db_name):
    """设置性能监控任务"""
    import schedule
    
    def daily_performance_check():
        analyze_slow_queries(api_key, db_name)
        monitor_query_performance(api_key, db_name)
    
    # 每天上午9点执行性能检查
    schedule.every().day.at("09:00").do(daily_performance_check)
    
    # 每小时执行快速检查
    schedule.every().hour.do(
        lambda: monitor_query_performance(api_key, db_name, 5.0)
    )
```

### 2. 性能优化建议生成
```python
def generate_optimization_suggestions(api_key, db_name):
    """生成查询优化建议"""
    data = get_query_analysis(api_key, db_name)
    suggestions = []
    
    for query in data.get('slow_queries', []):
        # 分析扫描效率
        scan_efficiency = query['rows_sent'] / query['rows_examined'] if query['rows_examined'] > 0 else 0
        
        if scan_efficiency < 0.01:
            suggestions.append(
                f"查询扫描效率低 ({scan_efficiency:.2%})，考虑添加索引: {query['sql_text'][:50]}..."
            )
        
        if query['lock_time'] > 0.1:
            suggestions.append(
                f"查询锁等待时间较长 ({query['lock_time']:.3f}s)，考虑优化事务: {query['sql_text'][:50]}..."
            )
    
    return suggestions
```

### 3. 容量规划
```python
def query_capacity_analysis(api_key, db_name):
    """查询容量分析"""
    data = get_query_analysis(api_key, db_name)
    
    query_stats = data.get('query_stats', {})
    total_queries = query_stats.get('total_queries', 0)
    qps = query_stats.get('queries_per_second', 0)
    
    print("📋 查询容量分析")
    print(f"   当前 QPS: {qps:.1f}")
    print(f"   日均查询量: {total_queries:,}")
    
    # 基于当前负载的容量建议
    if qps > 100:
        print("💡 建议: 当前负载较高，考虑读写分离")
    elif qps > 50:
        print("💡 建议: 负载适中，定期监控性能")
    else:
        print("💡 建议: 负载较低，系统运行良好")
```

## 相关链接

- [监控统计总览](../monitoring-stats/index.md)
- [数据库统计](../monitoring-stats/database-stats.md)
- [性能统计](../monitoring-stats/performance-stats.md)
- [API 使用统计](../monitoring-stats/api-usage-stats.md)