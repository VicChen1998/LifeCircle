import json

from django.http import HttpResponse

from QuestionBank.models import College, Major, Subject


def get_subject(request):
    response = {'subject': [subject.dict() for subject in Subject.objects.all()]}
    return HttpResponse(json.dumps(response), content_type='application/json')


def get_college(request):
    response = {'college': [college.dict() for college in College.objects.all()]}
    return HttpResponse(json.dumps(response), content_type='application/json')


def get_major(request):
    college_list = College.objects.get(id=request.GET['college_id'])
    response = {'major': [major.dict() for major in college_list]}
    return HttpResponse(json.dumps(response), content_type='application/json')
