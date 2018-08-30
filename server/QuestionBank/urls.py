from django.conf.urls import url

from QuestionBank import auth, public, personal, exercise, upload, homework


'''
urls.py
本小程序的url配置
'''


urlpatterns = [
    # 登录
    url(r'^signin', auth.signin),

    # 获取公共数据
    url(r'^public/get_college$', public.get_college),
    url(r'^public/get_major', public.get_major),
    url(r'^public/get_class', public.get_class),
    url(r'^public/get_subject', public.get_subject),

    # 获取个人数据
    url(r'^personal/get_myupload', personal.get_myupload),

    # 上传个人信息
    url(r'^personal/set_userinfo', personal.set_userinfo),

    # 提交题目
    url(r'^upload/choice$', upload.choice),
    url(r'^upload/judge$', upload.judge),
    url(r'^upload/fill$', upload.fill),
    url(r'^upload/discuss$', upload.discuss),

    # 获取题目
    url(r'^exercise/get_choice', exercise.get_choice),
    url(r'^exercise/get_judge', exercise.get_judge),
    url(r'^exercise/get_fill', exercise.get_fill),
    url(r'^exercise/get_discuss', exercise.get_discuss),

    # 作业
    # 列表
    url(r'^homework/list/class', homework.list_of_class),
    url(r'^homework/list/teacher', homework.list_of_teacher),
    # 布置
    url(r'^homework/assign$', homework.assign),
    # 缴交情况
    url(r'^homework/detail', homework.detail),
    # 获取作业
    url(r'^homework/get', homework.get),
    # 上交
    url(r'^homework/submit', homework.submit),

]
