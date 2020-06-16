import { actionTypes } from '../types'
const initialState = null
export default (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.TERMS_AND_CONDITIONS:
            return action.payload
        default:
            return state
    }
}