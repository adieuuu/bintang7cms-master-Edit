import { createStore, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk'
import reducers from './reducers'

export const makeStore = initialState => {
    const store = createStore(reducers, initialState, applyMiddleware(ReduxThunk))
    if(module.hot) {
        module.hot.accept('../components/reducers', () => {
            // console.log('Replacing reducer')
            store.replaceReducer(require('../components/reducers').default)
        })
    }
    return store
}