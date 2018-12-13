const app = getApp()

Page({

    data: {

    },

    onLoad: function (options) {
        var url = app.globalData.host + 'paper/download' + '?openid=' + app.globalData.userInfo.openid + '&name=' + options.name

        this.setData({
            'url': url
        })
    },

    onBack: function (event) {
        wx.navigateBack()
    }
})