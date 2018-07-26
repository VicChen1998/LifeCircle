const app = getApp()

Page({

    data: {
        choice_list: null,
        fill_list: null,
        judge_list: null,
        discuss_list: null,

        show_detail: [-1, -1, -1, -1],
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

    onDetail: function(event) {
        let type_index = event.currentTarget.dataset.type_index
        let index = event.currentTarget.dataset.index
        if (index == this.data.show_detail[type_index]) {
            this.data.show_detail[type_index] = -1
            this.setData({
                show_detail: this.data.show_detail
            })
        } else {
            this.data.show_detail[type_index] = index
            this.setData({
                show_detail: this.data.show_detail
            })
        }
    }
})