import fetch from 'isomorphic-fetch'
import { actionTypes } from '../../components/types'

const API_URL = process.env.API_URL

export const getLogTrail = (page, size, sort, order, token, keyword)  => async (dispatch) => {
    let _csrf = JSON.parse(token)
    let search = keyword ? `&filters=[["owner.first_name","like","${keyword}"], ["name","like","${keyword}"], ["quantity","like","${keyword}"]]` : ''
    let qs = `page=${page}&size=${size}&sort=${order == "desc" ? "-" : "+"}${sort}${search}`
    let url = `${API_URL}/v1/log_transaction?${qs}`
    const res = await fetch(url, { 
        headers: { 
            "Authorization": `Bearer ${_csrf.access_token}`, 
            "Accept": `application/json` 
        } 
    })
    const data = await res.json() 
    if(res.ok) { 
        await dispatch({ type: actionTypes.AUDIT_TRAIL, payload: data })
        return { status: true, data: data } 
    }
    return { status: false, message: data.message }
}
