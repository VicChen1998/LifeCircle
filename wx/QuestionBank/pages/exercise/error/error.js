const app = getApp()

Page({

    data: {
        typename: null,
        question_id: null,
    },

    onLoad: function(options) {
        this.setData({
            typename: options.typename,
            question_id: options.question_id
        })
    },

    onSubmit: function(event) {
        var reason = event.detail.value.reason

        if(reason.length < 5){
            wx.showToast({
                title: '至少输入5个字',
                icon: 'none'
            })
            return
        }


        wx.request({
            url: app.globalData.host + 'exercise/report_error',
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                'openid': app.globalData.userInfo.openid,
                'typename': this.data.typename,
                'question_id': this.data.question_id,
                'reason': event.detail.value.reason
            },
            success: response => {
                if(response.data.status == 'success'){
                    wx.showToast({
                        title: '提交成功'
                    })

                    setTimeout(function() {
                        wx.navigateBack()
                    }, 1500)
                }

            }
        })
    },

    onBack: function(event) {
        wx.navigateBack()
    }
})