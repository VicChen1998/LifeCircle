const app = getApp()

Page({

    data: {
        homework: null,
    },

    onLoad: function(options) {
        wx.request({
            url: app.globalData.host + 'homework/get',
            data: {
                'homework_id': options.homework_id
            },
            success: response => {
                this.setData({
                    homework: response.data.homework
                })
            }
        })

    },

    onBack: function(event) {
        wx.showModal({
            title: '答题进度将丢失',
            content: '确定离开？',
            confirmColor: '#f00',
            success: result => {
                if (result.confirm)
                    wx.navigateBack()
            }
        })
    }

})