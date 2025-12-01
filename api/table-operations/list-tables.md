# 获取表列表

## 端点信息

```http
GET /database/{db_name}/tables
Authorization: Bearer your_api_key
```

获取指定数据库中的所有表列表。

## 权限要求
- `list_tables` 权限
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
  "database": "my_database",
  "tables": [
    "users",
    "products", 
    "orders",
    "order_items"
  ],
  "count": 4
}
```

### 响应字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `database` | string | 数据库名称 |
| `tables` | array | 表名称列表 |
| `count` | integer | 表数量 |

## 使用示例
::: code-group
<!-- ### cURL 示例 -->
```bash[cURL 示例]
curl -X GET https://dbapi.muzilix.cn/database/my_database/tables \
  -H "Authorization: Bearer your_api_key"
```

<!-- ### Python 示例 -->
```python[Python 示例]
import requests

def list_tables(api_key, db_name):
    url = f"https://dbapi.muzilix.cn/database/{db_name}/tables"
    headers = {
        "Authorization": f"Bearer {api_key}"
    }
    
    response = requests.get(url, headers=headers)
    return response.json()

# 使用示例
result = list_tables("your_api_key", "user_management")
if "error" not in result:
    print(f"数据库 {result['database']} 中的表:")
    for table in result["tables"]:
        print(f"  - {table}")
    print(f"总计: {result['count']} 个表")
else:
    print(f"获取表列表失败: {result['error']}")
```

<!-- ### JavaScript 示例 -->
```javascript[JavaScript 示例]
async function listTables(apiKey, dbName) {
    const response = await fetch(`https://dbapi.muzilix.cn/database/${dbName}/tables`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${apiKey}`
        }
    });
    
    return await response.json();
}

// 使用示例
listTables('your_api_key', 'inventory_db')
    .then(result => {
        if (!result.error) {
            console.log(`数据库 ${result.database} 中的表:`);
            result.tables.forEach(table => {
                console.log(`  - ${table}`);
            });
            console.log(`总计: ${result.count} 个表`);
        } else {
            console.log(`获取表列表失败: ${result.error}`);
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
  "error": "获取表列表失败"
}
```

## 使用场景

### 1. 数据库浏览器
```python
def explore_database(api_key, db_name):
    """浏览数据库结构"""
    tables_result = list_tables(api_key, db_name)
    
    if "error" in tables_result:
        print(f"无法访问数据库: {tables_result['error']}")
        return
    
    print(f"📁 数据库: {tables_result['database']}")
    print(f"📊 表数量: {tables_result['count']}")
    print("\n📋 表列表:")
    
    for i, table_name in enumerate(tables_result["tables"], 1):
        print(f"  {i}. {table_name}")
        
        # 可选：获取每个表的详细信息
        structure = get_table_structure(api_key, db_name, table_name)
        if "error" not in structure:
            column_count = len(structure["columns"])
            print(f"     字段数: {column_count}")

# 使用示例
explore_database("your_api_key", "ecommerce_db")
```

### 2. 表存在性检查
```python
def table_exists(api_key, db_name, table_name):
    """检查表是否存在"""
    result = list_tables(api_key, db_name)
    
    if "error" in result:
        return False
    
    return table_name in result["tables"]

# 使用示例
if table_exists("your_api_key", "my_app", "users"):
    print("users 表存在")
else:
    print("users 表不存在，需要创建")
```

### 3. 批量表操作
```python
def process_all_tables(api_key, db_name, processor_func):
    """对所有表执行处理函数"""
    result = list_tables(api_key, db_name)
    
    if "error" in result:
        print(f"错误: {result['error']}")
        return
    
    for table_name in result["tables"]:
        print(f"处理表: {table_name}")
        processor_func(api_key, db_name, table_name)

# 示例处理函数 - 备份所有表结构
def backup_table_structure(api_key, db_name, table_name):
    structure = get_table_structure(api_key, db_name, table_name)
    if "error" not in structure:
        # 保存表结构到文件
        filename = f"backup/{db_name}_{table_name}_structure.json"
        with open(filename, 'w') as f:
            json.dump(structure, f, indent=2)
        print(f"  ✅ 已备份: {table_name}")

# 使用示例
process_all_tables("your_api_key", "production_db", backup_table_structure)
```

### 4. 表命名模式匹配
```python
def find_tables_by_pattern(api_key, db_name, pattern):
    """根据模式查找表"""
    result = list_tables(api_key, db_name)
    
    if "error" in result:
        return []
    
    import re
    matched_tables = []
    
    for table_name in result["tables"]:
        if re.search(pattern, table_name):
            matched_tables.append(table_name)
    
    return matched_tables

# 使用示例
# 查找所有日志表
log_tables = find_tables_by_pattern("your_api_key", "app_db", r"log_|_log$")
print("日志表:", log_tables)

# 查找所有临时表
temp_tables = find_tables_by_pattern("your_api_key", "app_db", r"^temp_|_tmp$")
print("临时表:", temp_tables)
```

### 5. 表统计报告
```javascript
async function generateTableReport(apiKey, dbName) {
    const tablesResult = await listTables(apiKey, dbName);
    
    if (tablesResult.error) {
        console.log(`错误: ${tablesResult.error}`);
        return;
    }
    
    const report = {
        database: tablesResult.database,
        totalTables: tablesResult.count,
        tables: []
    };
    
    // 为每个表获取详细信息
    for (const tableName of tablesResult.tables) {
        const structure = await getTableStructure(apiKey, dbName, tableName);
        if (!structure.error) {
            report.tables.push({
                name: tableName,
                columns: structure.columns.length,
                hasPrimaryKey: structure.columns.some(col => col.key === 'PRI'),
                createTime: structure.statistics.create_time
            });
        }
    }
    
    return report;
}

// 使用示例
generateTableReport('your_api_key', 'analytics_db').then(report => {
    console.log('表统计报告:');
    console.log(`数据库: ${report.database}`);
    console.log(`总表数: ${report.totalTables}`);
    
    report.tables.forEach(table => {
        console.log(`- ${table.name}: ${table.columns} 个字段, 主键: ${table.hasPrimaryKey ? '是' : '否'}`);
    });
});
```

## 相关链接

- [表操作总览](../table-operations/index.md)
- [创建表](create-table.md)
- [表结构信息](table-structure.md)
- [数据操作](../data-operations/)