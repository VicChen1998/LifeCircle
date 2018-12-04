const app = getApp()
const requireCallback = require('../../utils/requireCallback.js')

Page({

    data: {
        hasUserInfo: false,
        userInfo: null,

        answer_stat: {
            'choice': '',
            'fill': '',
            'judge': '',
            'discuss': ''
        },

        motto: {
            'content': '谁知道你出的题，会不会出现在期末试卷上呢？',
            'author': 'XXX'
        },

        // 学院picker数据
        college_range: [],
        college_index: 0,

        // 专业picker数据
        major_range: [],
        college_index: 0,

        // 班级picker数据
        class_range: [],
        class_index: 0,

    },

    onLoad: function(options) {

        // 索要用户信息 回调为初始化学院信息
        requireCallback.requireUserInfo(this, 3, this.initCollege)

    },

    onShow: function() {
        if (this.data.hasUserInfo && !this.data.userInfo.isTeacher) {
            wx.request({
                url: app.globalData.host + 'personal/get_answer_stat',
                data: {
                    'openid': app.globalData.userInfo.openid
                },
                success: response => {
                    this.setData({
                        answer_stat: response.data.answer_stat
                    })
                }
            })
        }
    },

    // 初始化学院
    initCollege: function() {
        wx.request({
            url: app.globalData.host + 'public/get_college',
            success: response => {
                let college_list = response.data.college
                let college_index = 0
                // 如果有学院信息则picker指向相应的学院并加载专业信息
                if (this.data.userInfo.college) {
                    for (var i in college_list)
                        if (this.data.userInfo.college.id == college_list[i].id) {
                            college_index = i
                            break
                        }
                    this.initMajor(college_list[college_index].id)
                }
                // 否则显示"请选择"
                else {
                    college_list.unshift({
                        'id': null,
                        'name': '请选择'
                    })
                }

                this.setData({
                    college_range: college_list,
                    college_index: college_index,
                })
            }
        })
    },

    // 初始化专业信息
    initMajor: function(college_id) {
        if(this.data.userInfo.isTeacher)
            return

        wx.request({
            url: app.globalData.host + 'public/get_major',
            data: {
                'college_id': college_id
            },
            success: response => {
                let major_list = response.data.major
                let major_index = 0
                // 如果有专业信息则picker指向相应的专业并加载班级信息
                var check = false
                if (this.data.userInfo.major) {
                    for (var i in major_list)
                        if (this.data.userInfo.major.id == major_list[i].id) {
                            major_index = i
                            check = true
                            break
                        }
                    this.initClass(major_list[major_index].id)
                }
                // 无专业信息或专业不在列表中则显示"请选择"
                if (!this.data.userInfo.major || !check) {
                    major_list.unshift({
                        'id': null,
                        'name': '请选择'
                    })
                }

                this.setData({
                    major_range: major_list,
                    major_index: major_index,
                })
            }
        })
    },

    // 初始化班级信息
    initClass: function(major_id) {
        wx.request({
            url: app.globalData.host + 'public/get_class',
            data: {
                'major_id': major_id
            },
            success: response => {
                let class_list = response.data.class
                let class_index = 0
                var check = false
                // 如果有班级信息则picker指向相应的班级
                if (this.data.userInfo.class)
                    for (var i in class_list)
                        if (this.data.userInfo.class.id == class_list[i].id) {
                            class_index = i
                            check = true
                            break
                        }

                // 无班级信息或班级不在列表中则显示"请选择"
                if (!this.data.userInfo.class || !check) {
                    class_list.unshift({
                        'id': null,
                        'name': "请选择",
                        'shortname': '请选择',
                    })
                }

                this.setData({
                    class_range: class_list,
                    class_index: class_index
                })
            }
        })
    },

    onCollegeChange: function(event) {
        let index = event.detail.value
        // 如果选择的是“请选择”则直接返回
        if (!this.data.college_range[index].id)
            return

        this.setData({
            college_index: index
        })
        this.initMajor(this.data.college_range[index].id)
    },

    onMajorChange: function(event) {
        let index = event.detail.value
        // 如果选择的是“请选择”则直接返回
        if (!this.data.major_range[index].id)
            return

        this.setData({
            major_index: index
        })
        this.initClass(this.data.major_range[index].id)
    },

    onClassChange: function(event) {
        let index = event.detail.value
        this.setData({
            class_index: index
        })
        // 检测选项是否合法
        if (this.data.class_range[index].id) {
            // 如果原来存在数据且未改变则直接返回
            if (this.data.userInfo.class && this.data.class_range[index].id == this.data.userInfo.class.id)
                return
            // 否则上传数据
            this.upload('class_id', this.data.class_range[index].id)
        }
    },

    onNameBlur: function(event) {
        let name = event.detail.value
        // 检测选项是否合法 检测是否发生改变
        if (name.length >= 2 && name != this.data.userInfo.name)
            this.upload('name', name)
    },

    onStudentIdBlur: function(event) {
        let student_id = event.detail.value
        // 检测选项是否合法 检测是否发生改变
        if (student_id.length == 11 && student_id != this.data.userInfo.student_id)
            this.upload('student_id', student_id)
    },

    /* 上传保存用户信息
     * infotype 信息类型 'class_id' / 'name' / 'student_id'
     * info 信息 班级id / 名字 / 学号
     */
    upload: function(infotype, info) {

        var data = {
            'openid': this.data.userInfo.openid,
            'infotype': infotype,
        }

        data[infotype] = info

        wx.request({
            url: app.globalData.host + 'personal/set_userinfo',
            data: data,
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: response => {
                if (response.data.status == 'success') {
                    wx.showToast({
                        title: '信息已保存',
                    })

                    // 更新本地数据
                    switch (infotype) {
                        case 'class_id':
                            var clas
                            for (var i in this.data.class_range)
                                if (this.data.class_range[i].id == info)
                                    clas = this.data.class_range[i]

                            // FIXME 最好能更新学院和专业
                            app.globalData.userInfo.class = clas
                            this.data.userInfo.class = clas
                            break
                        case 'name':
                            app.globalData.userInfo.name = info
                            this.data.userInfo.name = info
                            break
                        case 'student_id':
                            app.globalData.userInfo.student_id = info
                            this.data.userInfo.student_id = info
                            break
                    }
                }
            }
        })
    },

    /* 老师相关 */
    // 修改所属院系
    onTeacherCollegeChange: function(event) {
        let index = event.detail.value
        // 如果选择的是“请选择”则直接返回
        if (!this.data.college_range[index].id)
            return

        this.setData({
            college_index: index
        })

        var college = this.data.college_range[this.data.college_index]

        wx.request({
            url: app.globalData.host + 'teacher/set_college',
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                'openid': app.globalData.userInfo.openid,
                'college_id': college.id
            },
            success: response => {
                if (response.data.status == 'success') {
                    app.globalData.userInfo.college = college
                    this.data.userInfo.college = college

                    wx.showToast({
                        title: '信息已保存',
                    })
                }
            }
        })
    },

    // 选择课程
    toTeacherCourse: function(event) {
        wx.navigateTo({
            url: '/pages/settings/teacher/subject/subject',
        })
    },

    // 查看题库统计
    toBankStat: function(event) {
        wx.navigateTo({
            url: '/pages/settings/teacher/bankstat/bankstat',
        })
    },

    // 跳转到“我出的题”页面
    toMyUpload: function(event) {
        wx.navigateTo({
            url: '/pages/settings/myupload/myupload'
        })
    },

    // 我的收藏
    toMyStar: function(event) {
        wx.navigateTo({
            url: '/pages/settings/mystar/mystar',
        })
    },

    toMyPaper: function(event){
        wx.navigateTo({
            url: '/pages/settings/teacher/paper/paper',
        })
    }
})