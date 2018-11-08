import { applyMiddleware, createStore, Store } from 'redux';
import thunk from 'redux-thunk';

import { ApplicationState, reducers } from './store';

export default function configureStore(): Store<ApplicationState> {
  return createStore(
    reducers,
    applyMiddleware(thunk),
  );
}