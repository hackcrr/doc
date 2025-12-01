# SQL 使用指南

## 概述

本文档提供在 Database API 中使用 SQL 查询的详细指南，包括语法规范、安全限制和最佳实践。

## 支持的操作类型

### 允许的查询类型
| 类型 | 语法 | 描述 | 示例 |
|------|------|------|-------|
| `SELECT` | `SELECT ...` | 数据查询 | `SELECT * FROM users` |
| `EXPLAIN` | `EXPLAIN ...` | 查询分析 | `EXPLAIN SELECT * FROM users` |
| `DESCRIBE` | `DESCRIBE ...` | 表结构描述 | `DESCRIBE users` |
| `SHOW` | `SHOW ...` | 元数据查询 | `SHOW TABLES` |

### 禁止的操作
以下 SQL 操作被明确禁止：
- `INSERT`, `UPDATE`, `DELETE`, `REPLACE`
- `CREATE`, `ALTER`, `DROP`, `TRUNCATE`
- `GRANT`, `REVOKE`
- `LOCK`, `UNLOCK`
- 所有存储过程和函数操作

## 基本查询语法

### SELECT 查询
```sql
-- 基本查询
SELECT * FROM table_name;

-- 指定字段
SELECT column1, column2 FROM table_name;

-- 使用别名
SELECT column1 AS name, column2 AS email FROM table_name;

-- 去重查询
SELECT DISTINCT column1 FROM table_name;
```

### WHERE 条件
```sql
-- 等值条件
SELECT * FROM users WHERE id = 1;

-- 比较条件
SELECT * FROM products WHERE price > 100;

-- 字符串匹配
SELECT * FROM users WHERE name LIKE '%张%';

-- 多条件组合
SELECT * FROM orders WHERE status = 'completed' AND total_amount > 1000;

-- IN 条件
SELECT * FROM users WHERE id IN (1, 2, 3, 4);

-- BETWEEN 条件
SELECT * FROM products WHERE price BETWEEN 50 AND 100;

-- NULL 检查
SELECT * FROM users WHERE email IS NOT NULL;
```

### 排序和分页
```sql
-- 单字段排序
SELECT * FROM users ORDER BY created_at DESC;

-- 多字段排序
SELECT * FROM products ORDER BY category ASC, price DESC;

-- 分页查询
SELECT * FROM users ORDER BY id LIMIT 10 OFFSET 20;

-- 简化分页
SELECT * FROM users ORDER BY id LIMIT 20, 10;
```

## 高级查询功能

### 聚合函数
```sql
-- 计数
SELECT COUNT(*) FROM users;
SELECT COUNT(DISTINCT city) FROM users;

-- 求和与平均
SELECT SUM(amount) FROM orders;
SELECT AVG(price) FROM products;

-- 最大值最小值
SELECT MAX(price) FROM products;
SELECT MIN(created_at) FROM users;

-- 分组统计
SELECT department, COUNT(*) as employee_count 
FROM employees 
GROUP BY department;

-- 分组后过滤
SELECT city, AVG(salary) as avg_salary
FROM employees
GROUP BY city
HAVING AVG(salary) > 50000;
```

### 连接查询
```sql
-- 内连接
SELECT u.name, o.order_number
FROM users u
INNER JOIN orders o ON u.id = o.user_id;

-- 左连接
SELECT u.name, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id;

-- 多表连接
SELECT 
    u.name,
    p.product_name,
    oi.quantity,
    oi.unit_price
FROM users u
JOIN orders o ON u.id = o.user_id
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id;
```

### 子查询
```sql
-- IN 子查询
SELECT * FROM users 
WHERE id IN (SELECT user_id FROM orders WHERE total_amount > 1000);

-- EXISTS 子查询
SELECT * FROM users u
WHERE EXISTS (
    SELECT 1 FROM orders o 
    WHERE o.user_id = u.id AND o.status = 'completed'
);

-- 标量子查询
SELECT 
    name,
    (SELECT COUNT(*) FROM orders WHERE user_id = users.id) as order_count
FROM users;
```

