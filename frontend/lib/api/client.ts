import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export interface ApiError {
  message: string
  code?: string
  status: number
}

export interface ApiResponse<T> {
  data: T
  success: boolean
}

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      withCredentials: true,
    })

    this.setupInterceptors()
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      (config) => {
        if (typeof window !== "undefined") {
          const token = document.cookie
            .split("; ")
            .find((row) => row.startsWith("auth_token="))
            ?.split("=")[1]

          if (token) {
            config.headers.Authorization = `Bearer ${token}`
          }
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError<{ message?: string }>) => {
        const apiError: ApiError = {
          message: error.response?.data?.message || error.message || "An error occurred",
          status: error.response?.status || 500,
          code: error.code,
        }
        return Promise.reject(apiError)
      }
    )
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config)
    return response.data
  }

  public async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config)
    return response.data
  }

  public async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config)
    return response.data
  }

  public async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config)
    return response.data
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config)
    return response.data
  }

  public getInstance(): AxiosInstance {
    return this.client
  }
}

export const apiClient = new ApiClient()
