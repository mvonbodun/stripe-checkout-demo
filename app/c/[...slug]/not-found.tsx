import Link from 'next/link';

export default function CategoryNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          {/* 404 Icon */}
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-100">
            <svg 
              className="h-12 w-12 text-red-600" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
          </div>
          
          {/* Title */}
          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            Category Not Found
          </h1>
          
          {/* Description */}
          <p className="mt-4 text-lg text-gray-600 max-w-lg mx-auto">
            The category you&apos;re looking for doesn&apos;t exist or may have been moved. 
            This could happen if the category URL is incorrect or the category has been removed.
          </p>
          
          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <svg className="mr-2 -ml-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Go to Homepage
            </Link>
            
            <Link
              href="/search"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <svg className="mr-2 -ml-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search Products
            </Link>
          </div>
          
          {/* Helpful Links */}
          <div className="mt-12 border-t border-gray-200 pt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Popular Categories
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <Link 
                href="/c/men" 
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                Men&apos;s Fashion
              </Link>
              <Link 
                href="/c/women" 
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                Women&apos;s Fashion
              </Link>
              <Link 
                href="/c/electronics" 
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                Electronics
              </Link>
              <Link 
                href="/c/home-garden" 
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                Home &amp; Garden
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
