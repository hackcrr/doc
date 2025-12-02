# 创建数据库

## 端点信息

<ApiEndpoint method="POST" path="/create" />

创建新的 MySQL 数据库。

## 权限要求
- `create_database` 权限

## 请求

### 请求头
| 头部 | 值 | 必填 |
|------|-----|------|
| `Authorization` | `Bearer your_api_key` | 是 |
| `Content-Type` | `application/json` | 是 |

### 请求体
```json
{
  "db_name": "my_database",
  "charset": "utf8mb4",
  "collation": "utf8mb4_unicode_ci"
}
```

### 请求字段说明

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|---------|------|
| `db_name` | string | 是 | - | 数据库名称 |
| `charset` | string | 否 | `utf8mb4` | 字符集 |
| `collation` | string | 否 | `utf8mb4_unicode_ci` | 排序规则 |

### 数据库命名规则
- 只能包含字母、数字和下划线
- 不能是纯数字
- 不能与系统数据库重名

## 响应

### 成功响应
**状态码:** `201 Created`

```json
{
  "success": true,
  "message": "数据库 my_database 创建成功",
  "database": "my_database",
  "charset": "utf8mb4",
  "collation": "utf8mb4_unicode_ci",
  "auto_granted": true
}
```

### 响应字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `success` | boolean | 操作是否成功 |
| `message` | string | 成功消息 |
| `database` | string | 创建的数据库名称 |
| `charset` | string | 使用的字符集 |
| `collation` | string | 使用的排序规则 |
| `auto_granted` | boolean | 是否自动授予创建者权限 |

## 使用示例
::: code-group
<!-- ### cURL 示例 -->
```bash[cURL 示例]
curl -X POST https://dbapi.muzilix.cn/create \
  -H "Authorization: Bearer your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "db_name": "my_app_db",
    "charset": "utf8mb4",
    "collation": "utf8mb4_unicode_ci"
  }'
```

<!-- ### Python 示例 -->
```python[Python 示例]
import requests

def create_database(api_key, db_name, charset="utf8mb4", collation="utf8mb4_unicode_ci"):
    url = "https://dbapi.muzilix.cn/create"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    data = {
        "db_name": db_name,
        "charset": charset,
        "collation": collation
    }
    
    response = requests.post(url, headers=headers, json=data)
    return response.json()

# 使用示例
result = create_database("your_api_key", "user_management")
if result.get("success"):
    print(f"数据库创建成功: {result['database']}")
else:
    print(f"创建失败: {result.get('error')}")
```

<!-- ### JavaScript 示例 -->
```javascript[JavaScript 示例]
async function createDatabase(apiKey, dbName, charset = 'utf8mb4', collation = 'utf8mb4_unicode_ci') {
    const response = await fetch('https://dbapi.muzilix.cn/create', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            db_name: dbName,
            charset: charset,
            collation: collation
        })
    });
    
    return await response.json();
}

// 使用示例
createDatabase('your_api_key', 'inventory_db')
    .then(result => {
        if (result.success) {
            console.log(`数据库创建成功: ${result.database}`);
        } else {
            console.log(`创建失败: ${result.error}`);
        }
    });
```
:::
## 错误处理

### 错误响应示例

**数据库已存在 (409 Conflict)**
```json
{
  "error": "数据库 my_database 已存在"
}
```

**无效的数据库名称 (400 Bad Request)**
```json
{
  "error": "数据库名称只能包含字母、数字和下划线"
}
```

**权限不足 (403 Forbidden)**
```json
{
  "error": "权限不足"
}
```

**请求频率超限 (429 Too Many Requests)**
```json
{
  "error": "请求过于频繁"
}
```

## 注意事项

1. **自动权限授予**: 数据库创建者会自动获得该数据库的 admin 权限
2. **字符集推荐**: 建议使用 `utf8mb4` 字符集以支持完整的 Unicode
3. **频率限制**: 创建操作限制为 10 次/分钟
4. **命名规范**: 遵循数据库命名规则，避免使用保留字

## 支持的字符集

| 字符集 | 说明 |
|--------|------|
| `utf8mb4` | 推荐，支持完整的 Unicode |
| `utf8` | 基本 Unicode 支持 |
| `latin1` | 西欧语言 |
| `gbk` | 简体中文 |
| `gb2312` | 简体中文 |

## 相关链接

- [数据库管理总览](../database-management/index.md)
- [列出数据库](list-databases.md)
- [删除数据库](delete-database.md)
- [权限指南](../../guide/authentication.md)