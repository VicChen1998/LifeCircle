const app = getApp()

Page({

    data: {
        userInfo: null,

        motto: {
            'content': '谁知道你出的题，会不会出现在期末试卷上呢？',
            'author': 'XXX'
        },

        college_range: [],
        college_index: 0,

        major_range: [],
        college_index: 0,

        class_range: [],
        class_index: 0,

    },

    onLoad: function(options) {
        if (app.globalData.hasUserInfo) {
            this.data.userInfo = app.globalData.userInfo
        } else {
            app.settingsGetUserInfoCallback = () => {
                this.setData({
                    userInfo: app.globalData.userInfo
                })
            }
        }

        wx.request({
            url: app.globalData.host + 'public/get_college',
            success: response => {
                this.setData({
                    college_range: response.data.college
                })
            }
        })
    },

    toMyUpload: function(event) {
        wx.navigateTo({
            url: '/pages/settings/myupload/myupload'
        })
    }
})