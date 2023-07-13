import {createStore, applyMiddleware, combineReducers} from 'redux';
import logger from 'redux-logger';
import axios from 'axios';
import thunk from 'redux-thunk';
//action names
const inc = 'account/increment';
const dec = 'account/decrement';
const getAccUserPending = 'account/getUser/pending';
const getAccUserFulfilled = 'account/getUser/fulfilled';
const getAccUserRejected = 'account/getUser/rejected';

const incBonus = 'bonus/increment';
//store
const store = createStore(
    combineReducers({
        account: accountReducer,
        bonus: bonusReducer
    }), 
    applyMiddleware(logger.default, thunk.default));

//reducer
function accountReducer(state = {amount: 1},action){
    switch(action.type){
        case inc:
            return{amount: state.amount + 1};
        case dec:
            return{amount: state.amount - 1};
        case getAccUserFulfilled:
            return{amount: action.payload, pending: false };
        case getAccUserPending:
            return{...state, pending: true };
        case getAccUserRejected:
            return{...state, error: action.error, pending: false };    
    }   
    return state;
}

function bonusReducer(state = {points: 0},action){
    switch(action.type){
        case incBonus:
            return{points: state.points + 1};
        case inc:
            return{points: state.points + 1};
        default:
            return state;

    }

}
//Action creators
function increment(){
    return {type: inc}
}
function decrement(){
    return {type: dec}
}
function getAcountUserFulfilled(value){
    return {type: getAccUserFulfilled, payload: value}
}
function getAcountUserPending(value){
    return {type: getAccUserPending}
}
function getAcountUserRejected(e){
    return {type: getAccUserRejected, error: e}
}
 function getUserAccount(id){
    return async (dispatch, getState)=> {
        try{
            dispatch(getAcountUserPending())
            const {data} = await axios.get(`http://localhost:3000/accounts/${id}`)
            dispatch (getAcountUserFulfilled(data.amount))
        }
        catch(e){
            dispatch(getAcountUserRejected(e.message))
        }
    
    }
}
function increaseBonus(){
    return {type: incBonus}
}
store.dispatch(getUserAccount(1));
console.log(store.getState());
