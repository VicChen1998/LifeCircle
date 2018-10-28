const app = getApp()
const requireCallback = require('../../utils/requireCallback.js')

Page({

    data: {
        tabs: null,
        currentTab: 0,

        subject_range: [],
        subject_index: 0,

        fillQuestion: '',
        fillAnswer: [],

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
        this.submit('choice', data)
    },

    submit_judge: function(event) {
        let data = event.detail.value
        if (data.question.length == 0 || data.answer.length == 0) {
            this.showAlert()
            return
        }
        this.submit('judge', data)
    },

    // 填空题
    fillQuestionOnInput: function(event) {
        this.data.fillQuestion = event.detail.value
    },

    fillAnswerOnInput: function(event) {
        let index = event.target.dataset.index
        this.data.fillAnswer[index] = event.detail.value
        this.setData({
            fillAnswer: this.data.fillAnswer
        })
    },

    fillOnAddAnswer: function(event) {
        this.data.fillQuestion += '______'
        this.data.fillAnswer.push('')
        this.setData({
            fillQuestion: this.data.fillQuestion,
            fillAnswer: this.data.fillAnswer
        })
    },

    fillOnDeleteAnswer: function(event) {
        this.data.fillAnswer.pop()
        this.setData({
            fillAnswer: this.data.fillAnswer
        })
    },

    submit_fill: function(event) {

        if (this.data.fillQuestion.length == 0) {
            this.showAlert()
            return
        }

        if(this.data.fillAnswer.length == 0){
            this.showAlert('点击左下角加号挖空')
            return
        }

        for (var i in this.data.fillAnswer) {
            if (this.data.fillAnswer[i].length == 0) {
                this.showAlert()
                return
            }
        }

        var data = {
            'question': this.data.fillQuestion,
            'answer': JSON.stringify(this.data.fillAnswer),
            'answer_count': this.data.fillAnswer.length,
            'comment': event.detail.value.comment
        }

        this.submit('fill', data, () => {
            this.setData({
                fillQuestion: '',
                fillAnswer: []
            })
        })
    },

    submit_discuss: function(event) {
        let data = event.detail.value
        if (data.question.length == 0 || data.answer.length == 0) {
            this.showAlert()
            return
        }
        this.submit('discuss', data)
    },

    /* 提交题目
     * 各题型提交的过程类似 只有url和data有区别
     * 单独写出来减少冗余
     */
    submit: function(url, data, callback) {

        // 附上openid
        data.openid = app.globalData.userInfo.openid
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

                    if (callback)
                        callback()
                }
            }
        })
    },

    showAlert(text ='请完整填写题目') {
        wx.showToast({
            title: text,
            icon: 'none'
        })
    }

})