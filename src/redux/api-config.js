import config from '../config';
import { Auth } from 'aws-amplify';
import { push } from 'connected-react-router';

export const RestAPI = {
    ORIGINAL_ENDPOINT: config.apiGateway.URL
}

export const getMyTokenFunc = async () => {
    let header = "";
    try {
        header = (await Auth.currentSession()).idToken.jwtToken;
    } catch (e) { console.log(e)}
    return {
        'Authorization': header
    };
}

export const logOutFunc = dispatch => () => {   
    Auth.signOut();
    localStorage.removeItem('userData');
    dispatch({
        type: 'DEL_CURRENT_USER'
    })
    push(`/`);
}