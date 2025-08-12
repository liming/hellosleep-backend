'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import { fetchCategories, fetchTutorialsByCategoryKey, type Category, type Article } from '@/lib/api';

export default function TutorialCategoryPage() {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const categoryKey = params.category as string;
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [tutorials, setTutorials] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);

  useEffect(() => {
    console.log('TutorialCategoryPage: useEffect triggered with categoryKey:', categoryKey);
    
    async function loadData() {
      try {
        console.log('TutorialCategoryPage: Starting to load data');
        setLoading(true);
        setError(null);
        
        // Fetch categories first to validate the category key
        const categoriesResponse = await fetchCategories();
        console.log('TutorialCategoryPage: Categories fetched successfully');
        
        const validCategories = categoriesResponse.data.filter(category => 
          category && category.name
        );
        setCategories(validCategories);
        
        // Find the current category by key
        const category = validCategories.find(cat => cat.key === categoryKey);
        if (!category) {
          console.error('TutorialCategoryPage: Category not found for key:', categoryKey);
          setError('Category not found');
          setLoading(false);
          return;
        }
        
        setCurrentCategory(category);
        console.log('TutorialCategoryPage: Found category:', category);
        
        // Fetch tutorials for this category
        const tutorialsResponse = await fetchTutorialsByCategoryKey(categoryKey);
        console.log('TutorialCategoryPage: Tutorials fetched successfully');
        
        const validTutorials = tutorialsResponse.data.filter(tutorial => 
          tutorial && tutorial.title
        );
        console.log('TutorialCategoryPage: Valid tutorials:', validTutorials);
        
        setTutorials(validTutorials);
      } catch (err) {
        console.error('TutorialCategoryPage: Failed to load tutorial data:', err);
        setError('Failed to load tutorials. Please try again later.');
      } finally {
        console.log('TutorialCategoryPage: Setting loading to false');
        setLoading(false);
      }
    }

    loadData();
  }, [categoryKey]);

  const handleCategoryClick = (category: Category | null) => {
    if (category) {
      router.push(`/tutorial/${category.key}`);
    } else {
      router.push('/tutorial');
    }
  };

  console.log('TutorialCategoryPage: Rendering with', { 
    loading, 
    error, 
    categoryKey, 
    currentCategory, 
    categoriesCount: categories.length, 
    tutorialsCount: tutorials.length 
  });

  if (loading) {
    return (
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading tutorials...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-brand-text-dark mb-2">Error Loading Tutorials</h2>
            <p className="text-gray-600">{error}</p>
            <button 
              onClick={() => router.push('/tutorial')}
              className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Back to Tutorials
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-brand-text-dark sm:text-5xl">
            {currentCategory?.name || 'Tutorials'}
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            {currentCategory?.description || t('knowledgeBaseDesc')}
          </p>
        </div>

        {/* Category Navigation */}
        {categories.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => handleCategoryClick(null)}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  !currentCategory
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All Categories
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category)}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    currentCategory?.id === category.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category.name || 'Unnamed Category'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tutorials Grid */}
        {tutorials.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {tutorials.map((tutorial) => (
              <div key={tutorial.id} className="bg-white rounded-lg shadow-md p-6 border hover:shadow-lg transition-shadow">
                <a 
                  href={`/article/${tutorial.documentId}`}
                  className="block hover:no-underline"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 hover:text-brand-primary transition-colors">
                    {tutorial.title || 'Untitled Tutorial'}
                  </h3>
                  {tutorial.excerpt && (
                    <p className="text-gray-600 text-sm">
                      {tutorial.excerpt}
                    </p>
                  )}
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">
              No tutorials found in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 