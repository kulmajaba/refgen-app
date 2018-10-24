import { createStore, applyMiddleware, Store } from 'redux';

import { ApplicationState, reducers } from './store';
import thunk from 'redux-thunk';

export default function configureStore(): Store<ApplicationState> {
  return createStore(
    reducers,
    applyMiddleware(thunk),
  );
}