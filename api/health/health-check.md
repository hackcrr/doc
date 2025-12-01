# 健康检查

## 端点信息

<!-- ```http
GET /health
``` -->
<ApiEndpoint method="GET" path="/health" />

健康检查端点，用于验证 API 服务是否正常运行。此端点无需认证。

## 请求

### 请求头
无需特殊请求头。

### 请求体
无请求体。

## 响应

### 成功响应
<!-- **状态码:** `200 OK` -->
**响应状态:** <Badge type="success">200 OK</Badge>
```json
{
  "status": "healthy",
  "message": "Database API is running"
}
```

### 响应字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `status` | string | 服务状态，固定为 `"healthy"` |
| `message` | string | 状态描述信息 |

## 使用示例
::: code-group
<!-- ### cURL 示例 -->
```bash[cURL 示例 ]
curl -X GET https://dbapi.muzilix.cn/health
```

<!-- ### Python 示例 -->
```python[Python 示例]
import requests

def check_health():
    try:
        response = requests.get('https://dbapi.muzilix.cn/health', timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"服务状态: {data['status']}")
            print(f"消息: {data['message']}")
            return True
        else:
            print(f"服务异常，状态码: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"健康检查失败: {e}")
        return False

# 使用示例
if check_health():
    print("API 服务正常运行")
else:
    print("API 服务异常")
```

<!-- ### JavaScript 示例 -->
```javascript[JavaScript 示例]
async function checkHealth() {
    try {
        const response = await fetch('https://dbapi.muzilix.cn/health');
        if (response.ok) {
            const data = await response.json();
            console.log(`服务状态: ${data.status}`);
            console.log(`消息: ${data.message}`);
            return true;
        } else {
            console.log(`服务异常，状态码: ${response.status}`);
            return false;
        }
    } catch (error) {
        console.log(`健康检查失败: ${error}`);
        return false;
    }
}

// 使用示例
checkHealth().then(healthy => {
    if (healthy) {
        console.log("API 服务正常运行");
    } else {
        console.log("API 服务异常");
    }
});
```
:::
## 使用场景

### 1. 服务监控
```bash
# 定时健康检查脚本
#!/bin/bash
if curl -s https://dbapi.muzilix.cn/health | grep -q "healthy"; then
    echo "✅ API服务正常"
else
    echo "❌ API服务异常"
    # 发送告警通知
fi
```

### 2. 负载均衡健康检查
```nginx
# Nginx 配置示例
upstream api_servers {
    server 192.168.1.10:5000 check;
    server 192.168.1.11:5000 check;
}

server {
    location /health {
        proxy_pass http://api_servers/health;
    }
}
```

### 3. 容器健康检查
```dockerfile
# Dockerfile 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f https://dbapi.muzilix.cn/health || exit 1
```

```yaml
# Docker Compose 健康检查
version: '3'
services:
  api:
    image: your-api-image
    healthcheck:
      test: ["CMD", "curl", "-f", "https://dbapi.muzilix.cn/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

## 注意事项

1. **无认证要求**: 此端点不需要 API 密钥或任何认证信息
2. **轻量级**: 响应快速，不涉及数据库连接或复杂操作
3. **基础状态检查**: 仅验证 Web 服务是否运行，不检查数据库连接状态
4. **监控友好**: 适合用于各种监控系统和健康检查工具

## 故障排除

如果健康检查失败，可能的原因包括：

- 🔌 API 服务未启动
- 🌐 网络连接问题
- 🔄 服务端口被占用
- 💻 服务器资源不足

## 相关链接

- [快速开始指南](/guide/quick-start)
- [API 总览](/api/)
- [监控统计接口](/api/monitoring-stats/)