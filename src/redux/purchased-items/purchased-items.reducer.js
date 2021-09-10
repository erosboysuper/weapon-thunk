import PurchasedItemsActionTypes from './purchased-items.types';

const INITIAL_STATE = {
    product_items: {
        data: [],
        count: 1
    },
    webinar_items: {
        data: [],
        count: 1
    },
    filterStr: "",
    limitPerPage: {
        product: 5,
        wonList: 5
    },
    pageNum: {
        product: 1,
        wonList: 1
    },
    isTableLoad: false
}

const PurchasedItemsReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case PurchasedItemsActionTypes.SET_PURCHASED_PRODUCT_ITEMS:
            return {
                ...state, 
                product_items : action.payload, 
            }
        case PurchasedItemsActionTypes.SET_PURCHASED_WEBINAR_ITEMS:
            return {
                ...state, webinar_items : action.payload
            }
        case PurchasedItemsActionTypes.SET_FILTER_STRING:
            return {
                ...state, filterStr: action.payload
            }
        case PurchasedItemsActionTypes.SET_LIMIT_PER_PAGE:
            return {
                ...state, limitPerPage: action.payload
            }
        case PurchasedItemsActionTypes.SET_PRODUCT_PAGE_NUM:
            return {
                ...state, pageNum: {...state.pageNum, product:action.payload}
            }
        case PurchasedItemsActionTypes.SET_WONLIST_PAGE_NUM:
            return {
                ...state, pageNum: {...state.pageNum, wonList:action.payload}
            }
        case PurchasedItemsActionTypes.SET_IS_TABLE_LOAD:
            return {
                ...state, isTableLoad: action.payload
            }
        default:
            return state;
    }
}

export default PurchasedItemsReducer;