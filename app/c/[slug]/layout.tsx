import { Metadata } from 'next';
import { mockCategories, findCategoryBySlug } from '../../models/category';

interface CategoryLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    slug: string;
  }>;
}

// Generate static paths for all categories at build time
export async function generateStaticParams() {
  // Get all categories (level 1, 2, and 3)
  const categories = mockCategories;
  
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = findCategoryBySlug(slug);
  
  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }

  return {
    title: category.seoTitle || `${category.name} - Shop Now`,
    description: category.seoDescription || category.description || `Shop ${category.name} products`,
    openGraph: {
      title: category.seoTitle || category.name,
      description: category.seoDescription || category.description,
      images: category.imageUrl ? [category.imageUrl] : [],
    },
  };
}

export default function CategoryLayout({ children }: CategoryLayoutProps) {
  return <>{children}</>;
}

// Enable Incremental Static Regeneration
export const revalidate = 3600; // Revalidate every hour
