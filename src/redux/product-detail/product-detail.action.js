import { ProductDetailActionTypes } from './product-detail.type';
import axios from 'axios';
import { getMyTokenFunc, RestAPI, logOutFunc } from '../api-config';
import store from '../store';

export const getCurrentProdItem = dispatch => async (email = '', prodID,prodType) => {
    try {
        const result = await axios.post(RestAPI.ORIGINAL_ENDPOINT + "general/products/getproduct", {
            email: email,
            id: prodID, 
            product_type: prodType
        });
   
        dispatch(setCurrentProdItem(result.data.data));
        return result.data.data;
    } catch (error) {
        console.log(error.message);
    }
}

export const getCurrentComments = dispatch => async (prodID) => {
    try {
        const result = await axios.get(RestAPI.ORIGINAL_ENDPOINT + "consumer/comments/getproductcomments/" + prodID, { 
            headers: (await getMyTokenFunc())
        });
        dispatch(setCurrentProdComments(result.data.data.result));
    } catch (error) {
        if (error?.response?.status)
           ((error.response.status === 401) || (error.response.status === 403)) && logOutFunc(store.dispatch)()
    }
}

export const addCommentsFunc = dispatch => async (obj, index = null) => {
    try {
        const result = await axios.post(RestAPI.ORIGINAL_ENDPOINT + "consumer/comments", obj, { 
            headers: (await getMyTokenFunc())
        });
       
        return result.data;
        // if(index)
        //     dispatch(addRepliedComment(result.data.data, index));            
        // else
        //     dispatch(addOwnComment({
        //         message: result.data.data,
        //         childs: []
        //     }));

    } catch (error) {
        if (error?.response?.status)
           ((error.response.status === 401) || (error.response.status === 403)) && logOutFunc(store.dispatch)()
    }
}

export const updateCommentFunc = dispatch => async (obj) => {

    try {
        const result = await axios.put(RestAPI.ORIGINAL_ENDPOINT + "consumer/comments", obj, { 
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

export const setCommentPin = dispatch => async (obj) => {
    try {
        const result = await axios.post(RestAPI.ORIGINAL_ENDPOINT + "admin/comments/pin", obj, { 
            headers: (await getMyTokenFunc())
        });
        return result.data.message;
    } catch (error) {
        if (error?.response?.status)
           ((error.response.status === 401) || (error.response.status === 403)) && logOutFunc(store.dispatch)()
    }
}

export const setCommentDel = dispatch => async (obj) => {
    try {
        const result = await axios.delete(RestAPI.ORIGINAL_ENDPOINT + "admin/comments/" + obj.comment_id,  { 
            headers: (await getMyTokenFunc())
        });
        return result.data.message;
    } catch (error) {
        if (error?.response?.status)
           ((error.response.status === 401) || (error.response.status === 403)) && logOutFunc(store.dispatch)()
    }
}

export const setCommentUserBan = dispatch => async (obj) => {
    try {
        const result = await axios.post(RestAPI.ORIGINAL_ENDPOINT + "admin/users/ban", obj, { 
            headers: (await getMyTokenFunc())
        });
        return result.data.message;
    } catch (error) {
        if (error?.response?.status)
           ((error.response.status === 401) || (error.response.status === 403)) && logOutFunc(store.dispatch)()
    }
}

const setCurrentProdItem = items => ({
    type: ProductDetailActionTypes.SET_CURRENT_PRODUCT_DETAIL,
    payload: items
})

const setCurrentProdComments = comments => ({
    type: ProductDetailActionTypes.SET_CURRENT_PRODUCT_COMMENTS,
    payload: comments
})

const addOwnComment = comments => ({
    type: ProductDetailActionTypes.ADD_OWN_COMMENT,
    payload: comments
})

const addRepliedComment = (comments, index) => ({
    type: ProductDetailActionTypes.ADD_REPLIED_COMMENT,
    payload: {
        data: comments,
        index: index
    }
})