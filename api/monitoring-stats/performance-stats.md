# 性能统计

## 端点信息

<ApiEndpoint method="GET" path="/stats/performance"/>

获取数据库性能统计信息，包括连接状态、查询统计和系统性能指标。

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
  "connection_stats": {
    "threads_connected": 25,
    "max_used_connections": 48,
    "threads_running": 3,
    "threads_created": 1250,
    "connection_usage_percent": 52.1
  },
  "query_stats": {
    "total_queries": 1258472,
    "slow_queries": 42,
    "queries_per_second": 145.3,
    "select_queries": 985421,
    "insert_queries": 156234,
    "update_queries": 89234,
    "delete_queries": 27583
  },
  "table_cache": {
    "open_tables": 128,
    "table_locks_waited": 5,
    "table_locks_immediate": 984512
  },
  "buffer_pool": {
    "buffer_pool_hit_rate": 99.7,
    "pages_read": 12584,
    "pages_created": 892,
    "pages_written": 4562
  },
  "innodb_available": true,
  "performance_health": "excellent"
}
```

### 响应字段说明

#### 连接统计
| 字段 | 类型 | 说明 |
|------|------|------|
| `threads_connected` | integer | 当前连接数 |
| `max_used_connections` | integer | 历史最大连接数 |
| `threads_running` | integer | 正在运行的线程数 |
| `threads_created` | integer | 已创建的线程总数 |
| `connection_usage_percent` | number | 连接使用率百分比 |

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

#### 表缓存
| 字段 | 类型 | 说明 |
|------|------|------|
| `open_tables` | integer | 打开的表数量 |
| `table_locks_waited` | integer | 表锁等待次数 |
| `table_locks_immediate` | integer | 立即获得的表锁次数 |

#### 缓冲池 (InnoDB)
| 字段 | 类型 | 说明 |
|------|------|------|
| `buffer_pool_hit_rate` | number | 缓冲池命中率 (%) |
| `pages_read` | integer | 读取的页数 |
| `pages_created` | integer | 创建的页数 |
| `pages_written` | integer | 写入的页数 |

#### 系统信息
| 字段 | 类型 | 说明 |
|------|------|------|
| `innodb_available` | boolean | InnoDB 是否可用 |
| `performance_health` | string | 性能健康状态 |

## 使用示例

### cURL 示例
```bash
curl -X GET https://dbapi.muzilix.cn/stats/performance \
  -H "Authorization: Bearer your_api_key"
```

### Python 示例
```python
def get_performance_stats(api_key):
    """获取性能统计信息"""
    url = "https://dbapi.muzilix.cn/stats/performance"
    headers = {"Authorization": f"Bearer {api_key}"}
    
    response = requests.get(url, headers=headers)
    return response.json()

def analyze_performance_health(api_key):
    """分析性能健康状况"""
    stats = get_performance_stats(api_key)
    
    print("🎯 数据库性能分析")
    print("=" * 50)
    
    # 连接分析
    conn_stats = stats["connection_stats"]
    print(f"\n🔗 连接统计:")
    print(f"   当前连接: {conn_stats['threads_connected']}")
    print(f"   运行线程: {conn_stats['threads_running']}")
    print(f"   连接使用率: {conn_stats['connection_usage_percent']}%")
    
    # 查询分析
    query_stats = stats["query_stats"]
    print(f"\n📊 查询统计:")
    print(f"   QPS: {query_stats['queries_per_second']}")
    print(f"   慢查询: {query_stats['slow_queries']}")
    print(f"   查询类型分布:")
    print(f"     SELECT: {query_stats['select_queries']:,}")
    print(f"     INSERT: {query_stats['insert_queries']:,}")
    print(f"     UPDATE: {query_stats['update_queries']:,}")
    print(f"     DELETE: {query_stats['delete_queries']:,}")
    
    # 缓冲池分析
    if stats["innodb_available"]:
        buffer_stats = stats["buffer_pool"]
        print(f"\n💾 InnoDB 缓冲池:")
        print(f"   命中率: {buffer_stats['buffer_pool_hit_rate']}%")
        print(f"   页读取: {buffer_stats['pages_read']:,}")
        print(f"   页创建: {buffer_stats['pages_created']:,}")
    
    # 健康状态
    print(f"\n❤️  性能健康: {stats['performance_health'].upper()}")

def monitor_performance_thresholds(api_key):
    """监控性能阈值"""
    stats = get_performance_stats(api_key)
    
    alerts = []
    
    # 连接阈值检查
    if stats["connection_stats"]["connection_usage_percent"] > 80:
        alerts.append("⚠️  连接使用率超过80%")
    
    # 慢查询检查
    if stats["query_stats"]["slow_queries"] > 10:
        alerts.append("⚠️  慢查询数量较多")
    
    # 缓冲池命中率检查
    if stats["innodb_available"]:
        if stats["buffer_pool"]["buffer_pool_hit_rate"] < 95:
            alerts.append("⚠️  缓冲池命中率低于95%")
    
    # 表锁等待检查
    if stats["table_cache"]["table_locks_waited"] > 100:
        alerts.append("⚠️  表锁等待次数较多")
    
    if alerts:
        print("🚨 性能告警:")
        for alert in alerts:
            print(f"   {alert}")
    else:
        print("✅ 所有性能指标正常")

