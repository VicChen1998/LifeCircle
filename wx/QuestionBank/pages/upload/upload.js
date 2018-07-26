const util = require('../../utils/util.js')

const app = getApp()

Page({

    data: {
        tabs: null,
        currentTab: 0,

        subject_range: [],
        subject_index: 0,

        fill_items: [{
            'text': '',
            'answer': ''
        }],

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

    tabOnChange: function(event) {
        let newTab = event.target.dataset.index
        this.data.tabs[this.data.currentTab].show = false
        this.data.tabs[newTab].show = true
        this.setData({
            tabs: this.data.tabs,
            currentTab: newTab
        })
    },

    subjectOnChange: function(event) {
        this.setData({
            subject_index: event.detail.value
        })
    },

    submit_choice: function(event) {
        let data = event.detail.value
        if (data.question.length == 0 || data.answer.length == 0 ||
            data.option_A.length == 0 || data.option_B.length == 0 || data.option_C.length == 0) {
            this.showAlert()
            return
        }
        data.openid = app.globalData.userInfo.openid
        data.subject_id = this.data.subject_range[this.data.subject_index].id
        this.submit('choice', data)
    },

    submit_judge: function(event) {
        let data = event.detail.value
        if (data.question.length == 0 || data.answer.length == 0) {
            this.showAlert()
            return
        }
        data.openid = app.globalData.userInfo.openid
        data.subject_id = this.data.subject_range[this.data.subject_index].id
        this.submit('judge', data)
    },

    fillOnAdd: function(event) {
        this.data.fill_items.push({
            'text': '',
            'answer': ''
        })
        this.setData({
            fill_items: this.data.fill_items
        })
    },

    fillOnRemove: function(event) {
        this.data.fill_items.pop()
        this.setData({
            fill_items: this.data.fill_items
        })
    },

    fillTextOnBlur: function(event) {
        let value = event.detail.value
        let index = event.target.dataset.index
        this.data.fill_items[index].text = value
    },

    fillAnswerOnBlur: function(event) {
        let value = event.detail.value
        let index = event.target.dataset.index
        this.data.fill_items[index].answer = value
    },

    submit_fill: function(event) {

        if (this.data.fill_items[0].text.length == 0 || this.data.fill_items[0].answer.length == 0) {
            this.showAlert()
            return
        }

        var data = {
            'openid': app.globalData.userInfo.openid,
            'subject_id': this.data.subject_range[this.data.subject_index].id,
            'items': JSON.stringify(this.data.fill_items),
            'comment': event.detail.value.comment
        }

        this.submit('fill', data)
    },

    submit_discuss: function(event) {
        let data = event.detail.value
        if (data.question.length == 0 || data.answer.length == 0) {
            this.showAlert()
            return
        }
        data.openid = app.globalData.userInfo.openid
        data.subject_id = this.data.subject_range[this.data.subject_index].id
        this.submit('discuss', data)
    },

    submit: function(url, data) {
        wx.request({
            url: app.globalData.host + 'upload/' + url,
            data: data,
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
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

    showAlert() {
        wx.showToast({
            title: '请完整填写题目',
            icon: 'none'
        })
    }

})