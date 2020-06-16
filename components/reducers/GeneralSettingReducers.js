import { actionTypes } from '../types'

class GeneralSettingReducer {
    static SingleLinkState(state = null, action) {
        switch (action.type) {
            case actionTypes.SINGLE_LINK:
                return action.payload
            default:
                return state
        }
    }

    static listSubBannerState(state = null, action) {
        switch (action.type) {
            case actionTypes.LIST_CAMPAIGN_BANNER:
                return action.payload
            default:
                return state
        }
    }

    static FaqState(state = null, action) {
        switch (action.type) {
            case actionTypes.FAQ_STATE:
                return action.payload
            default:
                return state
        }
    }
}

export default GeneralSettingReducer