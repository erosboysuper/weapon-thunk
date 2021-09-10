import { MyCommentsActionTypes } from './my-comments.types';
import axios from 'axios';
import { getMyTokenFunc, RestAPI, logOutFunc } from '../api-config';
import store from '../store';

export const getMyComments = dispatch => async (userID) => {

    try {
        const result = await axios.get( RestAPI.ORIGINAL_ENDPOINT + "consumer/comments/getusercomments", { 
            headers: (await getMyTokenFunc())
        });
        dispatch(setMyComments(result.data.data.result));       
    } catch (error) {
        if (error?.response?.status)
           ((error.response.status === 401) || (error.response.status === 403)) && logOutFunc(store.dispatch)()
    }
    
}

const setMyComments = data => ({
    type: MyCommentsActionTypes.SET_MY_COMMENTS,
    payload: data
});
