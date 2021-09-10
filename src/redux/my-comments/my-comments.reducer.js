import { MyCommentsActionTypes } from './my-comments.types';

const INITIAL_STATE = {
    myCommentsData: null
}

const MyCommentsReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case MyCommentsActionTypes.SET_MY_COMMENTS:
            
            return {
                ...state, myCommentsData: action.payload 
            }
            
        default:
            return state;
    }
}

export default MyCommentsReducer;