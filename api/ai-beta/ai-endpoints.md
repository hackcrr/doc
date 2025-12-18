---
title: AI 内部接口说明文档导出 (Beta)
beta: true
---

## 🧪 AI 内部接口说明导出 (Beta)

> **状态：Beta**  
> 此接口主要面向内部服务或管理员，用于向大模型提供一份“机器可读”的接口说明清单，帮助 AI 更好地了解后端能力。请谨慎开放权限。

### 基本信息

- **方法**: `GET`
- **路径**: <ApiEndpoint method="GET" path="/ai/endpoints"/>
- **权限**: 需要具备 `user_management` 权限（`@require_permission('user_management')`）

### 功能说明

返回一份面向 AI 的接口说明文档，格式为 JSON，来自后端的 `AI_API_SPECS` 结构。  
典型用途：

- 将返回结果作为大模型提示的一部分，让 AI 知道“有哪些接口可以调用、路径和参数是什么”；
- 为 `/ai/router`、`/ai/execute`、`/ai/nl-execute` 等功能提供更精确的工具描述；
- 用于内部调试、可视化或配置管理。

### 请求示例

```bash
curl -X GET "https://dbapi.muzilix.cn/ai/endpoints" \
  -H "Authorization: Bearer <admin_or_internal_token>"
```

### 响应示例

```json
{
  "success": true,
  "endpoints": [
    {
      "name": "CREATE_DATABASE",
      "method": "POST",
      "path": "/create",
      "description": "创建数据库",
      "params": {
        "db_name": "string"
      }
    },
    {
      "name": "LIST_DATABASES",
      "method": "GET",
      "path": "/databases",
      "description": "列出当前用户可见的数据库"
    }
  ]
}
```

> **说明**：  
> - `endpoints` 字段的具体结构由后端 `AI_API_SPECS` 决定，上面的示例仅为示意。  
> - 可根据需要在 `AI_API_SPECS` 中扩展字段，如请求体 schema、示例、权限要求等。

### 响应字段说明

- **success**: `boolean`，是否获取成功。
- **endpoints**: `array | object`，面向 AI 使用的接口说明清单。
- **error**: `string`，当 `success=false` 时的错误信息。

### 可能的错误

- `403`：当前用户不具备 `user_management` 权限。
- `500`：内部异常（如 `AI_API_SPECS` 构建失败等）。


