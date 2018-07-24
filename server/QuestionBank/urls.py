from django.conf.urls import url

from QuestionBank import auth, public, exercise, upload

urlpatterns = [
    # 登录
    url(r'^signin', auth.signin),

    # 获取公共数据
    url(r'^public/get_college', public.get_college),
    url(r'^public/get_major', public.get_major),
    url(r'^public/get_subject', public.get_subject),

    # 提交题目
    url(r'^upload/choice$', upload.choice),

    # 获取题目
    url(r'^exercise/get_choice', exercise.get_choice),

]
