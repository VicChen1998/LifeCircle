const app = getApp()

Page({

    data: {
        type_index: 0,
        index: 0,

        question: null,

        subject_range: [],

        fillQuestion: '',
        fillAnswer: [],
    },

    onLoad: function(options) {
        var pages = getCurrentPages()
        var prepage = pages[pages.length - 2]

        var question
        switch (options.type_index) {
            case '0':
                question = prepage.data.choice_list[options.index];
                break;
            case '1':
                question = prepage.data.fill_list[options.index];
                break;
            case '2':
                question = prepage.data.judge_list[options.index];
                break;
            case '3':
                question = prepage.data.discuss_list[options.index];
                break;
        }

        var subject_range = app.globalData.subject
        var subject_index = 0
        for (var i in subject_range)
            if (subject_range[i].id == question.subject.id)
                subject_index = i

        this.setData({
            type_index: options.type_index,
            index: options.index,
            question: question,
            subject_range: subject_range,
            subject_index: subject_index
        })

        if (options.type_index == 1)
            this.setData({
                fillQuestion: question.question,
                fillAnswer: question.answer,
            })
    },

    subjectOnChange: function(event) {
        let subject_index = event.detail.value
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

        if (this.data.fillAnswer.length == 0) {
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

        this.submit('fill', data)
    },

    submit_judge: function(event) {
        let data = event.detail.value
        if (data.question.length == 0 || data.answer.length == 0) {
            this.showAlert()
            return
        }
        this.submit('judge', data)
    },

    submit_discuss: function(event) {
        let data = event.detail.value
        if (data.question.length == 0 || data.answer.length == 0) {
            this.showAlert()
            return
        }
        this.submit('discuss', data)
    },

    submit: function(url, data) {

        // 附上openid
        data.openid = app.globalData.userInfo.openid
        // 附上学科信息
        data.subject_id = this.data.subject_range[this.data.subject_index].id
        // 附上原题目id
        data.id = this.data.question.id

        wx.request({
            url: app.globalData.host + 'upload/modify/' + url,
            data: data,
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: response => {
                if (response.data.status == 'success') {
                    wx.showToast({
                        title: '修改成功！'
                    }, 1500)

                    setTimeout(() => {
                        wx.navigateBack()
                    }, 1500)

                    var pages = getCurrentPages()
                    var prepage = pages[pages.length - 2]

                    data.subject = this.data.subject_range[this.data.subject_index]

                    switch (this.data.type_index) {
                        case '0':
                            prepage.data.choice_list[this.data.index] = data;
                            prepage.setData({
                                choice_list: prepage.data.choice_list
                            })
                            break;
                        case '1':
                            data.answer = JSON.parse(data.answer)
                            prepage.data.fill_list[this.data.index] = data;
                            prepage.setData({
                                fill_list: prepage.data.fill_list
                            })
                            break;
                        case '2':
                            prepage.data.judge_list[this.data.index] = data;
                            prepage.setData({
                                judge_list: prepage.data.judge_list
                            })
                            break;
                        case '3':
                            prepage.data.discuss_list[this.data.index] = data;
                            prepage.setData({
                                discuss_list: prepage.data.discuss_list
                            })
                            break;
                    }
                }
            }
        })
    },

    showAlert(text = '请完整填写题目') {
        wx.showToast({
            title: text,
            icon: 'none'
        })
    },

    onBack: function(event) {
        wx.navigateBack()
    }
})