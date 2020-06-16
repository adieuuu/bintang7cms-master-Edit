import { actionTypes } from '../types'

class LocationReducer {
    static locationProviceState(state = null, action) {
        switch (action.type) {
            case actionTypes.LIST_PROVINCE:
                return action.payload
            default:
                return state
        }
    }
}

export default LocationReducer