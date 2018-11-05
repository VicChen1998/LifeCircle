const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

/* 获取近似的显示长度
 * 英文字符算1个 中文字符算2个 
 */
const getAbsoluteLength = str => {
    var absolute = 0;
    for (var i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) < 128)
            absolute += 1
        else
            absolute += 2
    }
    return absolute
}

// 根据课程名字拼音首字母排序
const sortbyName = (p,q) => {
    return p.name.localeCompare(q.name, 'zh-Hans-CN', { sensitivity:'accent'})
}

// 先按是否是我的课程排序 再按拼音首字母排序
const sortSubjectByCheckedAndName = (p,q) => {
    if((!p.checked && ! q.checked) || (p.checked && q.checked))
        return sortbyName(p,q)
    else
        return p.checked ? -1 : 1

}

module.exports = {
    formatTime: formatTime,
    getAbsoluteLength: getAbsoluteLength,
    sortbyName: sortbyName,
    sortSubjectByCheckedAndName: sortSubjectByCheckedAndName
}