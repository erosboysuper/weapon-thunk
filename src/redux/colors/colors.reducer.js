import { ColorsActionTypes } from './colors.types';

const INITIAL_SATE = {
    currentFontColors: null,
    currentHeaderColor: null,
    currentFooterColor: null
}

const ColorsReducer = (state = INITIAL_SATE, action) => {
    switch (action.type) {
        case ColorsActionTypes.SET_CURRENT_FONT_COLORS:
            return {
                ...state, currentFontColors: action.payload 
            }
    
        default:
            return state;
    }
}

export default ColorsReducer;