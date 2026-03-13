export interface ApiError {
  message: string
  code?: string
  status: number
}

export interface ApiResponse<T> {
  data: T
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total_count: number
  page?: number
  per_page?: number
}
