const app = getApp()

Page({

    data: {
        // 学科
        subject: null,

        // 4个题目数picker的range
        num_range: [
            [],
            [],
            [],
            []
        ],

        // 4个题目数picker的index
        num_index: [
            [],
            [],
            [],
            []
        ],

        // 4种类型题目数据
        questions: [
            [],
            [],
            [],
            []
        ],

        // 4种类型题目的选中index
        checked_index: [
            [],
            [],
            [],
            []
        ],

        // 4种类型题目查看detail的index
        show_detail: [-1, -1, -1, -1],

        name: '',
        default_name: '',

        class_list: []
    },

    onLoad: function(options) {
        // 初始化四个题型数量picker的range
        for (var i = 0; i <= 20; i++) {
            this.data.num_range[0].push(i)
            this.data.num_range[1].push(i)
            this.data.num_range[2].push(i)
        }

        for (var i = 0; i <= 10; i++)
            this.data.num_range[3].push(i)

        // 初始化默认名称为日期
        var date = new Date()
        var name = date.getMonth() + 1 + '月' + date.getDate() + '日作业'

        this.setData({
            num_range: this.data.num_range,
            default_name: name,
            subject: JSON.parse(options.subject)
        })
    },

    // 4个题型数量picker的回调 获取当前的index存储在num_index
    numOnChange: function(event) {
        let typeindex = event.target.dataset.typeindex
        let num = event.detail.value[0]
        this.data.num_index[typeindex] = num
    },

    generate: function(typeindex) {
        // 将选中保留的题目压入新数组
        var keep = []
        for (var i in this.data.checked_index[typeindex]) {
            let index = this.data.checked_index[typeindex][i]
            keep.push(this.data.questions[typeindex][index])
        }
        this.data.questions[typeindex] = keep

        // 生成新的此题型checked_index 即为长度等于保留题目数的数组
        var sub_checked_index = []
        for (var i = 0; i < keep.length; i++)
            sub_checked_index.push(i)
        this.data.checked_index[typeindex] = sub_checked_index

        // 更新数据
        this.setData({
            questions: this.data.questions,
            checked_index: this.data.checked_index
        })

        // 如果选中保留的题目数小于需要的题目数 则向服务器获取新题目
        let range = this.data.num_range[typeindex]
        let index = this.data.num_index[typeindex]
        let num = range[index] - keep.length

        let urls = ['exercise/get_choice', 'exercise/get_fill', 'exercise/get_judge', 'exercise/get_discuss']
        let response_name = ['choice', 'fill', 'judge', 'discuss']

        for (var i = 0; i < num; i++) {
            wx.request({
                url: app.globalData.host + urls[typeindex],
                data: {
                    'subject_id': this.data.subject.id
                },
                success: response => {
                    this.data.questions[typeindex].push(response.data[response_name[typeindex]])
                    this.setData({
                        questions: this.data.questions
                    })
                }
            })
        }

    },

    onGenerate: function(event) {
        this.generate(0)
        this.generate(1)
        this.generate(2)
        this.generate(3)

        this.setData({
            show_detail: [-1, -1, -1, -1]
        })
    },

    // 显示detail
    onDetail: function(event) {
        let typeindex = event.currentTarget.dataset.typeindex
        let index = event.currentTarget.dataset.index
        // 如果当前是显示状态则隐藏，否则把show_detail[typeindex]设为题目的index
        if (index == this.data.show_detail[typeindex]) {
            this.data.show_detail[typeindex] = -1
            this.setData({
                show_detail: this.data.show_detail
            })
        } else {
            this.data.show_detail[typeindex] = index
            this.setData({
                show_detail: this.data.show_detail
            })
        }
    },

    // 选中题目回调
    onChecked: function(event) {
        let typeindex = event.currentTarget.dataset.typeindex
        let checked_list = event.detail.value
        this.data.checked_index[typeindex] = checked_list
    },

    onCheckedAll: function(event) {
        for (var typeindex in this.data.questions) {
            var checked = []
            for (var i in this.data.questions[typeindex])
                checked.push(i)
            this.data.checked_index[typeindex] = checked

            this.setData({
                checked_index: this.data.checked_index
            })

        }
    },

    onNameBlur: function(event) {
        this.setData({
            name: event.detail.value
        })
    },

    onSelectClass: function(event) {
        wx.navigateTo({
            url: '/pages/homework/assign/select_class',
        })
    },

    onAssign: function(event) {
        var empty = true
        for (var typeindex in this.data.questions) {
            if (this.data.checked_index[typeindex].length != 0)
                empty = false

            if (this.data.questions[typeindex].length != this.data.checked_index[typeindex].length) {
                wx.showToast({
                    title: '有未选中的题目',
                    icon: 'none'
                })
                return
            }
        }

        if (empty) {
            wx.showToast({
                title: '未选择题目',
                icon: 'none'
            })
            return
        }

        if (this.data.class_list.length == 0) {
            wx.showToast({
                title: '未选择班级',
                icon: 'none'
            })
            return
        }

        var questions = []
        for (var typeindex in this.data.questions) {
            questions.push([])
            for (var i in this.data.questions[typeindex])
                questions[typeindex].push(this.data.questions[typeindex][i].id)
        }

        var name = this.data.name
        if (name.length == 0)
            name = this.data.default_name

        wx.request({
            url: app.globalData.host + 'homework/assign',
            data: {
                'openid': app.globalData.userInfo.openid,
                'name': name,
                'subject_id': this.data.subject.id,
                'class': JSON.stringify(this.data.class_list),
                'questions': JSON.stringify(questions)
            },
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: response => {
                wx.showToast({
                    title: '作业布置成功',
                })
                setTimeout(() => {
                    wx.navigateBack({
                        delta: 2
                    })
                }, 1500)
            }
        })
    },

    onBack: function(event) {
        wx.navigateBack()
    }
})