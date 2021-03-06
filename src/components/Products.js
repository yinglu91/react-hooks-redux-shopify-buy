import React from "react"
import { useShopify } from "../hooks"
import ProductItem from './ProductItem'

const Products = () => {
	const { products } = useShopify()

	return (
		<div className="Products-wrapper">
			<div className="Product-wrapper">
				{products && products.map((product, i) => (
					<ProductItem key={product.id + i} product={product} />
				))}
			</div>
		</div>
	)
}

export default Products

