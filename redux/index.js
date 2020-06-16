import reducerUser from './reducerUser/index';



import {combineReducers} from 'redux'

const reducerCombined = combineReducers({
  
    reducerUser,
   

});
export default reducerCombined