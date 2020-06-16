import { actionTypes } from '../types'

const initialState = null

export default (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.USER_CUSTOMER_TOTAL:
			return action.payload
		default:
			return state
	}
}