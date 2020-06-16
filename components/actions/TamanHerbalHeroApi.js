import fetch from 'isomorphic-unfetch'
import { actionTypes } from '../types'

const API_URL = process.env.API_URL

export const getListTHHero = (page, size, sort, order, token, keyword)  => async (dispatch) => {
    let _csrf = JSON.parse(token)
    let search = keyword ? `&filters=[["name","like","${keyword}"]]` : ''
    let qs = `page=${page}&size=${size}&sort=${order == "desc" ? "-" : "+"}${sort}${search}`
    let url = `${API_URL}/v1/heroes?${qs}`
    const res = await fetch(url, {
        headers: { 
            "Authorization": `Bearer ${_csrf.access_token}`, 
            "Accept": `application/json`,
            'Content-Type': 'application/json'
        } 
    })
    const data = await res.json() 
    if(res.ok) { 
        await dispatch({ type: actionTypes.TAMAN_HERBAL_HERO, payload: data })
        return { status: true, data: data } 
    }
    return { status: false, message: data.message } 
}

export const addNewTHHero = async (datas, token) => {
    let _csrf = JSON.parse(token)
    let url = `${API_URL}/v1/heroes`
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

export const editTHHero = async (datas, token) => {
    let _csrf = JSON.parse(token)
    let url = `${API_URL}/v1/heroes`
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

export const deleteTHHero = async ( token) => {
    let _csrf = JSON.parse(token)
    let url = `${API_URL}/v1/heroes`
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
