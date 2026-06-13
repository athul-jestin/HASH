// Theme colors
export const colors = {
  light: {
    primary: '#6366f1',
    secondary: '#1e293b',
    accent: '#f59e0b',
    background: '#ffffff',
    foreground: '#1e293b',
    border: '#e2e8f0',
    error: '#ef4444',
    success: '#10b981',
    warning: '#f59e0b',
  },
  dark: {
    primary: '#818cf8',
    secondary: '#f1f5f9',
    accent: '#fbbf24',
    background: '#1e293b',
    foreground: '#f1f5f9',
    border: '#334155',
    error: '#f87171',
    success: '#34d399',
    warning: '#fcd34d',
  },
}

// Common constants
export const ROLES = {
  OWNER: 'OWNER',
  REVIEWER: 'REVIEWER',
  MEMBER: 'MEMBER',
} as const

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
} as const

export const CACHE_TIMES = {
  SHORT: 1000 * 60 * 5, // 5 minutes
  MEDIUM: 1000 * 60 * 30, // 30 minutes
  LONG: 1000 * 60 * 60, // 1 hour
} as const

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  DEFAULT_PAGE_NUMBER: 1,
} as const
