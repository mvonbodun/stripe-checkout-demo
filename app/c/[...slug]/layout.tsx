import { Metadata } from 'next';
import { CategoryTree } from '../../models/category';
import { parseCategorySlug, findCategoryBySlugPath } from '../../utils/category-lookup';

interface CategoryLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    slug: string[];
  }>;
}

// This will be called server-side to generate metadata
async function getCategoryFromSlug(slug: string[]): Promise<CategoryTree | null> {
  try {
    // For metadata generation, we'll need to fetch categories server-side
    // This is a simplified version - in production you might want to cache this
    const response = await fetch(`${process.env.NATS_URL || 'http://localhost:4222'}/api/categories`, {
      cache: 'force-cache',
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      console.warn('Failed to fetch categories for metadata generation');
      return null;
    }
    
    const categories = await response.json();
    const slugPath = parseCategorySlug(slug.join('/'));
    return findCategoryBySlugPath(slugPath, categories);
  } catch (error) {
    console.error('Error fetching category for metadata:', error);
    return null;
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  
  // For metadata, we'll try to get category info
  // If this fails, we'll provide fallback metadata
  const category = await getCategoryFromSlug(slug);
  
  if (!category) {
    // Fallback metadata for unknown categories
    const categoryPath = slug.join(' › ').replace(/-/g, ' ');
    return {
      title: `${categoryPath} - Category Not Found`,
      description: 'The requested category could not be found.',
      robots: 'noindex, nofollow',
    };
  }

  // Generate SEO-friendly metadata from category data
  const title = category.seoTitle || `${category.name} - Shop Now`;
  const description = category.seoDescription || 
    category.description || 
    `Shop ${category.name} products. Find the best selection and prices.`;

  return {
    title,
    description,
    openGraph: {
      title: category.seoTitle || category.name,
      description: category.seoDescription || category.description,
      type: 'website',
      images: category.imageUrl ? [
        {
          url: category.imageUrl,
          alt: category.name,
        }
      ] : [],
    },
    twitter: {
      card: 'summary',
      title: category.seoTitle || category.name,
      description: category.seoDescription || category.description,
      images: category.imageUrl ? [category.imageUrl] : [],
    },
    alternates: {
      canonical: `/c/${slug.join('/')}`,
    },
  };
}

export default function CategoryLayout({ children }: CategoryLayoutProps) {
  return <>{children}</>;
}

// Enable Incremental Static Regeneration
export const revalidate = 3600; // Revalidate every hour
