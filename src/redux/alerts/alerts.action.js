import AlertsActionTypes from './alerts.types';
import axios from 'axios';
import { getMyTokenFunc, RestAPI, logOutFunc } from '../api-config';
import store from '../store';

export const alertsShow = () => ({
    type: AlertsActionTypes.ALERTS_SHOW
});

export const hideAlerts = () => ({
    type: AlertsActionTypes.HIDE_ALERTS
});

export const removeReadItem = id => ({
    type: AlertsActionTypes.REMOVE_READ_ITEM,
    payload: id
});

export const setLoadAlerts = flag => ({
    type: AlertsActionTypes.SET_LOAD_ALERTS,
    payload: flag
})

export const getNotifications = dispatch => async (userID) => {
    try {
        const result = await axios.get( RestAPI.ORIGINAL_ENDPOINT + "consumer/notification", {
            headers: (await getMyTokenFunc())
        });
        dispatch(setNotifications(result.data.message));
    } catch (error) {
        if (error?.response?.status)
           ((error.response.status === 401) || (error.response.status === 403)) && logOutFunc(store.dispatch)()
    }
};

export const readNotifications = dispatch => async (notificationID) => {
    try {
        const result = await axios.put( RestAPI.ORIGINAL_ENDPOINT + "consumer/notification/read/"+notificationID, null, { 
            headers: (await getMyTokenFunc())
        });
        return result.data.message;
    } catch (error) {
        if (error?.response?.status)
           ((error.response.status === 401) || (error.response.status === 403)) && logOutFunc(store.dispatch)()
    }
};

export const removeAllNotifications = dispatch => async () => {
    try {
        const result = await axios.delete(RestAPI.ORIGINAL_ENDPOINT + "consumer/user_notification", { 
            headers: (await getMyTokenFunc())
        });
        dispatch(setNotifications([]));
    } catch (error) {
        if (error?.response?.status)
           ((error.response.status === 401) || (error.response.status === 403)) && logOutFunc(store.dispatch)()
    }
};

const setNotifications = notifications => ({
    type: AlertsActionTypes.SET_NOTIFICATIONS,
    payload: notifications
})

