const app = getApp()

Page({

    data: {
        tabs: null,
        currentTab: 0,

        subject_range: [],
        subject_index: 0,

        choice: null,
        judge: null,
        fill: null,
        discuss: null,

        checked: false,
        choosed: false,

        fillAnswerVisiable: false,
        discussAnswerVisiable: false,

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
            app.exerciseGetSubjectCallback = () => {
                this.setData({
                    subject_range: app.globalData.subject
                })
            }
        }
    },

    onReady: function(options) {
        this.choiceInit()
    },

    tabOnChange: function(event) {
        let newTab = event.target.dataset.index
        this.data.tabs[this.data.currentTab].show = false
        this.data.tabs[newTab].show = true
        this.setData({
            tabs: this.data.tabs,
            currentTab: newTab
        })

        if (this.data.tabs[newTab].name == '填空' && this.data.fill == null)
            this.fillInit()
        if (this.data.tabs[newTab].name == '判断' && this.data.judge == null)
            this.judgeInit()
        if (this.data.tabs[newTab].name == '简答' && this.data.discuss == null)
            this.discussInit()
    },

    subjectOnChange: function(event) {
        this.setData({
            subject_index: event.detail.value
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
                        for (var i in this.data.subject_range) {
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
                        for (var i in this.data.subject_range) {
                            if (this.data.judge.subject.id == this.data.subject_range[i].id) {
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
    },

    fillInit: function() {
        wx.request({
            url: app.globalData.host + 'exercise/get_fill',
            success: response => {
                if (response.data.status == 'success') {
                    this.setData({
                        fill: response.data.fill,
                        fillAnswerVisiable: false,
                        empty: ''
                    })
                    if (this.data.subject_range.length != 0) {
                        for (var i in this.data.subject_range) {
                            if (this.data.fill.subject.id == this.data.subject_range[i].id) {
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

    fillOnAnswer: function() {
        this.setData({
            fillAnswerVisiable: true
        })
    },

    discussInit: function() {
        wx.request({
            url: app.globalData.host + 'exercise/get_discuss',
            success: response => {
                this.setData({
                    discuss: response.data.discuss,
                    discussAnswerVisiable: false
                })
                if (this.data.subject_range.length != 0) {
                    for (var i in this.data.subject_range) {
                        if (this.data.discuss.subject.id == this.data.subject_range[i].id) {
                            this.setData({
                                subject_index: i
                            })
                            break;
                        }
                    }
                }
            }
        })
    },

    discussOnAnswer: function() {
        this.setData({
            discussAnswerVisiable: true
        })
    }
})