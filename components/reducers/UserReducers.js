import { actionTypes } from '../types'

class UserReducer {
    static MyProfile(state = null, action) {
        switch (action.type) {
            case actionTypes.MY_PROFILE:
                return action.payload
            default:
                return state
        }
    }

    static AdminState(state = null, action) {
        switch (action.type) {
            case actionTypes.LIST_USER_ADMIN:
                return action.payload
            default:
                return state
        }
    }

    static CustomerState(state = null, action) {
        switch (action.type) {
            case actionTypes.LIST_USER_CUSTOMER:
                return action.payload
            default:
                return state
        }
    }

    static RoleState(state = null, action) {
        switch (action.type) {
            case actionTypes.LIST_ROLES:
                return action.payload
            default:
                return state
        }
    }
}

export default UserReducer