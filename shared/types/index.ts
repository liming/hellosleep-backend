// Shared TypeScript types for HelloSleep platform

// API Response types
export interface ApiResponse<T = any> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Article types
export interface Article {
  id: number;
  attributes: {
    title: string;
    excerpt: string;
    body: any[]; // Rich text content from Strapi
    date: string;
    like: number;
    coverUrl?: string;
    altId: string;
    originUrl?: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: string;
  };
}

export interface ArticleListItem {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  like: number;
  coverUrl?: string;
  readingTime?: number;
  category?: string;
}

// User types
export interface User {
  id: number;
  username: string;
  email: string;
  confirmed: boolean;
  blocked: boolean;
  role: {
    id: number;
    name: string;
    description: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  preferences?: {
    theme: 'light' | 'dark';
    notifications: boolean;
    readingLevel: 'beginner' | 'intermediate' | 'advanced';
  };
  readingHistory?: ArticleListItem[];
  bookmarks?: ArticleListItem[];
}

// Assessment types
export interface AssessmentQuestion {
  id: number;
  question: string;
  type: 'multiple-choice' | 'scale' | 'text';
  options?: string[];
  required: boolean;
  category: string;
}

export interface AssessmentAnswer {
  questionId: number;
  answer: string | number;
  category: string;
}

export interface AssessmentResult {
  id: number;
  userId?: number;
  score: number;
  category: string;
  severity: 'mild' | 'moderate' | 'severe';
  recommendations: string[];
  completedAt: string;
  answers: AssessmentAnswer[];
}

// Category types
export interface Category {
  id: number;
  name: string;
  description: string;
  slug: string;
  articles?: ArticleListItem[];
}

// Search and filter types
export interface SearchFilters {
  category?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  readingTime?: 'short' | 'medium' | 'long';
  issues?: string[];
  search?: string;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  sort?: string;
  filters?: SearchFilters;
}

// API Error types
export interface ApiError {
  status: number;
  name: string;
  message: string;
  details?: any;
}

// Authentication types
export interface LoginCredentials {
  identifier: string; // email or username
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  jwt: string;
  user: User;
}

// Component props types
export interface ArticleCardProps {
  article: ArticleListItem;
  variant?: 'default' | 'featured' | 'compact';
}

export interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// Utility types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface LoadingStateData<T> {
  data: T | null;
  loading: LoadingState;
  error: string | null;
} 