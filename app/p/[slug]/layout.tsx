import { Metadata } from 'next';
import { mockProducts, findProductBySlug } from '../../models/product';

interface ProductLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    slug: string;
  }>;
}

// Generate static paths for all products at build time
export async function generateStaticParams() {
  // Get all products
  const products = mockProducts;
  
  return products.map((product) => ({
    slug: product.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = findProductBySlug(slug);
  
  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: product.seoTitle || `${product.name} - ${product.brand || 'Shop'}`,
    description: product.seoDescription || product.shortDescription || product.description,
    openGraph: {
      title: product.name,
      description: product.shortDescription || product.description,
      images: product.images.length > 0 ? product.images.map(img => img.url) : [`https://placehold.co/600x600/e5e7eb/6b7280?text=${encodeURIComponent(product.name)}`],
    },
  };
}

export default function ProductLayout({ children }: ProductLayoutProps) {
  return <>{children}</>;
}

// Enable Incremental Static Regeneration
export const revalidate = 3600; // Revalidate every hour
