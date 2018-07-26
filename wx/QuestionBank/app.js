//app.js
App({
    globalData: {
        host: 'https://www.dva-loveyou.top/questionbank/',
        // host: 'http://localhost/questionbank/',

        userInfo: null,
        hasUserInfo: false,

        subject: null,
        hasSubject: false,

        tabs: [{
            'name': '选择',
            'show': true
        }, {
            'name': '填空',
            'show': false,
        }, {
            'name': '判断',
            'show': false
        }, {
            'name': '简答',
            'show': false
        }],

    },

    onLaunch: function() {
        // 登录
        wx.login({
            success: res => {
                wx.request({
                    url: this.globalData.host + 'signin',
                    data: {
                        js_code: res.code
                    },
                    method: 'GET',
                    success: response => {
                        if (response.data.status == 'success') {
                            this.globalData.userInfo = response.data.userInfo
                            this.globalData.hasUserInfo = true
                            if (this.settingsGetUserInfoCallback)
                                this.settingsGetUserInfoCallback()
                        }
                    }
                })
            }
        })

        // 获取学科信息
        wx.request({
            url: this.globalData.host + 'public/get_subject',
            success: response => {
                this.globalData.subject = response.data.subject
                this.globalData.hasSubject = true
                if (this.exerciseGetSubjectCallback)
                    this.exerciseGetSubjectCallback()
                if (this.uploadGetSubjectCallback)
                    this.uploadGetSubjectCallback()
            }
        })
    }
})