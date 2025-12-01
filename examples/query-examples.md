# 查询示例

## 概述

本文档提供丰富的 SQL 查询示例，涵盖从基础查询到高级分析的多种场景，帮助您快速掌握 Database API 的查询功能。

## 基础查询

### 简单数据检索
```sql
-- 查询所有数据
SELECT * FROM users;

-- 查询特定字段
SELECT id, name, email FROM users;

-- 使用表别名
SELECT u.id, u.name, u.email FROM users u;

-- 限制返回行数
SELECT * FROM users LIMIT 10;

-- 去重查询
SELECT DISTINCT department FROM employees;
```

### 条件筛选
```sql
-- 等值查询
SELECT * FROM users WHERE id = 1;
SELECT * FROM products WHERE category = 'electronics';

-- 比较查询
SELECT * FROM products WHERE price > 100;
SELECT * FROM employees WHERE salary BETWEEN 50000 AND 100000;
SELECT * FROM orders WHERE total_amount >= 1000;

-- 字符串匹配
SELECT * FROM users WHERE name LIKE '张%';
SELECT * FROM products WHERE name LIKE '%手机%';
SELECT * FROM users WHERE email LIKE '%@gmail.com';

-- 多条件组合
SELECT * FROM orders 
WHERE status = 'completed' 
AND total_amount > 500 
AND order_date >= '2024-01-01';

-- IN 查询
SELECT * FROM users WHERE id IN (1, 2, 3, 4, 5);
SELECT * FROM products WHERE category IN ('electronics', 'books', 'clothing');

-- NULL 值处理
SELECT * FROM users WHERE phone IS NULL;
SELECT * FROM users WHERE email IS NOT NULL;
```

### 排序和分页
```sql
-- 单字段排序
SELECT * FROM users ORDER BY created_at DESC;
SELECT * FROM products ORDER BY price ASC;

-- 多字段排序
SELECT * FROM employees ORDER BY department ASC, salary DESC;
SELECT * FROM orders ORDER BY order_date DESC, total_amount DESC;

-- 分页查询
SELECT * FROM users ORDER BY id LIMIT 10 OFFSET 0;      -- 第1页
SELECT * FROM users ORDER BY id LIMIT 10 OFFSET 10;     -- 第2页
SELECT * FROM users ORDER BY id LIMIT 10 OFFSET 20;     -- 第3页

-- 简化分页写法
SELECT * FROM users ORDER BY id LIMIT 0, 10;    -- 第1页
SELECT * FROM users ORDER BY id LIMIT 10, 10;   -- 第2页
```

## 聚合分析

### 基础聚合函数
```sql
-- 计数
SELECT COUNT(*) FROM users;
SELECT COUNT(DISTINCT city) FROM users;
SELECT COUNT(*) FROM orders WHERE status = 'completed';

-- 求和与平均
SELECT SUM(total_amount) FROM orders;
SELECT AVG(price) FROM products;
SELECT AVG(salary) FROM employees WHERE department = 'Engineering';

-- 极值查询
SELECT MAX(price) FROM products;
SELECT MIN(created_at) FROM users;
SELECT MAX(salary) as highest_salary FROM employees;
```

### 分组统计
```sql
-- 简单分组
SELECT department, COUNT(*) as employee_count 
FROM employees 
GROUP BY department;

-- 多字段分组
SELECT department, job_title, COUNT(*) as count
FROM employees
GROUP BY department, job_title;

-- 分组后排序
SELECT city, COUNT(*) as user_count
FROM users
GROUP BY city
ORDER BY user_count DESC;

-- 分组统计数值
SELECT 
    category,
    COUNT(*) as product_count,
    AVG(price) as avg_price,
    MAX(price) as max_price,
    MIN(price) as min_price
FROM products
GROUP BY category;
```

