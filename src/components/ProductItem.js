import React from "react"
import { useHistory } from "react-router-dom"

const ProductItem = ({ product, i }) => {
	const history = useHistory()

	const handleClick = async (e, handle) => {
		e.preventDefault()

		history.push(`/products/${handle}`)
  }
  
  return (
    <div className="Product">
      {product.images[0] && 
        <img src={product.images[0].src} alt={`${product.title} product shot`} />
      }

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
}

export default ProductItem
