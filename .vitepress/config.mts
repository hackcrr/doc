import { defineConfig } from 'vitepress'
// 定义基础 URL 常量

export default defineConfig({
  title: '数据库管理 API',
  description: '专业的 MySQL 数据库管理接口文档',
  sitemap: {
    hostname: 'https://doc.muzilix.cn'
  },
  // 主题配置
  themeConfig: {
    // 网站logo和标题
    logo: 'https://pic.muzilix.cn/i/2025/12/02/692ed2b0d5541.png',
    siteTitle: '数据库 API',
    
    // 导航栏
    nav: [
      { text: '首页', link: '/' },
      { 
        text: '使用指南', 
        items: [
          { text: '快速开始', link: '/guide/quick-start' },
          { text: '认证与权限', link: '/guide/authentication' },
          { text: '安全指南', link: '/guide/security' },
          { text: '最佳实践', link: '/guide/best-practices' }
        ]
      },
      { text: 'API参考', link: '/api' },
      { 
        text: '更多', 
        items: [
          { text: '使用示例', link: '/examples/query-examples' },
          { text: '参考手册', link: '/reference/' }
        ]
      }
    ],

    // 侧边栏
    sidebar: {
      // 指南侧边栏
      '/guide/': [
        {
          text: '使用指南',
          collapsed: false,
          items: [
            { text: '快速开始', link: '/guide/quick-start' },
            { text: '认证与权限', link: '/guide/authentication' },
            { text: '安全指南', link: '/guide/security' },
            { text: '最佳实践', link: '/guide/best-practices' }
          ]
        }
      ],

      // API 侧边栏
      '/api/': [
        {
          text: 'API 总览',
          link: '/api/'
        },
        {
          text: '健康检查',
          collapsed: true,
          items: [
            { text: '健康检查', link: '/api/health/health-check' }
          ]
        },
        {
          text: '数据库管理',
          collapsed: true,
          items: [
            { text: '总览', link: '/api/database-management/' },
            { text: '创建数据库', link: '/api/database-management/create-database' },
            { text: '列出数据库', link: '/api/database-management/list-databases' },
            { text: '删除数据库', link: '/api/database-management/delete-database' },
            { text: '数据库信息', link: '/api/database-management/database-info' }
            // { text: '调试数据库', link: '/api/database-management/debug-database' }
          ]
        },
        {
          text: '表操作',
          collapsed: true,
          items: [
            { text: '总览', link: '/api/table-operations/' },
            { text: '列出表', link: '/api/table-operations/list-tables' },
            { text: '创建表', link: '/api/table-operations/create-table' },
            { text: '表结构', link: '/api/table-operations/table-structure' }
          ]
        },
        {
          text: '数据操作',
          collapsed: true,
          items: [
            { text: '总览', link: '/api/data-operations/' },
            { text: '插入数据', link: '/api/data-operations/insert-data' },
            { text: '查询数据', link: '/api/data-operations/query-data' },
            { text: '执行SQL', link: '/api/data-operations/execute-query' },
            { text: '表信息', link: '/api/data-operations/query-table-info' }
          ]
        },
        {
          text: '批量操作',
          collapsed: true,
          items: [
            { text: '总览', link: '/api/batch-operations/' },
            { text: '批量更新', link: '/api/batch-operations/batch-update' },
            { text: '批量删除', link: '/api/batch-operations/batch-delete' },
            { text: '导出数据', link: '/api/batch-operations/export-data' },
            { text: '导入数据', link: '/api/batch-operations/import-data' },
            { text: '下载导出', link: '/api/batch-operations/download-export' }
          ]
        },
        {
          text: '备份恢复',
          collapsed: true,
          items: [
            { text: '总览', link: '/api/backup-recovery/' },
            { text: '创建备份', link: '/api/backup-recovery/backup-database' },
            { text: '备份列表', link: '/api/backup-recovery/list-backups' },
            { text: '下载备份', link: '/api/backup-recovery/download-backup' },
            { text: '删除备份', link: '/api/backup-recovery/delete-backup' },
            { text: '备份状态', link: '/api/backup-recovery/backup-status' },
            { text: '自动备份', link: '/api/backup-recovery/auto-backup' }
          ]
        },
        {
          text: '监控统计',
          collapsed: true,
          items: [
            { text: '总览', link: '/api/monitoring-stats/' },
            { text: '数据库统计', link: '/api/monitoring-stats/database-stats' },
            { text: '性能统计', link: '/api/monitoring-stats/performance-stats' },
            { text: '查询分析', link: '/api/monitoring-stats/query-analysis' },
            { text: 'API使用统计', link: '/api/monitoring-stats/api-usage-stats' },
            { text: '系统统计', link: '/api/monitoring-stats/system-stats' },
            { text: '统计摘要', link: '/api/monitoring-stats/stats-summary' }
          ]
        },
        {
          text: '用户管理',
          collapsed: true,
          items: [
            { text: '总览', link: '/api/user-management/' },
            { text: '用户登录', link: '/api/user-management/auth-login' },
            { text: '用户登出', link: '/api/user-management/auth-logout' },
            { text: '用户注册', link: '/api/user-management/auth-register' },
            { text: '用户信息', link: '/api/user-management/auth-profile' },
            { text: '更改密码', link: '/api/user-management/change-password' },
            { text: '管理员功能', link: '/api/user-management/admin-users' },
            { text: '管理员API管理', link: '/api/user-management/admin-api-keys' }
          ]
        },
        {
          text: 'AI 增强 (Beta)',
          collapsed: true,
          items: [
            { text: 'AI 路由 (Beta)', link: '/api/ai-beta/ai-router' },
            { text: 'AI 执行 (Beta)', link: '/api/ai-beta/ai-execute' },
            { text: '自然语言执行 (Beta)', link: '/api/ai-beta/ai-nl-execute' },
            { text: 'AI 接口说明导出 (Beta)', link: '/api/ai-beta/ai-endpoints' }
          ]
        }
      ],

      // 示例侧边栏
      '/examples/': [
        {
          text: '使用示例',
          items: [
            { text: '示例总览', link: '/examples/' },
            { text: '基础使用', link: '/examples/basic-usage' },
            { text: '高级查询', link: '/examples/advanced-queries' },
            { text: '备份策略', link: '/examples/backup-strategies' }
          ]
        }
      ],

      // 参考手册侧边栏
      '/reference/': [
        {
          text: '参考手册',
          items: [
            { text: '手册总览', link: '/reference/' },
            { text: '错误码参考', link: '/reference/error-codes' },
            { text: '权限矩阵', link: '/reference/permission-matrix' },
            { text: 'SQL 指南', link: '/reference/sql-guide' },
            { text: 'API 限制', link: '/reference/api-limits' }
          ]
        }
      ]
    },
    
    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/hackcrr/doc' }
    ],

    // 页脚
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025 数据库管理 API'
    },

    // 搜索
    search: {
      provider: 'local'
    },

    // 最后更新时间
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    },

    // 编辑链接
    editLink: {
      pattern: 'https://github.com/hackcrr/doc:path',
      text: '在 GitHub 上编辑此页面'
    },

    // 文档底部导航
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    // 大纲配置
    outline: {
      level: [2, 3],
      label: '本页目录'
    }
  },

  // Markdown 配置
  markdown: {
    theme: 'material-theme-palenight',
    lineNumbers: true
  },

  // 最后更新时间
  lastUpdated: true,

  // 清理 URL
  cleanUrls: true,

  // 头部配置
  head: [
    ['meta', { name: 'theme-color', content: '#3c8772' }],
    ['meta', { name: 'keywords', content: '数据库,API,MySQL,管理接口,文档' }],
    ['link', { rel: 'icon', href: 'https://pic.muzilix.cn/i/2025/12/02/692ed2b0d5541.png' }]
  ],

  // 开发服务器配置
  vite: {
    server: {
      port: 3000,
      host: true
    }
  }
})
