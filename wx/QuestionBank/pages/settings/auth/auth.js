const app = getApp()

Page({

    data: {
        showSubmitBt: true,
        showSuccessView: false,
    },

    onLoad: function(options) {

    },

    submit: function(event) {
        let data = event.detail.value

        if(data.name.length < 2 || data.work_num.length < 6)
            return

        data.openid = app.globalData.userInfo.openid

        wx.request({
            url: app.globalData.host + 'teacher_auth',
            data: data,
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: response => {
                if (response.data.status == 'success') {
                    wx.showToast({
                        title: '验证成功',
                    })
                    this.setData({
                        showSubmitBt: false,
                        showSuccessView: true,
                    })
                } else switch (response.data.errCode) {
                    case -1:
                        wx.showModal({
                            title: '该账号已被绑定',
                            content: '如被误绑请联系tel:18030066873 / qq:895419327',
                        })
                        break
                    case -2:
                        wx.showModal({
                            title: '姓名或教职工号错误',
                            content: '请检查输入是否有误',
                        })
                        break


                }
            }
        })
    },

    onBack: function(event) {
        wx.navigateBack()
    }
})