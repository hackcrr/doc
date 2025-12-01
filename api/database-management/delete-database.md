# 删除数据库

## 端点信息

```http
DELETE /database/{db_name}
Authorization: Bearer your_api_key
```

删除指定的 MySQL 数据库。

## 权限要求
- `delete_database` 权限
- 对目标数据库的 `write` 权限

## 请求

### 请求头
| 头部 | 值 | 必填 |
|------|-----|------|
| `Authorization` | `Bearer your_api_key` | 是 |

### 路径参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `db_name` | string | 是 | 要删除的数据库名称 |

## 响应

### 成功响应
**状态码:** `200 OK`

```json
{
  "success": true,
  "message": "数据库 my_database 删除成功"
}
```

### 响应字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `success` | boolean | 操作是否成功 |
| `message` | string | 成功消息 |

## 使用示例
::: code-group
<!-- ### cURL 示例 -->
```bash[cURL 示例]
curl -X DELETE https://dbapi.muzilix.cn/database/old_database \
  -H "Authorization: Bearer your_api_key"
```

<!-- ### Python 示例 -->
```python[Python 示例]
import requests

def delete_database(api_key, db_name):
    url = f"https://dbapi.muzilix.cn/database/{db_name}"
    headers = {
        "Authorization": f"Bearer {api_key}"
    }
    
    response = requests.delete(url, headers=headers)
    return response.json()

# 使用示例
result = delete_database("your_api_key", "temp_database")
if result.get("success"):
    print(f"数据库删除成功: {result['message']}")
else:
    print(f"删除失败: {result.get('error')}")
```

<!-- ### JavaScript 示例 -->
```javascript[JavaScript 示例]
async function deleteDatabase(apiKey, dbName) {
    const response = await fetch(`https://dbapi.muzilix.cn/database/${dbName}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${apiKey}`
        }
    });
    
    return await response.json();
}

// 使用示例
deleteDatabase('your_api_key', 'test_db')
    .then(result => {
        if (result.success) {
            console.log(`数据库删除成功: ${result.message}`);
        } else {
            console.log(`删除失败: ${result.error}`);
        }
    });
```
:::
## 错误处理

### 错误响应示例

**数据库不存在 (404 Not Found)**
```json
{
  "error": "数据库 old_database 不存在"
}
```

**系统数据库保护 (403 Forbidden)**
```json
{
  "error": "不能删除系统数据库"
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

**请求频率超限 (429 Too Many Requests)**
```json
{
  "error": "请求过于频繁"
}
```

## 安全保护

### 受保护的系统数据库
以下系统数据库无法删除：
- `information_schema`
- `mysql`
- `performance_schema`
- `sys`
- `api_auth`

### 操作限制
- 删除操作限制为 5 次/分钟
- 需要明确的数据库写权限
- 数据库名称必须通过格式验证

## 注意事项

### ⚠️ 重要警告
1. **数据丢失**: 删除数据库将永久删除所有数据和表结构
2. **不可恢复**: 删除操作无法撤销，请谨慎操作
3. **依赖检查**: 删除前请确保没有应用程序依赖该数据库
4. **备份建议**: 重要数据删除前建议先备份

### 最佳实践
```python
def safe_database_deletion(api_key, db_name):
    """安全的数据库删除流程"""
    
    # 1. 先备份数据库
    backup_result = backup_database(api_key, db_name, {
        "backup_name": f"pre_deletion_backup_{db_name}",
        "compress": True
    })
    
    if not backup_result.get("success"):
        return {"error": "备份失败，取消删除操作"}
    
    # 2. 验证备份文件
    backup_id = backup_result["backup"]["backup_id"]
    time.sleep(10)  # 等待备份完成
    
    status = get_backup_status(api_key, db_name, backup_id)
    if status.get("status") != "completed":
        return {"error": "备份验证失败，取消删除操作"}
    
    # 3. 执行删除
    return delete_database(api_key, db_name)

# 使用安全删除
result = safe_database_deletion("your_api_key", "old_database")
```

## 使用场景

### 1. 清理测试环境
```python
# 清理所有测试数据库
databases = list_databases(api_key)
for db in databases["databases"]:
    if db.startswith("test_") or db.startswith("temp_"):
        print(f"删除测试数据库: {db}")
        delete_database(api_key, db)
```

### 2. 项目下线清理
```python
def cleanup_project_databases(api_key, project_name):
    """清理项目相关的所有数据库"""
    databases = list_databases(api_key)
    
    for db in databases["databases"]:
        if db.startswith(f"{project_name}_"):
            print(f"删除项目数据库: {db}")
            delete_database(api_key, db)
    
    print("项目数据库清理完成")

# 使用示例
cleanup_project_databases("your_api_key", "old_project")
```

### 3. 自动化清理脚本
```bash
#!/bin/bash
# 自动化清理脚本 - 删除30天前创建的临时数据库

API_KEY="your_api_key"
BASE_URL="https://dbapi.muzilix.cn"

# 获取数据库列表
DATABASES=$(curl -s -H "Authorization: Bearer $API_KEY" "$BASE_URL/databases?details=true")

echo $DATABASES | jq -r '.databases[] | select(.name | startswith("temp_")) | "\(.name) \(.create_time)"' | while read db_name create_time; do
    # 检查创建时间是否超过30天
    if [[ $(date -d "$create_time" +%s) -lt $(date -d "30 days ago" +%s) ]]; then
        echo "删除过期数据库: $db_name (创建于 $create_time)"
        curl -X DELETE -H "Authorization: Bearer $API_KEY" "$BASE_URL/database/$db_name"
    fi
done
```

## 相关链接

- [数据库管理总览](../database-management/index.md)
- [创建数据库](create-database.md)
- [列出数据库](list-databases.md)
- [备份数据库](../backup-recovery/backup-database.md)
- [安全指南](../../guide/security.md)