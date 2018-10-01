from django.http import JsonResponse

from QuestionBank.models import User, UserProfile, Class, Choice, Fill, Judge, Discuss


'''
personal.py
个人信息相关接口
包括长传个人信息：学院/专业/班级/姓名/学号
获取该用户上传的题目
'''


# 上传个人信息
def set_userinfo(request):
    profile = UserProfile.objects.get(username=request.POST['openid'])

    infotype = request.POST['infotype']

    if infotype == 'class_id':
        clas = Class.objects.get(id=request.POST['class_id'])

        profile.clas = clas
        profile.major = clas.major
        profile.college = clas.major.college

    elif infotype == 'name':
        profile.name = request.POST['name']

    elif infotype == 'student_id':
        profile.student_id = request.POST['student_id']

    profile.save()

    response = {'status': 'success'}
    return JsonResponse(response)


# 获取上传的题目
def get_myupload(request):
    user = User.objects.get(username=request.GET['openid'])

    response = {'status': 'success',
                'choice_list': [choice.dict() for choice in Choice.objects.filter(author=user)],
                'fill_list': [fill.dict() for fill in Fill.objects.filter(author=user)],
                'judge_list': [judge.dict() for judge in Judge.objects.filter(author=user)],
                'discuss_list': [discuss.dict() for discuss in Discuss.objects.filter(author=user)]}

    return JsonResponse(response)
