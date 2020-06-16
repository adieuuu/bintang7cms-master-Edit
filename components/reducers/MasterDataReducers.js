import { actionTypes } from '../types'

class MasterData {
	static FactorySettingState(state = null, action) {
		switch(action.type) {
			case actionTypes.MASTER_SETTINGS:
				return action.payload
			default:
				return state
		}
	}

	static FoodState(state = null, action) {
		switch (action.type) {
			case actionTypes.MASTER_FOOD:
				return action.payload
			default:
				return state
		}
	}

	static PackageState(state = null, action) {
		switch (action.type) {
			case actionTypes.MASTER_PACKAGE:
				return action.payload
			default:
				return state
		}
	}

	static ProductState(state = null, action) {
		switch (action.type) {
			case actionTypes.MASTER_PRODUCT:
				return action.payload
			default:
				return state
		}
	}

	static IdentityTypeState(state = null, action) {
		switch (action.type) {
			case actionTypes.MASTER_TYPE_IDENTITY:
				return action.payload
			default:
				return state;
		}
	}

	static RoomMaster(state = null, action) {
		switch (action.type) {
			case actionTypes.ROOM_MASTER:
				return action.payload
			default:
				return state;
		}
	}

	static RoomList(state = null, action) {
		switch (action.type) {
			case actionTypes.ROOM_LIST:
				return action.payload
			default:
				return state;
		}
	}
}


export default MasterData