import { useSelector, useDispatch } from "react-redux"
import Client from "shopify-buy"

// Creates the client with Shopify-Buy and store info
//
const client = Client.buildClient({
	storefrontAccessToken: process.env.REACT_APP_SHOPIFY_API,
	domain: process.env.REACT_APP_SHOPIFY_DOMAIN,
})

//
// Example Storefront
//
// const client = Client.buildClient({
// 	storefrontAccessToken: "dd4d4dc146542ba7763305d71d1b3d38",
// 	domain: "graphql.myshopify.com",
// })

/**
 * 1. Action Types
 */
const PRODUCTS_FOUND = "shopify/PRODUCTS_FOUND"
const PRODUCT_FOUND = "shopify/PRODUCT_FOUND"
const COLLECTION_FOUND = "shopify/COLLECTION_FOUND"
const CHECKOUT_FOUND = "shopify/CHECKOUT_FOUND"
const SHOP_FOUND = "shopify/SHOP_FOUND"
const ADD_VARIANT_TO_CART = "shopify/ADD_VARIANT_TO_CART"
const UPDATE_QUANTITY_IN_CART = "shopify/UPDATE_QUANTITY_IN_CART"
const REMOVE_LINE_ITEM_IN_CART = "shopify/REMOVE_LINE_ITEM_IN_CART"
const OPEN_CART = "shopify/OPEN_CART"
const CLOSE_CART = "shopify/CLOSE_CART"
const CART_COUNT = "shopify/CART_COUNT"

const initialState = {
	isCartOpen: false,
	cartCount: 0,
	checkout: {},
	products: [],
	featured: [],
	product: {},
	shop: {},
}

/**
 * 2. Reducer
 */

export default (state = initialState, action) => {
	switch (action.type) {
		case PRODUCTS_FOUND:
			return { ...state, products: action.payload }
		case PRODUCT_FOUND:
			return { ...state, product: action.payload }
		case COLLECTION_FOUND:
			return { ...state, featured: action.payload }
		case CHECKOUT_FOUND:
			return { ...state, checkout: action.payload }
		case SHOP_FOUND:
			return { ...state, shop: action.payload }
		case ADD_VARIANT_TO_CART:
			return { ...state, checkout: action.payload }
		case UPDATE_QUANTITY_IN_CART:
			return { ...state, checkout: action.payload }
		case REMOVE_LINE_ITEM_IN_CART:
			return { ...state, checkout: action.payload }
		case OPEN_CART:
			return { ...state, isCartOpen: true }
		case CLOSE_CART:
			return { ...state, isCartOpen: false }
		case CART_COUNT:
			return { ...state, cartCount: action.payload }
		default:
			return state
	}
}

/**
 * 3. Action Creators
 */

// Gets all the products from Shopify
const getProducts = () => async (dispatch) => {
	const products = await client.product.fetchAll()
	
	dispatch({
		type: PRODUCTS_FOUND,
		payload: products,
	})
}

// Gets individual item based on id
// const getProductById = (id) => async (dispatch) => {
// 	const product = await client.product.fetch(id)

// 	dispatch({
// 		type: PRODUCT_FOUND,
// 		payload: product,
// 	})

// 	return product
// }

const getProductByHandle = (handle) => async (dispatch) => {
	const product = await client.product.fetchByHandle(handle)

	dispatch({
		type: PRODUCT_FOUND,
		payload: product,
	})

	return product
}


// Gets a  collection based on that collection's id
//
// const getCollection = () => {
// 	const collectionId = "Z2lkOi8vc2hvcGlmeS9Db2xsZWN0aW9uLzIwODAyMDYwMzAzMw=="
// 	return async (dispatch) => {
// 		const featured = await client.collection.fetchWithProducts(collectionId)

// 		dispatch({
// 			type: COLLECTION_FOUND,
// 			payload: featured.products,
// 		})
// 	}
// }

// Creates initial checkout state from Shopify
const checkout = () => async (dispatch) => {
	const checkout = await client.checkout.create()

	dispatch({
		type: CHECKOUT_FOUND,
		payload: checkout,
	})
}

// Gets Shopify store information
const shopInfo = () => async (dispatch) => {
	const shop = await client.shop.fetchInfo()

	dispatch({
		type: SHOP_FOUND,
		payload: shop,
	})
}

// Adds variants to cart/checkout
const addVariantToCart = (checkoutId, lineItemsToAdd) => async (dispatch) => {
	const checkout = await client.checkout.addLineItems(
		checkoutId,
		lineItemsToAdd
	)

	dispatch({
		type: ADD_VARIANT_TO_CART,
		payload: checkout,
	})

	return checkout
}

// Updates quantity of line items in cart and in checkout state
const updateQuantityInCart = (lineItemId, quantity, checkoutId) => {
	const lineItemsToUpdate = [
		{ id: lineItemId, quantity: parseInt(quantity, 10) },
	]

	return async (dispatch) => {
		const checkout = await client.checkout.updateLineItems(
			checkoutId,
			lineItemsToUpdate
		)

		dispatch({
			type: UPDATE_QUANTITY_IN_CART,
			payload: checkout,
		})

		return checkout
	}
}

// Removes line item from cart and checkout state
const removeLineItemInCart = (checkoutId, lineItemId) => async (dispatch) => {
	const checkout = await client.checkout.removeLineItems(checkoutId, [lineItemId])

	dispatch({
		type: REMOVE_LINE_ITEM_IN_CART,
		payload: checkout,
	})
}

// To close the cart
const handleCartClose = () => {
	return {
		type: CLOSE_CART,
	}
}

// To open the cart
const handleCartOpen = () => {
	return {
		type: OPEN_CART,
	}
}

// Set the count of items in the cart
const handleSetCount = (count) => {
	return {
		type: CART_COUNT,
		payload: count,
	}
}

export const useShopify = () => {
	// extract data from redux store
	const cartStatus = useSelector((appState) => appState.shopifyState.isCartOpen)
	const cartCount = useSelector((appState) => appState.shopifyState.cartCount)
	const products = useSelector((appState) => appState.shopifyState.products)
	const product = useSelector((appState) => appState.shopifyState.product)
	const featured = useSelector((appState) => appState.shopifyState.featured)
	const checkoutState = useSelector((appState) => appState.shopifyState.checkout)
	const shopDetails = useSelector((appState) => appState.shopifyState.shop)

	// trigger actions to update redux store
	
	const dispatch = useDispatch()

	const fetchProducts = () => dispatch(getProducts())
	const fetchProductByHandle = (handle) => dispatch(getProductByHandle(handle))
	// const fetchCollection = () => dispatch(getCollection())
	const createCheckout = () => dispatch(checkout())
	const createShop = () => dispatch(shopInfo())
	const closeCart = () => dispatch(handleCartClose())
	const openCart = () => dispatch(handleCartOpen())
	const setCount = (count) => dispatch(handleSetCount(count))

	const addVariant = (checkoutId, lineItemsToAdd) =>
		dispatch(addVariantToCart(checkoutId, lineItemsToAdd))
	const updateQuantity = (lineItemId, quantity, checkoutID) =>
		dispatch(updateQuantityInCart(lineItemId, quantity, checkoutID))
	const removeLineItem = (checkoutId, lineItemId) =>
		dispatch(removeLineItemInCart(checkoutId, lineItemId))

	return {
		products,
		product,
		featured,
		cartStatus,
		checkoutState,
		cartCount,
		shopDetails,
		addVariant,
		fetchProducts,
		fetchProductByHandle,
		createCheckout,
		createShop,
		closeCart,
		openCart,
		updateQuantity,
		removeLineItem,
		setCount,
	}
}
