import PurchasedItemsActionTypes from './purchased-items.types';
import axios from 'axios';
import { getMyTokenFunc, RestAPI, logOutFunc } from '../api-config';
import store from '../store';

export const getProductItems = dispatch => async (userID, filterStr = null, limit = null, pageNum = null) => {
    const data_object = {
        filterString: filterStr,
        limit: limit,
        pageNo: pageNum
    }
    try {
        const result = await axios.post( RestAPI.ORIGINAL_ENDPOINT + "consumer/products/getpurchasehistory", data_object, { 
            headers: (await getMyTokenFunc())
        });
        console.log(result);
        dispatch(setProductItems(result.data));
    } catch (error) {
        if (error?.response?.status)
           ((error.response.status === 401) || (error.response.status === 403)) && logOutFunc(store.dispatch)()
    }
}

export const getWebinarItems = dispatch => async (userID, filterStr = null, limit = null, pageNum = null) => {
    const data_object = {
        user_id: userID,
        filterString: filterStr,
        limit: limit,
        pageNo: pageNum
    }
    try {
        const result = await axios.post( RestAPI.ORIGINAL_ENDPOINT + "consumer/products/getwebinarwinnerhistory", data_object, { 
            headers: (await getMyTokenFunc())
        });
        console.log(result);
        dispatch(setWebinarItems(result.data));
    } catch (error) {
        if (error?.response?.status)
           ((error.response.status === 401) || (error.response.status === 403)) && logOutFunc(store.dispatch)()
    }

}

export const setFilterString = filterStr => ({
    type: PurchasedItemsActionTypes.SET_FILTER_STRING,
    payload: filterStr
})

export const setLimitPerPage = limit => ({
    type: PurchasedItemsActionTypes.SET_LIMIT_PER_PAGE,
    payload: limit
})

export const setProductPageNum = num => ({
    type: PurchasedItemsActionTypes.SET_PRODUCT_PAGE_NUM,
    payload: num
})

export const setWonListPageNum = num => ({
    type: PurchasedItemsActionTypes.SET_WONLIST_PAGE_NUM,
    payload: num
})

export const setIsTableLoad = flag => ({
    type: PurchasedItemsActionTypes.SET_IS_TABLE_LOAD,
    payload: flag
})

const setProductItems = items => ({
    type: PurchasedItemsActionTypes.SET_PURCHASED_PRODUCT_ITEMS,
    payload: items
})

const setWebinarItems = items => ({
    type: PurchasedItemsActionTypes.SET_PURCHASED_WEBINAR_ITEMS,
    payload: items
})
