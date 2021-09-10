import AlertsActionTypes from "./alerts.types";
import { removeReadAlert } from './alerts.utils';
const INITIAL_STATE = {
    isShow: false,
    isLoadingAlerts: false,
    alertItems: []
}

const AlertsReducer = (state=INITIAL_STATE, action) => {
    switch (action.type) {
        case AlertsActionTypes.ALERTS_SHOW:
            return {
                ...state, isShow: !state.isShow
            }
        
        case AlertsActionTypes.HIDE_ALERTS:
            return {
                ...state, isShow: false
            }
        
        case AlertsActionTypes.REMOVE_READ_ITEM:
            return {
                ...state, alertItems: removeReadAlert(state.alertItems, action.payload)
            }
        case AlertsActionTypes.SET_NOTIFICATIONS:
            return {
                ...state, alertItems: action.payload
            }
        case AlertsActionTypes.SET_LOAD_ALERTS:
            return {
                ...state, isLoadingAlerts: action.payload
            }
        default:
            return state;
    }
};

export default AlertsReducer;