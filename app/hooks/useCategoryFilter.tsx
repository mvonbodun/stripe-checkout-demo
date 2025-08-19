'use client';

import { useEffect, useRef } from 'react';
import { useHierarchicalMenu } from 'react-instantsearch';
import { CategoryTree } from '../models/category';

/**
 * Custom hook for setting hierarchical menu refinement based on category
 * This integrates with the normal hierarchical menu facet system
 */
export function useCategoryFilter(category: CategoryTree | null) {
  const hierarchicalMenu = useHierarchicalMenu({
    attributes: [
      'categories.lvl0',
      'categories.lvl1', 
      'categories.lvl2'
    ]
  });

  const { refine, items, canRefine } = hierarchicalMenu;

  // Use ref to track the last category we applied refinement for
  const lastAppliedCategoryId = useRef<string | null>(null);

  useEffect(() => {
    if (!category || !canRefine) return;

    // Check if this is a new category
    const isNewCategory = lastAppliedCategoryId.current !== category.id;
    
    console.log('Category filter effect:', {
      categoryId: category.id,
      categoryName: category.name,
      lastAppliedCategoryId: lastAppliedCategoryId.current,
      isNewCategory,
      canRefine,
      itemsLength: items.length
    });

    // Build the hierarchical path based on category level
    let hierarchicalValue: string;
    
    if (category.level === 1) {
      // Level 1: Just the category name
      hierarchicalValue = category.name;
    } else if (category.level === 2) {
      // Level 2: Parent > Child format from path
      hierarchicalValue = category.path;
    } else {
      // Level 3+: Use full path
      hierarchicalValue = category.path;
    }

    console.log('Built hierarchical value:', hierarchicalValue);

    // Check if any item in the hierarchical menu is currently selected (refined)
    const getCurrentRefinement = (): string | null => {
      const findSelectedItem = (itemList: any[]): any => {
        for (const item of itemList) {
          if (item.isRefined) {
            return item;
          }
          // Check children recursively
          if (item.data && item.data.length > 0) {
            const childSelected = findSelectedItem(item.data);
            if (childSelected) return childSelected;
          }
        }
        return null;
      };
      
      const selectedItem = findSelectedItem(items);
      return selectedItem ? (selectedItem.value || selectedItem.label) : null;
    };

    const currentRefinement = getCurrentRefinement();
    const isAlreadyRefined = currentRefinement === hierarchicalValue;
    
    console.log('Refinement check:', {
      category: hierarchicalValue,
      currentRefinement,
      isAlreadyRefined,
      isNewCategory
    });

    // Only proceed if this is a new category OR if the current refinement doesn't match
    if (!isNewCategory && isAlreadyRefined) {
      console.log('Skipping refinement - same category and already refined correctly');
      return;
    }

    // Only refine if we have items to work with
    if (items.length === 0) {
      console.log('No items available yet, waiting...');
      return;
    }

    try {
      console.log('Available hierarchical menu items:', items);
      
      // Find the matching item by searching through the hierarchical structure
      const findMatchingItem = (itemList: any[], targetName: string, targetPath: string): any => {
        for (const item of itemList) {
          // Check if this item matches by name or value
          if (item.label === targetName || item.value === targetName || 
              item.label === targetPath || item.value === targetPath) {
            console.log('Found direct match:', item);
            return item;
          }
          
          // For level 2 categories, also check if we can find the parent and then the child
          if (category.level === 2 && item.data && item.data.length > 0) {
            // Extract parent name from path (e.g., "Men" from "Men > Accessories")
            const parentName = targetPath.split(' > ')[0];
            if (item.label === parentName || item.value === parentName) {
              // Found parent, now look for child
              const childName = targetPath.split(' > ')[1] || targetName;
              const childItem = item.data.find((child: any) => 
                child.label === childName || child.value === childName ||
                child.label === targetPath || child.value === targetPath
              );
              if (childItem) {
                console.log('Found child match:', childItem);
                return childItem;
              }
            }
          }
          
          // Recursively search children
          if (item.data && item.data.length > 0) {
            const childMatch = findMatchingItem(item.data, targetName, targetPath);
            if (childMatch) return childMatch;
          }
        }
        return null;
      };
      
      const matchingItem = findMatchingItem(items, category.name, hierarchicalValue);
      
      if (matchingItem) {
        console.log(`Applying hierarchical menu refinement with item:`, matchingItem);
        refine(matchingItem.value);
        lastAppliedCategoryId.current = category.id;
      } else {
        console.log('No matching item found for category:', {
          name: category.name,
          path: hierarchicalValue,
          availableItems: items.map(item => ({
            label: item.label,
            value: item.value,
            hasChildren: item.data && item.data.length > 0,
            children: item.data ? item.data.map((child: any) => ({ label: child.label, value: child.value })) : []
          }))
        });
      }
    } catch (error) {
      console.error('Failed to set hierarchical menu refinement:', error);
    }
  }, [category?.id, category?.name, category?.path, category?.level, refine, canRefine]);

  return { refine, items, canRefine };
}
