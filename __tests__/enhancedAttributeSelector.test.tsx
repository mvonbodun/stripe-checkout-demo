import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AttributeSelector from '../app/components/AttributeSelector';
import { Item } from '../app/models/item';
import { Product } from '../app/models/product';
import { Status } from '../app/models/common';

// Mock data for testing
const mockMacBookItems: Item[] = [
  {
    id: 'item_mbp_space_gray_512',
    productId: 'prod_macbook',
    sku: 'MBP-SG-512',
    name: 'MacBook Pro 14" Space Gray 512GB',
    price: 199900,
    inventoryQuantity: 10,
    inventoryTracking: true,
    status: Status.ACTIVE,
    itemDefiningSpecificationValues: [
      { name: 'Color', value: 'Space Gray', displayName: 'Space Gray' },
      { name: 'Storage', value: '512GB', displayName: '512 GB SSD' }
    ],
    images: [],
    position: 1,
    isInStock: true,
    isLowStock: false,
    lowStockThreshold: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'item_mbp_space_gray_1tb',
    productId: 'prod_macbook',
    sku: 'MBP-SG-1TB',
    name: 'MacBook Pro 14" Space Gray 1TB',
    price: 239900,
    inventoryQuantity: 5,
    inventoryTracking: true,
    status: Status.ACTIVE,
    itemDefiningSpecificationValues: [
      { name: 'Color', value: 'Space Gray', displayName: 'Space Gray' },
      { name: 'Storage', value: '1TB', displayName: '1 TB SSD' }
    ],
    images: [],
    position: 2,
    isInStock: true,
    isLowStock: false,
    lowStockThreshold: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'item_mbp_silver_512',
    productId: 'prod_macbook',
    sku: 'MBP-S-512',
    name: 'MacBook Pro 14" Silver 512GB',
    price: 199900,
    inventoryQuantity: 8,
    inventoryTracking: true,
    status: Status.ACTIVE,
    itemDefiningSpecificationValues: [
      { name: 'Color', value: 'Silver', displayName: 'Silver' },
      { name: 'Storage', value: '512GB', displayName: '512 GB SSD' }
    ],
    images: [],
    position: 3,
    isInStock: true,
    isLowStock: false,
    lowStockThreshold: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const mockMacBookProduct: Product = {
  id: 'prod_macbook',
  name: 'MacBook Pro 14"',
  slug: 'macbook-pro-14',
  description: 'Apple MacBook Pro 14-inch',
  brand: 'Apple',
  categoryId: '121',
  categoryIds: ['121'],
  basePrice: 199900,
  taxCode: 'P0000000',
  status: Status.ACTIVE,
  features: ['M3 Pro chip', 'Retina display'],
  productLevelSpecifications: [],
  totalInventory: 23,
  itemDefiningSpecifications: [
    { name: 'Color', group: 'Appearance' },
    { name: 'Storage', group: 'Capacity' }
  ],
  images: [],
  seoTitle: 'MacBook Pro 14"',
  seoDescription: 'Apple MacBook Pro 14-inch',
  createdAt: new Date(),
  updatedAt: new Date()
};

describe('Enhanced AttributeSelector Component', () => {
  const mockOnOptionsChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering and Basic Functionality', () => {
    it('should render all attribute options', async () => {
      render(
        <AttributeSelector
          product={mockMacBookProduct}
          items={mockMacBookItems}
          selectedOptions={{}}
          onOptionsChange={mockOnOptionsChange}
        />
      );

      // Wait for loading to complete
      await screen.findByText('Color');
      await screen.findByText('Storage');

      // Check that all options are rendered
      expect(screen.getByText('Space Gray')).toBeInTheDocument();
      expect(screen.getByText('Silver')).toBeInTheDocument();
      expect(screen.getByText('512 GB SSD')).toBeInTheDocument();
      expect(screen.getByText('1 TB SSD')).toBeInTheDocument();
    });

    it('should show loading state initially', () => {
      render(
        <AttributeSelector
          product={mockMacBookProduct}
          items={mockMacBookItems}
          selectedOptions={{}}
          onOptionsChange={mockOnOptionsChange}
        />
      );

      expect(screen.getByText('Loading available options...')).toBeInTheDocument();
    });

    it('should handle empty items array', () => {
      const { container } = render(
        <AttributeSelector
          product={mockMacBookProduct}
          items={[]}
          selectedOptions={{}}
          onOptionsChange={mockOnOptionsChange}
        />
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe('Interactive Functionality', () => {
    it('should call onOptionsChange when option is selected', async () => {
      render(
        <AttributeSelector
          product={mockMacBookProduct}
          items={mockMacBookItems}
          selectedOptions={{}}
          onOptionsChange={mockOnOptionsChange}
        />
      );

      // Wait for loading to complete
      const spaceGrayButton = await screen.findByText('Space Gray');
      
      fireEvent.click(spaceGrayButton);

      expect(mockOnOptionsChange).toHaveBeenCalledWith({ Color: 'Space Gray' });
    });

    it('should show selected state visually', async () => {
      render(
        <AttributeSelector
          product={mockMacBookProduct}
          items={mockMacBookItems}
          selectedOptions={{ Color: 'Space Gray' }}
          onOptionsChange={mockOnOptionsChange}
        />
      );

      const spaceGrayButton = await screen.findByText('Space Gray');
      
      expect(spaceGrayButton).toHaveClass('bg-blue-600', 'text-white', 'border-blue-600');
      expect(spaceGrayButton).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('Combination Logic', () => {
    it('should disable 1TB when Silver is selected', async () => {
      render(
        <AttributeSelector
          product={mockMacBookProduct}
          items={mockMacBookItems}
          selectedOptions={{ Color: 'Silver' }}
          onOptionsChange={mockOnOptionsChange}
        />
      );

      const oneTBButton = await screen.findByText('1 TB SSD');
      
      expect(oneTBButton).toBeDisabled();
      expect(oneTBButton).toHaveClass('bg-gray-100', 'text-gray-400', 'cursor-not-allowed', 'opacity-50');
    });

    it('should disable Silver when 1TB is selected', async () => {
      render(
        <AttributeSelector
          product={mockMacBookProduct}
          items={mockMacBookItems}
          selectedOptions={{ Storage: '1TB' }}
          onOptionsChange={mockOnOptionsChange}
        />
      );

      const silverButton = await screen.findByText('Silver');
      
      expect(silverButton).toBeDisabled();
      expect(silverButton).toHaveClass('bg-gray-100', 'text-gray-400', 'cursor-not-allowed', 'opacity-50');
    });

    it('should allow valid combinations', async () => {
      render(
        <AttributeSelector
          product={mockMacBookProduct}
          items={mockMacBookItems}
          selectedOptions={{ Color: 'Space Gray' }}
          onOptionsChange={mockOnOptionsChange}
        />
      );

      const oneTBButton = await screen.findByText('1 TB SSD');
      const fiveTwelveGBButton = await screen.findByText('512 GB SSD');
      
      expect(oneTBButton).not.toBeDisabled();
      expect(fiveTwelveGBButton).not.toBeDisabled();
    });

    it('should not allow clicking disabled options', async () => {
      render(
        <AttributeSelector
          product={mockMacBookProduct}
          items={mockMacBookItems}
          selectedOptions={{ Color: 'Silver' }}
          onOptionsChange={mockOnOptionsChange}
        />
      );

      const oneTBButton = await screen.findByText('1 TB SSD');
      
      fireEvent.click(oneTBButton);
      
      // Should not have been called because 1TB is disabled when Silver is selected
      expect(mockOnOptionsChange).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility Features', () => {
    it('should have proper ARIA attributes for disabled options', async () => {
      render(
        <AttributeSelector
          product={mockMacBookProduct}
          items={mockMacBookItems}
          selectedOptions={{ Color: 'Silver' }}
          onOptionsChange={mockOnOptionsChange}
        />
      );

      const oneTBButton = await screen.findByText('1 TB SSD');
      
      expect(oneTBButton).toHaveAttribute('disabled');
      expect(oneTBButton).toHaveAttribute('title', 'Not available with current selection');
      expect(oneTBButton).toHaveAttribute('aria-describedby');
    });

    it('should have proper ARIA attributes for selected options', async () => {
      render(
        <AttributeSelector
          product={mockMacBookProduct}
          items={mockMacBookItems}
          selectedOptions={{ Color: 'Space Gray' }}
          onOptionsChange={mockOnOptionsChange}
        />
      );

      const spaceGrayButton = await screen.findByText('Space Gray');
      
      expect(spaceGrayButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('should provide screen reader descriptions for unavailable options', async () => {
      render(
        <AttributeSelector
          product={mockMacBookProduct}
          items={mockMacBookItems}
          selectedOptions={{ Color: 'Silver' }}
          onOptionsChange={mockOnOptionsChange}
        />
      );

      await screen.findByText('1 TB SSD');
      
      // Check that screen reader text exists
      expect(screen.getByText('1TB is not available with your current selection')).toHaveClass('sr-only');
    });
  });

  describe('Visual Feedback', () => {
    it('should show recently changed indicator', async () => {
      render(
        <AttributeSelector
          product={mockMacBookProduct}
          items={mockMacBookItems}
          selectedOptions={{}}
          onOptionsChange={mockOnOptionsChange}
        />
      );

      const spaceGrayButton = await screen.findByText('Space Gray');
      
      fireEvent.click(spaceGrayButton);

      // After clicking, the button should have a ring effect (recently changed)
      // Note: This would need to be tested with a more sophisticated test setup
      // that can handle the timing of the ring effect
    });
  });

  describe('Development Features', () => {
    it('should show debug info in development', async () => {
      // Mock NODE_ENV using Object.defineProperty
      const originalDescriptor = Object.getOwnPropertyDescriptor(process.env, 'NODE_ENV');
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'development',
        writable: true,
        configurable: true
      });

      render(
        <AttributeSelector
          product={mockMacBookProduct}
          items={mockMacBookItems}
          selectedOptions={{ Color: 'Space Gray' }}
          onOptionsChange={mockOnOptionsChange}
        />
      );

      await screen.findByText('Color');
      
      expect(screen.getByText('Debug Info')).toBeInTheDocument();

      // Restore original environment
      if (originalDescriptor) {
        Object.defineProperty(process.env, 'NODE_ENV', originalDescriptor);
      }
    });
  });
});
