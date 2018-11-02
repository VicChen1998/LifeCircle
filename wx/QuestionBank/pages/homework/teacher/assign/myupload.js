const app = getApp()

Page({

    data: {
        hasLoad: false,

        subject: null,

        choice_list: [],
        fill_list: [],
        judge_list: [],
        discuss_list: [],

        /* 各题型中显示详细信息的题目的index
         * 选择0 填空1 判断2 简答3
         * 默认为-1即都隐藏详细信息
         */
        show_detail: [-1, -1, -1, -1],

        checked: [
            [],
            [],
            [],
            []
        ]
    },

    onLoad: function(options) {

        this.data.subject = JSON.parse(options.subject)

        wx.request({
            url: app.globalData.host + 'personal/get_myupload',
            data: {
                'openid': app.globalData.userInfo.openid,
                'subject_id': this.data.subject.id
            },
            success: response => {
                if (response.data.status == 'success') {

                    var fill_list = response.data.fill_list
                    for (var i in fill_list)
                        fill_list[i].answer = JSON.parse(fill_list[i].answer)

                    this.setData({
                        subject: this.data.subject,
                        choice_list: response.data.choice_list,
                        fill_list: fill_list,
                        judge_list: response.data.judge_list,
                        discuss_list: response.data.discuss_list,
                        hasLoad: true
                    })
                    wx.hideNavigationBarLoading()
                }
            },
        })
    },

    /* 点击某一题目后显示该题详细信息
     * 如果该题已经是显示详细信息的状态则隐藏
     */
    onDetail: function(event) {
        // 题型index
        let type_index = event.currentTarget.dataset.type_index
        // 题目index
        let index = event.currentTarget.dataset.index

        // 如果已显示 则隐藏
        if (index == this.data.show_detail[type_index]) {
            this.data.show_detail[type_index] = -1
            this.setData({
                show_detail: this.data.show_detail
            })
        } else {
            this.data.show_detail[type_index] = index
            this.setData({
                show_detail: this.data.show_detail
            })
        }
    },

    onSelect: function(event){
        let type_index = event.currentTarget.dataset.type_index

        this.data.checked[type_index] = event.detail.value
    },

    onConfirm: function(event){
        var pages = getCurrentPages()
        var prepage = pages[pages.length - 2]

        for(var i in this.data.checked[0]){
            var index = this.data.checked[0][i]
            var choice = this.data.choice_list[index]
            prepage.data.questions[0].push(choice)
        }

        for (var i in this.data.checked[1]) {
            var index = this.data.checked[1][i]
            var fill = this.data.fill_list[index]
            prepage.data.questions[1].push(fill)
        }

        for (var i in this.data.checked[2]) {
            var index = this.data.checked[2][i]
            var judge = this.data.judge_list[index]
            prepage.data.questions[2].push(judge)
        }

        for (var i in this.data.checked[3]) {
            var index = this.data.checked[3][i]
            var discuss = this.data.discuss_list[index]
            prepage.data.questions[3].push(discuss)
        }

        prepage.setData({
            questions: prepage.data.questions
        })

        wx.navigateBack()        
    },

    onBack: function(event) {
        wx.navigateBack()
    }
})