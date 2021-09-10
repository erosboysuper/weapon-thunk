import { ProductsActionTypes } from './products.types';

const INITIAL_STATE = {
    items: null,
    limit: 8,
    offset: 0
}

const ProductsReducer = (state=INITIAL_STATE, action) => {
    switch(action.type) {
        case ProductsActionTypes.SET_PRODUCTS:
            return {
                ...state, items: action.payload
            }
        case ProductsActionTypes.ADD_MORE_PRODUCTS:
            return {
                ...state, items: { ...state.items, data: state.items.data.concat(action.payload.data)}
            }
        case ProductsActionTypes.SET_LIMIT:
            return {
                ...state, limit: action.payload
            }
        case ProductsActionTypes.SET_OFFSET:
            return {
                ...state, offset: action.payload
            }        
        default:
            return state;
    }
}

export default ProductsReducer;