import { actionTypes } from '../types'

const intialState = null

export default (state = intialState, action) => {
    switch (action.type) {
        case actionTypes.TOTAL_MOBIL:
            return Number(action.payload)
        default:
            return state
    }
}