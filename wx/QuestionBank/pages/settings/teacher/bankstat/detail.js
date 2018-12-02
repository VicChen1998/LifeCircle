const app = getApp()

Page({

    data: {
        subject: null,
        ranks: []
    },

    onLoad: function (options) {
        wx.request({
            url: app.globalData.host + 'teacher/bank_stat/student',
            data:{
                'openid': app.globalData.userInfo.openid,
                'subject_id': options.subject_id
            },
            success: response => {
                if(response.data.status == 'success'){
                    this.setData({
                        subject: response.data.subject,
                        ranks: response.data.ranks
                    })
                }
            }
        })
    },

    onBack: function () {
        wx.navigateBack()
    }
})