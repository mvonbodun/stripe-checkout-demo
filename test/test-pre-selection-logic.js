// Test script to verify pre-selection implementation
import { calculateInitialAttributeSelections } from '../app/utils/attributeHelpers.js';

// Mock test data
const testCases = [
  {
    name: 'Multi-attribute product (iPhone)',
    allAttributes: {
      'Color': ['Natural Titanium', 'Blue Titanium'],
      'Storage': ['128GB', '256GB', '512GB']
    },
    combinationMatrix: {
      'Color': {
        'Natural Titanium': { exists: true },
        'Blue Titanium': { exists: true }
      },
      'Storage': {
        '128GB': { exists: true },
        '256GB': { exists: true },
        '512GB': { exists: true }
      }
    },
    expected: { 'Color': 'Natural Titanium' },
    description: 'Should pre-select only the first attribute (Color) with first value'
  },
  {
    name: 'Single attribute product (Samsung TV)',
    allAttributes: {
      'Screen Size': ['65"', '75"', '85"']
    },
    combinationMatrix: {
      'Screen Size': {
        '65"': { exists: true },
        '75"': { exists: true },
        '85"': { exists: true }
      }
    },
    expected: { 'Screen Size': '65"' },
    description: 'Should pre-select the single attribute with first value'
  },
  {
    name: 'No attributes',
    allAttributes: {},
    combinationMatrix: {},
    expected: {},
    description: 'Should return empty selection for products with no attributes'
  },
  {
    name: 'Invalid combination matrix',
    allAttributes: {
      'Color': ['Red', 'Blue']
    },
    combinationMatrix: {
      'Color': {
        'Green': { exists: true } // Different value not in attributes
      }
    },
    expected: {},
    description: 'Should return empty selection when first value is not in combination matrix'
  }
];

console.log('='.repeat(60));
console.log('ATTRIBUTE PRE-SELECTION VERIFICATION TESTS');
console.log('='.repeat(60));

testCases.forEach((testCase, index) => {
  console.log(`\nTest ${index + 1}: ${testCase.name}`);
  console.log('-'.repeat(40));
  console.log(`Description: ${testCase.description}`);
  
  try {
    const result = calculateInitialAttributeSelections(
      testCase.allAttributes,
      testCase.combinationMatrix
    );
    
    const passed = JSON.stringify(result) === JSON.stringify(testCase.expected);
    
    console.log(`Expected: ${JSON.stringify(testCase.expected)}`);
    console.log(`Actual:   ${JSON.stringify(result)}`);
    console.log(`Status:   ${passed ? '✅ PASS' : '❌ FAIL'}`);
    
    if (!passed) {
      console.log(`❌ Test failed!`);
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
});

console.log('\n' + '='.repeat(60));
console.log('IMPLEMENTATION VERIFICATION COMPLETE');
console.log('='.repeat(60));
