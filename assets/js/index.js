$(function () {
    // 调用函数获取基本信息
    getUserInfo();
    let layer = layui.layer;
    $('#btnLogout').on('click', function () {
        // 提示用户是否确认退出
        layer.confirm('确定退出登陆?', { icon: 3, title: '提示' }, function (index) {
            // 1.清空本地存储中的token
            localStorage.removeItem('token');
            // 2.重新跳转到登录页
            location.href = '/login.html';
            layer.close(index);
        });
    })
})
// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function (res) {
            if (res.status !== 0) {
                return;
            }
            // 调用渲染用户头像函数
            renderAvatar(res.data)
        },
        // 不论成功还是失败 都会调用
        // 当用户直接在url中写index.html 会强制跳转回login页面
        // complete: function (res) {
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 1.强制清空token
        //         localStorage.removeItem('token'),
        //         // 2.强制跳转
        //             location.href = '/login.html'
        //     }
        // }
        // 以上放在了baseAPI中设置
    })
}
// 渲染用户头像
function renderAvatar(user) {
    //1. 获取用户名称 并设置欢迎文本
    let name = user.nickname || user.username;
    console.log(name);
    $('#welcome').html('欢迎' + name);
    // 2.按需渲染用户的头像
    if (user.user_pic !== null) {
        // 2.1渲染图片头像
        $('.text-avatar').hide();
        $('.layui-nav-img').attr('src', user.user_pic).show;
    } else {
        // 2.2渲染文本头像
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }
}