import { actionTypes } from '../types'

class TamanHerbalReducer {
    static PlantList(state = null, action) {
        switch (action.type) {
            case actionTypes.TAMAN_HERBAL_LIST:
                return action.payload
            default:
                return state
        }
    }

    static HeroList(state = null, action) {
        switch (action.type) {
            case actionTypes.TAMAN_HERBAL_HERO:
                return action.payload
            default:
                return state
        }
    }
}

export default TamanHerbalReducer