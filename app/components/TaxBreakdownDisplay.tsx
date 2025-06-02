import React from 'react';

interface TaxBreakdownItem {
  amount: number;
  jurisdiction: {
    country: string;
    display_name: string;
    level: string;
    state?: string;
  };
  tax_rate_details: {
    display_name: string;
    percentage_decimal: string;
    tax_type: string;
  } | null;
  taxability_reason: string;
  taxable_amount: number;
}

interface LineItem {
  id: string;
  reference: string;
  amount: number;
  amount_tax: number;
  quantity: number;
  tax_breakdown: TaxBreakdownItem[];
}

interface TaxCalculation {
  id: string;
  amount_total: number;
  tax_amount_exclusive: number;
  currency: string;
  line_items: {
    data: LineItem[];
  };
}

interface TaxBreakdownDisplayProps {
  calculation: TaxCalculation;
  showDetailedBreakdown?: boolean;
}

export function TaxBreakdownDisplay({ 
  calculation, 
  showDetailedBreakdown = false 
}: TaxBreakdownDisplayProps) {
  const formatCurrency = (amountInCents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: calculation.currency.toUpperCase(),
    }).format(amountInCents / 100);
  };

  const formatPercentage = (percentageDecimal: string) => {
    return `${parseFloat(percentageDecimal).toFixed(2)}%`;
  };

  return (
    <div className="tax-breakdown bg-gray-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Tax Breakdown</h3>
      
      {/* Summary */}
      <div className="mb-4 p-3 bg-white rounded border">
        <div className="flex justify-between items-center">
          <span className="font-medium">Total Tax:</span>
          <span className="font-bold text-green-600">
            {formatCurrency(calculation.tax_amount_exclusive)}
          </span>
        </div>
        <div className="flex justify-between items-center mt-1 text-sm text-gray-600">
          <span>Total with Tax:</span>
          <span>{formatCurrency(calculation.amount_total)}</span>
        </div>
      </div>

      {/* Line Item Breakdown */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-800">Tax by Item:</h4>
        
        {calculation.line_items.data.map((lineItem) => (
          <div key={lineItem.id} className="bg-white p-3 rounded border">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <span className="font-medium">{lineItem.reference}</span>
                {lineItem.quantity > 1 && (
                  <span className="text-sm text-gray-500 ml-2">
                    (Qty: {lineItem.quantity})
                  </span>
                )}
              </div>
              <div className="text-right">
                <div className="font-medium">
                  {formatCurrency(lineItem.amount)}
                </div>
                <div className="text-sm text-green-600">
                  Tax: {formatCurrency(lineItem.amount_tax)}
                </div>
              </div>
            </div>

            {/* Detailed Tax Breakdown per Item */}
            {showDetailedBreakdown && lineItem.tax_breakdown.length > 0 && (
              <div className="mt-3 pl-4 border-l-2 border-gray-200">
                <h5 className="text-sm font-medium text-gray-700 mb-2">
                  Tax Details:
                </h5>
                <div className="space-y-1">
                  {lineItem.tax_breakdown.map((breakdown, breakdownIndex) => (
                    <div 
                      key={breakdownIndex} 
                      className="flex justify-between items-center text-sm"
                    >
                      <div className="flex-1">
                        <span className="text-gray-600">
                          {breakdown.jurisdiction.display_name}
                        </span>
                        {breakdown.tax_rate_details && (
                          <span className="text-gray-500 ml-2">
                            ({formatPercentage(breakdown.tax_rate_details.percentage_decimal)})
                          </span>
                        )}
                      </div>
                      <span className="text-gray-800">
                        {formatCurrency(breakdown.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Toggle Detailed View */}
      <button 
        onClick={() => {
          // This would be handled by the parent component
          console.log('Toggle detailed breakdown');
        }}
        className="mt-3 text-sm text-blue-600 hover:text-blue-800 underline"
      >
        {showDetailedBreakdown ? 'Hide' : 'Show'} detailed tax breakdown
      </button>
    </div>
  );
}

// Example usage component
export function TaxBreakdownExample() {
  const [showDetailed, setShowDetailed] = React.useState(false);
  const [taxCalculation, setTaxCalculation] = React.useState<TaxCalculation | null>(null);

  // Example function to fetch tax calculation
  const fetchTaxCalculation = async () => {
    try {
      const response = await fetch('/api/calculate-tax', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shipping_address: {
            line1: '123 Main St',
            city: 'Spring',
            state: 'TX',
            postal_code: '77381',
            country: 'US'
          },
          cart: [
            {
              name: 'Premium T-Shirt',
              price: 29.99,
              quantity: 2,
              taxcode: 'txcd_99999999'
            },
            {
              name: 'Coffee Mug',
              price: 15.99,
              quantity: 1,
              taxcode: 'txcd_99999999'
            }
          ]
        })
      });
      
      const data = await response.json();
      setTaxCalculation(data.calculation);
    } catch (error) {
      console.error('Error fetching tax calculation:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <button 
        onClick={fetchTaxCalculation}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Calculate Tax Example
      </button>
      
      {taxCalculation && (
        <TaxBreakdownDisplay 
          calculation={taxCalculation} 
          showDetailedBreakdown={showDetailed}
        />
      )}
      
      {taxCalculation && (
        <button 
          onClick={() => setShowDetailed(!showDetailed)}
          className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          {showDetailed ? 'Hide' : 'Show'} Detailed Breakdown
        </button>
      )}
    </div>
  );
}

export default TaxBreakdownDisplay;
