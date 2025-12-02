# 数据库统计

## 端点信息

<ApiEndpoint method="GET" path="/stats/database"/>

获取所有数据库的统计概览。

<ApiEndpoint method="GET" path="/stats/database/{db_name}"/>

获取单个数据库的详细统计信息。

## 权限要求
- `monitoring` 权限
- 对目标数据库的 `read` 权限

## 请求

### 所有数据库统计

#### 请求头
| 头部 | 值 | 必填 |
|------|-----|------|
| `Authorization` | `Bearer your_api_key` | 是 |

#### 查询参数
| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|---------|------|
| `details` | boolean | 否 | `false` | 是否显示详细信息 |

### 单个数据库统计

#### 请求头
| 头部 | 值 | 必填 |
|------|-----|------|
| `Authorization` | `Bearer your_api_key` | 是 |

#### 路径参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `db_name` | string | 是 | 数据库名称 |

## 响应

### 所有数据库统计响应

**状态码:** `200 OK`

```json
{
  "timestamp": "2024-01-20T15:30:00",
  "database_count": 5,
  "total_size": 5368709120,
  "total_tables": 45,
  "databases": [
    {
      "name": "users_db",
      "size_bytes": 1572864000,
      "table_count": 8,
      "row_count": 150000,
      "last_updated": "2024-01-20T14:25:00"
    },
    {
      "name": "orders_db",
      "size_bytes": 2147483648,
      "table_count": 12,
      "row_count": 500000,
      "last_updated": "2024-01-20T13:45:00"
    }
  ]
}
```

### 单个数据库详细统计响应

**状态码:** `200 OK`

```json
{
  "name": "users_db",
  "size_bytes": 1572864000,
  "table_count": 8,
  "row_count": 150000,
  "last_updated": "2024-01-20T14:25:00",
  "size_human": "1.46 GB",
  "tables": [
    {
      "name": "users",
      "engine": "InnoDB",
      "row_count": 100000,
      "data_size": 805306368,
      "index_size": 134217728,
      "total_size": 939524096,
      "total_size_human": "896 MB",
      "create_time": "2024-01-15T10:30:00",
      "update_time": "2024-01-20T14:25:00"
    }
  ],
  "table_usage": [
    {
      "table_name": "users",
      "data_size": 805306368,
      "index_size": 134217728,
      "total_size": 939524096,
      "total_size_human": "896 MB",
      "row_count": 100000,
      "avg_row_length": 8053
    }
  ]
}
```

### 响应字段说明

#### 概览统计
| 字段 | 类型 | 说明 |
|------|------|------|
| `timestamp` | string | 统计时间戳 |
| `database_count` | integer | 数据库数量 |
| `total_size` | integer | 总数据大小（字节） |
| `total_tables` | integer | 总表数量 |
| `databases` | array | 数据库列表 |

#### 数据库信息
| 字段 | 类型 | 说明 |
|------|------|------|
| `name` | string | 数据库名称 |
| `size_bytes` | integer | 数据库大小（字节） |
| `table_count` | integer | 表数量 |
| `row_count` | integer | 行数估算 |
| `last_updated` | string | 最后更新时间 |

#### 详细统计
| 字段 | 类型 | 说明 |
|------|------|------|
| `size_human` | string | 人类可读的数据库大小 |
| `tables` | array | 表详细信息列表 |
| `table_usage` | array | 表空间使用情况 |

#### 表信息
| 字段 | 类型 | 说明 |
|------|------|------|
| `name` | string | 表名称 |
| `engine` | string | 存储引擎 |
| `row_count` | integer | 行数 |
| `data_size` | integer | 数据大小 |
| `index_size` | integer | 索引大小 |
| `total_size` | integer | 总大小 |
| `total_size_human` | string | 人类可读的总大小 |
| `create_time` | string | 创建时间 |
| `update_time` | string | 更新时间 |

## 使用示例

### cURL 示例

**获取所有数据库统计:**
```bash
curl -X GET "https://dbapi.muzilix.cn/stats/database?details=true" \
  -H "Authorization: Bearer your_api_key"
```

**获取单个数据库统计:**
```bash
curl -X GET https://dbapi.muzilix.cn/stats/database/users_db \
  -H "Authorization: Bearer your_api_key"
```

