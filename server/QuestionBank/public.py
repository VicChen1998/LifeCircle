from django.http import JsonResponse

from QuestionBank.models import College, Major, Class, Subject


'''
public.py
公共数据接口
获取学院/专业/班级/学科信息
'''


def get_college(request):
    response = {'college': [college.dict() for college in College.objects.all()]}
    return JsonResponse(response)


def get_major(request):
    major_list = Major.objects.filter(college_id=request.GET['college_id'])
    response = {'major': [major.dict() for major in major_list]}
    return JsonResponse(response)


def get_class(request):
    class_list = Class.objects.filter(major_id=request.GET['major_id']).order_by('-grade')
    response = {'class': [clas.dict() for clas in class_list]}
    return JsonResponse(response)


def get_subject(request):
    response = {'subject': [subject.dict() for subject in Subject.objects.all()]}
    return JsonResponse(response)
