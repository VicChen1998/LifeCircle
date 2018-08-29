import json

from django.http import JsonResponse

from QuestionBank.models import User, UserProfile, Subject, Choice, Fill, Judge, Discuss


'''
upload.py
上传题目接口
'''


def choice(request):
    user = User.objects.get(username=request.POST['openid'])
    subject = Subject.objects.get(id=request.POST['subject_id'])

    Choice.objects.create(author=user,
                          subject=subject,
                          question=request.POST['question'],
                          option_A=request.POST['option_A'],
                          option_B=request.POST['option_B'],
                          option_C=request.POST['option_C'],
                          option_D=request.POST['option_D'],
                          answer=request.POST['answer'],
                          comment=request.POST['comment'])

    response = {'status': 'success'}
    return JsonResponse(response)


def judge(request):
    user = User.objects.get(username=request.POST['openid'])
    subject = Subject.objects.get(id=request.POST['subject_id'])

    Judge.objects.create(author=user,
                         subject=subject,
                         question=request.POST['question'],
                         answer=request.POST['answer'],
                         comment=request.POST['comment'])

    response = {'status': 'success'}
    return JsonResponse(response)


def fill(request):
    user = User.objects.get(username=request.POST['openid'])
    subject = Subject.objects.get(id=request.POST['subject_id'])

    Fill.objects.create(author=user,
                        subject=subject,
                        question=request.POST['question'],
                        answer=request.POST['answer'],
                        answer_count=request.POST['answer_count'],
                        comment=request.POST['comment'])

    response = {'status': 'success'}
    return JsonResponse(response)


def discuss(request):
    user = User.objects.get(username=request.POST['openid'])
    subject = Subject.objects.get(id=request.POST['subject_id'])

    Discuss.objects.create(author=user,
                           subject=subject,
                           question=request.POST['question'],
                           answer=request.POST['answer'])

    response = {'status': 'success'}
    return JsonResponse(response)
