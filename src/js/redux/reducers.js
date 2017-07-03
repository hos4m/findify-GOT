import { combineReducers } from 'redux';
import HTTPRequest from '../helpers/API';

export const GOTReducers = async (state = {}, action) => {
  switch (action.type) {
    case 'PREV_DATA':
      try {
        let prevDataResult = await HTTPRequest.getCharacters(action.params.page);
        return prevDataResult.data;
      } catch (error) {
        console.log('------------------------------------');
        console.log(error);
        console.log('------------------------------------');
      }
      
    case 'NEXT_DATA':
      try {
        let nextDataResult = await HTTPRequest.getCharacters(action.params.page);
        return nextDataResult.data;
      } catch (error) {
        console.log('------------------------------------');
        console.log(error);
        console.log('------------------------------------');
      }
      
    default:
      return state;
  }
};

export const reducers = combineReducers({  
  GOTReducers
});