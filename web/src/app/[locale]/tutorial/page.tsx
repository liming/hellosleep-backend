'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { fetchCategories, fetchTutorials, type Category, type Article } from '@/lib/api';

export default function TutorialPage() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [tutorials, setTutorials] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  useEffect(() => {
    console.log('TutorialPage: useEffect triggered');
    
    async function loadData() {
      try {
        console.log('TutorialPage: Starting to load data');
        setLoading(true);
        setError(null);
        
        console.log('TutorialPage: About to fetch categories and tutorials');
        
        // Fetch tutorials first, then try to fetch categories
        const tutorialsResponse = await fetchTutorials();
        console.log('TutorialPage: Tutorials fetched successfully');
        
        let categoriesResponse = null;
        try {
          categoriesResponse = await fetchCategories();
          console.log('TutorialPage: Categories fetched successfully');
        } catch (categoryError) {
          console.log('TutorialPage: Categories fetch failed, continuing without categories');
        }
        
        console.log('TutorialPage: API calls completed');
        console.log('Tutorials response:', tutorialsResponse);
        console.log('Categories response:', categoriesResponse);
        
        // Filter out any null or undefined tutorials
        const validTutorials = tutorialsResponse.data.filter(tutorial => 
          tutorial && tutorial.title
        );
        console.log('Valid tutorials:', validTutorials);
        
        setTutorials(validTutorials);
        if (categoriesResponse) {
          console.log('Setting categories:', categoriesResponse.data);
          // Filter out any null or undefined categories
          const validCategories = categoriesResponse.data.filter(category => 
            category && category.name
          );
          console.log('Valid categories:', validCategories);
          setCategories(validCategories);
        }
      } catch (err) {
        console.error('TutorialPage: Failed to load tutorial data:', err);
        setError('Failed to load tutorials. Please try again later.');
      } finally {
        console.log('TutorialPage: Setting loading to false');
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Filter tutorials by selected category (if categories are available)
  const filteredTutorials = selectedCategory && categories.length > 0
    ? tutorials.filter(tutorial => tutorial.category?.id === selectedCategory)
    : tutorials;

  console.log('TutorialPage: Rendering with', { loading, error, categoriesCount: categories.length, tutorialsCount: tutorials.length });

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
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Try Again
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
            {t('knowledgeBaseTitle')}
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            {t('knowledgeBaseDesc')}
          </p>
        </div>

        {/* Category Navigation - only show if categories are available */}
        {categories.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  selectedCategory === null
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All Categories
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    selectedCategory === category.id
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
        {filteredTutorials.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredTutorials.map((tutorial) => (
              <div key={tutorial.id} className="bg-white rounded-lg shadow-md p-6 border hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {tutorial.title || 'Untitled Tutorial'}
                </h3>
                {tutorial.excerpt && (
                  <p className="text-gray-600 text-sm mb-4">
                    {tutorial.excerpt}
                  </p>
                )}
                <div className="flex items-center text-sm text-gray-500">
                  <span>
                    {tutorial.date 
                      ? new Date(tutorial.date).toLocaleDateString()
                      : 'No date'
                    }
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">
              {selectedCategory 
                ? 'No tutorials found in this category.'
                : 'No tutorials available at the moment.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 