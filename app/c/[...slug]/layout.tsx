import type { Metadata } from 'next';

interface CategoryLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    slug: string[];
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  
  // Generate basic metadata from slug
  const categoryPath = slug.join(' › ').replace(/-/g, ' ');
  const categoryName = slug[slug.length - 1].replace(/-/g, ' ');
  
  // Create title with proper capitalization
  const title = `${categoryName.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')} - Shop Now`;
  
  const description = `Shop ${categoryName} products. Find the best selection and prices for ${categoryPath}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title,
      description,
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
