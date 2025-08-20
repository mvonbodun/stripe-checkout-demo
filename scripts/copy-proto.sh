#!/bin/bash

# Copy proto files to public directory so they're included in deployment
echo "Copying proto files for deployment..."

# Create public/proto directory if it doesn't exist
mkdir -p public/proto

# Copy all proto files maintaining directory structure
cp -r proto/* public/proto/

echo "Proto files copied to public/proto/"
echo "Files copied:"
find public/proto -name "*.proto"
