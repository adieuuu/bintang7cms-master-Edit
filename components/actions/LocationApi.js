import fetch from 'isomorphic-fetch'
import { actionTypes } from '../../components/types'

const API_URL = process.env.API_URL

export const getProvinces = (page, size, sort, order, token, keyword)  => async (dispatch) => {
    let _csrf = JSON.parse(token)
    let search = keyword ? `&filters=[["name","like","${keyword}"]]` : ''
    let qs = `page=${page}&size=${size}&sort=${order == "desc" ? "-" : "+"}${sort}${search}`
    let url = `${API_URL}/v1/locations/id/provinces?${qs}`
    const res = await fetch(url, {
        headers: { 
            Authorization: `Bearer ${_csrf.access_token}`, 
            Accept: `application/json` 
        } 
    })
    const data = await res.json() 
    if(res.ok) { 
        await dispatch({ type: actionTypes.LIST_PROVINCE, payload: data }) 
        return { status: true, data: data } 
    }
    return { status: false, message: data.message } 
}

export const addProvinces = async (value, token) => {
    let _csrf = JSON.parse(token)
    let url = `${API_URL}/v1/locations/id/provinces`
    const res = await fetch(url, {
        method: 'POST',
        headers: { 
            "Authorization": `Bearer ${_csrf.access_token}`, 
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({name: value}) 
    })
    const data = await res.json() 
    if(res.ok) { 
        return { status: true, data: data } 
    }
    return { status: false, message: data.message } 
}

export const editProvinces = async (value, id, token) => {
    let _csrf = JSON.parse(token)
    let url = `${API_URL}/v1/locations/id/provinces/${id}`
    const res = await fetch(url, {
        method: 'PUT',
        headers: { 
            "Authorization": `Bearer ${_csrf.access_token}`, 
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({name: value}) 
    })
    const data = await res.json() 
    if(res.ok) { 
        return { status: true, data: data } 
    }
    return { status: false, message: data.message } 
}

export const getCities = async (page, size, sort, order, token, keyword, id) => {
    let _csrf = JSON.parse(token)
    let search = keyword ? `&filters=[["name","like","${keyword}"]]` : ''
    let qs = `page=${page}&size=${size}&sort=${order == "desc" ? "-" : "+"}${sort}${search}`
    let url = `${API_URL}/v1/locations/id/provinces/${id}/cities?${qs}`
    const res = await fetch(url, {
        headers: { 
            Authorization: `Bearer ${_csrf.access_token}`, 
            Accept: `application/json` 
        } 
    })
    const data = await res.json() 
    if(res.ok) { 
        return { status: true, data: data } 
    }
    return { status: false, message: data.message } 
}

export const addCities = async (value, id, token) => {
    let _csrf = JSON.parse(token)
    let url = `${API_URL}/v1/locations/id/provinces/${id}/cities`
    const res = await fetch(url, {
        method: 'POST',
        headers: { 
            "Authorization": `Bearer ${_csrf.access_token}`, 
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({name: value}) 
    })
    const data = await res.json() 
    if(res.ok) { 
        return { status: true, data: data } 
    }
    return { status: false, message: data.message } 
}

export const editCities = async (value, provId, cityId, token) => {
    let _csrf = JSON.parse(token)
    let url = `${API_URL}/v1/locations/id/provinces/${provId}/cities/${cityId}`
    const res = await fetch(url, {
        method: 'PUT',
        headers: { 
            "Authorization": `Bearer ${_csrf.access_token}`, 
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({name: value}) 
    })
    const data = await res.json() 
    if(res.ok) { 
        return { status: true, data: data } 
    }
    return { status: false, message: data.message } 
}
