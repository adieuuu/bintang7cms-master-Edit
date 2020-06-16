import { combineReducers } from 'redux'
import TamanHerbalReducers from './TamanHerbalReducers'
import MasterDataReducers from './MasterDataReducers'
import UserReducers from './UserReducers'
import TermConditionReducers from './TermConditionReducers'
import FactoriesReducers from './FactoriesReducers'
import GeneralSettingReducers from './GeneralSettingReducers'
import LogMasterReducers from './LogMasterReducers'
import HumanResourceReducers from './HumanResourceReducers'
import LocatinReducers from './LocationReducers'
import ListMobilReducer from './ListMobilReducers'
import TotalMobilReducers from './TotalMobilReducers';

export default combineReducers({
    tamanHerbal_plant: TamanHerbalReducers.PlantList,
    tamanHerbal_hero: TamanHerbalReducers.HeroList,

    // START COMBINE USER
    myProfile: UserReducers.MyProfile,
    listUser_customer: UserReducers.CustomerState,
    listUser_administrator: UserReducers.AdminState,
    listRoles: UserReducers.RoleState,
    // END COMBINE USER

    // START COMBINE GENERAL SETTING
    termsCondition: TermConditionReducers,
    singleLink_banner: GeneralSettingReducers.SingleLinkState,
    listCampaign_banner: GeneralSettingReducers.listSubBannerState,
    faqList: GeneralSettingReducers.FaqState,
    // END COMBINE GENERAL SETTING

    // START COMBINE FACTORIES
    listFactories: FactoriesReducers.FactoryState,
    roomMaster: MasterDataReducers.RoomMaster,
    roomList: MasterDataReducers.RoomList,
    listGaleries: FactoriesReducers.listGaleryState,
    // END COMBINE FACTORIES

    // START MASTER DATA
    listProduct: MasterDataReducers.ProductState,
    listPackage: MasterDataReducers.PackageState,
    listFood: MasterDataReducers.FoodState,
    listIdentityType: MasterDataReducers.IdentityTypeState,
    factorySettings: MasterDataReducers.FactorySettingState,
    // END MASTER DATA

    // START LOG MASTER
    auditTrail: LogMasterReducers.AuditTrailState,
    balance: LogMasterReducers.BalanceState,
    // END LOG MASTER

    // START HUMAN RESOURCE
    listJob_portal: HumanResourceReducers.JobPortalState,
    listApplicants: HumanResourceReducers.ApplicantState,
    // END HUMAN RESOURCE

    // START LOCATION
    listProvince: LocatinReducers.locationProviceState,
    // END LOCATION

    // LATIHAN
    listMobil: ListMobilReducer,
    totalMobil: TotalMobilReducers
    
})
