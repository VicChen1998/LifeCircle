const app = getApp()

Page({

    data: {
        // 学科
        subject: null,

        generating: false,

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

        deadline_range: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
        deadline_index: 0,

        name: '',
        default_name: '',

        class_list: []
    },

    onLoad: function(options) {
        // 初始化四个题型数量picker的range
        for (var i = 0; i <= 40; i++) {
            this.data.num_range[0].push(i)
            this.data.num_range[1].push(i)
            this.data.num_range[2].push(i)
        }

        for (var i = 0; i <= 20; i++)
            this.data.num_range[3].push(i)

        // 初始化默认名称为日期
        var date = new Date()
        var name = (date.getMonth() + 1) + '月' + date.getDate() + '日作业'

        this.setData({
            num_range: this.data.num_range,
            default_name: name,
            subject: JSON.parse(options.subject),
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
                    if (typeindex == 1) {
                        var fill = response.data.fill
                        fill.answer = JSON.parse(fill.answer)
                        this.data.questions[1].push(fill)
                    } else
                        this.data.questions[typeindex].push(response.data[response_name[typeindex]])

                    this.setData({
                        questions: this.data.questions
                    })
                }
            })
        }

    },

    onGenerate: function(event) {
        this.setData({
            generating: true
        })

        this.generate(0)
        this.generate(1)
        this.generate(2)
        this.generate(3)

        this.setData({
            show_detail: [-1, -1, -1, -1]
        })

        setTimeout(() => {
            this.setData({
                generating: false
            })
        }, 750)
    },

    onToMyUpload: function(event) {
        wx.navigateTo({
            url: '/pages/homework/teacher/assign/myupload' + '?subject=' + JSON.stringify(this.data.subject),
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

    deadlineOnChange: function(event) {
        this.setData({
            deadline_index: event.detail.value[0]
        })
    },

    onSelectClass: function(event) {
        wx.navigateTo({
            url: '/pages/homework/teacher/assign/select_class',
        })
    },

    onAssign: function(event) {
        var empty = true
        for (var typeindex in this.data.questions) {
            if (this.data.checked_index[typeindex].length != 0)
                empty = false
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
            for (var i in this.data.checked_index[typeindex]) {
                var index = this.data.checked_index[typeindex][i]
                questions[typeindex].push(this.data.questions[typeindex][i].id)
            }
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
                'questions': JSON.stringify(questions),
                'active_day': this.data.deadline_range[this.data.deadline_index]
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

    onGeneratePaper: function(event) {
        var empty = true
        for (var typeindex in this.data.questions) {
            if (this.data.checked_index[typeindex].length != 0)
                empty = false
        }

        if (empty) {
            wx.showToast({
                title: '未选择题目',
                icon: 'none'
            })
            return
        }

        var questions = []
        for (var typeindex in this.data.questions) {
            questions.push([])
            for (var i in this.data.checked_index[typeindex]) {
                var index = this.data.checked_index[typeindex][i]
                questions[typeindex].push(this.data.questions[typeindex][index].id)
            }
        }

        var name = this.data.name
        if (name.length == 0)
            name = this.data.default_name

        // 生成试卷docx
        wx.showLoading({
            title: '',
        })

        wx.request({
            url: app.globalData.host + 'paper/create',
            data: {
                'openid': app.globalData.userInfo.openid,
                'name': name,
                'subject_id': this.data.subject.id,
                'questions': JSON.stringify(questions),
            },
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: create_res => {
                if (create_res.data.status == 'success') {

                    wx.navigateBack({
                        delta: 2
                    })

                    wx.navigateTo({
                        url: '/pages/settings/teacher/paper/paper',
                    })


                    var filename = create_res.data.filename
                    // 下载临时文件
                    wx.downloadFile({
                        url: app.globalData.host + 'paper/download' + '?openid=' + app.globalData.userInfo.openid + '&name=' + filename,
                        success: download_res => {
                            // 打开预览
                            wx.openDocument({
                                filePath: download_res.tempFilePath,
                                complete: wx.hideLoading()
                            })
                        },
                        fail: response => {
                            console.log('fail')
                        },
                    })
                }
            }
        })
    },

    onToHelp: function(event) {
        wx.navigateTo({
            url: '/pages/homework/teacher/assign/help'
        })
    },

    onBack: function(event) {
        wx.navigateBack()
    }
})