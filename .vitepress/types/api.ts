// API 相关类型定义
export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  path: string
  description?: string
  requiresAuth?: boolean
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// 预定义的 API 端点
export const API_ENDPOINTS = {
  // ==================== 健康检查 ====================
  HEALTH: { method: 'GET', path: '/health' } as ApiEndpoint,
  
  // ==================== 用户认证 ====================
  REGISTER: { method: 'POST', path: '/auth/register' } as ApiEndpoint,
  LOGIN: { method: 'POST', path: '/auth/login' } as ApiEndpoint,
  LOGOUT: { method: 'POST', path: '/auth/logout', requiresAuth: true } as ApiEndpoint,
  GET_PROFILE: { method: 'GET', path: '/auth/profile', requiresAuth: true } as ApiEndpoint,
  CHANGE_PASSWORD: { method: 'POST', path: '/auth/change-password', requiresAuth: true } as ApiEndpoint,
  
  // ==================== 数据库管理 ====================
  CREATE_DATABASE: { method: 'POST', path: '/create', requiresAuth: true } as ApiEndpoint,
  LIST_DATABASES: { method: 'GET', path: '/databases', requiresAuth: true } as ApiEndpoint,
  DELETE_DATABASE: { method: 'DELETE', path: '/database/{db_name}', requiresAuth: true } as ApiEndpoint,
  GET_DATABASE_INFO: { method: 'GET', path: '/database/{db_name}/info', requiresAuth: true } as ApiEndpoint,
  DEBUG_DATABASE_INFO: { method: 'GET', path: '/debug/database/{db_name}', requiresAuth: true } as ApiEndpoint,
  
  // ==================== 表管理 ====================
  LIST_TABLES: { method: 'GET', path: '/database/{db_name}/tables', requiresAuth: true } as ApiEndpoint,
  CREATE_TABLE: { method: 'POST', path: '/database/{db_name}/table', requiresAuth: true } as ApiEndpoint,
  GET_TABLE_STRUCTURE: { method: 'GET', path: '/database/{db_name}/table/{table_name}/structure', requiresAuth: true } as ApiEndpoint,
  
  // ==================== 数据操作 ====================
  INSERT_DATA: { method: 'POST', path: '/database/{db_name}/table/{table_name}/data', requiresAuth: true } as ApiEndpoint,
  QUERY_DATA: { method: 'GET', path: '/database/{db_name}/table/{table_name}/data', requiresAuth: true } as ApiEndpoint,
  EXECUTE_QUERY: { method: 'POST', path: '/database/{db_name}/query', requiresAuth: true } as ApiEndpoint,
  GET_TABLES_INFO: { method: 'GET', path: '/database/{db_name}/tables-info', requiresAuth: true } as ApiEndpoint,
  GET_QUERY_EXAMPLES: { method: 'GET', path: '/database/{db_name}/query-examples', requiresAuth: true } as ApiEndpoint,
  
  // ==================== 批量操作 ====================
  BATCH_UPDATE: { method: 'POST', path: '/database/{db_name}/batch/update', requiresAuth: true } as ApiEndpoint,
  BATCH_DELETE: { method: 'POST', path: '/database/{db_name}/batch/delete', requiresAuth: true } as ApiEndpoint,
  EXPORT_DATA: { method: 'POST', path: '/database/{db_name}/export', requiresAuth: true } as ApiEndpoint,
  IMPORT_DATA: { method: 'POST', path: '/database/{db_name}/import', requiresAuth: true } as ApiEndpoint,
  DOWNLOAD_EXPORT: { method: 'GET', path: '/download/export/{filename}', requiresAuth: true } as ApiEndpoint,
  
  // ==================== 备份恢复 ====================
  BACKUP_DATABASE: { method: 'POST', path: '/database/{db_name}/backup', requiresAuth: true } as ApiEndpoint,
  LIST_BACKUPS: { method: 'GET', path: '/database/{db_name}/backups', requiresAuth: true } as ApiEndpoint,
  DOWNLOAD_BACKUP: { method: 'GET', path: '/backup/{filename}', requiresAuth: true } as ApiEndpoint,
  DELETE_BACKUP: { method: 'DELETE', path: '/backup/{filename}', requiresAuth: true } as ApiEndpoint,
  ENABLE_AUTO_BACKUP: { method: 'POST', path: '/database/{db_name}/backup/auto', requiresAuth: true } as ApiEndpoint,
  GET_BACKUP_STATUS: { method: 'GET', path: '/database/{db_name}/backup/{backup_id}/status', requiresAuth: true } as ApiEndpoint,
  GET_BACKUP_TASKS: { method: 'GET', path: '/database/{db_name}/backup/tasks', requiresAuth: true } as ApiEndpoint,
  
  // ==================== 监控统计 ====================
  GET_DATABASE_STATS: { method: 'GET', path: '/stats/database', requiresAuth: true } as ApiEndpoint,
  GET_DATABASE_DETAILED_STATS: { method: 'GET', path: '/stats/database/{db_name}', requiresAuth: true } as ApiEndpoint,
  GET_PERFORMANCE_STATS: { method: 'GET', path: '/stats/performance', requiresAuth: true } as ApiEndpoint,
  GET_QUERY_ANALYSIS: { method: 'GET', path: '/stats/query-analysis', requiresAuth: true } as ApiEndpoint,
  GET_API_USAGE_STATS: { method: 'GET', path: '/stats/api-usage', requiresAuth: true } as ApiEndpoint,
  GET_SYSTEM_STATS: { method: 'GET', path: '/stats/system', requiresAuth: true } as ApiEndpoint,
  GET_STATS_SUMMARY: { method: 'GET', path: '/stats/summary', requiresAuth: true } as ApiEndpoint,
  
  // ==================== 用户管理 (管理员) ====================
  CREATE_USER: { method: 'POST', path: '/admin/users', requiresAuth: true } as ApiEndpoint,
  LIST_USERS: { method: 'GET', path: '/admin/users', requiresAuth: true } as ApiEndpoint,
  UPDATE_USER: { method: 'PUT', path: '/admin/users/{user_id}', requiresAuth: true } as ApiEndpoint,
  DELETE_USER: { method: 'DELETE', path: '/admin/users/{user_id}', requiresAuth: true } as ApiEndpoint,
  LIST_API_KEYS: { method: 'GET', path: '/admin/api-keys', requiresAuth: true } as ApiEndpoint,
  REVOKE_API_KEY: { method: 'POST', path: '/admin/api-keys/{api_key}/revoke', requiresAuth: true } as ApiEndpoint,
  LIST_USER_API_KEYS: { method: 'GET', path: '/admin/api-keys/{user_id}', requiresAuth: true } as ApiEndpoint,
  SEARCH_USERS: { method: 'GET', path: '/admin/users/search', requiresAuth: true } as ApiEndpoint,
  GRANT_DATABASE_PERMISSION: { method: 'POST', path: '/admin/database-permissions', requiresAuth: true } as ApiEndpoint,
  GET_SYSTEM_STATS_ADMIN: { method: 'GET', path: '/admin/system-stats', requiresAuth: true } as ApiEndpoint,
  RESET_USER_PASSWORD: { method: 'POST', path: '/admin/users/{user_id}/reset-password', requiresAuth: true } as ApiEndpoint,
  
  // ==================== 用户个人 ====================
  GET_MY_DATABASES: { method: 'GET', path: '/user/databases', requiresAuth: true } as ApiEndpoint,
  
  // ==================== AI 增强 (Beta) ====================
  AI_ROUTER: { method: 'POST', path: '/ai/router', requiresAuth: true } as ApiEndpoint,
  AI_EXECUTE: { method: 'POST', path: '/ai/execute', requiresAuth: true } as ApiEndpoint,
  AI_NL_EXECUTE: { method: 'POST', path: '/ai/nl-execute', requiresAuth: true } as ApiEndpoint,
  AI_LIST_ENDPOINTS: { method: 'GET', path: '/ai/endpoints', requiresAuth: true } as ApiEndpoint,
  
} as const;