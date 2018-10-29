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

const sortbyName = (p,q) => {
    return p.name.localeCompare(q.name, 'zh-Hans-CN', { sensitivity:'accent'})
}

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