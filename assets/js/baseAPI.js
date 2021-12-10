// 每次调用get post ajax 时 会先调用这个函数
// 在这个函数中 可以拿到我们的Ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;
    // 统一为有权限的接口设置headers请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || '',
        }
    }
    //全局统一挂载complete回调函数
    options.complete = function (res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 1.强制清空token
            localStorage.removeItem('token'),
                // 2.强制跳转
                location.href = '/login.html'
        }
    }
})