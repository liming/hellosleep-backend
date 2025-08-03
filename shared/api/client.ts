import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse, ApiError, Article, User, AuthResponse, LoginCredentials, RegisterCredentials } from '../types';

// API client configuration
class ApiClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for authentication
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearAuthToken();
          // Redirect to login if needed
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication helpers
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  private setAuthToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('auth_token', token);
  }

  private clearAuthToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('auth_token');
  }

  // Authentication methods
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.client.post('/api/auth/local', credentials);
    this.setAuthToken(response.data.jwt);
    return response.data;
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.client.post('/api/auth/local/register', credentials);
    this.setAuthToken(response.data.jwt);
    return response.data;
  }

  async logout(): Promise<void> {
    this.clearAuthToken();
  }

  async getCurrentUser(): Promise<User> {
    const response: AxiosResponse<User> = await this.client.get('/api/users/me');
    return response.data;
  }

  // Article methods
  async getArticles(params?: {
    page?: number;
    pageSize?: number;
    sort?: string;
    filters?: any;
  }): Promise<ApiResponse<Article[]>> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('pagination[page]', params.page.toString());
    if (params?.pageSize) queryParams.append('pagination[pageSize]', params.pageSize.toString());
    if (params?.sort) queryParams.append('sort', params.sort);
    if (params?.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value) queryParams.append(`filters[${key}]`, value.toString());
      });
    }

    const response: AxiosResponse<ApiResponse<Article[]>> = await this.client.get(
      `/api/articles?${queryParams.toString()}`
    );
    return response.data;
  }

  async getArticle(id: number | string): Promise<ApiResponse<Article>> {
    const response: AxiosResponse<ApiResponse<Article>> = await this.client.get(`/api/articles/${id}`);
    return response.data;
  }

  async getArticleByAltId(altId: string): Promise<ApiResponse<Article>> {
    const response: AxiosResponse<ApiResponse<Article>> = await this.client.get(
      `/api/articles?filters[altId]=${altId}`
    );
    return response.data;
  }

  // Category methods
  async getCategories(): Promise<ApiResponse<any[]>> {
    const response: AxiosResponse<ApiResponse<any[]>> = await this.client.get('/api/categories');
    return response.data;
  }

  // Search methods
  async searchArticles(query: string, filters?: any): Promise<ApiResponse<Article[]>> {
    const queryParams = new URLSearchParams();
    queryParams.append('filters[title][$containsi]', query);
    queryParams.append('filters[excerpt][$containsi]', query);
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(`filters[${key}]`, value.toString());
      });
    }

    const response: AxiosResponse<ApiResponse<Article[]>> = await this.client.get(
      `/api/articles?${queryParams.toString()}`
    );
    return response.data;
  }

  // Assessment methods (placeholder for future implementation)
  async getAssessmentQuestions(): Promise<any[]> {
    // TODO: Implement when assessment content type is created
    throw new Error('Assessment questions not implemented yet');
  }

  async submitAssessment(answers: any[]): Promise<any> {
    // TODO: Implement when assessment results content type is created
    throw new Error('Assessment submission not implemented yet');
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  getBaseURL(): string {
    return this.baseURL;
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient();

// Export the class for testing purposes
export { ApiClient }; 