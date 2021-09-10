import { FaqItemsActionTypes } from './faq-items.types';
import axios from 'axios';
import { RestAPI } from '../api-config';

export const getFaqItems = dispatch => async () => {
    try {
        const result = await axios.get(RestAPI.ORIGINAL_ENDPOINT + "general/faq");
        dispatch(setFaqItems(result.data.data));
    } catch (error) {
        console.log(error.message);
    }
}

const setFaqItems = items => ({
    type: FaqItemsActionTypes.SET_FAQ_ITEMS,
    payload: items
})