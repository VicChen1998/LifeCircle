import json

from django.http import HttpResponse

from QuestionBank.models import Subject, Choice, Fill, Judge, Discuss


def get_choice(request):
    subject = Subject.objects.get(id=request.GET['subject_id']) if 'subject_id' in request.GET else None
    response = {'status': 'success', 'choice': Choice.random(subject).dict()}
    return HttpResponse(json.dumps(response), content_type='application/json')


def get_judge(request):
    subject = Subject.objects.get(id=request.GET['subject_id']) if 'subject_id' in request.GET else None
    response = {'status': 'success', 'judge': Judge.random(subject).dict()}
    return HttpResponse(json.dumps(response), content_type='application/json')


def get_fill(request):
    subject = Subject.objects.get(id=request.GET['subject_id']) if 'subject_id' in request.GET else None
    response = {'status': 'success', 'fill': Fill.random(subject).dict()}
    return HttpResponse(json.dumps(response), content_type='application/json')


def get_discuss(request):
    subject = Subject.objects.get(id=request.GET['subject_id']) if 'subject_id' in request.GET else None
    response = {'status': 'success', 'discuss': Discuss.random(subject).dict()}
    return HttpResponse(json.dumps(response), content_type='application/json')
