'use client';

import { use, useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { useCategories } from '../../categories-context';
import { parseCategorySlug, findCategoryBySlugPath } from '../../utils/category-lookup';
import CategorySearchInterface from '../../components/search/CategorySearchInterface';
import { CategoryTree } from '../../models/category';

interface CategoryPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = use(params);
  const { categories, isLoading } = useCategories();
  const [category, setCategory] = useState<CategoryTree | null>(null);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (isLoading || !categories) {
      return;
    }

    try {
      // Parse the slug array into category path components
      const slugPath = parseCategorySlug(slug.join('/'));
      
      // Find the category using the backend service data
      const foundCategory = findCategoryBySlugPath(slugPath, categories);
      
      if (!foundCategory) {
        console.warn('Category not found for slug path:', slugPath);
        notFound();
        return;
      }

      console.log('Found category:', foundCategory.name, 'Path:', foundCategory.path);
      setCategory(foundCategory);
    } catch (error) {
      console.error('Error finding category:', error);
      notFound();
    } finally {
      setPageLoading(false);
    }
  }, [slug, categories, isLoading]);

  // Show loading state while fetching categories or parsing slug
  if (isLoading || pageLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading category...</p>
        </div>
      </div>
    );
  }

  // Category not found after loading completed
  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CategorySearchInterface 
        category={category}
        showCategoryHeader={true}
        showSubcategoryFacets={true}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      />
    </div>
  );
}
