const app = getApp()
const requireCallback = require('../../utils/requireCallback.js')

Page({

    data: {
        tabs: null,
        currentTab: 0,

        subject_range: [],
        subject_index: 0,

        // 装载填空题数据
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

        // 索要学科信息 回调为在学科最前加一项“请选择”并显示
        requireCallback.requireSubject(this, 2, () => {
            this.data.subject_range.unshift({
                'id': null,
                'name': '请选择学科'
            })
            this.setData({
                subject_range: this.data.subject_range
            })
        })
    },

    tabOnChange: function(event) {
        let index = event.target.dataset.index
        this.data.tabs[this.data.currentTab].show = false
        this.data.tabs[index].show = true
        this.setData({
            tabs: this.data.tabs,
            currentTab: index
        })
    },

    subjectOnChange: function(event) {
        let subject_index = event.detail.value

        // 如果选择的是“请选择学科” 则返回
        if (!this.data.subject_range[0].id && subject_index == 0) {
            return
        }

        // 选择的不是“请选择学科” 且列表里有“请选择学科” 则删除“请选择学科”
        if (!this.data.subject_range[0].id) {
            this.data.subject_range.shift()
            subject_index -= 1
            this.setData({
                subject_range: this.data.subject_range,
                subject_index: subject_index
            })
            return
        }
        
        // 正常情况
        this.setData({
            subject_index: subject_index
        })
    },

    submit_choice: function(event) {
        let data = event.detail.value
        // 检查数据 问题非空 答案非空 ABC选项非空
        if (data.question.length == 0 || data.answer.length == 0 ||
            data.option_A.length == 0 || data.option_B.length == 0 || data.option_C.length == 0) {
            this.showAlert()
            return
        }
        data.openid = app.globalData.userInfo.openid
        this.submit('choice', data)
    },

    submit_judge: function(event) {
        let data = event.detail.value
        if (data.question.length == 0 || data.answer.length == 0) {
            this.showAlert()
            return
        }
        data.openid = app.globalData.userInfo.openid
        this.submit('judge', data)
    },

    // 填空题加题目和空格
    fillOnAdd: function(event) {
        this.data.fill_items.push({
            'text': '',
            'answer': ''
        })
        this.setData({
            fill_items: this.data.fill_items
        })
    },

    // 填空题减少题目和空格
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
        this.submit('discuss', data)
    },

    /* 提交题目
     * 各题型提交的过程类似 只有url和data有区别
     * 单独写出来减少冗余
     */
    submit: function(url, data) {

        // 附上学科信息
        data.subject_id = this.data.subject_range[this.data.subject_index].id

        if (!data.subject_id) {
            wx.showToast({
                title: '请选择学科',
                icon: 'none'
            })
            return
        }

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
                    // 清空输入框
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