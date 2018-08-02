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

    toAssign: function(event) {
        wx.navigateTo({
            url: '/pages/homework/teacher/assign/select_subject',
        })
    },

    homeworkOnTap: function(event) {
        let homework_id = event.currentTarget.dataset.id
        if (app.globalData.userInfo.isTeacher) {
            wx.navigateTo({
                url: '/pages/homework/teacher/detail/detail' + '?homework_id=' + homework_id,
            })

        } else {
            wx.navigateTo({
                url: '/pages/homework/doHomework/doHomework' + '?homework_id=' + homework_id,
            })
        }
    }
})