'use client';

import React from 'react';
import { Highlight, Snippet } from 'react-instantsearch';
import Link from 'next/link';
import Image from 'next/image';

export default function EnhancedProductCard({ hit }: { hit: any }) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="aspect-w-3 aspect-h-4 bg-gray-200 sm:aspect-none group-hover:opacity-75 sm:h-96">
        <Image
          src={hit.image || '/next.svg'}
          alt={hit.name}
          width={500}
          height={500}
          className="h-full w-full object-cover object-center sm:h-full sm:w-full"
        />
      </div>
      <div className="flex flex-1 flex-col space-y-2 p-4">
        <h3 className="text-sm font-medium text-gray-900">
          <Link href={`/p/${hit.slug}`}>
            <span aria-hidden="true" className="absolute inset-0" />
            <Highlight attribute="name" hit={hit} />
          </Link>
        </h3>
        <p className="text-sm text-gray-500">
          <Snippet attribute="description" hit={hit} />
        </p>
        <div className="flex flex-1 flex-col justify-end">
          <p className="text-base font-medium text-gray-900">${hit.price}</p>
        </div>
      </div>
    </div>
  );
}