# 使用示例
stats = get_performance_stats("your_api_key")
analyze_performance_health("your_api_key")
monitor_performance_thresholds("your_api_key")
```

## 性能指标说明

### 关键性能指标 (KPI)

#### 连接相关
- **连接使用率**: 当前连接数 / 最大连接数 × 100%
- **线程运行数**: 反映当前系统负载
- **线程创建数**: 历史创建的线程总数

#### 查询相关
- **QPS (Queries Per Second)**: 每秒查询数
- **慢查询率**: 慢查询占总查询的比例
- **查询类型分布**: 了解业务负载特征

#### 缓存相关
- **缓冲池命中率**: InnoDB 缓冲池的缓存效率
- **表缓存效率**: 表打开和锁等待情况

## 性能监控工具

### 实时性能仪表板
```python
def create_performance_dashboard(api_key, refresh_interval=30):
    """创建实时性能仪表板"""
    import time
    import os
    
    while True:
        os.system('clear')  # 清屏
        stats = get_performance_stats(api_key)
        
        print("🖥️  实时性能仪表板")
        print("=" * 60)
        print(f"更新时间: {stats['timestamp']}")
        print(f"健康状态: {stats['performance_health'].upper()}")
        
        # 连接状态
        conn = stats["connection_stats"]
        print(f"\n🔗 连接: {conn['threads_connected']} / {conn['max_used_connections']} ({conn['connection_usage_percent']}%)")
        
        # 查询状态
        query = stats["query_stats"]
        print(f"📊 QPS: {query['queries_per_second']} | 慢查询: {query['slow_queries']}")
        
        # 缓冲池状态
        if stats["innodb_available"]:
            buffer = stats["buffer_pool"]
            print(f"💾 缓冲池: {buffer['buffer_pool_hit_rate']}% 命中率")
        
        print(f"\n⏰ 下次更新: {refresh_interval}秒后...")
        time.sleep(refresh_interval)

# 使用示例（谨慎使用，会持续运行）
# create_performance_dashboard("your_api_key")
```

### 性能趋势分析
```python
def track_performance_trends(api_key, duration_minutes=10):
    """跟踪性能趋势"""
    import time
    from collections import deque
    
    # 存储历史数据
    qps_history = deque(maxlen=60)  # 保留最近60个数据点
    connection_history = deque(maxlen=60)
    
    start_time = time.time()
    
    while time.time() - start_time < duration_minutes * 60:
        stats = get_performance_stats(api_key)
        
        qps = stats["query_stats"]["queries_per_second"]
        connections = stats["connection_stats"]["threads_connected"]
        
        qps_history.append(qps)
        connection_history.append(connections)
        
        # 计算趋势
        if len(qps_history) > 1:
            qps_trend = "↑" if qps_history[-1] > qps_history[-2] else "↓"
            conn_trend = "↑" if connection_history[-1] > connection_history[-2] else "↓"
        else:
            qps_trend = "→"
            conn_trend = "→"
        
        print(f"QPS: {qps:.1f} {qps_trend} | 连接: {connections} {conn_trend}")
        
        time.sleep(10)  # 每10秒更新一次
    
    # 生成趋势报告
    avg_qps = sum(qps_history) / len(qps_history)
    max_connections = max(connection_history)
    
    print(f"\n📈 {duration_minutes}分钟性能趋势:")
    print(f"   平均 QPS: {avg_qps:.1f}")
    print(f"   最大连接数: {max_connections}")
    print(f"   QPS 范围: {min(qps_history):.1f} - {max(qps_history):.1f}")

# 使用示例
track_performance_trends("your_api_key", duration_minutes=5)
```

### 性能基准测试
```python
def performance_benchmark(api_key, expected_metrics):
    """性能基准测试"""
    stats = get_performance_stats(api_key)
    
    benchmarks = {
        "connection_usage": stats["connection_stats"]["connection_usage_percent"] < 70,
        "slow_queries": stats["query_stats"]["slow_queries"] < 5,
        "buffer_hit_rate": stats["buffer_pool"]["buffer_pool_hit_rate"] > 98 if stats["innodb_available"] else True,
        "qps": stats["query_stats"]["queries_per_second"] > expected_metrics.get("min_qps", 50)
    }
    
    print("🎯 性能基准测试结果:")
    passed = 0
    total = len(benchmarks)
    
    for test, result in benchmarks.items():
        status = "✅" if result else "❌"
        print(f"   {status} {test}: {'通过' if result else '未通过'}")
        if result:
            passed += 1
    
    score = (passed / total) * 100
    print(f"\n📊 基准测试得分: {score:.1f}%")
    
    return score >= 80  # 80%以上认为通过

# 使用示例
expected = {"min_qps": 100}
if performance_benchmark("your_api_key", expected):
    print("🎉 性能基准测试通过!")
else:
    print("⚠️  性能基准测试未通过，建议优化")
```

## 健康状态说明

### 性能健康等级
- **excellent**: 所有指标优秀
- **good**: 大部分指标良好
- **fair**: 部分指标需要关注
- **poor**: 多个指标存在问题
- **critical**: 严重性能问题

## 相关链接

- [监控统计总览](../monitoring-stats/index.md)
- [数据库统计](database-stats.md)
- [查询分析](query-analysis.md)
- [系统统计](system-stats.md)