const app = getApp()
const util = require('../../../../utils/util.js')
Page({

    data: {
        hasLoad: false,
        subject_list: [],
    },

    onLoad: function (options) {
        this.setData({
            subject_list: app.globalData.subject
        })

        wx.request({
            url: app.globalData.host + 'teacher/get_subject',
            data: {'openid': app.globalData.userInfo.openid},
            success: response => {
                var subject_ids = response.data.subjects
                for(var i in this.data.subject_list)
                    for(var j in subject_ids)
                        if (subject_ids[j] == this.data.subject_list[i].id)
                            this.data.subject_list[i].checked = true

                this.data.subject_list.sort(util.sortSubjectByCheckedAndName)
                this.setData({
                    subject_list: this.data.subject_list,
                    hasLoad: true
                })           
            }
        })
    },

    onComfirm: function(event) {
        wx.request({
            url: app.globalData.host + 'teacher/set_subject',
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data:{
                'openid': app.globalData.userInfo.openid,
                'subjects': JSON.stringify(event.detail.value)
            },
            success: response => {
                if(response.data.status == 'success'){
                    wx.showToast({
                        title: '信息已保存',
                    })

                    setTimeout(()=>{
                        wx.navigateBack()
                    }, 1500)
                }
            }
        })
    },

    onBack: function (event) {
        wx.navigateBack()
    }
})