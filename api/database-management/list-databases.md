# 列出数据库

## 端点信息

```http
GET /databases
Authorization: Bearer your_api_key
```

获取所有可访问的数据库列表。

## 权限要求
- `list_databases` 权限

## 请求

### 请求头
| 头部 | 值 | 必填 |
|------|-----|------|
| `Authorization` | `Bearer your_api_key` | 是 |

### 查询参数
| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|---------|------|
| `details` | boolean | 否 | `false` | 是否返回详细信息 |

## 响应

### 简单列表响应
**当 `details=false` 时：**

```json
{
  "databases": [
    "my_database",
    "user_management",
    "inventory_db"
  ]
}
```

### 详细信息响应
**当 `details=true` 时：**

```json
{
  "databases": [
    {
      "name": "my_database",
      "character_set": "utf8mb4",
      "collation": "utf8mb4_unicode_ci",
      "create_time": "2024-01-01T00:00:00",
      "table_count": 5,
      "size_bytes": 1048576,
      "size_human": "1.00 MB"
    }
  ]
}
```

### 响应字段说明（详细信息模式）

| 字段 | 类型 | 说明 |
|------|------|------|
| `name` | string | 数据库名称 |
| `character_set` | string | 字符集 |
| `collation` | string | 排序规则 |
| `create_time` | string | 创建时间 |
| `table_count` | integer | 表数量 |
| `size_bytes` | integer | 数据库大小（字节） |
| `size_human` | string | 人类可读的数据库大小 |

## 使用示例
### cURL 示例
::: code-group
<!-- **获取简单列表：** -->
```bash[获取简单列表]
curl -X GET "https://dbapi.muzilix.cn/databases" \
  -H "Authorization: Bearer your_api_key"
```

<!-- **获取详细信息：** -->
```bash[获取详细信息]
curl -X GET "https://dbapi.muzilix.cn/databases?details=true" \
  -H "Authorization: Bearer your_api_key"
```
:::

### Python & JavaScript 示例
::: code-group
```python[Python 示例]
import requests

def list_databases(api_key, details=False):
    url = "https://dbapi.muzilix.cn/databases"
    headers = {
        "Authorization": f"Bearer {api_key}"
    }
    params = {
        "details": str(details).lower()
    }
    
    response = requests.get(url, headers=headers, params=params)
    return response.json()

# 使用示例 - 简单列表
databases = list_databases("your_api_key")
print("数据库列表:", databases["databases"])

# 使用示例 - 详细信息
detailed_databases = list_databases("your_api_key", details=True)
for db in detailed_databases["databases"]:
    print(f"{db['name']}: {db['table_count']} 表, 大小: {db['size_human']}")
```

<!-- ### JavaScript 示例 -->
```javascript[JavaScript 示例]
async function listDatabases(apiKey, details = false) {
    const url = new URL('https://dbapi.muzilix.cn/databases');
    url.searchParams.append('details', details.toString());
    
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${apiKey}`
        }
    });
    
    return await response.json();
}

// 使用示例 - 简单列表
listDatabases('your_api_key')
    .then(data => {
        console.log('数据库列表:', data.databases);
    });

// 使用示例 - 详细信息
listDatabases('your_api_key', true)
    .then(data => {
        data.databases.forEach(db => {
            console.log(`${db.name}: ${db.table_count} 表, 大小: ${db.size_human}`);
        });
    });
```
:::
## 权限说明

### 可见数据库范围
- **超级管理员**: 可以看到所有非系统数据库
- **普通用户**: 只能看到被授权的数据库
- **系统数据库**: 自动过滤（information_schema, mysql, performance_schema, sys）

### 数据库权限
用户只能看到和访问被明确授权的数据库。

## 错误处理

### 错误响应示例

**认证失败 (401 Unauthorized)**
```json
{
  "error": "需要认证，请提供API密钥"
}
```

**权限不足 (403 Forbidden)**
```json
{
  "error": "权限不足"
}
```

**服务器错误 (500 Internal Server Error)**
```json
{
  "error": "获取数据库列表失败"
}
```

## 注意事项

1. **性能考虑**: 详细信息模式会查询更多系统表，性能开销较大
2. **数据过滤**: 自动过滤系统数据库，只返回用户数据库
3. **权限隔离**: 用户只能看到自己有权限访问的数据库
4. **大小计算**: 数据库大小包括数据和索引的总大小

## 使用场景

### 1. 数据库选择界面
```javascript
// 在前端显示数据库选择下拉框
const databases = await listDatabases(apiKey);
databases.forEach(db => {
    $('#database-select').append(`<option value="${db.name}">${db.name}</option>`);
});
```

### 2. 监控仪表板
```python
# 显示数据库统计信息
databases = list_databases(api_key, details=True)
total_size = sum(db['size_bytes'] for db in databases['databases'])
total_tables = sum(db['table_count'] for db in databases['databases'])
print(f"总数据库数: {len(databases['databases'])}")
print(f"总表数量: {total_tables}")
print(f"总数据大小: {format_size(total_size)}")
```

### 3. 备份管理
```python
# 检查需要备份的数据库
databases = list_databases(api_key, details=True)
for db in databases['databases']:
    if db['size_bytes'] > 100 * 1024 * 1024:  # 大于100MB
        print(f"大数据库需要备份: {db['name']} ({db['size_human']})")
```

## 相关链接

- [数据库管理总览](../database-management/index.md)
- [创建数据库](create-database.md)
- [数据库信息](database-info.md)
- [权限指南](../../guide/authentication.md)