### 分组过滤
```sql
-- HAVING 条件过滤
SELECT department, AVG(salary) as avg_salary
FROM employees
GROUP BY department
HAVING AVG(salary) > 50000;

-- 复杂分组条件
SELECT 
    city,
    COUNT(*) as user_count,
    AVG(age) as avg_age
FROM users
GROUP BY city
HAVING COUNT(*) > 100 AND AVG(age) BETWEEN 25 AND 40;

-- 多条件分组统计
SELECT 
    status,
    COUNT(*) as order_count,
    SUM(total_amount) as total_revenue
FROM orders
GROUP BY status
HAVING COUNT(*) > 10 AND SUM(total_amount) > 5000;
```

## 连接查询

### 内连接
```sql
-- 基础内连接
SELECT u.name, o.order_number, o.total_amount
FROM users u
INNER JOIN orders o ON u.id = o.user_id;

-- 多表内连接
SELECT 
    u.name as customer_name,
    o.order_number,
    p.product_name,
    oi.quantity,
    oi.unit_price
FROM users u
INNER JOIN orders o ON u.id = o.user_id
INNER JOIN order_items oi ON o.id = oi.order_id
INNER JOIN products p ON oi.product_id = p.id;

-- 带条件的连接
SELECT 
    u.name,
    o.order_date,
    o.total_amount
FROM users u
INNER JOIN orders o ON u.id = o.user_id
WHERE o.status = 'completed'
AND o.order_date >= '2024-01-01';
```

### 左连接
```sql
-- 基础左连接
SELECT 
    u.name,
    COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name;

-- 左连接识别无订单用户
SELECT 
    u.name,
    u.email
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE o.id IS NULL;

-- 多表左连接
SELECT 
    u.name as customer_name,
    o.order_number,
    p.product_name
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
LEFT JOIN order_items oi ON o.id = oi.order_id
LEFT JOIN products p ON oi.product_id = p.id;
```

### 复杂连接场景
```sql
-- 自连接（员工和经理）
SELECT 
    e.name as employee_name,
    m.name as manager_name
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;

-- 多条件连接
SELECT 
    u.name,
    o.order_number,
    a.address
FROM users u
INNER JOIN orders o ON u.id = o.user_id
LEFT JOIN addresses a ON u.id = a.user_id AND a.is_primary = 1;
```

## 子查询

### IN 子查询
```sql
-- 基础 IN 子查询
SELECT * FROM users 
WHERE id IN (SELECT user_id FROM orders WHERE total_amount > 1000);

-- 多层 IN 子查询
SELECT * FROM products
WHERE id IN (
    SELECT product_id FROM order_items 
    WHERE order_id IN (
        SELECT id FROM orders WHERE status = 'completed'
    )
);

-- NOT IN 查询
SELECT * FROM users
WHERE id NOT IN (SELECT user_id FROM orders);
```

### EXISTS 子查询
```sql
-- EXISTS 查询
SELECT * FROM users u
WHERE EXISTS (
    SELECT 1 FROM orders o 
    WHERE o.user_id = u.id AND o.status = 'completed'
);

-- NOT EXISTS 查询
SELECT * FROM users u
WHERE NOT EXISTS (
    SELECT 1 FROM orders o 
    WHERE o.user_id = u.id
);

-- 复杂 EXISTS 条件
SELECT * FROM products p
WHERE EXISTS (
    SELECT 1 FROM order_items oi
    INNER JOIN orders o ON oi.order_id = o.id
    WHERE oi.product_id = p.id 
    AND o.order_date >= '2024-01-01'
);
```

### 标量子查询
```sql
-- 在 SELECT 中使用子查询
SELECT 
    name,
    (SELECT COUNT(*) FROM orders WHERE user_id = users.id) as order_count
FROM users;

-- 多字段标量子查询
SELECT 
    name,
    email,
    (SELECT COUNT(*) FROM orders WHERE user_id = users.id) as order_count,
    (SELECT SUM(total_amount) FROM orders WHERE user_id = users.id) as total_spent
FROM users;

-- 带条件的标量子查询
SELECT 
    p.product_name,
    p.price,
    (SELECT COUNT(*) FROM order_items WHERE product_id = p.id) as times_ordered
FROM products p;
```

## 条件逻辑

