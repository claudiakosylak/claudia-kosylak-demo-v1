const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export interface User {
  id: number
  email: string
  first_name: string | null
  last_name: string | null
  role: 'admin' | 'client'
  created_at: string
  updated_at: string
}

export interface LoginResponse {
  user: User
  message: string
}

export interface UsersResponse {
  users: User[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: Response
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  const response = await fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new ApiError(
      errorData.detail || `HTTP error! status: ${response.status}`,
      response.status,
      response
    )
  }

  return response.json()
}

export const authApi = {
  async login(googleToken: string): Promise<LoginResponse> {
    return fetchApi<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ token: googleToken }),
    })
  },

  async logout(): Promise<{ message: string }> {
    return fetchApi<{ message: string }>('/auth/logout', {
      method: 'POST',
    })
  },

  async getCurrentUser(): Promise<User> {
    return fetchApi<User>('/auth/me')
  },
}

export const userApi = {
  async getUser(userId: number): Promise<User> {
    return fetchApi<User>(`/users/${userId}`)
  },

  async updateUser(userId: number, data: { first_name: string; last_name: string }): Promise<User> {
    return fetchApi<User>(`/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },

  async getUsers(params: {
    page?: number
    page_size?: number
    sort_by?: string
    sort_direction?: 'asc' | 'desc'
  } = {}): Promise<UsersResponse> {
    const searchParams = new URLSearchParams()
    
    if (params.page) searchParams.set('page', params.page.toString())
    if (params.page_size) searchParams.set('page_size', params.page_size.toString())
    if (params.sort_by) searchParams.set('sort_by', params.sort_by)
    if (params.sort_direction) searchParams.set('sort_direction', params.sort_direction)

    const query = searchParams.toString()
    return fetchApi<UsersResponse>(`/users${query ? `?${query}` : ''}`)
  },
}

export { ApiError }