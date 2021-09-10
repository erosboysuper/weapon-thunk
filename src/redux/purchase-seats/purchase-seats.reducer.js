import { PurchaseSeatsActionTypes } from './purchase-seats.types';

const INITIAL_STATE = {
    seatsArray: null
}

const PurchaseSeatsReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case PurchaseSeatsActionTypes.SET_SEATS_ARRAY:
            return {
                ...state, seatsArray: action.payload
            }           
        default:
            return state;
    }
}

export default PurchaseSeatsReducer;