### CASE WHEN 表达式
```sql
-- 简单 CASE 表达式
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

-- 多条件 CASE
SELECT 
    order_number,
    total_amount,
    CASE 
        WHEN total_amount > 1000 THEN '大额订单'
        WHEN total_amount > 500 THEN '中等订单'
        ELSE '小额订单'
    END as order_size,
    CASE status
        WHEN 'pending' THEN '待处理'
        WHEN 'completed' THEN '已完成'
        WHEN 'cancelled' THEN '已取消'
        ELSE '未知状态'
    END as status_text
FROM orders;

-- 在聚合中使用 CASE
SELECT 
    department,
    COUNT(*) as total_employees,
    COUNT(CASE WHEN salary > 50000 THEN 1 END) as high_salary_count,
    AVG(CASE WHEN gender = 'M' THEN salary END) as avg_male_salary,
    AVG(CASE WHEN gender = 'F' THEN salary END) as avg_female_salary
FROM employees
GROUP BY department;
```

### 条件函数
```sql
-- IF 函数
SELECT 
    name,
    IF(status = 1, '活跃', '非活跃') as status_text
FROM users;

-- COALESCE 处理空值
SELECT 
    name,
    COALESCE(email, '未设置邮箱') as email,
    COALESCE(phone, '未设置手机') as phone
FROM users;

-- NULLIF 避免除零错误
SELECT 
    name,
    total_orders,
    total_amount,
    total_amount / NULLIF(total_orders, 0) as avg_order_amount
FROM user_stats;
```

## 日期和时间函数

### 日期查询
```sql
-- 当前时间查询
SELECT NOW(), CURDATE(), CURTIME();

-- 日期范围查询
SELECT * FROM orders WHERE order_date >= '2024-01-01';
SELECT * FROM users WHERE created_at BETWEEN '2024-01-01' AND '2024-01-31';

-- 相对日期查询
SELECT * FROM orders WHERE order_date >= DATE_SUB(NOW(), INTERVAL 7 DAY);
SELECT * FROM users WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY);

-- 日期提取
SELECT 
    order_date,
    YEAR(order_date) as order_year,
    MONTH(order_date) as order_month,
    DAY(order_date) as order_day,
    DAYNAME(order_date) as day_name
FROM orders;
```

### 日期格式化
```sql
-- 日期格式化
SELECT 
    name,
    DATE_FORMAT(created_at, '%Y-%m-%d') as create_date,
    DATE_FORMAT(created_at, '%H:%i:%s') as create_time,
    DATE_FORMAT(created_at, '%Y年%m月%d日 %H时%i分') as chinese_format
FROM users;

-- 时间差计算
SELECT 
    order_number,
    order_date,
    shipped_date,
    DATEDIFF(shipped_date, order_date) as days_to_ship
FROM orders
WHERE shipped_date IS NOT NULL;
```

## 窗口函数

### 排名和排序
```sql
-- 简单排名
SELECT 
    name,
    salary,
    RANK() OVER (ORDER BY salary DESC) as salary_rank
FROM employees;

-- 分区排名
SELECT 
    department,
    name,
    salary,
    RANK() OVER (PARTITION BY department ORDER BY salary DESC) as dept_rank
FROM employees;

-- 使用 DENSE_RANK
SELECT 
    name,
    salary,
    DENSE_RANK() OVER (ORDER BY salary DESC) as dense_rank
FROM employees;
```

### 累计计算
```sql
-- 累计求和
SELECT 
    order_date,
    total_amount,
    SUM(total_amount) OVER (ORDER BY order_date) as running_total
FROM orders;

-- 移动平均
SELECT 
    order_date,
    total_amount,
    AVG(total_amount) OVER (
        ORDER BY order_date 
        ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
    ) as moving_avg
FROM orders;
```

## 实用分析查询

