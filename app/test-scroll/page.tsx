export default function TestScrollPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Test Scroll Behavior
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Header Scroll Test</h2>
          <p className="text-gray-600 mb-4">
            Scroll down to see the enhanced header behavior:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Initially:</strong> All three header rows are visible</li>
            <li><strong>First scroll:</strong> Categories row disappears under the logo row</li>
            <li><strong>Continued scroll:</strong> Promotional offers row starts to disappear</li>
            <li><strong>Logo row:</strong> Always remains fixed at the top</li>
          </ul>
        </div>

        {/* Generate content to enable scrolling */}
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-3">Content Block {i + 1}</h3>
            <p className="text-gray-600 mb-4">
              This is content block number {i + 1}. Keep scrolling to see how the header
              behaves as you move down the page. The enhanced header includes:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Promotional offers with rotating messages</li>
              <li>Logo and cart icon (always visible)</li>
              <li>Product categories navigation</li>
            </ul>
            <div className="mt-4 p-4 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">
                The scroll behavior is smooth and performance-optimized with debounced
                scroll event handling for a better user experience.
              </p>
            </div>
          </div>
        ))}

        <div className="bg-blue-50 rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-3 text-blue-800">Features Demonstrated</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-blue-700 mb-2">🎨 Visual Features</h4>
              <ul className="text-sm text-blue-600 space-y-1">
                <li>• Gradient promotional banner</li>
                <li>• Smooth scroll animations</li>
                <li>• Hover effects on categories</li>
                <li>• Loading states</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-700 mb-2">⚡ Performance</h4>
              <ul className="text-sm text-blue-600 space-y-1">
                <li>• Debounced scroll events</li>
                <li>• Passive event listeners</li>
                <li>• Optimized re-renders</li>
                <li>• Mobile-responsive design</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
