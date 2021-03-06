const app = getApp()

Page({

    data: {
        paper_list: []
    },

    onLoad: function (options) {
        wx.request({
            url: app.globalData.host + 'paper/get_list',
            data:{
                'openid': app.globalData.userInfo.openid
            },
            success: response => {
                this.setData({
                    paper_list: response.data.paper_list
                })
            }
        })
    },

    preview: function (event){
        wx.showLoading({
            title: '加载中...',
        })

        var name = event.target.dataset.name
        var url = app.globalData.host + 'paper/download' + '?openid=' + app.globalData.userInfo.openid + '&name=' + name

        wx.downloadFile({
            url: url,
            success: response => {
                wx.openDocument({
                    filePath: response.tempFilePath,
                    complete: wx.hideLoading()
                })
            }
        })
    },


    download: function (event) {
        var name = event.target.dataset.name

        var url = app.globalData.host + 'paper/download' + '?openid=' + app.globalData.userInfo.openid + '&name=' + name

        wx.setClipboardData({
            data: url,
            success: res => {
                wx.showModal({
                    title: '下载链接已复制到剪贴板',
                    content: '请打开手机浏览器粘贴链接进行下载',
                })
            },
            fail: res => {
                wx.showModal({
                    title: '下载链接无法粘贴值剪贴板',
                    content: url,
                })
            }
        })
    },

    onBack: function (event) {
        wx.navigateBack()
    }
})