### Python 示例
```python
def get_database_stats(api_key, db_name=None):
    """获取数据库统计信息"""
    if db_name:
        url = f"https://dbapi.muzilix.cn/stats/database/{db_name}"
    else:
        url = "https://dbapi.muzilix.cn/stats/database"
    
    headers = {"Authorization": f"Bearer {api_key}"}
    
    response = requests.get(url, headers=headers)
    return response.json()

def analyze_database_growth(api_key):
    """分析数据库增长趋势"""
    stats = get_database_stats(api_key)
    
    print("📊 数据库统计概览")
    print(f"   数据库数量: {stats['database_count']}")
    print(f"   总表数量: {stats['total_tables']}")
    print(f"   总数据大小: {format_size(stats['total_size'])}")
    
    print("\n📈 各数据库详情:")
    for db in stats["databases"]:
        size_gb = db["size_bytes"] / (1024 ** 3)
        print(f"   📁 {db['name']}")
        print(f"      大小: {format_size(db['size_bytes'])}")
        print(f"      表数: {db['table_count']}")
        print(f"      行数: {db['row_count']:,}")

def monitor_large_tables(api_key, db_name, size_threshold_mb=100):
    """监控大表使用情况"""
    detailed_stats = get_database_stats(api_key, db_name)
    
    if "error" in detailed_stats:
        print(f"错误: {detailed_stats['error']}")
        return
    
    large_tables = []
    for table in detailed_stats["table_usage"]:
        size_mb = table["total_size"] / (1024 * 1024)
        if size_mb > size_threshold_mb:
            large_tables.append({
                "name": table["table_name"],
                "size_mb": size_mb,
                "rows": table["row_count"]
            })
    
    if large_tables:
        print(f"⚠️  {db_name} 中的大表 (> {size_threshold_mb}MB):")
        for table in sorted(large_tables, key=lambda x: x["size_mb"], reverse=True):
            print(f"   - {table['name']}: {table['size_mb']:.1f} MB, {table['rows']:,} 行")
    else:
        print(f"✅ {db_name} 中没有超过 {size_threshold_mb}MB 的大表")

# 使用示例
# 获取所有数据库统计
all_stats = get_database_stats("your_api_key")
analyze_database_growth("your_api_key")

# 获取单个数据库详细统计
db_stats = get_database_stats("your_api_key", "production_db")
monitor_large_tables("your_api_key", "production_db", 500)
```

## 统计指标说明

### 大小计算
数据库总大小包括：
- 表数据大小 (`data_length`)
- 索引大小 (`index_length`)
- 不包括系统开销

### 行数估算
- 基于存储引擎的统计信息
- 对于 InnoDB 是估算值
- 定期更新，可能不是实时精确值

### 时间信息
- `last_updated`: 最后数据更新时间
- `create_time`: 表创建时间
- `update_time`: 最后数据修改时间

## 监控应用

### 容量规划
```python
def capacity_planning_report(api_key):
    """容量规划报告"""
    stats = get_database_stats(api_key)
    
    total_size_gb = stats["total_size"] / (1024 ** 3)
    avg_db_size_gb = total_size_gb / stats["database_count"]
    
    print("📋 容量规划报告")
    print(f"   当前总数据量: {total_size_gb:.2f} GB")
    print(f"   平均数据库大小: {avg_db_size_gb:.2f} GB")
    print(f"   数据库数量: {stats['database_count']}")
    
    # 增长预测（假设每月增长10%）
    monthly_growth = 0.10
    projected_3mo = total_size_gb * (1 + monthly_growth) ** 3
    projected_12mo = total_size_gb * (1 + monthly_growth) ** 12
    
    print(f"\n📈 增长预测 (每月 {monthly_growth*100}%):")
    print(f"   3个月后: {projected_3mo:.2f} GB")
    print(f"   12个月后: {projected_12mo:.2f} GB")

# 使用示例
capacity_planning_report("your_api_key")
```

### 存储优化建议
```python
def storage_optimization_suggestions(api_key, db_name):
    """存储优化建议"""
    stats = get_database_stats(api_key, db_name)
    
    if "error" in stats:
        return
    
    suggestions = []
    
    # 分析索引大小占比
    for table in stats["table_usage"]:
        total_size = table["total_size"]
        index_size = table["index_size"]
        
        if total_size > 0:
            index_ratio = index_size / total_size
            
            if index_ratio > 0.5:
                suggestions.append(
                    f"表 '{table['table_name']}' 索引占比过高 ({index_ratio:.1%})，考虑索引优化"
                )
            
            if table["row_count"] > 1000000 and table["avg_row_length"] > 10000:
                suggestions.append(
                    f"表 '{table['table_name']}' 行长度较大，考虑数据归档"
                )
    
    if suggestions:
        print(f"💡 {db_name} 存储优化建议:")
        for suggestion in suggestions:
            print(f"   - {suggestion}")
    else:
        print(f"✅ {db_name} 存储结构良好")

# 使用示例
storage_optimization_suggestions("your_api_key", "analytics_db")
```

## 相关链接

- [监控统计总览](../monitoring-stats/index.md)
- [性能统计](performance-stats.md)
- [查询分析](query-analysis.md)
- [API 使用统计](api-usage-stats.md)