const app = getApp()

Page({

    data: {
        subject_list: [],
        subject_index: null,
    },

    onLoad: function(options) {
        this.setData({
            subject_list: app.globalData.subject
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
            url: '/pages/homework/assign/assign' + '?subject=' + JSON.stringify(subject),
        })
    }
})