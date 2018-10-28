const app = getApp()
const requireCallback = require('../../utils/requireCallback.js')

Page({

    data: {
        hasLoad: false,

        hasUserInfo: false,
        userInfo: null,

        homework_list: [],
    },

    onLoad: function(options) {
        // 索要用户信息
        requireCallback.requireUserInfo(this, 1)
    },

    onShow: function(event) {

        // 每次显示时刷新数据

        // 如果有用户信息
        if (this.data.hasUserInfo) {
            // 如果此页面的用户信息和全局的用户信息不一样
            // 则拉取全局的用户信息
            // 保证用户在设置界面更改过信息后能够正常使用
            if (this.data.userInfo != app.globalData.userInfo)
                this.setData({
                    userInfo: app.globalData.userInfo
                })
            
            // 根据不用身份初始化页面
            if (app.globalData.userInfo.isTeacher)
                this.teacharOnLoad()
            else
                this.studentOnLoad()
        } else {
            // 如果没有用户信息 等待50ms再检查
            setTimeout(this.onShow, 50)
        }
    },

    // 教师身份：加载此教师布置的作业列表
    teacharOnLoad: function(options) {
        wx.request({
            url: app.globalData.host + 'homework/list/teacher',
            data: {
                'teacher_openid': app.globalData.userInfo.openid
            },
            success: response => {
                this.setData({
                    homework_list: response.data.homework,
                    hasLoad: true
                })
            }
        })
    },

    // 学生身份：加载所在班级被布置的作业列表
    studentOnLoad: function(options) {
        wx.request({
            url: app.globalData.host + 'homework/list/class',
            data: {
                'class_id': app.globalData.userInfo.class.id
            },
            success: response => {
                this.setData({
                    homework_list: response.data.homework,
                    hasLoad: true
                })
            }
        })
    },

    // 教师布置作业 跳转到选择科目界面
    toAssign: function(event) {
        wx.navigateTo({
            url: '/pages/homework/teacher/assign/select_subject',
        })
    },

    /* 点击某一项作业
     * 教师进入作业详情页面
     * 学生进入做作业页面
     */ 
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