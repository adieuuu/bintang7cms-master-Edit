import fetch from 'isomorphic-fetch'
import axios from 'axios'
import { actionTypes } from '../../components/types'

const API_URL = process.env.API_URL

export const getList_masterData = (_type, page, size, sort, order, token, keyword)  => async (dispatch) => {
    let _csrf = JSON.parse(token), _paramDispatch = {}
    let search = keyword ? `&filters=[["category","=","${_type}"], ["and"], ["name","like","${keyword}"]]` : `&filters=[["category","=","${_type}"]]`
    let qs = `page=${page}&size=${size}&sort=${order == "desc" ? "-" : "+"}${sort}${search}`
    let url = `${API_URL}/v1/items?${qs}`
    const res = await fetch(url, { 
        headers: { 
            "Authorization": `Bearer ${_csrf.access_token}`, 
            "Accept": `application/json`,
            'Content-Type': 'application/json'  
        } 
    })
    const data = await res.json() 
    if(res.ok) {
        switch (_type) {
            case 'product':
                _paramDispatch = { type: actionTypes.MASTER_PRODUCT, payload: data }
                break;
            case 'package':
                _paramDispatch = { type: actionTypes.MASTER_PACKAGE, payload: data }
                break;
            case 'food':
                _paramDispatch = { type: actionTypes.MASTER_FOOD, payload: data }
                break;
            default:
                break;
        }
        await dispatch(_paramDispatch) 
        return { status: true, data: data } 
    }
    return { status: false, message: data.message }
}

export const getPage_masterData = async (_type, page = 1, size = 10, sort = 'price', _csrf) => {
    let qs = `page=${page}&size=${size}&sort=${sort}`
    let url = `${API_URL}/v1/items/${_type}?${qs}`
    return axios.get(url, {
        headers: {
            'Authorization': `Bearer ${_csrf.access_token}`, 
            'Accept': `application/json`,
            'Content-Type': 'application/json' 
        }
    })
}

export const post_masterData = async (_type, datas, token) => {
    let _csrf = JSON.parse(token)
    let url = `${API_URL}/v1/items/${_type}`
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

export const put_masterData = async (_type, datas, id, token) => {
    let _csrf = JSON.parse(token)
    let url = `${API_URL}/v1/items/${_type}/${id}`
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

export const delete_item = async (_type, id, token) => {
    let _csrf = JSON.parse(token)
    let url = `${API_URL}/v1/items/${_type}/${id}`
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
        return { status: true, data: data } 
    }
    return { status: false, message: data.message }
}

export const getFactorySettings = (token) => async (dispatch) =>  {
    let _csrf = JSON.parse(token)
    let url = `${API_URL}/v1/credit`
    const res = await fetch(url, {
        headers: { 
            "Authorization": `Bearer ${_csrf.access_token}`, 
            "Accept": `application/json`,
            'Content-Type': 'application/json' 
        } 
    })
    const data = await res.json() 
    if(res.ok) {
        await dispatch({ type: actionTypes.MASTER_SETTINGS, payload: data })
        return { status: true, data: data } 
    }
    return { status: false, message: data.message }
}

export const saveFactorySettings = (id, datas, token) => async (dispatch) => {
    let _csrf = JSON.parse(token)
    let url = `${API_URL}/v1/credit/${id}`
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
        await dispatch({ type: actionTypes.MASTER_SETTINGS, payload: data })
        return { status: true, data: data } 
    }
    return { status: false, message: data.message }
}