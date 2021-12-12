$(function () {
    var layer = layui.layer;
    var form = layui.form;

    initArtCateList()
    // 获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                let htmrStr = template('tpl-table', res);
                $('tbody').html(htmrStr);
            }
        })
    }

    // 为  添加类别  按钮绑定点击事件
    var indexAdd = null;  // 弹出层的索引 关闭的时候需要用到
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html(),
        });
    })

    //通过代理的形式 为  form-add确定添加  绑定提交事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $('#form-add').serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增失败');
                }
                layer.msg('新增成功');
                initArtCateList();
                // 根据索引关闭对应的弹出层
                layer.close(indexAdd)
            }
        })
    })


    // 通过代理的形式为btn-edit绑定点击事件
    var indexEdit = null;
    $('tbody').on('click', '#btn-edit', function () {
        // 弹出一个修改分类的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html(),
        });
        // 获取到数据的id
        let id = $(this).attr('data-id');
        //发起请求 获取数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('form-edit', res.data)
            }
        })
    })

    // 通过代理的形式为修改分类的表单绑定提交事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新失败');
                }
                layer.msg('更新成功');
                layer.close(indexEdit);
                initArtCateList();
            }
        })
    })


    // 通过代理的形式为btn-del删除绑定时间
    let indexDel = null;
    $('tbody').on('click', '#btn-del', function (e) {
        e.preventDefault();
        let id = $(this).attr('data-id');
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败');
                    }
                    layer.msg('删除成功')
                    initArtCateList();
                }
            })
            layer.close(index);
        });
    })

})