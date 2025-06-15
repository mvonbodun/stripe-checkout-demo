'use client';

import { useCart } from './cart-context';
import ProductCard from './components/ProductCard';
import Hero, { HeroData } from './components/Hero';
import { mockProducts, Product } from './models/product';
import { getValidTaxCode } from './models/common';

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

import { useMiniCartUI } from './mini-cart-ui-context';

// Get a subset of products for the homepage
const FEATURED_PRODUCTS = mockProducts.slice(0, 4);

export default function Home() {
	const { dispatch } = useCart();
	const { openMiniCart } = useMiniCartUI();

	const addToCart = (product: Product) => {
		dispatch({
			type: 'ADD_ITEM',
			item: {
				id: '', // Will be generated in reducer
				product_id: parseInt(product.id), // Convert string ID to number for cart compatibility
				name: product.name,
				attributes: product.features?.slice(0, 3) || [], // Use features as attributes
				image: product.images?.[0]?.url || undefined,
				price: product.basePrice,
				quantity: 1,
				taxcode: getValidTaxCode(product.taxCode), // Use utility function for tax code validation
				line_subtotal: 0, // Will be calculated in reducer
				line_shipping_total: 0,
				line_tax_total: 0,
				line_shipping_tax_total: 0,
				line_grand_total: 0, // Will be calculated in reducer
			},
		});
		openMiniCart();
	};

	return (
		<div className="min-h-screen bg-base-100">
			<Hero
				heroes={HERO_DATA}
				autoRotate={true}
				rotationInterval={6000}
				className="mb-12"
			/>

			{/* Products Section */}
			<div className="max-w-2xl mx-auto py-10">
				<main>
					<div
						id="products"
						className="grid grid-cols-1 md:grid-cols-2 gap-8"
					>
						{FEATURED_PRODUCTS.map((product) => (
							<ProductCard
								key={product.id}
								product={product}
								onAddToCart={addToCart}
							/>
						))}
					</div>
				</main>
			</div>
		</div>
	);
}
