const app = getApp()

Page({

    data: {
        hasLoad: false,
        stat_list: []
    },

    onLoad: function(options) {
        wx.request({
            url: app.globalData.host + 'teacher/bank_stat',
            data: {'openid': app.globalData.userInfo.openid},
            success: response => {
                this.setData({
                    stat_list: response.data.stat,
                    hasLoad: true
                })
            }
        })
    },

    onBack: function(){
        wx.navigateBack()
    }
})