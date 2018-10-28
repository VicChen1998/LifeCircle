const app = getApp()

Page({

    data: {
        hasLoad: false,

        choice_list: [],
        fill_list: [],
        judge_list: [],
        discuss_list: [],

        /* 各题型中显示详细信息的题目的index
         * 选择0 填空1 判断2 简答3
         * 默认为-1即都隐藏详细信息
         */
        show_detail: [-1, -1, -1, -1],
    },

    onLoad: function(options) {
        wx.request({
            url: app.globalData.host + 'personal/get_myupload',
            data: {
                'openid': app.globalData.userInfo.openid
            },
            success: response => {
                if (response.data.status == 'success') {

                    var fill_list = response.data.fill_list
                    for(var i in fill_list)
                        fill_list[i].answer = JSON.parse(fill_list[i].answer)

                    this.setData({
                        choice_list: response.data.choice_list,
                        fill_list: fill_list,
                        judge_list: response.data.judge_list,
                        discuss_list: response.data.discuss_list,
                        hasLoad: true
                    })
                    wx.hideNavigationBarLoading()
                }
            },
        })
    },

    /* 点击某一题目后显示该题详细信息
     * 如果该题已经是显示详细信息的状态则隐藏
     */
    onDetail: function(event) {
        // 题型index
        let type_index = event.currentTarget.dataset.type_index
        // 题目index
        let index = event.currentTarget.dataset.index

        // 如果已显示 则隐藏
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
    },

    onModify: function(event) {
        let type_index = event.currentTarget.dataset.type_index
        let index = event.currentTarget.dataset.index

        wx.navigateTo({
            url: '/pages/settings/myupload/modify/modify' + '?type_index=' + type_index + '&index=' + index
        })
    },

    onBack: function(event) {
        wx.navigateBack()
    }
})