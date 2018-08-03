const app = getApp()

/* 各页面索取用户信息和科目信息的函数相同
 * 写成公用的减少冗余
 */


/* tab      页面：刷题、作业、出题、设置四个页面  不是题型子页面 
 * tabIndex 页面index 刷题0 作业1 出题2 设置3
 * callback 附加的回调
 */
const requireUserInfo = (tab, tabIndex, callback) => {
    // 如果此时全局已经从服务器获取了用户信息 则直接加载到页面
    if (app.globalData.hasUserInfo) {
        tab.setData({
            hasUserInfo: true,
            userInfo: app.globalData.userInfo
        })
        if (callback)
            callback()
    } else {
        // 如果全局还没获取到用户信息 则加入到app.js的回调中
        // 获取到数据后执行
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

// 同上
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