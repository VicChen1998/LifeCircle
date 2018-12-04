from django.http import JsonResponse

from QuestionBank.models import *

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

    if 'subject_id' not in request.GET:
        response = {'choice_list': [choice.dict() for choice in Choice.objects.filter(author=user)],
                    'fill_list': [fill.dict() for fill in Fill.objects.filter(author=user)],
                    'judge_list': [judge.dict() for judge in Judge.objects.filter(author=user)],
                    'discuss_list': [discuss.dict() for discuss in Discuss.objects.filter(author=user)]}
    else:
        subject = Subject.objects.get(id=request.GET['subject_id'])
        response = {'choice_list': [choice.dict() for choice in Choice.objects.filter(author=user, subject=subject)],
                    'fill_list': [fill.dict() for fill in Fill.objects.filter(author=user, subject=subject)],
                    'judge_list': [judge.dict() for judge in Judge.objects.filter(author=user, subject=subject)],
                    'discuss_list': [discuss.dict() for discuss in
                                     Discuss.objects.filter(author=user, subject=subject)]}

    response['status'] = 'success'
    return JsonResponse(response)


# 获取答题统计
def get_answer_stat(request):
    profile = UserProfile.objects.get(username=request.GET['openid'])
    response = {'answer_stat': profile.answer_stat()}
    return JsonResponse(response)


'''
收藏相关
'''

question_type = {
    'choice': ChoiceStar,
    'fill': FillStar,
    'judge': JudgeStar,
    'discuss': DiscussStar
}


def check_star(request):
    user = User.objects.get(username=request.GET['openid'])
    QType = question_type[request.GET['type']]
    question_id = request.GET['question_id']

    is_star = QType.objects.filter(question_id=question_id, user=user).exists()

    response = {'is_star': is_star}
    return JsonResponse(response)


def set_star(request):
    user = User.objects.get(username=request.POST['openid'])
    QType = question_type[request.POST['type']]
    question_id = request.POST['question_id']

    QType.objects.create(question_id=question_id, user=user)

    response = {'status': 'success'}
    return JsonResponse(response)


def set_unstar(request):
    user = User.objects.get(username=request.POST['openid'])
    QType = question_type[request.POST['type']]
    question_id = request.POST['question_id']

    QType.objects.get(question_id=question_id, user=user).delete()

    response = {'status': 'success'}
    return JsonResponse(response)


def get_mystar(request):
    user = User.objects.get(username=request.GET['openid'])

    response = {'choice_list': [star.question.dict() for star in ChoiceStar.objects.filter(user=user)],
                'fill_list': [star.question.dict() for star in FillStar.objects.filter(user=user)],
                'judge_list': [star.question.dict() for star in JudgeStar.objects.filter(user=user)],
                'discuss_list': [star.question.dict() for star in DiscussStar.objects.filter(user=user)],
                'status': 'success'}

    return JsonResponse(response)
