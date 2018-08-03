const app = getApp()

Page({

    data: {
        homework: null,

        /* 各题型答案
         * 选择、判断、简答为一维数组 一个元素存储一题答案
         * 填空为二维数组 每个元素也是数组 存储该题每个空的答案
         */
        choice_answer: [],
        fill_answer: [],
        judge_answer: [],
        discuss_answer: [],
    },

    onLoad: function(options) {
        // 获取作业
        wx.request({
            url: app.globalData.host + 'homework/get',
            data: {
                'homework_id': options.homework_id
            },
            success: response => {
                this.setData({
                    homework: response.data.homework
                })

                // 初始化答案数组
                for (var i in this.data.homework.choice)
                    this.data.choice_answer.push(null)
                for (var i in this.data.homework.fill) {
                    this.data.fill_answer.push([])
                    for (var j in this.data.homework.fill[i].answer)
                        if (this.data.homework.fill[i].answer[j] > 0)
                            this.data.fill_answer[i].push(null)
                }
                for (var i in this.data.homework.judge)
                    this.data.judge_answer.push(null)
                for (var i in this.data.homework.discuss)
                    this.data.discuss_answer.push(null)
            }
        })

    },

    /* 选择、判断 选中后更新答案数组数据
     * 填空 每填一空更新答案数据
     * 简答 写完一题更新
     */
    choiceOnChange: function(event) {
        let index = event.currentTarget.dataset.index
        let answer = event.detail.value
        this.data.choice_answer[index] = answer
    },

    fillOnBlur: function(event) {
        let index = event.currentTarget.dataset.index
        let subindex = event.currentTarget.dataset.subindex
        let answer = event.detail.value
        this.data.fill_answer[index][subindex] = answer
    },

    judgeOnChange: function(event) {
        let index = event.currentTarget.dataset.index
        let answer = event.detail.value
        this.data.judge_answer[index] = answer
    },

    discussOnBlur: function(event) {
        let index = event.currentTarget.dataset.index
        let answer = event.detail.value
        this.data.discuss_answer[index] = answer
    },

    // 提交答案
    onSubmit: function(event) {
        // 检查是否有没做的题目
        if (!this.checkComplete()) {
            wx.showToast({
                title: '有未完成的题目！',
                icon: 'none'
            })
            return
        }

        wx.request({
            url: app.globalData.host + 'homework/submit',
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                'openid': app.globalData.userInfo.openid,
                'homework_id': this.data.homework.id,
                // 直接把答案数组以json格式发送到服务器
                'choice': JSON.stringify(this.data.choice_answer),
                'fill': JSON.stringify(this.data.fill_answer),
                'judge': JSON.stringify(this.data.judge_answer),
                'discuss': JSON.stringify(this.data.discuss_answer),
            },
            success: response => {
                if(response.data.status == 'success'){
                    wx.showToast({
                        title: '作业提交成功'
                    })
                    setTimeout(wx.navigateBack, 1500)
                } else {
                    // 提交失败显示服务器错误信息 目前只定义了重复提交
                    wx.showToast({
                        title: response.data.errMsg,
                        icon: 'none',
                        duration: 3000,
                    })
                }
            }
        })
    },

    // 检查各答案数组是否有为null的元素
    // 有则代表有题目没做
    checkComplete: function() {
        for (var i in this.data.choice_answer)
            if (!this.data.choice_answer[i])
                return false

        for (var i in this.data.fill_answer)
            for (var j in this.data.fill_answer[i])
                if (!this.data.fill_answer[i][j])
                    return false

        for (var i in this.data.judge_answer)
            if (!this.data.judge_answer[i])
                return false

        for (var i in this.data.discuss_answer)
            if (!this.data.discuss_answer[i])
                return false

        return true
    },

    onBack: function(event) {
        wx.showModal({
            title: '答题进度将丢失',
            content: '确定离开？',
            confirmColor: '#ff0000',
            success: result => {
                if (result.confirm)
                    wx.navigateBack()
            }
        })
    }

})