### 业务分析报表
```sql
-- 销售日报表
SELECT 
    DATE(order_date) as order_day,
    COUNT(*) as order_count,
    SUM(total_amount) as daily_revenue,
    AVG(total_amount) as avg_order_value,
    COUNT(DISTINCT user_id) as unique_customers
FROM orders
WHERE order_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY DATE(order_date)
ORDER BY order_day DESC;

-- 用户分层分析
SELECT 
    CASE 
        WHEN order_count = 0 THEN '无订单用户'
        WHEN order_count = 1 THEN '单次购买用户'
        WHEN order_count <= 5 THEN '轻度用户'
        WHEN order_count <= 20 THEN '中度用户'
        ELSE '重度用户'
    END as user_segment,
    COUNT(*) as user_count,
    AVG(total_spent) as avg_spent,
    SUM(total_spent) as segment_revenue
FROM (
    SELECT 
        user_id,
        COUNT(*) as order_count,
        SUM(total_amount) as total_spent
    FROM orders
    GROUP BY user_id
) user_stats
GROUP BY user_segment
ORDER BY segment_revenue DESC;

-- 产品销售分析
SELECT 
    p.product_name,
    p.category,
    COUNT(oi.id) as times_ordered,
    SUM(oi.quantity) as total_quantity,
    SUM(oi.quantity * oi.unit_price) as total_revenue,
    AVG(oi.unit_price) as avg_selling_price
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
LEFT JOIN orders o ON oi.order_id = o.id AND o.status = 'completed'
GROUP BY p.id, p.product_name, p.category
ORDER BY total_revenue DESC;
```

### 数据质量检查
```sql
-- 数据完整性检查
SELECT 
    'users' as table_name,
    COUNT(*) as total_rows,
    COUNT(email) as non_null_emails,
    COUNT(phone) as non_null_phones,
    COUNT(*) - COUNT(email) as missing_emails,
    COUNT(*) - COUNT(phone) as missing_phones
FROM users;

-- 重复数据检测
SELECT 
    email,
    COUNT(*) as duplicate_count
FROM users
GROUP BY email
HAVING COUNT(*) > 1;

-- 数据一致性检查
SELECT 
    o.id as order_id,
    o.total_amount as order_total,
    SUM(oi.quantity * oi.unit_price) as calculated_total,
    o.total_amount - SUM(oi.quantity * oi.unit_price) as difference
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id, o.total_amount
HAVING ABS(o.total_amount - SUM(oi.quantity * oi.unit_price)) > 0.01;
```

## 性能优化查询

### 查询执行计划
```sql
-- 分析查询性能
EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';

-- 分析连接查询
EXPLAIN 
SELECT u.name, o.order_number 
FROM users u 
INNER JOIN orders o ON u.id = o.user_id 
WHERE o.order_date >= '2024-01-01';

-- 分析复杂查询
EXPLAIN
SELECT 
    u.name,
    COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id
HAVING COUNT(o.id) > 5;
```

### 索引使用检查
```sql
-- 查看表索引
SHOW INDEX FROM users;

-- 分析索引使用情况
EXPLAIN FORMAT=JSON 
SELECT * FROM users WHERE email = 'test@example.com';

-- 检查全表扫描
EXPLAIN 
SELECT * FROM users WHERE name LIKE '%张%';
```

## API 调用示例

### Python 参数化查询
```python
import requests

def execute_query_examples(api_key, db_name):
    """执行各种查询示例"""
    base_url = "https://dbapi.muzilix.cn"
    headers = {"Authorization": f"Bearer {api_key}"}
    
    # 1. 基础查询
    queries = [
        {
            "name": "用户列表",
            "sql": "SELECT id, name, email FROM users ORDER BY created_at DESC LIMIT 10",
            "params": []
        },
        {
            "name": "订单统计",
            "sql": """
                SELECT 
                    DATE(order_date) as order_day,
                    COUNT(*) as order_count,
                    SUM(total_amount) as daily_revenue
                FROM orders 
                WHERE order_date >= ?
                GROUP BY DATE(order_date)
                ORDER BY order_day DESC
            """,
            "params": ["2024-01-01"]
        },
        {
            "name": "用户购买分析",
            "sql": """
                SELECT 
                    u.name,
                    COUNT(o.id) as order_count,
                    SUM(o.total_amount) as total_spent
                FROM users u
                LEFT JOIN orders o ON u.id = o.user_id
                GROUP BY u.id, u.name
                HAVING COUNT(o.id) > 0
                ORDER BY total_spent DESC
                LIMIT 20
            """,
            "params": []
        }
    ]
    
    results = {}
    for query in queries:
        data = {
            "sql": query["sql"],
            "params": query["params"],
            "type": "select"
        }
        
        response = requests.post(
            f"{base_url}/database/{db_name}/query",
            json=data,
            headers=headers
        )
        
        if response.status_code == 200:
            results[query["name"]] = response.json()
        else:
            results[query["name"]] = {"error": response.text}
    
    return results

# 使用示例
api_key = "your_api_key"
db_name = "production_db"
results = execute_query_examples(api_key, db_name)

for query_name, result in results.items():
    print(f"\n=== {query_name} ===")
    if 'data' in result:
        for row in result['data'][:3]:  # 只显示前3行
            print(row)
    else:
        print(f"错误: {result.get('error')}")
```

