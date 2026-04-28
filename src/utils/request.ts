import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'

export interface ApiResponse<T = unknown> {
  code: number
  data: T
  message?: string
  msg?: string
}

type RequestInstance = Omit<
  AxiosInstance,
  'get' | 'post' | 'put' | 'delete' | 'patch'
> & {
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>
  post<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<T>
  put<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<T>
  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>
  patch<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<T>
}

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 10000,
})

service.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }

  return config
})

const handleResponse = (response: AxiosResponse): unknown => {
  const result = response.data as ApiResponse

  if (result.code === 200) {
    return result.data
  }

  return Promise.reject(new Error(result.msg || result.message || '请求失败'))
}

const handleRequestError = (error: AxiosError<ApiResponse>) => {
  const errorMessage = error.response?.data?.msg || error.response?.data?.message || error.message

  return Promise.reject(new Error(errorMessage || '请求失败'))
}

service.interceptors.response.use(
  handleResponse as unknown as Parameters<typeof service.interceptors.response.use>[0],
  handleRequestError,
)

export default service as RequestInstance
