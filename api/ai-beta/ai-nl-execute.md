---
title: 纯自然语言 AI 执行接口 (Beta)
beta: true
---

## 🧪 纯自然语言 AI 执行接口 (Beta)

> **状态：Beta**  
> 此接口允许用户直接用自然语言描述需求，由 AI 自动规划并执行具体数据库操作。为避免误操作，强烈建议在测试环境和有限权限账号下使用。

### 基本信息

- **方法**: `POST`
- **路径**: <ApiEndpoint method="POST" path="/ai/nl-execute"/>
- **认证**: 需要登录（`Authorization: Bearer <token>`）

### 功能说明

整体流程：

1. 根据当前用户构建可访问的数据库/表结构上下文 `db_context`；
2. 将 `prompt`（自然语言需求）与 `db_context` 一并交给大模型，由 AI 生成一组可执行的 `actions`（plan）；
3. 在当前用户身份下，依次执行这些 `actions`（沿用原有权限校验逻辑）；
4. 返回每一步执行结果、使用模型、上下文摘要等信息。

### 请求参数

请求体既可以是 JSON，也可以是纯字符串：

#### 1. JSON 格式

```json
{
  "prompt": "在 testdb 库的 users 表里插入一条 name=王五, age=28 的数据"
}
```

也可以使用其他字段名（会按顺序尝试）：

- `prompt`
- `q`
- `query`

#### 2. 字符串格式

请求体直接是字符串也可以，例如：

```json
"在 testdb 库的 users 表里插入一条 name=王五, age=28 的数据"
```

#### 参数校验

- 若无法从请求体中解析出有效的 `prompt`（或请求体类型不为 JSON/字符串），将返回：

```json
{
  "error": "请求体必须包含 prompt 字段，或直接是字符串"
}
```

并附带 `400` 状态码。

### 响应示例

```json
{
  "success": true,
  "model": "gpt-4.1-mini",
  "prompt": "在 testdb 库的 users 表里插入一条 name=王五, age=28 的数据",
  "db_context_summary": {
    "database_count": 2
  },
  "plan": {
    "actions": [
      {
        "name": "insert_user",
        "method": "POST",
        "path": "/database/testdb/table/users/data",
        "body": {
          "name": "王五",
          "age": 28
        }
      }
    ]
  },
  "executed": [
    {
      "name": "insert_user",
      "status": 200,
      "response": {
        "success": true,
        "insert_id": 456
      }
    }
  ],
  "comment": "根据自然语言需求完成插入操作。"
}
```

### 响应字段说明

- **success**: `boolean`，整体执行是否成功。
- **model**: `string`，使用的大模型标识。
- **prompt**: `string`，原始自然语言请求内容。
- **db_context_summary**: `object`，对当前用户可访问数据库上下文的简要统计：
  - `database_count`: 当前上下文中包含的数据库数量。
- **plan**: `object`，AI 生成的执行计划。
- **executed**: `array`，各个步骤的实际执行结果（结构与 `/ai/execute` 类似）。
- **comment**: `string`，对本次执行的总结说明。
- **error**: `string`，当 `success=false` 时的错误信息。

### 安全与权限

- `db_context` 仅包含当前用户有权限访问的数据库/表；
- 执行阶段仍然会走现有的权限校验逻辑（如只读库、表级权限等）；
- 建议通过审计日志、限流、只读账号等手段降低误操作影响。

### 可能的错误

- `400`：请求体缺少 `prompt` / `q` / `query` 字段，或格式不正确。
- `500`：AI 路由配置错误（`AiRouterError`）或大模型/后端执行异常。


