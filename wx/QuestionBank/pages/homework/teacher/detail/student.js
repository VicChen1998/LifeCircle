const app = getApp()

Page({

    data: {
        homework: null,
        answer: null,
        submit: null
    },

    onLoad: function(options) {
        wx.request({
            url: app.globalData.host + 'homework/detail/by_student',
            data: {
                'openid': app.globalData.userInfo.openid,
                'homework_id': options.homework_id,
                'student_openid': options.student_id
            },
            success: response => {
                var submit = response.data.submit
                submit.choice = JSON.parse(submit.choice)
                submit.fill = JSON.parse(submit.fill)
                submit.judge = JSON.parse(submit.judge)
                submit.discuss = JSON.parse(submit.discuss)
                this.setData({
                    submit: submit
                })
            }
        })

        var pages = getCurrentPages()
        var prepage = pages[pages.length - 2]
        this.setData({
            homework: prepage.data.homework,
            answer: prepage.data.answer
        })
    },

    onShow: function() {

    },

    onBack: function() {
        wx.navigateBack()
    }

})