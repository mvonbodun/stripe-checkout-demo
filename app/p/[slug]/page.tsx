import { notFound } from 'next/navigation';
import { findProductBySlug, getRelatedProducts } from '../../models/product';
import { getItemsByProduct } from '../../models/item';
import { findCategoryById, getAllCategories } from '../../models/category';
import { buildProductAttributeData } from '../../utils/productAttributeData';
import Breadcrumb from '../../components/Breadcrumb';
import { buildProductBreadcrumbs } from '../../utils/breadcrumbs';
import ProductImageGallery from '../../components/ProductImageGallery';
import ProductImageGalleryMobile from '../../components/ProductImageGalleryMobile';
import ProductInfoMobile from '../../components/ProductInfoMobile';
import EnhancedProductInfo from '../../components/EnhancedProductInfo';
import EnhancedProductInfoMobileBottom from '../../components/EnhancedProductInfoMobileBottom';
import ProductTabs from '../../components/ProductTabs';
import RelatedProducts from '../../components/RelatedProducts';
import { ProductPageProvider } from '../../components/ProductPageContext';

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

  // Load items data for the product
  const items = getItemsByProduct(product.id);

  // Phase 3: Pre-calculate attribute data at page level
  const attributeData = buildProductAttributeData(product, items);

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
    <ProductPageProvider>
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        {/* Breadcrumbs */}
        <Breadcrumb items={breadcrumbItems} className="mb-4 sm:mb-6" />
        
        {/* Mobile-First Layout */}
        <div className="block lg:hidden">
          {/* Mobile Layout: Following specified order */}
          {/* 1. Brand, Product Name, Star Rating & Q&A */}
          <ProductInfoMobile product={product} />
          
          {/* 2. Main Product Image */}
          <div className="mt-6">
            <ProductImageGalleryMobile product={product} items={items} />
          </div>
          
          {/* 3. Attributes, Quantity, Add to Cart, Trust Icons, SKU, Weight, Dimensions */}
          <div className="mt-6">
            <EnhancedProductInfoMobileBottom 
              product={product} 
              items={items} 
              attributeData={attributeData}
            />
          </div>
        </div>
        
        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-6 lg:gap-8 mt-4 sm:mt-6">
          {/* Left: Image Gallery */}
          <ProductImageGallery product={product} items={items} />
          
          {/* Right: Product Info */}
          <EnhancedProductInfo 
            product={product} 
            items={items} 
            attributeData={attributeData}
          />
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
    </ProductPageProvider>
  );
}
