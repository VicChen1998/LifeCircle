const app = getApp()


Page({

    data: {
        prepage: null,

        college_list: [],
    },

    onLoad: function(options) {
        var pages = getCurrentPages()
        this.data.prepage = pages[pages.length - 2]

        wx.request({
            url: app.globalData.host + 'public/get_college',
            success: response => {
                this.setData({
                    college_list: response.data.college
                })
            }
        })
    },

    onSelectCollege: function(event) {
        let college_index = event.currentTarget.dataset.college_index
        if (!this.data.college_list[college_index].major_list) {
            let college_id = this.data.college_list[college_index].id
            wx.request({
                url: app.globalData.host + 'public/get_major',
                data: {
                    'college_id': college_id
                },
                success: response => {
                    this.data.college_list[college_index].major_list = response.data.major
                    this.setData({
                        college_list: this.data.college_list
                    })

                    for (var i in this.data.college_list[college_index].major_list) {
                        this.loadClass(college_index, i)
                    }
                }
            })
        }
    },

    loadClass: function(college_index, major_index) {
        let major_id = this.data.college_list[college_index].major_list[major_index].id
        wx.request({
            url: app.globalData.host + 'public/get_class',
            data: {
                'major_id': major_id
            },
            success: response => {
                this.data.college_list[college_index].major_list[major_index].class_list = response.data.class
                this.setData({
                    college_list: this.data.college_list
                })
            }
        })
    },

    onSelectClass: function(event) {
        this.data.prepage.setData({
            class_list: event.detail.value
        })
    },

    onConfirm: function(event) {
        wx.navigateBack()
    }

})