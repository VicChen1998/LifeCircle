const app = getApp()
Page({

    data: {

        tabs: [{
            'name': '按学生',
            'show': true
        }, {
            'name': '按题目',
            'show': false,
        }],
        currentTab: 0,

        homework: null,
        submits: null,
    },

    onLoad: function(options) {

        wx.request({
            url: app.globalData.host + 'homework/get',
            data: {
                'homework_id': options.homework_id
            },
            success: response => {
                this.setData({
                    homework: response.data.homework
                })
            }
        })

        wx.request({
            url: app.globalData.host + 'homework/detail',
            data: {
                'openid': app.globalData.userInfo.openid,
                'homework_id': options.homework_id
            },
            success: response => {
                var submits = response.data.submits
                for (var i in submits){
                    submits[i].choice = JSON.parse(submits[i].choice)
                    submits[i].fill = JSON.parse(submits[i].fill)
                    submits[i].judge = JSON.parse(submits[i].judge)
                    submits[i].discuss = JSON.parse(submits[i].discuss)
                }
                this.setData({
                    submits: submits
                })
            }
        })
    },

    tabOnChange: function(event) {
        let index = event.target.dataset.index
        this.data.tabs[this.data.currentTab].show = false
        this.data.tabs[index].show = true
        this.setData({
            tabs: this.data.tabs,
            currentTab: index
        })
    },

    onBack: function(event) {
        wx.navigateBack()
    }
})