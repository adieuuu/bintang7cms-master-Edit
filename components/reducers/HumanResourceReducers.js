import { actionTypes } from '../types'

class HumanResourceReducer {
    static JobPortalState(state = null, action) {
        switch (action.type) {
            case actionTypes.LIST_JOB_PORTAL:
                return action.payload
            default:
                return state
        }
    }

    static ApplicantState(state = null, action) {
        switch (action.type) {
            case actionTypes.LIST_APPLICANTS:
                return action.payload
            default:
                return state
        }
    }
}

export default HumanResourceReducer