const app = getApp()

const requireUserInfo = (tab, tabIndex, callback) => {
    if (app.globalData.hasUserInfo) {
        tab.setData({
            hasUserInfo: true,
            userInfo: app.globalData.userInfo
        })
        if (callback)
            callback()
    } else {
        app.globalData.requireUserInfo[tabIndex] = () => {
            tab.setData({
                hasUserInfo: true,
                userInfo: app.globalData.userInfo
            })
            if (callback)
                callback()
        }
    }
}

const requireSubject = (tab, tabIndex, callback) => {
    if (app.globalData.hasSubject) {
        tab.setData({
            subject_range: app.globalData.subject
        })
        if (callback)
            callback()
    } else {
        app.globalData.requireSubject[tabIndex] = () => {
            tab.setData({
                subject_range: app.globalData.subject
            })
            if (callback)
                callback()
        }
    }
}

module.exports = {
    requireUserInfo: requireUserInfo,
    requireSubject: requireSubject
}