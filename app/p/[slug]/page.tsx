import { notFound } from 'next/navigation';
import { findProductBySlug, getRelatedProducts } from '../../models/product';
import { findCategoryById, getAllCategories } from '../../models/category';
import Breadcrumb from '../../components/Breadcrumb';
import { buildProductBreadcrumbs } from '../../utils/breadcrumbs';
import ProductImageGallery from '../../components/ProductImageGallery';
import ProductInfo from '../../components/ProductInfo';
import ProductTabs from '../../components/ProductTabs';
import RelatedProducts from '../../components/RelatedProducts';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = findProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Get category and breadcrumb data
  const allCategories = getAllCategories();
  const primaryCategory = findCategoryById(product.categoryId);
  const relatedProducts = getRelatedProducts(product.id, product.categoryId);

  // Build breadcrumbs
  const breadcrumbItems = primaryCategory 
    ? buildProductBreadcrumbs(product.name, product.slug, primaryCategory, allCategories)
    : [
        { label: 'Home', href: '/', isActive: false },
        { label: product.name, href: `/p/${product.slug}`, isActive: true }
      ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
      {/* Breadcrumbs */}
      <Breadcrumb items={breadcrumbItems} className="mb-4 sm:mb-6" />
      
      {/* Product Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mt-4 sm:mt-6">
        {/* Left: Image Gallery */}
        <ProductImageGallery product={product} />
        
        {/* Right: Product Info */}
        <ProductInfo product={product} />
      </div>
      
      {/* Product Details Tabs */}
      <ProductTabs product={product} />
      
      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-12 sm:mt-16">
          <RelatedProducts products={relatedProducts} />
        </div>
      )}
    </div>
  );
}
