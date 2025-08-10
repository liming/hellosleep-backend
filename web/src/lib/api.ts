// API client for Strapi backend
const API_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

// Common headers for API requests
const getHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (API_TOKEN) {
    headers['Authorization'] = `Bearer ${API_TOKEN}`;
  }
  
  console.log('API Token available:', !!API_TOKEN);
  console.log('API Base URL:', API_BASE_URL);
  
  return headers;
};

export interface Article {
  id: number;
  documentId: string;
  title: string;
  excerpt?: string;
  body: any; // Rich text content
  coverUrl?: string;
  date?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  altId: string;
  type: string; // 'tutorial' or 'share'
  originUrl?: string; // Present for shared articles, absent for tutorials
  like?: number;
  category?: Category;
}

export interface Category {
  id: number;
  documentId: string;
  name: string;
  slug?: string;
  key?: string; // UID key for category
  weight: number; // For sorting
  description?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
}

export interface StrapiResponse<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Fetch articles from Strapi
export async function fetchArticles(params?: {
  filters?: Record<string, any>;
  populate?: string;
  sort?: string;
  pagination?: {
    page?: number;
    pageSize?: number;
  };
}): Promise<StrapiResponse<Article>> {
  console.log('fetchArticles called with params:', params);
  
  const searchParams = new URLSearchParams();
  
  if (params?.filters) {
    // Convert filters to the format Strapi expects
    const filters = params.filters;
    Object.keys(filters).forEach(key => {
      const value = filters[key];
      if (typeof value === 'object' && value !== null) {
        // Handle nested filters like { $eq: 'tutorial' }
        Object.keys(value).forEach(operator => {
          searchParams.append(`filters[${key}][${operator}]`, value[operator]);
        });
      } else {
        searchParams.append(`filters[${key}]`, value);
      }
    });
  }
  
  if (params?.populate) {
    searchParams.append('populate', params.populate);
  }
  
  if (params?.sort) {
    searchParams.append('sort', params.sort);
  }
  
  if (params?.pagination) {
    searchParams.append('pagination', JSON.stringify(params.pagination));
  }

  const url = `${API_BASE_URL}/api/articles?${searchParams.toString()}`;
  console.log('Fetching articles from:', url);
  
  const response = await fetch(url, {
    headers: getHeaders(),
  });
  
  console.log('Response status:', response.status);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('API Error:', errorText);
    throw new Error(`Failed to fetch articles: ${response.statusText}`);
  }
  
  return response.json();
}

// Fetch categories from Strapi
export async function fetchCategories(): Promise<StrapiResponse<Category>> {
  console.log('fetchCategories called');
  
  const url = `${API_BASE_URL}/api/categories?sort=weight:asc`;
  console.log('Fetching categories from:', url);
  
  const response = await fetch(url, {
    headers: getHeaders(),
  });
  
  console.log('Categories response status:', response.status);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Categories API Error:', errorText);
    throw new Error(`Failed to fetch categories: ${response.statusText}`);
  }
  
  return response.json();
}

// Fetch tutorials (articles with type 'tutorial')
export async function fetchTutorials(): Promise<StrapiResponse<Article>> {
  console.log('fetchTutorials called');
  return fetchArticles({
    filters: {
      type: {
        $eq: 'tutorial'
      }
    },
    populate: 'category',
    sort: 'date:desc'
  });
}

// Fetch shared articles (articles with type 'share')
export async function fetchSharedArticles(): Promise<StrapiResponse<Article>> {
  console.log('fetchSharedArticles called');
  return fetchArticles({
    filters: {
      type: {
        $eq: 'share'
      }
    },
    populate: 'category',
    sort: 'date:desc'
  });
}

// Fetch tutorials by category
export async function fetchTutorialsByCategory(categoryId: number): Promise<StrapiResponse<Article>> {
  console.log('fetchTutorialsByCategory called with categoryId:', categoryId);
  return fetchArticles({
    filters: {
      type: {
        $eq: 'tutorial'
      },
      category: {
        id: {
          $eq: categoryId
        }
      }
    },
    populate: 'category',
    sort: 'date:desc'
  });
}

// Fetch tutorials by category key
export async function fetchTutorialsByCategoryKey(categoryKey: string): Promise<StrapiResponse<Article>> {
  console.log('fetchTutorialsByCategoryKey called with categoryKey:', categoryKey);
  return fetchArticles({
    filters: {
      type: {
        $eq: 'tutorial'
      },
      category: {
        key: {
          $eq: categoryKey
        }
      }
    },
    populate: 'category',
    sort: 'date:desc'
  });
} 