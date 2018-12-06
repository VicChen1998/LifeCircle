from django.conf.urls import url

from QuestionBank import auth, public, personal, teacher, exercise, upload, homework, paper, resource

'''
urls.py
本小程序的url配置
'''

urlpatterns = [
    # 登录
    url(r'^signin$', auth.signin),
    # 教师身份验证
    url(r'^teacher_auth$', auth.teacher_auth),

    # 获取公共数据
    url(r'^public/get_college$', public.get_college),
    url(r'^public/get_major$', public.get_major),
    url(r'^public/get_class$', public.get_class),
    url(r'^public/get_subject$', public.get_subject),
    # 资源
    url(r'^resource/image$', resource.image),

    # 获取个人数据
    url(r'^personal/get_myupload$', personal.get_myupload),
    url(r'^personal/get_answer_stat$', personal.get_answer_stat),
    # 收藏
    url(r'^personal/check_star$', personal.check_star),
    url(r'^personal/set_star$', personal.set_star),
    url(r'^personal/set_unstar$', personal.set_unstar),
    url(r'^personal/get_mystar$', personal.get_mystar),

    # 上传个人信息
    url(r'^personal/set_userinfo$', personal.set_userinfo),

    # 教师相关操作
    url(r'^teacher/set_college$', teacher.set_college),
    url(r'^teacher/set_subject$', teacher.set_subject),
    url(r'^teacher/get_subject$', teacher.get_subject),
    url(r'^teacher/bank_stat$', teacher.bank_stat),
    url(r'^teacher/bank_stat/student$', teacher.bank_stat_by_student),

    # 提交题目
    url(r'^upload/choice$', upload.choice),
    url(r'^upload/judge$', upload.judge),
    url(r'^upload/fill$', upload.fill),
    url(r'^upload/discuss$', upload.discuss),
    # 修改题目
    url(r'^upload/modify/choice$', upload.modify_choice),
    url(r'^upload/modify/judge$', upload.modify_judge),
    url(r'^upload/modify/fill$', upload.modify_fill),
    url(r'^upload/modify/discuss$', upload.modify_discuss),

    # 获取题目
    url(r'^exercise/get_choice$', exercise.get_choice),
    url(r'^exercise/get_judge$', exercise.get_judge),
    url(r'^exercise/get_fill$', exercise.get_fill),
    url(r'^exercise/get_discuss$', exercise.get_discuss),
    # 报错
    url(r'exercise/report_error$', exercise.report_error),
    url(r'exercise/get_error_reason$', exercise.get_error_reason),

    # 作业
    # 作业列表
    url(r'^homework/list/class$', homework.list_of_class),
    url(r'^homework/list/teacher$', homework.list_of_teacher),
    # 布置作业
    url(r'^homework/assign$', homework.assign),
    # 作业缴交情况
    url(r'^homework/detail$', homework.detail),
    # 查看学生答案
    url(r'^homework/detail/of_student$', homework.detail_of_student),
    # 查看答案分布
    url(r'^homework/detail/of_stat$', homework.detail_of_stat),
    # 获取答案
    url(r'^homework/answer$', homework.answer),
    # 获取作业
    url(r'^homework/get$', homework.get),
    # 上交
    url(r'^homework/submit$', homework.submit),

    # 生成试卷
    url(r'^paper/create$', paper.create_paper),
    # 下载试卷
    url(r'^paper/download$', paper.download),
    # 获取列表
    url(r'^paper/get_list$', paper.get_list),

]
