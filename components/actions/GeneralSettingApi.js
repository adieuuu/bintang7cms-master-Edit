import fetch from 'isomorphic-fetch'
import { actionTypes } from '../../components/types'

const API_URL = process.env.API_URL

// START GET 
export const getTermConditions = (token)  => async (dispatch) => {
    let _csrf = JSON.parse(token)
    let url = `${API_URL}/v1/cms/tnc/single`
    const res = await fetch(url, { 
        headers: { 
            "Authorization": `Bearer ${_csrf.access_token}`, 
            "Accept": "application/json",
            "Content-Type": "application/json" 
        } 
    })
    const data = await res.json() 
    if(res.ok) { 
        await dispatch({ type: actionTypes.TERMS_AND_CONDITIONS, payload: data })
        return { status: true, data: data } 
    }
    return { status: false, message: data.message }
}

export const putTermConditions = (datas, token) => async (dispatch) => {
    let _csrf = JSON.parse(token)
    let url = `${API_URL}/v1/cms/tnc/single`
    const res = await fetch(url, { 
        method: "PUT",
        headers: { 
            "Authorization": `Bearer ${_csrf.access_token}`, 
            "Accept": "application/json",
            "Content-Type": "application/json" 
        },
        body: JSON.stringify(datas) 
    })
    const data = await res.json()
    if(res.ok) { 
        await dispatch({ type: actionTypes.TERMS_AND_CONDITIONS, payload: data })
        return { status: true, data: data } 
    }
    return { status: false, message: data.message }
}

export const getListFaq = (page, size, sort, order, token, keyword)  => async (dispatch) => {
    let _csrf = JSON.parse(token)
    let search = keyword ? `&filters=[["title","like","${keyword}"]]` : ''
    let qs = `page=${page}&size=${size}&sort=${order == "desc" ? "-" : "+"}${sort}${search}`
    let url = `${API_URL}/v1/cms/faq?${qs}`
    const res = await fetch(url, { 
        headers: {
            'Authorization': `Bearer ${_csrf.access_token}`, 
            'Accept': `application/json`,
            'Content-Type': 'application/json' 
        }
    })
    const data = await res.json()
    if(res.ok) { 
        await dispatch({ type: actionTypes.FAQ_STATE, payload: data })
        return { status: true, data: data } 
    }
    return { status: false, message: data.message }
}

export const putListFaq = async (datas, token) => {
    let _csrf = JSON.parse(token)
    let url = `${API_URL}/v1/cms/faq/${datas.id}`
    const res = await fetch(url, { 
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${_csrf.access_token}`, 
            "Accept": "application/json",
            "Content-Type": "application/json" 
        },
        body: JSON.stringify(datas) 
    })
    const data = await res.json()
    if(res.ok) { 
        return { status: true, data: data } 
    }
    return { status: false, message: data.message }
}

export const deleteListFaq = async (id, token) => {
    let _csrf = JSON.parse(token)
    let url = `${API_URL}/v1/cms/faq/${id}`
    const res = await fetch(url, { 
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${_csrf.access_token}`, 
            "Accept": "application/json",
            "Content-Type": "application/json" 
        }
    })
    const data = await res.json()
    if(res.ok) { 
        return { status: true, data: data } 
    }
    return { status: false, message: data.message }
}

export const postListFaq = async (datas, token) => {
    let _csrf = JSON.parse(token)
    let url = `${API_URL}/v1/cms/faq`
    const res = await fetch(url, { 
        method: "POST",
        headers: {
            "Authorization": `Bearer ${_csrf.access_token}`, 
            "Accept": "application/json",
            "Content-Type": "application/json" 
        },
        body: JSON.stringify(datas) 
    })
    const data = await res.json()
    if(res.ok) { 
        return { status: true, data: data } 
    }
    return { status: false, message: data.message }
}

export const getSingleLinkBanner = (token)  => async (dispatch) => {
    let _csrf = JSON.parse(token)
    let url = `${API_URL}/v1/cms/single_banner/single/links`
    const res = await fetch(url, { 
        headers: {
            "Authorization": `Bearer ${_csrf.access_token}`, 
            "Accept": "application/json",
            "Content-Type": "application/json" 
        }
    })
    const data = await res.json()
    if(res.ok) { 
        await dispatch({ type: actionTypes.SINGLE_LINK, payload: data }) 
        return { status: true, data: data } 
    }
    return { status: false, message: data.message }
}

export const putSingleLinkBanner = (datas, token) => async (dispatch) => {
    let _csrf = JSON.parse(token)
    let url = `${API_URL}/v1/cms/single_banner/single/links`
    const res = await fetch(url, { 
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${_csrf.access_token}`, 
            "Accept": "application/json",
            "Content-Type": "application/json" 
        },
        body: JSON.stringify(datas) 
    })
    const data = await res.json()
    if(res.ok) { 
        await dispatch({ type: actionTypes.SINGLE_LINK, payload: data }) 
        return { status: true, data: data } 
    }
    return { status: false, message: data.message }
}

export const getListBannerCampaign = (page, size, sort, order, token, keyword)  => async (dispatch) => {
    let _csrf = JSON.parse(token)
    let search = keyword ? `&filters=[["title","like","${keyword}"]]` : ''
    let qs = `page=${page}&size=${size}&sort=${order == "desc" ? "-" : "+"}${sort}${search}`
    let url = `${API_URL}/v1/cms/mobile_news?${qs}`
    const res = await fetch(url, {
        headers: { 
            "Authorization": `Bearer ${_csrf.access_token}`, 
            "Accept": "application/json",
            "Content-Type": "application/json" 
        } 
    })
    const data = await res.json() 
    if(res.ok) { 
        await dispatch({ type: actionTypes.LIST_CAMPAIGN_BANNER, payload: data })
        return { status: true, data: data } 
    }
    return { status: false, message: data.message } 
}

export const putBannerCampaign = async (datas, token) => {
    let _csrf = JSON.parse(token)
    let url = `${API_URL}/v1/cms/mobile_news/${datas.id}`
    const res = await fetch(url, {
        method: "PUT",
        headers: { 
            "Authorization": `Bearer ${_csrf.access_token}`, 
            "Accept": "application/json",
            "Content-Type": "application/json" 
        },
        body: JSON.stringify(datas) 
    })
    const data = await res.json() 
    if(res.ok) {
        return { status: true, data: data } 
    }
    return { status: false, message: data.message } 
}

export const postBannerCampaign = async (datas, token) => {
    let _csrf = JSON.parse(token)
    let url = `${API_URL}/v1/cms/mobile_news`
    const res = await fetch(url, {
        method: "POST",
        headers: { 
            "Authorization": `Bearer ${_csrf.access_token}`, 
            "Accept": "application/json",
            "Content-Type": "application/json" 
        },
        body: JSON.stringify(datas) 
    })
    const data = await res.json() 
    if(res.ok) {
        return { status: true, data: data } 
    }
    return { status: false, message: data.message } 
}

export const deleteBannerCampaign = async (datas, token) => {
    let _csrf = JSON.parse(token)
    let url = `${API_URL}/v1/cms/mobile_news/${datas.id}`
    const res = await fetch(url, {
        method: "DELETE",
        headers: { 
            "Authorization": `Bearer ${_csrf.access_token}`, 
            "Accept": "application/json",
            "Content-Type": "application/json" 
        }
    })
    const data = await res.json() 
    if(res.ok) {
        return { status: true, data: data } 
    }
    return { status: false, message: data.message } 
}

