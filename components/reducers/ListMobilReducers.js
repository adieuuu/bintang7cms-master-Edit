import { actionTypes } from '../types'

const intialState = null

export default (state = intialState, action) => {
    switch (action.type) {
        case actionTypes.LIST_MOBIL:
            return action.payload
        default:
            return state
    }
}