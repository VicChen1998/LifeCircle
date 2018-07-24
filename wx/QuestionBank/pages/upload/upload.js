const app = getApp()

Page({

    data: {
        tabs: null,
        currentTab: 0,

        subject_range: [],
        subject_index: 0,

        empty: '',
    },

    onLoad: function(options) {
        this.setData({
            tabs: app.globalData.tabs
        })

        if (app.globalData.hasSubject)
            this.setData({
                subject_range: app.globalData.subject
            })
        else {
            app.uploadGetSubjectCallback = () => {
                this.setData({
                    subject_range: app.globalData.subject
                })
            }
        }
    },

    tabOnChange: function(options) {
        let newTab = options.target.dataset.index
        this.data.tabs[this.data.currentTab].show = false
        this.data.tabs[newTab].show = true
        this.setData({
            tabs: this.data.tabs,
            currentTab: newTab
        })
    },

    subjectOnChange: function(options) {
        this.setData({
            subject_index: options.detail.value
        })
    },

    submit_choice: function(options) {
        let data = options.detail.value
        data.openid = app.globalData.userInfo.openid
        data.subject_id = this.data.subject_range[this.data.subject_index].id
        wx.request({
            url: app.globalData.host + 'upload/choice',
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: data,
            success: response => {
                if (response.data.status == 'success') {
                    wx.showToast({
                        title: '提交成功！'
                    })
                    this.setData({
                        empty: ''
                    })
                }
            }
        })
    },

    submit_judge: function(options) {
        let data = options.detail.value
        data.openid = app.globalData.userInfo.openid
        data.subject_id = this.data.subject_range[this.data.subject_index].id
        wx.request({
            url: app.globalData.host + 'upload/judge',
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: data,
            success: response => {
                if (response.data.status == 'success') {
                    wx.showToast({
                        title: '提交成功！'
                    })
                    this.setData({
                        empty: ''
                    })
                }
            }
        })
    }
})