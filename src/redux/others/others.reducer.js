import { OthersActionTypes } from './others.type';

const INITIAL_STATE = {
    terms_conditions: null,
    social_links: null,
    contact_us_desc: null
}

const OthersReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case OthersActionTypes.SET_TERMS_AND_CONDITIONS:
            return {
                ...state, terms_conditions: action.payload
            }
        case OthersActionTypes.SET_SOCIAL_LINKS:
            return {
                ...state, social_links: action.payload
            }
        case OthersActionTypes.SET_CONTACT_US_DESC:
            return {
                ...state, contact_us_desc: action.payload
            }
        default:
            return state;
    }
}

export default OthersReducer;