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
        answer: null,
        submits: null,

        choice_stat: [],
        judge_stat: [],
    },

    onLoad: function(options) {

        wx.request({
            url: app.globalData.host + 'homework/detail',
            data: {
                'openid': app.globalData.userInfo.openid,
                'homework_id': options.homework_id
            },
            success: response => {
                this.setData({
                    homework: response.data.homework,
                    submits: response.data.submits
                })
            }
        })

        wx.request({
            url: app.globalData.host + 'homework/answer',
            data: {
                'openid': app.globalData.userInfo.openid,
                'homework_id': options.homework_id
            },
            success: response => {
                this.setData({
                    answer: response.data.answer
                })
            }
        })

        wx.request({
            url: app.globalData.host + 'homework/detail/of_stat',
            data: {
                'openid': app.globalData.userInfo.openid,
                'homework_id': options.homework_id
            },
            success: response => {
                this.setData({
                    choice_stat: response.data.choice_stat,
                    judge_stat: response.data.judge_stat
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

    toDetailByStudent: function(event) {
        wx.navigateTo({
            url: '/pages/homework/teacher/detail/student' +
                '?homework_id=' + this.data.homework.id +
                '&student_id=' + event.target.dataset.student_id,
        })
    },

    onBack: function(event) {
        wx.navigateBack()
    }
})