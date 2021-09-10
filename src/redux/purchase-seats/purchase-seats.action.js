import { PurchaseSeatsActionTypes } from './purchase-seats.types';
import { getMyTokenFunc, RestAPI, logOutFunc } from '../api-config';
import axios from 'axios';
import store from '../store';

export const getPurchaseSeatsArray = dispatch => async (webinarID, editArray = null) => {
    try {
        const result = await axios.get(RestAPI.ORIGINAL_ENDPOINT + `consumer/products/webinarseats/${webinarID}`, { 
            headers: (await getMyTokenFunc())
        });
        let resultArray = result.data.message;
        if (editArray) {
            editArray.map( i => resultArray[i] = "available");
        }
        dispatch(setSeatsArray(resultArray));
    } catch (error) {
        if (error?.response?.status)
           ((error.response.status === 401) || (error.response.status === 403)) && logOutFunc(store.dispatch)()
            
    }
}

export const getReservedStatus = dispatch => async (webinarID) => {
    try {
        const result = await axios.get(RestAPI.ORIGINAL_ENDPOINT + `consumer/products/getwebinarreservedstatus/` + webinarID, { 
            headers: (await getMyTokenFunc())
        });
        return result.data.data;
    } catch (error) {
        if (error?.response?.status)
           ((error.response.status === 401) || (error.response.status === 403)) && logOutFunc(store.dispatch)()
    }
}

export const setSeatsReserved = dispatch => async (userID, webinarID, seatsArray) => {
    const obj = {
        user_id: userID,
        webinar_id: webinarID,
        seatNoArray: seatsArray
    }
    try {
        const result = await axios.post(RestAPI.ORIGINAL_ENDPOINT + `consumer/products/reservewebinarticket`, obj, { 
            headers: (await getMyTokenFunc())
        });
        return result.data;
    } catch (error) {
        if (error?.response) {
            if ((error.response.status === 401) || (error.response.status === 403))
                logOutFunc(store.dispatch)()
            else
                return error.response.data?.message;
        }                  
    }
}

export const cancelReservation = dispatch => async (webinarID) => {
    const obj = {
        webinar_id: webinarID
    }
    try {
        const result = await axios.post(RestAPI.ORIGINAL_ENDPOINT + `consumer/products/cancel`, obj, { 
            headers: (await getMyTokenFunc())
        });
        return result.data;
    } catch (error) {
        if (error?.response?.status)
           ((error.response.status === 401) || (error.response.status === 403)) && logOutFunc(store.dispatch)()
    }
}

export const purchaseProducts = dispatch => async (obj) => {
    try {
        const result = await axios.post(RestAPI.ORIGINAL_ENDPOINT + `consumer/checkout`, obj ,{ 
            headers: (await getMyTokenFunc())
        });
        return result.data.message;
    } catch (error) {
        if (error?.response) {
            if ((error.response.status === 401) || (error.response.status === 403))
                logOutFunc(store.dispatch)()
            else
                return error.response.data?.message;
        }
    }
}

const setSeatsArray = array => ({
    type: PurchaseSeatsActionTypes.SET_SEATS_ARRAY,
    payload: array
})