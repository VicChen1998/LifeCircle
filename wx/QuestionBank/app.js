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

        requireUserInfo: [null, null, null, null],
        requireSubject: [null, null, null, null]
    },

    onLaunch: function() {
        // 登录
        wx.showLoading({
            title: '登录中'
        })
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
                            for (var i in this.globalData.requireUserInfo) {
                                if (this.globalData.requireUserInfo[i])
                                    this.globalData.requireUserInfo[i]()
                            }
                        } else {
                            wx.showToast({
                                title: '登录失败',
                                icon: 'none',
                                duration: 3000,
                            })
                        }
                    },
                })
            },
            fail: () => {
                wx.showToast({
                    title: '登录失败，请检查网络连接',
                    icon: 'none',
                    duration: 3000,
                })
            },
            complete: () => {
                wx.hideLoading()
            }
        })

        // 获取学科信息
        wx.request({
            url: this.globalData.host + 'public/get_subject',
            success: response => {
                this.globalData.subject = response.data.subject
                this.globalData.hasSubject = true
                for (var i in this.globalData.requireSubject) {
                    if (this.globalData.requireSubject[i])
                        this.globalData.requireSubject[i]()
                }
            }
        })
    }
})