const app = getApp()

Page({

    data: {
        choice_list: null,
        fill_list: null,
        judge_list: null,
        discuss_list: null,

        choiceShowDetail: -1,
        fillShowDetail: -1,
        judgeShowDetail: -1,
        discussShowDetail: -1,
    },

    onLoad: function(options) {
        wx.showNavigationBarLoading()
        wx.request({
            url: app.globalData.host + 'personal/get_upload',
            data: {
                'openid': app.globalData.userInfo.openid
            },
            success: response => {
                if (response.data.status == 'success') {
                    this.setData({
                        choice_list: response.data.choice_list,
                        fill_list: response.data.fill_list,
                        judge_list: response.data.judge_list,
                        discuss_list: response.data.discuss_list,
                    })
                    wx.hideNavigationBarLoading()
                }
            }
        })
    },

    choiceOnDetail: function(event) {
        this.setData({
            choiceShowDetail: event.currentTarget.dataset.index
        })
    },
    
    fillOnDetail: function(event) {
        this.setData({
            fillShowDetail: event.currentTarget.dataset.index
        })
    },

    judgeOnDetail: function(event) {
        this.setData({
            judgeShowDetail: event.currentTarget.dataset.index
        })
    },

    discussOnDetail: function(event) {
        this.setData({
            discussShowDetail: event.currentTarget.dataset.index
        })
    }
})