from django.http import JsonResponse

from QuestionBank.models import Subject, Choice, Fill, Judge, Discuss


'''
exercise.py
获取各题型题目
小程序刷题、出题等页面主要接口
'''



def get_choice(request):
    subject = Subject.objects.get(id=request.GET['subject_id']) if 'subject_id' in request.GET else None
    response = {'status': 'success', 'choice': Choice.random(subject).dict()}
    return JsonResponse(response)


def get_judge(request):
    subject = Subject.objects.get(id=request.GET['subject_id']) if 'subject_id' in request.GET else None
    response = {'status': 'success', 'judge': Judge.random(subject).dict()}
    return JsonResponse(response)


def get_fill(request):
    subject = Subject.objects.get(id=request.GET['subject_id']) if 'subject_id' in request.GET else None
    response = {'status': 'success', 'fill': Fill.random(subject).dict()}
    return JsonResponse(response)


def get_discuss(request):
    subject = Subject.objects.get(id=request.GET['subject_id']) if 'subject_id' in request.GET else None
    response = {'status': 'success', 'discuss': Discuss.random(subject).dict()}
    return JsonResponse(response)
