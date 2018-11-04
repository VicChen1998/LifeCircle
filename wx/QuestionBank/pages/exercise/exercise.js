const app = getApp()
const requireCallback = require('../../utils/requireCallback.js')

Page({

    data: {

        /* 四个题型的子页面切换标签
         * 刷题界面和出题界面的切换标签一样
         * 放只在app.js里 以后改起来方便
         */
        tabs: null,
        currentTab: 0,

        // 科目切换组件的数据
        subject_range: [],
        subject_index: 0,
        subject: null,

        // 各题型数据
        choice: null,
        judge: null,
        fill: null,
        discuss: null,

        // 与选择、判断题所有radio的checked绑定
        // 加载新题目时使选项都恢复未选中状态
        checked: false,

        // 与填空、简答题输入框的value绑定
        // 加载新题目时清空输入框
        empty: '',

        // 各题型答案可见性
        choiceAnswerVisiable: false,
        fillAnswerVisiable: false,
        judgeAnswerVisiable: false,
        discussAnswerVisiable: false
    },

    onLoad: function(options) {
        // 从app.js获取tabs列表
        this.setData({
            tabs: app.globalData.tabs
        })

        // 索要科目列表
        requireCallback.requireSubject(this, 0, () => {
            if (this.data.choice) {
                this.changeSubject(this.data.choice.subject.id)
            }
        })
        // 加载选择题
        this.choiceInit()
    },

    // 切换题型(子页面)
    tabOnChange: function(event) {
        // 获取索引
        let index = event.target.dataset.index
        // 隐藏原页面
        this.data.tabs[this.data.currentTab].show = false
        // 显示新页面
        this.data.tabs[index].show = true
        // 刷新数据
        this.setData({
            tabs: this.data.tabs,
            currentTab: index
        })

        /* 更新科目信息为当前题目的科目
         * 选择题在小程序打开时就已经加载好
         * 其他题型如果没有题目则加载
         */
        if (this.data.tabs[index].name == '选择')
            this.changeSubject(this.data.choice.subject.id)

        if (this.data.tabs[index].name == '填空') {
            if (this.data.fill == null)
                this.fillInit()
            else
                this.changeSubject(this.data.fill.subject.id)
        }

        if (this.data.tabs[index].name == '判断') {
            if (this.data.judge == null)
                this.judgeInit()
            else
                this.changeSubject(this.data.judge.subject.id)
        }

        if (this.data.tabs[index].name == '简答') {
            if (this.data.discuss == null)
                this.discussInit()
            else
                this.changeSubject(this.data.discuss.subject.id)
        }
    },

    /* 用户切换学科
     * 未设置时不限制学科
     * 向服务器随机获取所有学科的题目
     * 设置后只获取这一学科的题目
     */
    subjectOnChange: function(event) {
        let subject_index = event.detail.value
        let subject = this.data.subject_range[subject_index]
        this.setData({
            subject_index: subject_index,
            subject: subject
        })
        // 各题型的题目如果不属于这个学科 则重新加载
        if (this.data.choice && this.data.choice.subject.id != subject.id)
            this.choiceInit()
        if (this.data.fill && this.data.fill.subject.id != subject.id)
            this.fillInit()
        if (this.data.judge && this.data.judge.subject.id != subject.id)
            this.judgeInit()
        if (this.data.discuss && this.data.discuss.subject.id != subject.id)
            this.discussInit()
    },

    /* 更新学科组件
     * 接收subject_id
     * 在subject_range中搜索相应学科的index并设置
     */
    changeSubject: function(subject_id) {
        for (var i in this.data.subject_range) {
            if (subject_id == this.data.subject_range[i].id) {
                this.setData({
                    subject_index: i
                })
                break
            }
        }
    },

    // 加载选择题
    choiceInit: function() {
        var data = {}
        // 如果没有设置学科 则无需附上学科参数 服务器返回随机题目
        if (this.data.subject)
            data.subject_id = this.data.subject.id
        if (app.globalData.hasUserInfo)
            data.openid = app.globalData.userInfo.openid

        wx.request({
            url: app.globalData.host + 'exercise/get_choice',
            data: data,
            success: response => {
                if (response.data.status == 'success') {
                    this.setData({
                        // 更新题目
                        choice: response.data.choice,
                        // 隐藏答案
                        choiceAnswerVisiable: false,
                        // 所有radio恢复未选中状态
                        checked: false,
                    })
                    // 更新学科信息为新题目的学科
                    this.changeSubject(response.data.choice.subject.id)
                } else {
                    this.onQuestionNotExist()
                }
            },
            fail: app.onNetworkError
        })
    },

    // 选择后显示答案
    choiceOnChange: function() {
        this.setData({
            choiceAnswerVisiable: true
        })
    },

    // 加载填空题
    fillInit: function() {
        var data = {
            'openid': app.globalData.userInfo.openid
        }
        if (this.data.subject)
            data.subject_id = this.data.subject.id

        wx.request({
            url: app.globalData.host + 'exercise/get_fill',
            data: data,
            success: response => {
                if (response.data.status == 'success') {
                    var fill = response.data.fill
                    fill.answer = JSON.parse(fill.answer)
                    this.setData({
                        fill: fill,
                        fillAnswerVisiable: false,
                        // 清空所有input
                        empty: ''
                    })
                    this.changeSubject(response.data.fill.subject.id)
                } else {
                    this.onQuestionNotExist()
                }
            },
            fail: app.onNetworkError
        })
    },

    // 点击左下角完成图标后显示答案
    fillOnAnswer: function() {
        this.setData({
            fillAnswerVisiable: true
        })
    },

    // 加载判断题
    judgeInit: function() {
        var data = {
            'openid': app.globalData.userInfo.openid
        }
        if (this.data.subject)
            data.subject_id = this.data.subject.id

        wx.request({
            url: app.globalData.host + 'exercise/get_judge',
            data: data,
            success: response => {
                if (response.data.status == 'success') {
                    this.setData({
                        judge: response.data.judge,
                        judgeAnswerVisiable: false,
                        checked: false,
                    })
                    this.changeSubject(response.data.judge.subject.id)
                } else {
                    this.onQuestionNotExist()
                }
            },
            fail: app.onNetworkError
        })
    },

    judgeOnChange: function() {
        this.setData({
            judgeAnswerVisiable: true
        })
    },

    // 加载简答题
    discussInit: function() {
        var data = {
            'openid': app.globalData.userInfo.openid
        }
        if (this.data.subject)
            data.subject_id = this.data.subject.id

        wx.request({
            url: app.globalData.host + 'exercise/get_discuss',
            data: data,
            success: response => {
                if (response.data.status == 'success') {
                    this.setData({
                        discuss: response.data.discuss,
                        discussAnswerVisiable: false
                    })
                    this.changeSubject(response.data.discuss.subject.id)
                } else {
                    this.onQuestionNotExist()
                }
            },
            fail: app.onNetworkError
        })
    },

    discussOnAnswer: function() {
        this.setData({
            discussAnswerVisiable: true
        })
    },

    onQuestionNotExist: function() {
        app.showError('题库里还没有' + this.data.subject_range[this.data.subject_index].name + '的题目')
    },

    onShareAppMessage: app.onShareAppMessage
})