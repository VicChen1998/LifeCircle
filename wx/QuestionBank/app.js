const util = require('/utils/util.js')

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

        // 加载到用户信息后各页面的回调
        requireUserInfo: [null, null, null, null],
        // 加载到科目信息后各页面的回调
        requireSubject: [null, null, null, null]
    },

    onLaunch: function() {
        // 登录
        wx.showLoading({
            title: '登录中'
        })
        // 向微信服务器获取js_code
        wx.login({
            success: res => {
                // 将js_code提交到服务器获取用户信息
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
                            // 如果有回调的话执行回调函数
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
            // 无论成功与否隐藏加载框
            complete: () => {
                wx.hideLoading()
            }
        })

        // 获取学科信息
        wx.request({
            url: this.globalData.host + 'public/get_subject',
            success: response => {
                this.globalData.subject = response.data.subject.sort(util.sortbyName)
                this.globalData.hasSubject = true
                for (var i in this.globalData.requireSubject) {
                    if (this.globalData.requireSubject[i])
                        this.globalData.requireSubject[i]()
                }
            }
        })
    },

    onShareAppMessage: function(options) {
        return {
            path: '/pages/exercise/exercise',
            imageUrl: this.globalData.host + 'resource/image?name=relay.jpg'
        }
    },

    onNetworkError: function(errMsg = '连接服务器失败') {
        this.showError(errMsg)
    },

    showError: function(errMsg) {
        wx.showToast({
            title: errMsg,
            icon: 'none'
        })
    }
})



/*     _______ ____  _____   ____
 *    |__   __/ __ \|  __ \ / __ \
 *       | | | |  | | |  | | |  | |
 *       | | | |  | | |  | | |  | |
 *       | | | |__| | |__| | |__| |
 *       |_|  \____/|_____/ \____/
 *
 * Implement
 * 教师查看作业情况 按题目显示统计数据
 * 查看作业情况　网络延迟适配优化
 * 生成试卷
 * 修改界面闪烁修复
 * 教师查看题库题目
 * 锁定问题
 * 班级管理/题目审核
 * 答题排行
 * 
 * UI
 * 整体样式
 */