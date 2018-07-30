import json

from django.http import HttpResponse

from QuestionBank.models import College, Major, Class, Subject


def get_college(request):
    response = {'college': [college.dict() for college in College.objects.all()]}
    return HttpResponse(json.dumps(response), content_type='application/json')


def get_major(request):
    major_list = Major.objects.filter(college_id=request.GET['college_id'])
    response = {'major': [major.dict() for major in major_list]}
    return HttpResponse(json.dumps(response), content_type='application/json')


def get_class(request):
    class_list = Class.objects.filter(major_id=request.GET['major_id']).order_by('-id')
    response = {'class': [clas.dict() for clas in class_list]}
    return HttpResponse(json.dumps(response), content_type='application/json')


def get_subject(request):
    response = {'subject': [subject.dict() for subject in Subject.objects.all()]}
    return HttpResponse(json.dumps(response), content_type='application/json')
