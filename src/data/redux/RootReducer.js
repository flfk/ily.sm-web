import { combineReducers } from 'redux';

import reducerUser from './user/user.reducer';

const reducerRoot = combineReducers({
  user: reducerUser,
});

export default reducerRoot;
