import React from 'react';
import { render, screen } from '@testing-library/react';
import { CategoryTree } from '../app/models/category';
import { Status } from '../app/models/common';

// Mock the CategorySearchInterface dependencies
jest.mock('../app/components/search/SearchStats', () => {
  return function MockSearchStats() {
    return <div data-testid="search-stats">Search Stats</div>;
  };
});

jest.mock('../app/components/search/SearchResults', () => {
  return function MockSearchResults() {
    return <div data-testid="search-results">Search Results</div>;
  };
});

jest.mock('../app/components/search/SearchPagination', () => {
  return function MockSearchPagination() {
    return <div data-testid="search-pagination">Search Pagination</div>;
  };
});

jest.mock('../app/components/search/SearchFacets', () => {
  return function MockSearchFacets() {
    return <div data-testid="search-facets">Search Facets</div>;
  };
});

jest.mock('../app/components/search/SearchSort', () => {
  return function MockSearchSort() {
    return <div data-testid="search-sort">Search Sort</div>;
  };
});

jest.mock('../app/components/search/CategoryAwareFacets', () => {
  return function MockCategoryAwareFacets() {
    return <div data-testid="category-aware-facets">Category Aware Facets</div>;
  };
});

jest.mock('../app/components/analytics/AnalyticsDashboard', () => {
  return function MockAnalyticsDashboard() {
    return <div data-testid="analytics-dashboard">Analytics Dashboard</div>;
  };
});

jest.mock('../app/components/Breadcrumb', () => {
  return function MockBreadcrumb({ items }: { items: any[] }) {
    return <div data-testid="breadcrumb">{items.map(item => item.label).join(' > ')}</div>;
  };
});

jest.mock('react-instantsearch', () => ({
  useSearchBox: () => ({ refine: jest.fn() }),
  Configure: ({ filters }: { filters: string }) => <div data-testid="configure" data-filters={filters} />
}));

jest.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: jest.fn(() => null)
  })
}));

jest.mock('../app/categories-context', () => ({
  useCategories: () => ({
    categories: []
  })
}));

// Import after mocks
import CategorySearchInterface from '../app/components/search/CategorySearchInterface';

describe('CategorySearchInterface', () => {
  const mockCategory: CategoryTree = {
    id: '1',
    name: 'Men',
    slug: 'men',
    level: 1,
    path: 'Men',
    active: true,
    order: 1,
    status: Status.ACTIVE,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    seoTitle: 'Men - Shop Collection',
    seoDescription: 'Browse our Men collection.',
    description: 'Browse our comprehensive men\'s collection',
    imageUrl: 'https://example.com/men.jpg',
    productCount: 150,
    children: [
      {
        id: '2',
        name: 'Mens Apparel',
        slug: 'men/mens-apparel',
        level: 2,
        path: 'Men > Mens Apparel',
        active: true,
        order: 1,
        status: Status.ACTIVE,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        seoTitle: 'Mens Apparel',
        seoDescription: 'Browse our Mens Apparel collection.',
        productCount: 75
      }
    ]
  };

  it('renders category header with correct information', () => {
    render(<CategorySearchInterface category={mockCategory} />);
    
    // Check category name is displayed
    expect(screen.getByText('Men')).toBeInTheDocument();
    
    // Check level badge
    expect(screen.getByText('Level 1')).toBeInTheDocument();
    
    // Check description
    expect(screen.getByText('Browse our comprehensive men\'s collection')).toBeInTheDocument();
    
    // Check category path
    expect(screen.getByText(/Category: Men/)).toBeInTheDocument();
    
    // Check product count
    expect(screen.getByText(/150 products/)).toBeInTheDocument();
  });

  it('renders subcategory navigation when children exist', () => {
    render(<CategorySearchInterface category={mockCategory} />);
    
    // Check subcategories section
    expect(screen.getByText('Subcategories')).toBeInTheDocument();
    expect(screen.getByText('Mens Apparel')).toBeInTheDocument();
    expect(screen.getByText('138')).toBeInTheDocument();
  });

  it('applies correct category filter', () => {
    render(<CategorySearchInterface category={mockCategory} />);
    
    // Check that Configure component is rendered with correct filter
    const configureElement = screen.getByTestId('configure');
    expect(configureElement).toHaveAttribute('data-filters', 'categories.lvl0:"Men"');
  });

  it('renders all search components', () => {
    render(<CategorySearchInterface category={mockCategory} />);
    
    // Check all search interface components are present
    expect(screen.getByTestId('search-stats')).toBeInTheDocument();
    expect(screen.getByTestId('search-results')).toBeInTheDocument();
    expect(screen.getByTestId('search-pagination')).toBeInTheDocument();
    expect(screen.getByTestId('category-aware-facets')).toBeInTheDocument();
    expect(screen.getByTestId('search-sort')).toBeInTheDocument();
    expect(screen.getByTestId('analytics-dashboard')).toBeInTheDocument();
  });

  it('can hide category header when showCategoryHeader is false', () => {
    render(<CategorySearchInterface category={mockCategory} showCategoryHeader={false} />);
    
    // Category header should not be present
    expect(screen.queryByText('Men')).not.toBeInTheDocument();
    expect(screen.queryByText('Level 1')).not.toBeInTheDocument();
  });

  it('can hide subcategory facets when showSubcategoryFacets is false', () => {
    render(<CategorySearchInterface category={mockCategory} showSubcategoryFacets={false} />);
    
    // Subcategories section should not be present
    expect(screen.queryByText('Subcategories')).not.toBeInTheDocument();
    expect(screen.queryByText('Mens Apparel')).not.toBeInTheDocument();
  });

  it('handles category without children gracefully', () => {
    const categoryWithoutChildren = { ...mockCategory, children: undefined };
    render(<CategorySearchInterface category={categoryWithoutChildren} />);
    
    // Should not show subcategories section
    expect(screen.queryByText('Subcategories')).not.toBeInTheDocument();
    
    // But should still show search interface
    expect(screen.getByTestId('search-results')).toBeInTheDocument();
  });

  it('applies correct Algolia filter for level 2 category', () => {
    const level2Category: CategoryTree = {
      id: '2',
      name: 'Mens Apparel',
      slug: 'men/mens-apparel',
      level: 2,
      path: 'Men > Mens Apparel',
      active: true,
      order: 1,
      status: Status.ACTIVE,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      seoTitle: 'Mens Apparel',
      seoDescription: 'Browse our Mens Apparel collection.'
    };
    
    render(<CategorySearchInterface category={level2Category} />);
    
    // Check that Configure component is rendered with correct level 2 filter
    const configureElement = screen.getByTestId('configure');
    expect(configureElement).toHaveAttribute('data-filters', 'categories.lvl1:"Men > Mens Apparel"');
  });
});
