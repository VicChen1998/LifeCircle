const app = getApp()

Page({

    data: {
        hasLoad: false,
        stat_list: []
    },

    onLoad: function(options) {
        wx.request({
            url: app.globalData.host + 'teacher/bank_stat',
            data: {
                'openid': app.globalData.userInfo.openid
            },
            success: response => {
                this.setData({
                    stat_list: response.data.stat,
                    hasLoad: true
                })
            }
        })
    },

    toSubject: function() {
        wx.navigateTo({
            url: '/pages/settings/teacher/subject/subject',
        })
    },

    toStatDetail: function(event) {
        var subject_id = event.currentTarget.dataset.subject_id
        wx.navigateTo({
            url: '/pages/settings/teacher/bankstat/rank' + '?subject_id=' + subject_id,
        })
    },

    onBack: function() {
        wx.navigateBack()
    }
})