### 条件逻辑
```sql
-- CASE WHEN 条件
SELECT 
    name,
    age,
    CASE 
        WHEN age < 20 THEN '青少年'
        WHEN age < 40 THEN '青年'
        WHEN age < 60 THEN '中年'
        ELSE '老年'
    END as age_group
FROM users;

-- IF 函数
SELECT 
    name,
    IF(status = 1, '活跃', '非活跃') as status_text
FROM users;

-- COALESCE 处理空值
SELECT 
    name,
    COALESCE(email, '未设置') as email
FROM users;
```

## 日期和时间函数

### 日期查询
```sql
-- 当前时间
SELECT NOW(), CURDATE(), CURTIME();

-- 日期范围
SELECT * FROM orders WHERE order_date > '2024-01-01';

-- 最近N天的数据
SELECT * FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY);

-- 日期格式化
SELECT 
    name,
    DATE_FORMAT(created_at, '%Y-%m-%d') as create_date,
    DATE_FORMAT(created_at, '%H:%i:%s') as create_time
FROM users;

-- 日期计算
SELECT 
    order_date,
    DATE_ADD(order_date, INTERVAL 7 DAY) as delivery_date
FROM orders;
```

## 系统信息查询

### 数据库信息
```sql
-- 查看所有表
SHOW TABLES;

-- 查看表结构
DESCRIBE table_name;
DESC table_name;  -- 简写

-- 查看创建表的SQL
SHOW CREATE TABLE table_name;

-- 查看表状态
SHOW TABLE STATUS;

-- 分析查询性能
EXPLAIN SELECT * FROM users WHERE name = '张三';
```

## 参数化查询

### 使用参数占位符
```sql
-- 使用 ? 作为占位符
SELECT * FROM users WHERE name = ? AND age > ?;

-- 使用 %s 作为占位符（自动转换）
SELECT * FROM users WHERE name = %s AND age > %s;
```

### Python 参数化示例
```python
import requests

def execute_parameterized_query(api_key, db_name, sql, params):
    """执行参数化查询"""
    url = f"https://dbapi.muzilix.cn/database/{db_name}/query"
    headers = {"Authorization": f"Bearer {api_key}"}
    data = {
        "sql": sql,
        "params": params,
        "type": "select"
    }
    
    response = requests.post(url, json=data, headers=headers)
    return response.json()

# 使用示例
result = execute_parameterized_query(
    api_key="your_api_key",
    db_name="production_db",
    sql="SELECT * FROM users WHERE name = ? AND age > ?",
    params=["张三", 25]
)
```

## 安全限制

### SQL 注入防护
系统自动进行 SQL 安全验证，禁止以下模式：
- 系统表访问 (`INFORMATION_SCHEMA`, `mysql.*`, `sys.*`)
- 跨数据库查询 (`*.*`)
- 危险关键字 (`INSERT`, `UPDATE`, `DELETE` 等)
- 复杂子查询（深度限制）

### 查询限制
| 限制项 | 限制值 | 说明 |
|--------|--------|------|
| 查询长度 | 5000 字符 | 单条 SQL 最大长度 |
| 子查询深度 | 3 层 | 最大嵌套深度 |
| 执行时间 | 30 秒 | 查询超时时间 |
| 返回行数 | 1000 行 | 单次查询最大返回行数 |

## 性能优化建议

### 索引优化
```sql
-- 为常用查询字段添加索引
-- 在表创建时考虑：
CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(255),
    created_at TIMESTAMP,
    INDEX idx_name (name),
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
);

-- 分析查询性能
EXPLAIN SELECT * FROM users WHERE name = '张三';
```

### 查询优化
```sql
-- 避免 SELECT *
SELECT id, name, email FROM users;  -- 好的实践
SELECT * FROM users;  -- 避免使用

-- 使用 LIMIT 限制结果集
SELECT * FROM large_table LIMIT 100;

-- 合理使用 WHERE 条件
SELECT * FROM orders WHERE status = 'completed' AND created_at > '2024-01-01';

-- 避免在 WHERE 中使用函数
SELECT * FROM users WHERE DATE(created_at) = '2024-01-01';  -- 避免
SELECT * FROM users WHERE created_at >= '2024-01-01' AND created_at < '2024-01-02';  -- 推荐
```

## 错误处理

### 常见 SQL 错误
```sql
-- 表不存在
ERROR 1146: Table 'database.table_name' doesn't exist

-- 列不存在  
ERROR 1054: Unknown column 'column_name' in 'field list'

-- 语法错误
ERROR 1064: You have an error in your SQL syntax

-- 权限错误
ERROR 1142: SELECT command denied to user
```

