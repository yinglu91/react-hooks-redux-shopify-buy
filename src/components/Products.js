import React from "react"
import { useHistory } from "react-router-dom"
import { useShopify } from "../hooks"

const Products = () => {
	const history = useHistory()
	const { products } = useShopify()

	const handleClick = async (e, handle) => {
		e.preventDefault()

		history.push(`/products/${handle}`)
	}

	return (
		<div className="Products-wrapper">
			<div className="Product-wrapper">
				{products && products.map((product, i) => {
					const image = product.images[0]
					return (
						<div className="Product" key={product.id + i}>
							{image ? (
								<img src={image.src} alt={`${product.title} product shot`} />
							) : null}
							<div>
								<h4 className="Product__title">{product.title}</h4>
								<p className="Product__price">${product.variants[0].price}</p>
							</div>
							<button
								className="Product__buy button"
								onClick={(e) => handleClick(e, product.handle)}
							>
								View Details
							</button>
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default Products

