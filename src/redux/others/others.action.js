import { OthersActionTypes } from './others.type';
import axios from 'axios';
import { RestAPI } from '../api-config';

export const getSocialLinks = dispatch => async () => {
    try {
        const result = await axios.get(RestAPI.ORIGINAL_ENDPOINT + "general/support/sitesettings/socialmedialinks");
        dispatch(setSocialLinks(result.data));
    } catch (error) {
        console.log(error.message);
    }
}

export const getContactDesc = dispatch => async () => {
    try {
        const result = await axios.get(RestAPI.ORIGINAL_ENDPOINT + "general/support/sitesettings/contactdescription");
        dispatch(setContactDesc(result.data.data));
    } catch (error) {
        console.log(error.message);
    }
}

export const sendContact = dispatch => async (obj) => {
    try {
        const result = await axios.post(RestAPI.ORIGINAL_ENDPOINT + "general/support/contact", obj);
        return result.data.message;
        
    } catch (error) {
        console.log(error.message);
    }
}

export const getTermsAndConditions = dispatch => async () => {
    try {
        const result = await axios.get(RestAPI.ORIGINAL_ENDPOINT + "general/support/sitesettings");
        console.log(result.data.data);
        return result.data.data;
        // dispatch(setTermsAndConditions(result.data.data));
    } catch (error) {
        console.log(error.message);
    }
}

const setSocialLinks = items => ({
    type: OthersActionTypes.SET_SOCIAL_LINKS,
    payload: items
})

const setContactDesc = text => ({
    type: OthersActionTypes.SET_CONTACT_US_DESC,
    payload: text
})

const setTermsAndConditions = items => ({
    type: OthersActionTypes.SET_TERMS_AND_CONDITIONS,
    payload: items
})