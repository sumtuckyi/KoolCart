import axios from "axios"

// 쇼핑몰 서버로 요청을 보내는 경우
export const shop = axios.create({
    baseURL: "http://i10a101.p.ssafy.io:8000/"
})


// 애플리케이션 서버로 요청을 보내는 경우 
export const stock = axios.create({
    baseURL: "/"
})

// You can specify config defaults that will be applied to every request.
shop.defaults.headers.post['Content-Type'] = 'application/json'
stock.defaults.headers.post['Content-Type'] = 'application/json'
stock.defaults.headers.put['Content-Type'] = 'application/json'

// You can intercept requests or responses before they are handled by then or catch.
shop.interceptors.request.use(function (config) {
    return config;
}, function (error) {
    return Promise.reject(error);
})

shop.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    return Promise.reject(error);
})

stock.interceptors.request.use(function (config) {
    return config;
}, function (error) {
    return Promise.reject(error);
})

stock.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    return Promise.reject(error);
})

// 테스트해보기




// 앱 서버로 요청을 보내는 경우
