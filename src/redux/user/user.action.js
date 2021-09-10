import { UserActionTypes } from './user.types';
import axios from 'axios';
import { getMyTokenFunc, RestAPI, logOutFunc } from '../api-config';
import store from '../store';

export const sendForgotPassword = dispatch => async email => {
    try {
        const result = await axios.post( RestAPI.ORIGINAL_ENDPOINT + "general/users/forgotpassword", { email: email});        
        return result.data.message;        
    } catch (error) {
        console.log(error.response.data.message);
        return error.response.data;
    }
}

export const sendResetPassword = dispatch => async (userID, code, password) => {
    const obj = {
        id: userID,
        forgot_link: code,
        password: password
    }
    try {
        const result = await axios.put( RestAPI.ORIGINAL_ENDPOINT + "general/users/resetpassword", obj);        
        return result.data.message;        
    } catch (error) {
        console.log(error.message);
    }
}

export const verfiyResetLink = dispatch => async (userID, code) => {
    const obj = {
        id: userID,
        forgot_link: code
    }
    try {
        const result = await axios.put( RestAPI.ORIGINAL_ENDPOINT + "general/users/forgetlink/verify", obj);        
        return result.data.message;        
    } catch (error) {
        console.log(error.message);
    }
}

export const setCurrentUser = dispatch => async (user) => {

    try {
        const result = await axios.post( RestAPI.ORIGINAL_ENDPOINT + "general/users", user);        
        return result.data.message;
        
    } catch (error) {
        console.log(error.message);
    }
}

export const getVerifiedStatus = dispatch => async (user) => {

    try {
        console.log(user);
        const userData = await axios.get( RestAPI.ORIGINAL_ENDPOINT + "general/users/verifiedstatus/" + user);     
        return userData.data;
        
    } catch (error) {
        console.log(error.message);
    }
}

export const unsubscribeEmail = dispatch => async (userID) => {

    try {
        const userData = await axios.get( RestAPI.ORIGINAL_ENDPOINT + `general/users/unsubscribe/${userID}`); 
        return userData.data;
        
    } catch (error) {
        console.log(error.message);
    }
}

export const setVerifiedUser = dispatch => async (user, isEmailVerified = false, isPhoneVerified = false ) => {
    try {
        console.log(user);
        const userData = await axios.get( RestAPI.ORIGINAL_ENDPOINT + "general/users/verifiedstatus/" + user);
        let userInfo = userData.data;
        if(!isEmailVerified && !isPhoneVerified)
            userInfo.is_verified = true;
        else{
            if(isEmailVerified && isPhoneVerified){
                userInfo.is_email_verified = true;
                userInfo.is_phone_verified = true;
                userInfo.is_verified = true;
            }                
            else{
                userInfo.is_email_verified = isEmailVerified;
                userInfo.is_phone_verified = isPhoneVerified;
                userInfo.is_verified = false;
            }
        }
        const result = await axios.put( RestAPI.ORIGINAL_ENDPOINT + "general/users/verifiedstatus/"+user, userInfo); 
        return result;
    } catch (error) {
        console.log(error.message);
    }
}

export const getCurrentUser = dispatch => async (user, fromDB, token = null) => {

    let header = {}
    if (token)
        header = {
            'Authorization': token
        }
    else
        header = await getMyTokenFunc();

    try {
        const result = await axios.post( RestAPI.ORIGINAL_ENDPOINT + "consumer/users/login", null, { 
            headers: header
        });
        if(fromDB === "fromDB")
            return result.data; 
        else{
            console.log(result.data);
            dispatch(addCurrentUser(result.data));
            return result.data.first_name;
        }                
        
    } catch (error) {
        if (error?.response?.status)
           ((error.response.status === 401) || (error.response.status === 403)) && logOutFunc(store.dispatch)()
    }
    
}

export const updateCurrentUser = dispatch => async (user, token = null) => {  

    let header = {}
    if (token)
        header = {
            'Authorization': token
        }
    else
        header = await getMyTokenFunc();

    try {
        const result = await axios.put( RestAPI.ORIGINAL_ENDPOINT + "consumer/users/profile", user, { 
            headers: header
        });

        if (!token)
            dispatch(addCurrentUser(result.data.message));
        if (result?.data?.message?.email)
            return 'success';
        else
            return 'failed';

    } catch (error) {
        if (error?.response?.status)
           ((error.response.status === 401) || (error.response.status === 403)) && logOutFunc(store.dispatch)()
    }
}

export const delCurrentUser = () => ({
    type: UserActionTypes.DEL_CURRENT_USER
})

export const setIsOldEnough = flag => ({
    type: UserActionTypes.IS_OLD_ENOUGH,
    payload: flag
})

export const setIsReloadCartItems = flag => ({
    type: UserActionTypes.IS_RELOAD_CARTITEMS,
    payload: flag
})

export const setIsStartCountDown = flag => ({
    type: UserActionTypes.IS_START_COUNTDOWN,
    payload: flag
})

export const changeTimerAction = id => ({
    type: UserActionTypes.CHANGE_TIMER,
    payload: id
})

export const changeCheckOutStatus = state => ({
    type: UserActionTypes.CHECK_OUT_GLOBAL_STATUS,
    payload: state
})

export const setHideRefreshedTimer = () => ({
    type: UserActionTypes.HIDE_REFRESHED_TIMER_COUNTDOWN
})

const addCurrentUser = user => ({
    type: UserActionTypes.ADD_CURRENT_USER,
    payload: user
});
