'use client';
import { Product } from '../models/product';

interface AttributeSelectorProps {
  product: Product;
  selectedOptions: Record<string, string>;
  onOptionsChange: (options: Record<string, string>) => void;
}

export default function AttributeSelector({ 
  product, 
  selectedOptions, 
  onOptionsChange 
}: AttributeSelectorProps) {
  // Generate attribute options based on product type and categories
  const getAttributesForProduct = (product: Product) => {
    const attributes: Record<string, string[]> = {};
    
    // Add size options for clothing
    if (product.categoryIds.includes('2')) { // Clothing category
      attributes.Size = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    }
    
    // Add color options for applicable products
    if (product.categoryIds.includes('2') || product.categoryIds.includes('13')) { // Clothing or Mobile
      attributes.Color = ['Black', 'White', 'Gray', 'Blue', 'Red'];
    }
    
    // Add capacity for electronics
    if (product.categoryIds.includes('121') || product.categoryIds.includes('131')) { // Laptops or Smartphones
      attributes.Storage = ['128GB', '256GB', '512GB', '1TB'];
    }
    
    // Add screen size for TVs
    if (product.categoryIds.includes('111') || product.categoryIds.includes('112')) { // OLED TVs or QLED TVs
      attributes['Screen Size'] = ['55"', '65"', '75"', '85"'];
    }
    
    return attributes;
  };

  const attributes = getAttributesForProduct(product);

  if (Object.keys(attributes).length === 0) {
    return null;
  }

  const handleOptionChange = (attributeName: string, value: string) => {
    const newOptions = { ...selectedOptions, [attributeName]: value };
    onOptionsChange(newOptions);
  };

  return (
    <div className="space-y-4">
      {Object.entries(attributes).map(([attributeName, options]) => (
        <div key={attributeName}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {attributeName}
          </label>
          <div className="flex flex-wrap gap-2">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => handleOptionChange(attributeName, option)}
                className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                  selectedOptions[attributeName] === option
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
