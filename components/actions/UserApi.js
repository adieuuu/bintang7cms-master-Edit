import fetch from 'isomorphic-fetch'
import Router from 'next/router'
import axios from 'axios'
import oauth from 'axios-oauth-client'
import nextCookie from 'next-cookies'
import cookie from 'js-cookie'
import { actionTypes } from '../../components/types'

const API_URL = process.env.API_URL
const CLIENT_ID = process.env.API_CLIENT_ID
const CLIENT_SECRET = process.env.API_CLIENT_SECRET

export const getMyProfile = async (access_token) => {
    const url = `${API_URL}/v1/users/me`
    const res = await fetch(url, { 
        headers: { Authorization: `Bearer ${access_token}` }
    })
    const data = await res.json() 
    if(res.ok) { 
        return { status: true, data: data } 
    }
    return { status: false, message: data.message } 
}

export const changeMyProfile = async (datas, token) => {
    let _csrf = JSON.parse(token)
    let url = `${API_URL}/v1/users/me`
    const res = await fetch(url, { 
        method: "PUT",
        headers: {
            'Authorization': `Bearer ${_csrf.access_token}`, 
            'Accept': `application/json`,
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

export const changeMyPassword = async (datas, token) => {
    let _csrf = JSON.parse(token)
    let url = `${API_URL}/v1/users/change`
    const res = await fetch(url, {
        method: "PUT",
        headers: { 
            "Authorization": `Bearer ${_csrf.access_token}`, 
            "Accept": `application/json`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datas) 
    })
    // const data = await res.json() 
    if(res.ok) {
        return { status: true, message: "Change password success." }
    }
    return { status: false, message: "Change password failed!" } 
}

const getExpireDate = (expireInSeconds) => {
    let sec = Number(expireInSeconds)
    let min = Math.floor(sec / 60)
    let dates = new Date(new Date().getTime() + min * 60 * 1000)
    return dates
}

export const userLogin = async (email, password) => {
    try {
        const getAuthorizationCode = oauth.client(axios.create(), {
            url: `${API_URL}/oauth/token`,
            grant_type: "password",
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            username: email,
            password: password
        })
        let token = await getAuthorizationCode()
        if(token) {
            const user = await getMyProfile(token.access_token)
            if(user.status) {
                const roles = user.data.account.roles
                const isAdmin = roles.filter(role => role.name != "ROLE_USER")
                if(isAdmin.length > 0) {
                    cookie.set('token', token, { expires: getExpireDate(token.expires_in) })
                    return true
                } 
                return false
            }
            return false
        }
    } catch (error) {
        return false
    }
}

export const auth = (ctx) => {
    let { token } = nextCookie(ctx)
    if(ctx.req && !token) {
        ctx.res.writeHead(302, { Location: process.env.HOST_URL + '/' })
        ctx.res.end()
    }
    if (!token) Router.push('/')
    return token
}

export const forgotPassword = async (datas) => {
    let url = `${API_URL}/oauth/forgot_password/request`
    const res = await fetch(url, { 
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json" 
        },
        body: JSON.stringify(datas)
    })
    const data = await res.json() 
    if(res.ok) {
        return { status: true, message: data.message }
    }
    return { status: false, message: data.message } 
}

export const changePasswordRequest = async (id, email, datas) => {
    let url = `${API_URL}/oauth/forgot_password/reset?key=${id}&email=${email}`
    const res = await fetch(url, { 
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json" 
        },  
        body: JSON.stringify(datas)
    })
    // const data = await res.json() 
    if(res.ok) {
        return { status: true, message: "Change password success." }
    }
    return { status: false, message: "Change password failed!" } 
}

export const customerList = (page, size, sort, order, token, keyword)  => async (dispatch) => { 
    let _csrf = JSON.parse(token)
    let search = keyword ? `&filters=[["user.roles.name", "=", "ROLE_USER"], ["and"], ["first_name","like","${keyword}"], ["and"], ["email","like","${keyword}"]]` : '&filters=[["user.roles.name", "=", "ROLE_USER"]]'
    let qs = `page=${page}&size=${size}&sort=${order == "desc" ? "-" : "+"}${sort}${search}`
    let url = `${API_URL}/v1/users?${qs}`
    const res = await fetch(url, { 
        headers: { 
            "Authorization": `Bearer ${_csrf.access_token}`, 
            "Accept": `application/json` 
        } 
    })
    const data = await res.json()
    if(res.ok) {
        await dispatch({ type: actionTypes.LIST_USER_CUSTOMER, payload: data }) 
        return { status: true, data: data }
    }
    return { status: false, message: data.message }
}

export const administratorList = (page, size, sort, order, token, keyword)  => async (dispatch) => {
    let _csrf = JSON.parse(token)
    let search = keyword ? `&filters=[["user.roles.name", "=", "ROLE_ADMIN"], ["and"], ["email","like","${keyword}"], ["and"], ["first_name","like","${keyword}"]]` : '&filters=[["user.roles.name", "=", "ROLE_ADMIN"]]'
    let qs = `page=${page}&size=${size}&sort=${order == "desc" ? "-" : "+"}${sort}${search}`
    let url = `${API_URL}/v1/users?${qs}`
    const res = await fetch(url, { 
        headers: { 
            "Authorization": `Bearer ${_csrf.access_token}`, 
            "Accept": `application/json` 
        } 
    })
    const data = await res.json() 
    if(res.ok) { 
        await dispatch({ type: actionTypes.LIST_USER_ADMIN, payload: data })
        return { status: true, data: data } 
    }
    return { status: false, message: data.message } 
}

export const getRoleList = (page = 1, size = 10, sort = 'name', ctx) => async (dispatch) => {
    const { token } = nextCookie(ctx)
    let _csrf = JSON.parse(token)
    let qs = `page=${page}&size=${size}&sort=${sort}`
    let url = `${API_URL}/v1/roles?${qs}`
    const res = await fetch(url, { 
        headers: { Authorization: `Bearer ${_csrf.access_token}`, Accept: `application/json` } 
    })
    const data = await res.json()
    return dispatch({ type: actionTypes.LIST_ROLES, payload: data }) 
}

export const registerAccount = async (datas, _csrf) => {
    let url = `${API_URL}/v1/users`
    const res = await fetch(url, { 
        method: "POST",
        headers: {
            'Authorization': `Bearer ${_csrf.access_token}`, 
            'Accept': `application/json`,
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

export const modifyUser = async (id, datas, _csrf) => {
    let url = `${API_URL}/v1/users/${id}`
    const res = await fetch(url, { 
        method: "PUT",
        headers: {
            'Authorization': `Bearer ${_csrf.access_token}`, 
            'Accept': `application/json`,
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

export const deleteUser = async (id, _csrf) => {
    let url = `${API_URL}/v1/users/${id}`
    const res = await fetch(url, { 
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${_csrf.access_token}`, 
            'Accept': `application/json`,
            'Content-Type': 'application/json'
        }
    })
    const data = await res.json() 
    if(res.ok) { 
        return { status: true } 
    }
    return { status: false, message: data.message } 
}

export const changeStatusUser = async (id, datas, _csrf) => {
    let url = `${API_URL}/v1/users/${id}/activation`
    const res = await fetch(url, { 
        method: "PUT",
        headers: {
            'Authorization': `Bearer ${_csrf.access_token}`, 
            'Accept': `application/json`,
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

export const logout = () => {
    cookie.remove("token");
    window.location.href = "/"
}