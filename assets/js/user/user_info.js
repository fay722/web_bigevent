$(function () {
    let form = layui.form;
    let layer = layui.layer;
    // 预设表单验证
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在1-6个字符之间'
            }
        }
    })
    initUserInfo();
    // 初始化用户信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取失败')
                }
                form.val('formUserInfo', res.data)
            }
        })
    }
    // 重置点击事件
    $('#btnReset').on('click', function (e) {
        // 阻止表单的默认重置行为
        e.preventDefault();
        // 重新获取用户信息
        initUserInfo();
    })

    // 监听表单提交事件
    $('.layui-form').on('submit', function (e) {
        // 阻止表单的默认重置行为
        e.preventDefault();
        // 发起ajax数据请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status) {
                    return layer.msg('更新失败');
                }
                layer.msg('更新成功');
                // 调用父页面的方法 重新渲染欢迎信息 
                window.parent.getUserInfo();
            }
        })
    })
})