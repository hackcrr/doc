# 数据库信息

## 端点信息

<ApiEndpoint method="GET" path="/database/{db_name}/info" />

获取指定数据库的详细信息，包括字符集、大小、表数量等统计信息。

## 权限要求
- `database_info` 权限
- 对目标数据库的 `read` 权限

## 请求

### 请求头
| 头部 | 值 | 必填 |
|------|-----|------|
| `Authorization` | `Bearer your_api_key` | 是 |

### 路径参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `db_name` | string | 是 | 数据库名称 |

## 响应

### 成功响应
**状态码:** `200 OK`

```json
{
  "name": "my_database",
  "character_set": "utf8mb4",
  "collation": "utf8mb4_unicode_ci",
  "size_bytes": 15728640,
  "size_human": "15.00 MB",
  "table_count": 8,
  "create_time": "2024-01-15T10:30:00"
}
```

### 响应字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `name` | string | 数据库名称 |
| `character_set` | string | 字符集 |
| `collation` | string | 排序规则 |
| `size_bytes` | integer | 数据库总大小（字节） |
| `size_human` | string | 人类可读的数据库大小 |
| `table_count` | integer | 表数量 |
| `create_time` | string | 数据库创建时间 |

## 使用示例
::: code-group
<!-- ### cURL 示例 -->
```bash[cURL 示例]
curl -X GET https://dbapi.muzilix.cn/database/my_database/info \
  -H "Authorization: Bearer your_api_key"
```

<!-- ### Python 示例 -->
```python[Python 示例]
import requests

def get_database_info(api_key, db_name):
    url = f"https://dbapi.muzilix.cn/database/{db_name}/info"
    headers = {
        "Authorization": f"Bearer {api_key}"
    }
    
    response = requests.get(url, headers=headers)
    return response.json()

# 使用示例
db_info = get_database_info("your_api_key", "user_management")
if "error" not in db_info:
    print(f"数据库: {db_info['name']}")
    print(f"大小: {db_info['size_human']}")
    print(f"表数量: {db_info['table_count']}")
    print(f"字符集: {db_info['character_set']}")
    print(f"创建时间: {db_info['create_time']}")
else:
    print(f"获取信息失败: {db_info['error']}")
```

<!-- ### JavaScript 示例 -->
```javascript[JavaScript 示例]
async function getDatabaseInfo(apiKey, dbName) {
    const response = await fetch(`https://dbapi.muzilix.cn/database/${dbName}/info`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${apiKey}`
        }
    });
    
    return await response.json();
}

// 使用示例
getDatabaseInfo('your_api_key', 'inventory_db')
    .then(dbInfo => {
        if (!dbInfo.error) {
            console.log(`数据库: ${dbInfo.name}`);
            console.log(`大小: ${dbInfo.size_human}`);
            console.log(`表数量: ${dbInfo.table_count}`);
            console.log(`字符集: ${dbInfo.character_set}`);
            console.log(`创建时间: ${dbInfo.create_time}`);
        } else {
            console.log(`获取信息失败: ${dbInfo.error}`);
        }
    });
```
:::
## 错误处理

### 错误响应示例

**数据库不存在 (404 Not Found)**
```json
{
  "error": "数据库 my_database 不存在"
}
```

**权限不足 (403 Forbidden)**
```json
{
  "error": "没有访问该数据库的权限"
}
```

**无效的数据库名称 (400 Bad Request)**
```json
{
  "error": "无效的数据库名称"
}
```

**服务器错误 (500 Internal Server Error)**
```json
{
  "error": "获取数据库信息失败"
}
```

## 技术细节

### 数据来源
- **字符集和排序规则**: 从 `information_schema.SCHEMATA` 表获取
- **大小信息**: 从 `information_schema.TABLES` 表计算数据和索引大小总和
- **表数量**: 统计 `information_schema.TABLES` 中的表记录
- **创建时间**: 从表的最早创建时间推断数据库创建时间

### 大小计算
数据库大小计算公式：
```
总大小 = SUM(数据长度 + 索引长度)
```

## 使用场景

### 1. 数据库监控仪表板
```python
def generate_database_report(api_key):
    """生成数据库监控报告"""
    databases = list_databases(api_key)
    
    print("=== 数据库监控报告 ===")
    total_size = 0
    total_tables = 0
    
    for db_name in databases["databases"]:
        info = get_database_info(api_key, db_name)
        if "error" not in info:
            print(f"\n📊 {info['name']}")
            print(f"   大小: {info['size_human']}")
            print(f"   表数: {info['table_count']}")
            print(f"   字符集: {info['character_set']}")
            print(f"   创建时间: {info['create_time']}")
            
            total_size += info["size_bytes"]
            total_tables += info["table_count"]
    
    print(f"\n📈 统计汇总:")
    print(f"   总数据库数: {len(databases['databases'])}")
    print(f"   总表数量: {total_tables}")
    print(f"   总数据大小: {format_size(total_size)}")

# 使用示例
generate_database_report("your_api_key")
```

### 2. 容量规划
```python
def check_database_capacity(api_key, warning_threshold_mb=1024):
    """检查数据库容量，发出警告"""
    databases = list_databases(api_key)
    
    for db_name in databases["databases"]:
        info = get_database_info(api_key, db_name)
        if "error" not in info:
            size_mb = info["size_bytes"] / (1024 * 1024)
            if size_mb > warning_threshold_mb:
                print(f"⚠️  警告: 数据库 {db_name} 大小 {info['size_human']} 超过阈值 {warning_threshold_mb}MB")

# 使用示例
check_database_capacity("your_api_key", warning_threshold_mb=500)
```

### 3. 字符集一致性检查
```python
def check_charset_consistency(api_key, expected_charset="utf8mb4"):
    """检查所有数据库的字符集一致性"""
    databases = list_databases(api_key)
    inconsistent_dbs = []
    
    for db_name in databases["databases"]:
        info = get_database_info(api_key, db_name)
        if "error" not in info and info["character_set"] != expected_charset:
            inconsistent_dbs.append({
                "name": info["name"],
                "charset": info["character_set"]
            })
    
    if inconsistent_dbs:
        print(f"发现字符集不一致的数据库 (期望: {expected_charset}):")
        for db in inconsistent_dbs:
            print(f"  - {db['name']}: {db['charset']}")
    else:
        print("所有数据库字符集一致")

# 使用示例
check_charset_consistency("your_api_key")
```

### 4. 自动化报告
```javascript
// 生成每日数据库健康报告
async function generateDailyReport(apiKey) {
    const databases = await listDatabases(apiKey);
    const report = {
        timestamp: new Date().toISOString(),
        total_databases: databases.databases.length,
        databases: []
    };
    
    for (const dbName of databases.databases) {
        const info = await getDatabaseInfo(apiKey, dbName);
        if (!info.error) {
            report.databases.push({
                name: info.name,
                size: info.size_human,
                tables: info.table_count,
                charset: info.character_set,
                created: info.create_time
            });
        }
    }
    
    return report;
}

// 使用示例
generateDailyReport('your_api_key').then(report => {
    console.log('每日数据库报告:', JSON.stringify(report, null, 2));
});
```

## 相关链接

- [数据库管理总览](../database-management/index.md)
- [列出数据库](list-databases.md)
- [创建数据库](create-database.md)
<!-- - [调试数据库信息](debug-database.md) -->
- [监控统计](../monitoring-stats/database-stats.md)