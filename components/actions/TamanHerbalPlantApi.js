import fetch from 'isomorphic-unfetch'
import { actionTypes } from '../types'

const API_URL = process.env.API_URL

export const getListTHPlant = (page, size, sort, order, token, keyword)  => async (dispatch) => {
    let _csrf = JSON.parse(token)
    let search = keyword ? `&filters=[["name","like","${keyword}"], ["or"], ["latin_name","like","${keyword}"], ["or"], ["code","like","${keyword}"]]` : ''
    let qs = `page=${page}&size=${size}&sort=${order == "desc" ? "-" : "+"}${sort}${search}`
    let url = `${API_URL}/v1/markers?${qs}`
    const res = await fetch(url, {
        headers: { 
            "Authorization": `Bearer ${_csrf.access_token}`, 
            "Accept": `application/json`,
            'Content-Type': 'application/json'
        } 
    })
    const data = await res.json() 
    if(res.ok) { 
        await dispatch({ type: actionTypes.TAMAN_HERBAL_LIST, payload: data })
        return { status: true, data: data } 
    }
    return { status: false, message: data.message } 
}

export const addNewTHPlant = async (datas, token) => {
    let _csrf = JSON.parse(token)
    let url = `${API_URL}/v1/markers`
    const res = await fetch(url, {
        method: "POST",
        headers: { 
            "Authorization": `Bearer ${_csrf.access_token}`, 
            "Accept": `application/json`,
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

export const editTHPlant = async (id, datas, token) => {
    let _csrf = JSON.parse(token)
    let url = `${API_URL}/v1/markers/${id}`
    const res = await fetch(url, {
        method: "PUT",
        headers: { 
            "Authorization": `Bearer ${_csrf.access_token}`, 
            "Accept": `application/json`,
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

export const deleteTHPlant = async (id, token) => {
    let _csrf = JSON.parse(token)
    let url = `${API_URL}/v1/markers/${id}`
    const res = await fetch(url, {
        method: "DELETE",
        headers: { 
            "Authorization": `Bearer ${_csrf.access_token}`, 
            "Accept": `application/json`,
            'Content-Type': 'application/json'
        }
    })
    const data = await res.json()  
    if(res.ok) {  
        return { status: true } 
    }
    return { status: false, message: data.message } 
}