### 批量查询执行
```python
def batch_queries_with_parameters(api_key, db_name):
    """带参数的批量查询"""
    headers = {"Authorization": f"Bearer {api_key}"}
    
    parameterized_queries = [
        {
            "description": "查找特定城市的用户",
            "sql": "SELECT name, email FROM users WHERE city = ?",
            "params": ["北京"],
            "expected_columns": ["name", "email"]
        },
        {
            "description": "价格区间产品查询", 
            "sql": "SELECT product_name, price FROM products WHERE price BETWEEN ? AND ?",
            "params": [100, 500],
            "expected_columns": ["product_name", "price"]
        },
        {
            "description": "最近活跃用户",
            "sql": "SELECT name, last_login FROM users WHERE last_login >= ? ORDER BY last_login DESC",
            "params": ["2024-01-15"],
            "expected_columns": ["name", "last_login"]
        }
    ]
    
    for query in parameterized_queries:
        print(f"\n🔍 {query['description']}")
        
        data = {
            "sql": query["sql"],
            "params": query["params"],
            "type": "select"
        }
        
        response = requests.post(
            f"https://dbapi.muzilix.cn/database/{db_name}/query",
            json=data,
            headers=headers
        )
        
        if response.status_code == 200:
            result = response.json()
            if result.get('success'):
                data = result.get('data', [])
                print(f"找到 {len(data)} 条记录")
                for row in data[:2]:  # 显示前2条
                    print(f"  - {row}")
            else:
                print(f"查询失败: {result.get('error')}")
        else:
            print(f"请求失败: {response.status_code}")

# 执行批量查询
batch_queries_with_parameters("your_api_key", "production_db")
```

## 最佳实践提示

### 1. 查询优化
```sql
-- 使用索引友好的查询
SELECT * FROM users WHERE id = 123;  -- 好的，使用主键
SELECT * FROM users WHERE email = 'test@example.com';  -- 好的，如果有索引

-- 避免全表扫描的查询
SELECT * FROM users WHERE name LIKE '%张%';  -- 避免，无法使用索引
```

### 2. 分页优化
```sql
-- 高效分页（使用索引列）
SELECT * FROM users ORDER BY id LIMIT 20 OFFSET 0;

-- 避免大偏移量分页
SELECT * FROM users ORDER BY id LIMIT 20 OFFSET 10000;  -- 性能差

-- 使用游标分页（推荐）
SELECT * FROM users WHERE id > 10000 ORDER BY id LIMIT 20;
```

### 3. 结果集控制
```sql
-- 始终使用 LIMIT
SELECT * FROM users LIMIT 100;

-- 只选择需要的字段
SELECT id, name, email FROM users;  -- 好的
SELECT * FROM users;  -- 避免，除非确实需要所有字段

-- 使用 COUNT(*) 估算
SELECT COUNT(*) FROM users WHERE created_at >= '2024-01-01';
```

这些示例涵盖了从基础到高级的各种查询场景，您可以根据实际需求进行调整和使用。记得在实际使用时替换表名和字段名为您数据库中的实际名称。