### 错误处理示例
```python
def safe_query_execution(api_key, db_name, sql, params=None):
    """安全的查询执行"""
    try:
        result = execute_parameterized_query(api_key, db_name, sql, params or [])
        
        if 'error' in result:
            error_msg = result['error']
            
            if '1146' in error_msg:  # 表不存在
                print(f"表不存在: {error_msg}")
            elif '1054' in error_msg:  # 列不存在
                print(f"列不存在: {error_msg}")
            elif '1064' in error_msg:  # 语法错误
                print(f"SQL语法错误: {error_msg}")
            else:
                print(f"查询错误: {error_msg}")
                
            return None
                
        return result.get('data', [])
        
    except Exception as e:
        print(f"请求失败: {str(e)}")
        return None
```

## 实用查询示例

### 数据统计报表
```sql
-- 每日订单统计
SELECT 
    DATE(order_date) as order_day,
    COUNT(*) as order_count,
    SUM(total_amount) as total_revenue,
    AVG(total_amount) as avg_order_value
FROM orders
WHERE order_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY DATE(order_date)
ORDER BY order_day DESC;

-- 用户活跃度分析
SELECT 
    CASE 
        WHEN order_count = 0 THEN '无订单'
        WHEN order_count = 1 THEN '单次购买'
        WHEN order_count <= 5 THEN '轻度用户' 
        ELSE '重度用户'
    END as user_segment,
    COUNT(*) as user_count,
    AVG(total_spent) as avg_spent
FROM (
    SELECT 
        user_id,
        COUNT(*) as order_count,
        SUM(total_amount) as total_spent
    FROM orders
    GROUP BY user_id
) user_stats
GROUP BY user_segment;
```

### 数据质量检查
```sql
-- 查找重复邮箱
SELECT email, COUNT(*) as duplicate_count
FROM users
GROUP BY email
HAVING COUNT(*) > 1;

-- 查找空值
SELECT *
FROM users
WHERE email IS NULL OR name IS NULL;

-- 数据完整性检查
SELECT 
    'users' as table_name,
    COUNT(*) as total_rows,
    COUNT(email) as non_null_emails,
    COUNT(name) as non_null_names
FROM users;
```

## API 调用示例

### 完整的工作流程
```python
import requests

class SQLQueryExecutor:
    def __init__(self, api_key, base_url="https://dbapi.muzilix.cn"):
        self.api_key = api_key
        self.base_url = base_url
        self.headers = {"Authorization": f"Bearer {api_key}"}
    
    def get_table_info(self, db_name):
        """获取表信息"""
        url = f"{self.base_url}/database/{db_name}/tables-info"
        response = requests.get(url, headers=self.headers)
        return response.json()
    
    def execute_query(self, db_name, sql, params=None, query_type="select"):
        """执行SQL查询"""
        url = f"{self.base_url}/database/{db_name}/query"
        data = {
            "sql": sql,
            "params": params or [],
            "type": query_type
        }
        
        response = requests.post(url, json=data, headers=self.headers)
        return response.json()
    
    def get_query_examples(self, db_name):
        """获取查询示例"""
        url = f"{self.base_url}/database/{db_name}/query-examples"
        response = requests.get(url, headers=self.headers)
        return response.json()

# 使用示例
executor = SQLQueryExecutor("your_api_key")

# 1. 查看数据库表结构
table_info = executor.get_table_info("production_db")
print("可用的表:", [table['table_name'] for table in table_info['tables']])

# 2. 执行查询
result = executor.execute_query(
    db_name="production_db",
    sql="SELECT name, email, created_at FROM users WHERE created_at > ? ORDER BY created_at DESC LIMIT 10",
    params=["2024-01-01"]
)

if result.get('success'):
    for row in result.get('data', []):
        print(f"用户: {row['name']}, 邮箱: {row['email']}")
```

## 相关链接

- [查询示例](/examples/query-examples.md) - 更多实用查询示例
- [错误代码参考](error-codes.md) - SQL 错误代码说明
- [API 限制说明](api-limits.md) - 查询频率和限制
- [数据库管理](/api/database-management/index.md) - 数据库操作指南