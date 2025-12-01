# 系统统计

## 端点信息

```http
GET /stats/system
Authorization: Bearer your_api_key
```

获取系统级统计信息，包括数据库连接状态、内存使用情况和磁盘空间等。

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
  "python_version": "3.9.7 (default, Aug 31 2021, 13:28:12)",
  "platform": "linux",
  "database_connections": 1,
  "api_status": "healthy",
  "database_status": "connected",
  "backup_disk_usage": {
    "total_size": 1572864000,
    "total_size_human": "1.46 GB",
    "file_count": 15
  },
  "memory_usage": {
    "rss": 125829120,
    "rss_human": "120.00 MB",
    "vms": 254803968,
    "vms_human": "243.00 MB"
  }
}
```

### psutil 不可用响应

**状态码:** `200 OK`

```json
{
  "timestamp": "2024-01-20T15:30:00",
  "python_version": "3.9.7",
  "platform": "linux",
  "database_connections": 1,
  "api_status": "healthy",
  "database_status": "connected",
  "backup_disk_usage": {
    "total_size": 1572864000,
    "total_size_human": "1.46 GB",
    "file_count": 15
  },
  "memory_usage": {
    "psutil_not_available": true
  }
}
```

### 数据库连接失败响应

**状态码:** `200 OK`

```json
{
  "timestamp": "2024-01-20T15:30:00",
  "python_version": "3.9.7",
  "platform": "linux",
  "database_connections": 0,
  "api_status": "healthy",
  "database_status": "disconnected",
  "database_error": "(2003, \"Can't connect to MySQL server on 'localhost' ([Errno 111] Connection refused)\")",
  "backup_disk_usage": {
    "total_size": 1572864000,
    "total_size_human": "1.46 GB",
    "file_count": 15
  }
}
```

### 响应字段说明

#### 系统信息
| 字段 | 类型 | 说明 |
|------|------|------|
| `timestamp` | string | 统计生成时间戳 |
| `python_version` | string | Python 版本信息 |
| `platform` | string | 操作系统平台 |
| `api_status` | string | API 服务状态 |

#### 数据库状态
| 字段 | 类型 | 说明 |
|------|------|------|
| `database_connections` | integer | 数据库连接数 |
| `database_status` | string | 数据库连接状态 |
| `database_error` | string | 数据库连接错误信息 |

#### 磁盘使用
| 字段 | 类型 | 说明 |
|------|------|------|
| `total_size` | integer | 备份文件总大小（字节） |
| `total_size_human` | string | 人类可读的备份文件大小 |
| `file_count` | integer | 备份文件数量 |

#### 内存使用
| 字段 | 类型 | 说明 |
|------|------|------|
| `rss` | integer | 物理内存使用量（字节） |
| `rss_human` | string | 人类可读的物理内存大小 |
| `vms` | integer | 虚拟内存使用量（字节） |
| `vms_human` | string | 人类可读的虚拟内存大小 |
| `psutil_not_available` | boolean | psutil 库是否可用 |

## 使用示例

### cURL 示例

```bash
curl -X GET "https://dbapi.muzilix.cn/stats/system" \
  -H "Authorization: Bearer your_api_key"
```

### Python 示例

```python
import requests

def get_system_stats(api_key):
    """获取系统统计信息"""
    url = "https://dbapi.muzilix.cn/stats/system"
    headers = {"Authorization": f"Bearer {api_key}"}
    
    response = requests.get(url, headers=headers)
    return response.json()

def check_system_health(api_key):
    """检查系统健康状态"""
    data = get_system_stats(api_key)
    
    print("🖥️  系统健康检查")
    print(f"   时间: {data['timestamp']}")
    print(f"   Python版本: {data['python_version'].split()[0]}")
    print(f"   平台: {data['platform']}")
    
    # 数据库状态
    db_status = data['database_status']
    db_icon = "✅" if db_status == "connected" else "❌"
    print(f"   数据库: {db_icon} {db_status}")
    
    # API状态
    api_status = data['api_status']
    api_icon = "✅" if api_status == "healthy" else "❌"
    print(f"   API服务: {api_icon} {api_status}")
    
    # 备份磁盘使用
    backup_usage = data.get('backup_disk_usage', {})
    if backup_usage:
        print(f"   备份磁盘: {backup_usage.get('total_size_human', 'N/A')}")
        print(f"   备份文件: {backup_usage.get('file_count', 0)} 个")

def monitor_resources(api_key):
    """监控系统资源"""
    data = get_system_stats(api_key)
    
    print("📊 资源监控")
    
    # 内存使用
    memory = data.get('memory_usage', {})
    if memory.get('psutil_not_available'):
        print("   内存信息: psutil 库未安装")
    else:
        print(f"   物理内存: {memory.get('rss_human', 'N/A')}")
        print(f"   虚拟内存: {memory.get('vms_human', 'N/A')}")
    
    # 连接数
    connections = data.get('database_connections', 0)
    print(f"   数据库连接: {connections}")

# 使用示例
if __name__ == "__main__":
    API_KEY = "your_api_key"
    
    # 系统健康检查
    check_system_health(API_KEY)
    print()
    
    # 资源监控
    monitor_resources(API_KEY)
```

## 监控指标说明

### 系统状态
- **API服务状态**: 反映API服务的运行状况
- **数据库连接**: 监控数据库连接是否正常
- **平台信息**: 了解运行环境的基本信息

### 资源使用
- **内存使用**: 监控API进程的内存消耗
- **磁盘空间**: 跟踪备份文件占用的磁盘空间
- **连接数**: 了解当前的数据库连接负载

### 健康检查
通过定期调用此接口，可以：
- 监控系统的整体健康状态
- 及时发现资源瓶颈
- 预警潜在的磁盘空间不足问题

## 相关链接

- [监控统计总览](../monitoring-stats/index.md)
- [数据库统计](database-stats.md)
- [性能统计](performance-stats.md)
- [API使用统计](api-usage-stats.md)