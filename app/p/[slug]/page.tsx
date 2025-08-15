import { notFound } from 'next/navigation';
import { productService } from '../../lib/product-service';
import { getRelatedProducts, ProductWithVariants } from '../../models/product';
// import { getItemsByProduct } from '../../models/item';
import { findCategoryById, getAllCategories } from '../../models/category';
import { buildProductAttributeData } from '../../utils/productAttributeData';
import { 
  mapProductVariantsToItems, 
  enhanceProductForAttributeSelection, 
  debugDataMapping 
} from '../../utils/dataMapping';
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
  
  try {
    console.log(`Loading product page for slug: ${slug}`);
    
    // Phase 3C: Fetch product with variants AND inventory data
    const productData = await productService.getProductBySlug(slug, true, true); // Include variants + inventory

    if (!productData) {
      console.log(`Product not found for slug: ${slug}`);
      notFound();
    }

    console.log(`Successfully loaded product: ${productData.name}`);

    // Enhanced data mapping for Phase 3: Convert backend data to Item format for AttributeSelector
    const enhancedProduct = enhanceProductForAttributeSelection(productData as ProductWithVariants);
    const items = mapProductVariantsToItems(productData as ProductWithVariants);
    
    // Debug the data mapping
    if (process.env.NODE_ENV === 'development') {
      debugDataMapping(productData as ProductWithVariants, items);
    }

    console.log(`Mapped ${items.length} variants to items for attribute selection`);

    // For now, still use hardcoded functions for categories and related products
    // These will be migrated in future phases as their backend services become available
    const allCategories = getAllCategories();
    const primaryCategory = findCategoryById(enhancedProduct.categoryId);
    const relatedProducts = getRelatedProducts(enhancedProduct.id, enhancedProduct.categoryId);

    // Phase 3: Pre-calculate attribute data at page level using enhanced data
    const attributeData = buildProductAttributeData(enhancedProduct, items);

    // Build breadcrumbs
    const breadcrumbItems = primaryCategory 
      ? buildProductBreadcrumbs(enhancedProduct.name, enhancedProduct.slug, primaryCategory, allCategories)
      : [
          { label: 'Home', href: '/', isActive: false },
          { label: enhancedProduct.name, href: `/p/${enhancedProduct.slug}`, isActive: true }
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
            <ProductInfoMobile product={enhancedProduct} />
            
            {/* 2. Main Product Image */}
            <div className="mt-6">
              <ProductImageGalleryMobile product={enhancedProduct} items={items} />
            </div>
            
            {/* 3. Attributes, Quantity, Add to Cart, Trust Icons, SKU, Weight, Dimensions */}
            <div className="mt-6">
              <EnhancedProductInfoMobileBottom 
                product={enhancedProduct} 
                items={items} 
                attributeData={attributeData}
              />
            </div>
          </div>
          
          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-6 lg:gap-8 mt-4 sm:mt-6">
            {/* Left: Image Gallery */}
            <ProductImageGallery product={enhancedProduct} items={items} />
            
            {/* Right: Product Info */}
            <EnhancedProductInfo 
              product={enhancedProduct} 
              items={items} 
              attributeData={attributeData}
            />
          </div>
          
          {/* Product Details Tabs */}
          <ProductTabs product={enhancedProduct} />
          
          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-12 sm:mt-16">
              <RelatedProducts products={relatedProducts} />
            </div>
          )}
        </div>
      </ProductPageProvider>
    );
  } catch (error) {
    console.error(`Error loading product page for slug ${slug}:`, error);
    notFound();
  }
}

// Enable Incremental Static Regeneration
export const revalidate = 3600; // Revalidate every hour
