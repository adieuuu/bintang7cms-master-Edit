import { actionTypes } from '../types'


class FactoryReducer {
    static FactoryState(state = null, action) {
        switch (action.type) {
            case actionTypes.FACTORIES_LIST:
                return action.payload
            default:
                return state
        }
    }

    static listGaleryState(state = null, action) {
        switch (action.type) {
            case actionTypes.LIST_GALERIES:
                return action.payload
            default:
                return state
        }
    }
}

export default FactoryReducer