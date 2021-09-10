import { FaqItemsActionTypes } from './faq-items.types';

const INITIAL_STATE = {
    items: null
}

const FaqItemsReducer = ( state=INITIAL_STATE, action ) => {
    switch (action.type) {
        case FaqItemsActionTypes.SET_FAQ_ITEMS:
            return {
                ...state, items: action.payload
            }
        default:
            return state;
    }
}

export default FaqItemsReducer;