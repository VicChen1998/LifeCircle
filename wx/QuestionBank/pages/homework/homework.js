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
        requireCallback.requireUserInfo(this, 1)
        requireCallback.requireSubject(this, 1)
    },

    onShow: function(event) {
        if (this.data.hasUserInfo) {
            if (this.data.userInfo != app.globalData.userInfo)
                this.setData({
                    userInfo: app.globalData.userInfo
                })

            if (app.globalData.userInfo.isTeacher)
                this.teacharOnLoad()
            else
                this.studentOnLoad()
        } else {
            setTimeout(this.onShow, 50)
        }
    },

    teacharOnLoad: function(options) {
        wx.request({
            url: app.globalData.host + 'homework/list/teacher',
            data: {
                'teacher_openid': app.globalData.userInfo.openid
            },
            success: response => {
                this.setData({
                    homework_list: response.data.homework
                })
            }
        })
    },

    studentOnLoad: function(options) {
        wx.request({
            url: app.globalData.host + 'homework/list/class',
            data: {
                'class_id': app.globalData.userInfo.class.id
            },
            success: response => {
                this.setData({
                    homework_list: response.data.homework
                })
            }
        })
    },

    toAssign: function(options) {
        wx.navigateTo({
            url: '/pages/homework/assign/select_subject',
        })
    },
})