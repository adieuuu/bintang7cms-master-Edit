import fetch from 'isomorphic-unfetch'
import { actionTypes } from '../types'

const API_URL = process.env.API_URL

export const getFactories = (page, size, sort, order, token, keyword, filter, filterOption) => async (dispatch) => {
    let _csrf = JSON.parse(token)
    let filtered = filter ? 
        filterOption.isStatus ?
            `&filters=[["status", "=", "${filterOption.value}"]` 
            :
            `&filters=[["${filterOption.value}", "between", ["${filterOption.from}", "${filterOption.to}"]]` 
        : ""
    let search = keyword ? 
        `${filtered}${filter ? `, ["and"], ` : "&filters=["}["owner.first_name","like","${keyword}"], ["or"], ["owner.email","like","${keyword}"]], ["or"], ["name","like","${keyword}"]]` 
        : 
        `${filtered}${filter ? "]" : ""}`

    let qs = `page=${page}&size=${size}&sort=${order == "desc" ? "-" : "+"}${sort}${search}`
    let url = `${API_URL}/v1/factories?${qs}`
    const res = await fetch(url, {
        headers: { 
            "Authorization": `Bearer ${_csrf.access_token}`, 
            "Accept": `application/json` 
        } 
    })
    const data = await res.json() 
    if(res.ok) { 
        await dispatch({ type: actionTypes.FACTORIES_LIST, payload: data })
        return { status: true, data: data } 
    }
    return { status: false, message: data.message } 
}

export const saveFactoryRooms = async (id, datas, token) => {
    let _csrf = JSON.parse(token)
    let url = `${API_URL}/v1/factories/${id}/rooms`
    const res = await fetch(url, {
        method: 'POST',
        headers: { 
            'Authorization': `Bearer ${_csrf.access_token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify(datas)
    })
    const data = await res.json() 
    if(res.ok) { 
        return { status: true, data: data } 
    }
    return { status: false, message: data.message } 
}

export const publishFactoryRooms = async (id, datas, token) => {
    let _csrf = JSON.parse(token)
    let url = `${API_URL}/v1/factories/${id}/publish`
    const res = await fetch(url, {
        method: 'PUT',
        headers: { 
            'Authorization': `Bearer ${_csrf.access_token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify(datas)
    })
    const data = await res.json() 
    if(res.ok) { 
        return { status: true, data: data } 
    }
    return { status: false, message: data.message } 
}

export const getFactoriesById = async (id, token) => {
    let _csrf = JSON.parse(token)
    let url = `${API_URL}/v1/factories/${id}`
    const res = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${_csrf.access_token}`, 
            'Accept': `application/json`,
            'Content-Type': 'application/json' 
        } 
    })
    const data = await res.json() 
    if(res.ok) { 
        return { status: true, data: data } 
    }
    return { status: false, message: data.message } 
}

export const getDetailChecked = async (factory_id, rooom_id, page, size, _csrf) => {
    let qs = `page=${page}&size=${size}&sort=+id`
    const url = `${API_URL}/v1/factories/${factory_id}/rooms/${rooom_id}/check_in?${qs}`
    const res = await fetch(url, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${_csrf.access_token}`, 
            'Accept': `application/json`,
            'Content-Type': 'application/json' 
        }
    })
    const data = await res.json() 
    if(res.ok) {
        return { status: true, data: data }
    }
    return { status: false, message: data.message } 
}


// SCHEDULE 
export const getMasterScheduleList = (page, size, sort, order, token, keyword) => async (dispatch) => {
    let _csrf = JSON.parse(token)
    let search = keyword ? `&filters=[["name","like","${keyword}"]]` : ''
    let qs = `page=${page}&size=${size}&sort=${order == "desc" ? "-" : "+"}${sort}${search}`
    const url = `${API_URL}/v1/schedules?${qs}`
    const res = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${_csrf.access_token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        } 
    })
    const data = await res.json() 
    if(res.ok) {
        await dispatch({ type: actionTypes.ROOM_MASTER, payload: data })
        return {status: true, data: data}
    }
    return { status: false, message: data.message }
}

export const getScheduleById = async (id, token) => {
    let _csrf = JSON.parse(token)
    const url = `${API_URL}/v1/schedules/${id}`
    const res = await fetch(url, {
        headers: { 
            'Authorization': `Bearer ${_csrf.access_token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    const data = await res.json() 
    if(res.ok) {
        return { status: true, data: data }
    }
    return { status: false, message: data.message }
}

export const editMasterScheduleById = async (id, datas, token) => {
    let _csrf = JSON.parse(token)
    const url = `${API_URL}/v1/schedules/${id}`
    const res = await fetch(url, {
        method: 'PUT',
        headers: { 
            'Authorization': `Bearer ${_csrf.access_token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify(datas)
    })
    const data = await res.json() 
    if(res.ok) {
        return { status: true }
    }
    return { status: false, message: data.message }
}

export const deleteMasterScheduleById = async (id, token) => {
    let _csrf = JSON.parse(token)
    const url = `${API_URL}/v1/schedules/${id}`
    const res = await fetch(url, {
        method: 'DELETE',
        headers: { 
            'Authorization': `Bearer ${_csrf.access_token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    const data = await res.json() 
    if(res.ok) {
        return { status: true }
    }
    return { status: false, message: data.message }
}

export const addNewMasterSchedule = async (datas, token) => {
    let _csrf = JSON.parse(token)
    const url = `${API_URL}/v1/schedules`
    const res = await fetch(url, {
        method: 'POST',
        headers: { 
            'Authorization': `Bearer ${_csrf.access_token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datas)
    })
    const data = await res.json() 
    if(res.ok) {
        return { status: true }
    }
    return { status: false, message: data.message }
} 




