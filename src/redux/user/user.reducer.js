import { UserActionTypes } from './user.types';

const INITIAL_STATE = {
    currentUser: null,
    isOldEnough: true,
    isReloadCartItems: false,
    isStartCountDown: false,
    isHideRefreshedTimer: true,
    changeTimer: null,
    globalCheckState: false
}

const UserReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case UserActionTypes.ADD_CURRENT_USER:
            
            return {
                ...state, currentUser: action.payload 
            }
        case UserActionTypes.DEL_CURRENT_USER:
            
            return {
                ...state, currentUser: "noInfo" 
            }
        case UserActionTypes.IS_OLD_ENOUGH:
        
            return {
                ...state, isOldEnough: action.payload
            }
        case UserActionTypes.IS_RELOAD_CARTITEMS:
        
            return {
                ...state, isReloadCartItems: action.payload
            }
        case UserActionTypes.IS_START_COUNTDOWN:
        
            return {
                ...state, isStartCountDown: action.payload
            }
        case UserActionTypes.HIDE_REFRESHED_TIMER_COUNTDOWN:        
            return {
                ...state, isHideRefreshedTimer: false
            }
        case UserActionTypes.CHANGE_TIMER:        
            return {
                ...state, changeTimer: action.payload
            }
        case UserActionTypes.CHECK_OUT_GLOBAL_STATUS:        
            return {
                ...state, globalCheckState: action.payload
            }
        default:
            return state;
    }
}

export default UserReducer;