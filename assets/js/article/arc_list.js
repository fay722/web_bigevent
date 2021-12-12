$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    // 定义美化时间过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date);

        var y = padZero(dt.getFullYear());
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补0函数
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }

    // 定义一个查询的参数对象 
    // 将来请求数据的时候需要将请求参数对象提交到参数服务器
    var q = {
        pagenum: 1,  //页码值
        pagesize: 2, // 每页显示多少条数据
        cate_id: '', //文章分类的 Id
        state: '', //文章的状态，可选值有：已发布、草稿
    }

    initTable();
    initCate();
    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取失败')
                }
                // 使用模板引擎获取数据
                // console.log(res);
                let strHTML = template('tpl-table', res);
                // console.log(strHTML);
                $('tbody').html(strHTML);
                renderPage(res.total);
            }
        })
    }

    // 初始化  文章分类下拉选项  的方法 
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类失败');
                }
                // 调用模板引擎渲染分类可选项
                let strHTML = template('tpl-cate', res);
                $('[name=cate_id]').html(strHTML);
                // 让layui重新渲染一下表单区
                form.render();
            }
        })
    }


    // 为筛选表单绑定 提交事件
    $('#form-search').on('click', function (e) {
        e.preventDefault();
        // 获取表单中选中项的值
        let cate_id = $('[name=cate_id]').val()
        let state = $('[name=state]').val()
        // 为查询参数对象 q 中对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;
        // 根据最新的条件重新渲染
        initTable();
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox',   //盒子 渲染到哪里
            count: total,   //数据总数，从服务端得到
            limit: q.pagesize,//每页显示几条数据
            curr: q.pagenum,  //默认选中哪一页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换的时候触发
            // 触发jump回调的方法有两种
            // 1.点击页码的时候会触发jump回调
            // 2.只要调用laypage.render就会触发 用第二种方法 不要让触发jump
            jump: function (obj, first) {
                q.pagenum = obj.curr; //把最新的页码值赋值到q中
                q.pagesize = obj.limit;
                // console.log(first);
                if (!first) {
                    initTable();
                }
            }
        });
    }


    // 删除文章列表
    $('.layui-table').on('click', '.btn-del', function () {
        let id = $(this).attr('data-id');
        // 获取当前页面的个数
        let len = $('.btn-del').length;
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败');
                    }
                    layer.msg('删除成功');
                    // 当数据删除完成后 需要判断当前这一页中是否还有剩余的数据
                    // 如果没有 则页码-1
                    if (len === 1) {
                        // 页面上没有数据了
                        // 页码值最小为1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                }
            })

            layer.close(index);
        });
    })





    // 编辑文章列表 ****未能实现 504错误
    var p;
    var id;
    $('.layui-table').on('click', '.btn-edit', function () {
        id = $(this).attr('data-id');
        console.log(id);
        // 弹出框
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章',
            content: $('#dialog-edit').html(),
        });
        // 渲染分类
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类失败');
                }
                // 调用模板引擎渲染分类可选项
                let strHTML = template('tpl-cate', res);
                $('[name=cate_id]').html(strHTML);
                // 让layui重新渲染一下表单区
                form.render();
            }
        })
        // 渲染表单
        $.ajax({
            method: 'GET',
            url: '/my/article/' + id,
            success: function (res) {
                form.val('form-edit', res.data)
                p = res.data;
                console.log(p);
            }
        })
    })
    // 提交编辑
    $('body').on('submit', '.form-edit', function (e) {
        e.preventDefault();
        let fd = new FormData($('#form-edit')[0]);
        fd.append('content', p.content);
        fd.append('cover_img', p.cover_img);
        fd.append('state', p.state);
        // $.ajax({
        //     method: 'POST',
        //     url: '/my/article/edit',
        //     data: fd,
        //     contentType: false,
        //     processData: false,
        //     success: function (res) {
        //         console.log(res);
        //     },
        //     error: function (ress) {
        //         console.log(ress);
        //     }
        // })
        publishAticle(fd);
    })
    // 定义一个发布文章的方法
    function publishAticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/edit',
            data: fd,
            // 如果向服务器提交的是formdata数据 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败')
                }
                layer.msg('发布文章成功');
            }

        })
    }

})