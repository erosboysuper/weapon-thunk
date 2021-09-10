import { ProductDetailActionTypes } from './product-detail.type';

const INITIAL_STATE = {
    prodItem: null,
    prodComments: null
}

const ProductDetailReducer = (state=INITIAL_STATE, action) => {
    switch (action.type) {
        case ProductDetailActionTypes.SET_CURRENT_PRODUCT_DETAIL:
            return {
                ...state, prodItem: action.payload
            }
        case ProductDetailActionTypes.SET_CURRENT_PRODUCT_COMMENTS:
            return {
                ...state, prodComments: action.payload
            }
        case ProductDetailActionTypes.ADD_REPLIED_COMMENT:
            state.prodComments[action.payload.index].childs.push(action.payload.data);
            return state;
        case ProductDetailActionTypes.ADD_OWN_COMMENT:
            state.prodComments.unshift(action.payload);
            return state;
        default:
            return state;
    }
}

export default ProductDetailReducer;