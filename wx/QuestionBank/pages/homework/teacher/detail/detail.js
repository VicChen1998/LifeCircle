const app = getApp()
Page({

    data: {

    },

    onLoad: function(options) {
        wx.request({
            url: app.globalData.host + 'homework/detail',
            data: {
                'openid': app.globalData.userInfo.openid,
                'homework_id': options.homework_id
            },
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
        })
    },

    onBack: function (event) {
        wx.navigateBack()
    }
})