const app = getApp()

Page({

    data: {
        tabs: null,
        currentTab: 0,

        subject_range: [],
        subject_index: 0,

        choice: null,
        judge: null,

        checked: false,
        choosed: false,
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
            app.exerciseGetSubjectCallback = () => {
                this.setData({
                    subject_range: app.globalData.subject
                })
            }
        }

        this.choiceInit()
    },

    tabOnChange: function(options) {
        let newTab = options.target.dataset.index
        this.data.tabs[this.data.currentTab].show = false
        this.data.tabs[newTab].show = true
        this.setData({
            tabs: this.data.tabs,
            currentTab: newTab
        })

        if (this.data.tabs[newTab].name == '判断')
            this.judgeInit()
    },

    subjectOnChange: function(options) {
        this.setData({
            subject_index: options.detail.value
        })
    },

    choiceInit: function() {
        wx.request({
            url: app.globalData.host + 'exercise/get_choice',
            success: response => {
                if (response.data.status == 'success') {
                    this.setData({
                        choice: response.data.choice,
                        checked: false,
                        choosed: false
                    })
                    if (this.data.subject_range.length != 0) {
                        for (let i in this.data.subject_range) {
                            if (this.data.choice.subject.id == this.data.subject_range[i].id) {
                                this.setData({
                                    subject_index: i
                                })
                                break;
                            }
                        }
                    }
                }
            }
        })
    },

    choiceOnChange: function() {
        this.setData({
            choosed: true
        })
    },

    judgeInit: function() {
        wx.request({
            url: app.globalData.host + 'exercise/get_judge',
            success: response => {
                if (response.data.status == 'success') {
                    this.setData({
                        judge: response.data.judge,
                        checked: false,
                        choosed: false
                    })
                    if (this.data.subject_range.length != 0) {
                        for (let i in this.data.subject_range) {
                            if (this.data.choice.subject.id == this.data.subject_range[i].id) {
                                this.setData({
                                    subject_index: i
                                })
                                break;
                            }
                        }
                    }
                }
            }
        })
    },

    judgeOnChange: function() {
        this.setData({
            choosed: true
        })
    }



})