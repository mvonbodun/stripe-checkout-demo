import { Metadata } from 'next';
import { productService } from '../../lib/product-service';

interface ProductLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    slug: string;
  }>;
}

// Generate static paths for all products at build time
export async function generateStaticParams() {
  try {
    console.log('Generating static params for product pages...');
    
    // Get all product slugs from backend service (with fallback)
    const slugs = await productService.getAllProductSlugs();
    
    console.log(`Generated ${slugs.length} static params for product pages`);
    
    return slugs.map((slug) => ({
      slug,
    }));
  } catch (error) {
    console.error('Error generating static params for products:', error);
    
    // Fallback to empty array to prevent build failure
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    console.log(`Generating metadata for product: ${slug}`);
    
    const product = await productService.getProductBySlug(slug, false);
    
    if (!product) {
      return {
        title: 'Product Not Found',
        description: 'The requested product could not be found.',
      };
    }

    const images = product.images.length > 0 
      ? product.images.map(img => img.url) 
      : [`https://placehold.co/600x600/e5e7eb/6b7280?text=${encodeURIComponent(product.name)}`];

    return {
      title: product.seoTitle || `${product.name} - ${product.brand || 'Shop'}`,
      description: product.seoDescription || product.shortDescription || product.description,
      keywords: product.seoKeywords?.join(', '),
      openGraph: {
        title: product.name,
        description: product.shortDescription || product.description,
        images,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: product.name,
        description: product.shortDescription || product.description,
        images,
      },
    };
  } catch (error) {
    console.error(`Error generating metadata for product ${slug}:`, error);
    
    return {
      title: 'Product',
      description: 'Product page',
    };
  }
}

export default function ProductLayout({ children }: ProductLayoutProps) {
  return <>{children}</>;
}

// Enable Incremental Static Regeneration
export const revalidate = 3600; // Revalidate every hour
