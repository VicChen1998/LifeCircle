const app = getApp()
const requireCallback = require('../../utils/requireCallback.js')

Page({

    data: {
        hasUserInfo: false,
        userInfo: null,

        subject_range: [],
        subject_index: 0,

        homework_list: [],
    },

    onLoad: function(options) {
        requireCallback.requireUserInfo(this, 1, () => {
            if (this.data.userInfo.isTeacher)
                this.teacharOnLoad()
            else
                this.studentOnLoad()
        })

        requireCallback.requireSubject(this, 1)
    },

    teacharOnLoad: function(options) {
        wx.request({
            url: app.globalData.host + 'homework/list/teacher',
            data: {
                'teacher_openid': this.data.userInfo.openid
            },
            success: response => {
                this.setData({
                    homework_list: response.data.homework
                })
            },
            complete: () => {
                wx.stopPullDownRefresh()
            }
        })
    },

    studentOnLoad: function(options) {
        console.log('student')
    },

    toAssign: function(options) {
        wx.navigateTo({
            url: '/pages/homework/assign/assign',
        })
    },

    onPullDownRefresh: function(event) {
        if (this.data.hasUserInfo) {
            if (this.data.userInfo.isTeacher)
                this.teacharOnLoad()
            else
                this.studentOnLoad()
        }
    }
})