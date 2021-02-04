import Taro from '@tarojs/taro'

const CODE_SUCCESS = '0000';//成功状态码
const CODE_AUTH_EXPIRED = '0009';//未授权

function getStorage(key) {
    return Taro.getStorage({ key }).then(res => res.data).catch(() => '')
}

function updateStorage(data = {}) {
    return Promise.all([
        Taro.setStorage({ key: 'token', data: data })
    ])
}

export default async function request(url, options) {
    const { data={}, method = 'GET', showToast = false, autoLogin = true } = options?options:{}
    const token = await getStorage('token');
    console.log(token)
    const header = token ? { token } : {}
    if (method === 'POST') {
        header['content-type'] = 'application/json'
    }

    return Taro.request({
        url,
        method,
        data,
        header
    }).then(async (res) => {
        const { code,data,msg } = res.data
        //错误处理
        const defaultMsg = code === CODE_AUTH_EXPIRED ? '登录失效' : '错误信息';
        if (showToast) {
            Taro.showToast({
                title: msg || defaultMsg,
                icon: 'none'
            })
        }
        if (code != CODE_SUCCESS) {
            if (code === CODE_AUTH_EXPIRED) {
                await updateStorage({});
            }
            return res.data
        }

        return res.data
    }).catch((err) => {


        return Promise.reject({ ...err })
    })
}