import { ProductsActionTypes } from './products.types';
import { RestAPI } from '../api-config';
import axios from 'axios';

export const getProducts = dispatch => async (limit = null, offset=null, type=null) => {
    const sendInfo = {
        limit: limit,
        offset: offset,
        product_type: type
    }
    try {
        const result = await axios.post(RestAPI.ORIGINAL_ENDPOINT + "general/products/getall", sendInfo);
        dispatch(setProducts(result.data));
    } catch (error) {
        console.log(error.message);
    }
}

export const addMoreProducts = dispatch => async (limit = null, offset=null, type=null) => {
    const sendInfo = {
        limit: limit,
        offset: offset,
        product_type: type
    }
    try {
        const result = await axios.post(RestAPI.ORIGINAL_ENDPOINT + "general/products/getall", sendInfo);

        dispatch(addProducts(result.data));
    } catch (error) {
        console.log(error.message);
    }
}

export const setLimit = limit => ({
    type: ProductsActionTypes.SET_LIMIT,
    payload: limit
})

export const setOffset = offset => ({
    type: ProductsActionTypes.SET_OFFSET,
    payload: offset
})

const setProducts = items => ({
    type: ProductsActionTypes.SET_PRODUCTS,
    payload: items
})

const addProducts = items => ({
    type: ProductsActionTypes.ADD_MORE_PRODUCTS,
    payload: items
})
