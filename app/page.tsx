'use client';

import { useCart } from './cart-context';
import ProductCard from './components/ProductCard';
import Hero, { HeroData } from './components/Hero';

const PRODUCTS = [
	{
		product_id: 1,
		name: 'T-Shirt',
		price: 25.0,
		image: 'https://placehold.co/120x120',
		attributes: ['Large', 'Red'],
		taxcode: 'txcd_99999999',
	},
	{
		product_id: 2,
		name: 'Sneakers',
		price: 60.0,
		image: 'https://placehold.co/120x120',
		attributes: ['Size 10'],
		taxcode: 'txcd_99999999',
	},
	{
		product_id: 3,
		name: 'Shorts',
		price: 40.0,
		image: 'https://placehold.co/120x120',
		attributes: ['Size 32'],
		taxcode: 'txcd_99999999',
	},
	{
		product_id: 4,
		name: 'Hat',
		price: 15.0,
		image: 'https://placehold.co/120x120',
		attributes: ['Size Large'],
		taxcode: 'txcd_99999999',
	},
];

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

export default function Home() {
	const { dispatch } = useCart();
	const { openMiniCart } = useMiniCartUI();

	const addToCart = (product: typeof PRODUCTS[0]) => {
		dispatch({
			type: 'ADD_ITEM',
			item: {
				...product,
				id: '', // Will be generated in reducer
				quantity: 1,
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
		<div className="w-full">
			{/* Hero Section */}
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
						{PRODUCTS.map((product) => (
							<ProductCard
								key={product.product_id}
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
