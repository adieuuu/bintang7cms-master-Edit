import fetch from 'isomorphic-unfetch'
import { actionTypes } from '../types'

const API_DUMMY_URL = process.env.API_DUMMY_URL

export const getListMobil = (page, len, sort, order, keywords) => async(dispatch) => {
    page = page - 1
    let name = keywords ? `&name_like=${keywords}|brand_like=${keywords}` : ''
    // const name = keywords ? `&qty_gte=${keywords}` : ''
    const params = `_start=${page*len}&_limit=${len}&_sort=${sort}&_order=${order == "desc" ? "desc" : "asc"}${name}`
    const url = `${API_DUMMY_URL}/listMobil?${params}`
    const responses = await fetch(url)
    const headers = responses.headers
    const total = headers.get('x-total-count')
    dispatch(getTotalMobil(total))
    const data = await responses.json()
    return dispatch({ type: actionTypes.LIST_MOBIL, payload: data })
}

const getTotalMobil = (data) => (dispatch) => {
    return dispatch({ type: actionTypes.TOTAL_MOBIL, payload: data })
}