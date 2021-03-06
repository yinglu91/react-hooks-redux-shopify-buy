import React, { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { useShopify } from "../hooks"

const ProductView = () => {
	const {
		product,
		fetchProductByHandle,
		openCart,
		checkout,
		addVariant,
	} = useShopify()

	const [size, setSize] = useState("")
	const [quantity, setQuantity] = useState(1)

	// get the dynamic pieces of the URL "/products/:handle"
	const { handle } = useParams();

	useEffect(() => {
		fetchProductByHandle(handle)
	}, [handle])

	const defaultSize = product.variants && product.variants[0].id.toString()

	const changeSize = (sizeId, quantity) => {
		openCart()

		if (sizeId === "") {
			sizeId = defaultSize
			const lineItemsToAdd = [
				{ variantId: sizeId, quantity: parseInt(quantity, 10) },
			]

			const checkoutId = checkout.id
			addVariant(checkoutId, lineItemsToAdd)
		} else {
			const lineItemsToAdd = [
				{ variantId: sizeId, quantity: parseInt(quantity, 10) },
			]

			const checkoutId = checkout.id
			addVariant(checkoutId, lineItemsToAdd)
		}
	}

	const description = product.description && product.description.split(".")

	return (
		<div id="individualProduct">
			<Link className="homeButton button" to={"/home"}>
				Home
			</Link>

			<div className="Product-wrapper2">
				<div className="Images">
					{product.images &&
						product.images.map((image, i) => (
								<img
									key={image.id + i}
									src={image.src}
									alt={`${product.title} product shot`}
								/>
							)
					)}
				</div>
				<div className="Product__info">
					<h2 className="Product__title2">{product.title}</h2>

					<ul className="Product__description">
						{ description && description.map((each, i) => (
							<li key={`line-description +${i}`}>{each}</li>)
						)}
					</ul>

					<div>
						<label htmlFor={"prodOptions"}>Size</label>
						<select
							id="prodOptions"
							name={size}
							onChange={(e) => {
								setSize(e.target.value)
							}}
						>
							{product.variants &&
								product.variants.map((item, i) => (
										<option
											value={item.id.toString()}
											key={item.title + i}
										>{`${item.title}`}</option>
									)
							)}
						</select>
					</div>

					<div>
						<label>Quantity</label>
						<input
							className="quantity"
							type="number"
							min={1}
							value={quantity}
							onChange={(e) => {
								setQuantity(e.target.value)
							}}
						/>
					</div>

					<h3 className="Product__price">
						${product.variants && product.variants[0].price}
					</h3>

					<button
						className="prodBuy button"
						onClick={(e) => changeSize(size, quantity)}
					>
						Add to Cart
					</button>
				</div>
			</div>
		</div>
	)
}

export default ProductView

