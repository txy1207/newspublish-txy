import {legacy_createStore,combineReducers} from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' 
import { CollapsedReducer } from './reducers/CollapsedReducer';
import { LoadingReducer } from './reducers/LoadingReducer';

// import rootReducer from './reducers'

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['LoadingReducer'] 
}
const  reducer=combineReducers({
    CollapsedReducer,
    LoadingReducer
})

const persistedReducer = persistReducer(persistConfig, reducer) 
const store = legacy_createStore(persistedReducer);
const persistor=persistStore(store)

export {store,persistor};