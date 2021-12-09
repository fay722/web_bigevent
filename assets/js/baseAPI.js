// 每次调用get post ajax 时 会先调用这个函数
// 在这个函数中 可以拿到我们的Ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;
})