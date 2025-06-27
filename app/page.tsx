'use client';

import FeaturedProductsCarousel from './components/FeaturedProductsCarousel';
import Hero, { HeroData } from './components/Hero';
import { mockProducts, Product } from './models/product';
import { useState, useEffect } from 'react';

const HERO_DATA: HeroData[] = [
	{
		id: 'hero-1',
		title: 'Summer Collection 2024',
		subtitle:
			'Discover our latest summer styles featuring premium materials and contemporary designs that blend comfort with sophistication.',
		buttonText: 'Shop Now',
		buttonHref: '#products',
		image: 'https://placehold.co/600x400/4f46e5/ffffff?text=Summer+Collection',
	},
	{
		id: 'hero-2',
		title: 'Premium Quality Gear',
		subtitle:
			'Experience unmatched quality with our carefully curated selection of premium products designed for the modern lifestyle.',
		buttonText: 'Explore Collection',
		buttonHref: '#products',
		image: 'https://placehold.co/600x400/059669/ffffff?text=Premium+Quality',
	},
	{
		id: 'hero-3',
		title: 'Free Shipping Worldwide',
		subtitle:
			'Get your favorite items delivered anywhere in the world with our complimentary shipping service. No minimum order required.',
		buttonText: 'Start Shopping',
		buttonHref: '#products',
		image: 'https://placehold.co/600x400/dc2626/ffffff?text=Free+Shipping',
	},
];

export default function Home() {
	const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

	// Generate random products on client-side to avoid hydration mismatch
	useEffect(() => {
		const getRandomProducts = (products: Product[], count: number = 8): Product[] => {
			const shuffled = [...products].sort(() => 0.5 - Math.random());
			return shuffled.slice(0, Math.min(count, products.length));
		};
		
		setFeaturedProducts(getRandomProducts(mockProducts, 8));
	}, []);

	return (
		<div className="min-h-screen bg-base-100">
			<Hero
				heroes={HERO_DATA}
				autoRotate={true}
				rotationInterval={6000}
				className="mb-4"
			/>

			{/* Featured Products Carousel */}
			<div className="max-w-7xl mx-auto px-4 py-8">
				{featuredProducts.length > 0 && (
					<FeaturedProductsCarousel
						products={featuredProducts}
					/>
				)}
			</div>
		</div>
	);
}
