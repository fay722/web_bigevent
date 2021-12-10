$(function () {
    let form = layui.form
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须是6-12位 且不能有空格'],
        samePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同';
            }
        },
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致';
            }
        }

    })

    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('修改失败');
                }
                layui.layer.msg('修改成功');
                // 重置表单 jqurey拿到对象 [0]转换为原生dom对象
                $('.layui-form')[0].reset();
            }
        })
    })
})