const app = getApp()
const util = require('../../../../utils/util.js')

Page({

    data: {
        subject_list: [],
        subject_index: null,
    },

    onLoad: function(options) {
        this.data.subject_list = app.globalData.subject

        wx.request({
            url: app.globalData.host + 'teacher/get_subject',
            data: { 'openid': app.globalData.userInfo.openid },
            success: response => {
                var subject_ids = response.data.subjects
                for (var i in this.data.subject_list)
                    for (var j in subject_ids)
                        if (subject_ids[j] == this.data.subject_list[i].id)
                            this.data.subject_list[i].checked = true

                this.data.subject_list.sort(util.sortSubjectByCheckedAndName)
                this.setData({
                    subject_list: this.data.subject_list
                })
            }
        })
        
    },

    onSelect: function(event) {
        this.setData({
            subject_index: event.currentTarget.dataset.index
        })
    },

    onConfirm: function(event) {
        let subject = this.data.subject_list[this.data.subject_index]

        if (!subject) {
            wx.showToast({
                title: '请选择学科',
                icon: 'none'
            })
            return
        }


        wx.navigateTo({
            url: '/pages/homework/teacher/assign/assign' + '?subject=' + JSON.stringify(subject),
        })
    },

    onBack: function (event) {
        wx.navigateBack()
    }
})