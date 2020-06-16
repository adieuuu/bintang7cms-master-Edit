import { actionTypes } from '../types'

class LogMasterReducer {
    static AuditTrailState(state = null, action) {
        switch (action.type) {
            case actionTypes.AUDIT_TRAIL:
                return action.payload
            default:
                return state
        }
    }

    static BalanceState(state = null, action) {
        switch (action.type) {
            case actionTypes.BALANCE:
                return action.payload
            default:
                return state
        }
    }
}

export default LogMasterReducer