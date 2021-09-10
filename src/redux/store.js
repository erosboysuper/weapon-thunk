import {createStore, applyMiddleware} from 'redux';
import {logger} from 'redux-logger';
import thunk from 'redux-thunk';
import rootReducer from './root-reducer';

const middleware = [logger];

const store = createStore(rootReducer, applyMiddleware(...middleware, thunk));

export default store;