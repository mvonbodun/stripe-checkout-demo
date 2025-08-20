#!/bin/bash

# Copy proto files to multiple locations for deployment compatibility
echo "Copying proto files for deployment..."

# Create public/proto directory if it doesn't exist
mkdir -p public/proto

# Copy all proto files maintaining directory structure
cp -r proto/* public/proto/

# Also copy to .next/static for serverless function access
mkdir -p .next/static/proto
cp -r proto/* .next/static/proto/

echo "Proto files copied to public/proto/ and .next/static/proto/"
echo "Files copied:"
find public/proto -name "*.proto"
find .next/static/proto -name "*.proto" 2>/dev/null || echo "No .next/static/proto files (will be created during build)"
