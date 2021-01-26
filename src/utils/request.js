import Taro from '@tarojs/taro'
let { API_USER, API_USER_LOGIN } = { API_USER: "", API_USER_LOGIN: "" }

const CODE_SUCCESS = '200';//成功状态码
const CODE_AUTH_EXPIRED = '600';//未授权

function getStorage(key) {
    return Taro.getStorage({ key }).then(res => res.data).catch(() => '')
}

function updateStorage(data = {}) {
    return Promise.all([
        Taro.setStorage({ key: 'token', data: data['3rdSession'] || '' }),
        Taro.setStorage({ key: 'uid', data: data['uid'] || '' })
    ])
}

export default async function request(url, options) {
    const { data={}, method = 'GET', showToast = true, autoLogin = true } = options?options:{}
    const token = await getStorage('token')
    const header = token ? { 'WX-PIN-SESSION': token, 'X-WX-3RD-Session': token } : {}
    if (method === 'POST') {
        header['content-type'] = 'application/json'
    }

    return Taro.request({
        url,
        method,
        data,
        header
    }).then(async (res) => {
        const { code, data } = res.data
        //错误处理
        const defaultMsg = data.code === CODE_AUTH_EXPIRED ? '登录失效' : '错误信息'
        if (false) {
            if (code === CODE_AUTH_EXPIRED) {
                await updateStorage({});
                //未授权退回登录
                Taro.navigateTo({
                    url: '/pages/user-login/user-login'
                })
            }
            if (showToast) {
                Taro.showToast({
                    title: data && data.errorMsg || defaultMsg,
                    icon: 'none'
                })
            }
            return Promise.reject(res.data)
        }

        if (url === API_USER_LOGIN) {
            await updateStorage(data)
        }

        // XXX 用户信息需展示 uid，但是 uid 是登录接口就返回的，比较蛋疼，暂时糅合在 fetch 中解决
        if (url === API_USER) {
            const uid = await getStorage('uid')
            return { ...data, uid }
        }

        return res.data
    }).catch((err) => {


        return Promise.reject({ ...err })
    })
}