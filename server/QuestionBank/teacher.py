import json

from django.http import JsonResponse

from QuestionBank.models import User, UserProfile, College, Subject, TeacherSubject, Choice, Fill, Judge, Discuss


def set_college(request):
    profile = UserProfile.objects.get(username=request.POST['openid'])

    college = College.objects.get(id=request.POST['college_id'])

    profile.college = college

    profile.save()

    response = {'status': 'success'}
    return JsonResponse(response)


def set_subject(request):
    user = User.objects.get(username=request.POST['openid'])
    profile = UserProfile.objects.get(user=user)
    if not profile.isTeacher:
        response = {'status': 'fail', 'errMsg': 'you are not teacher'}
        return JsonResponse(response)

    TeacherSubject.objects.filter(teacher=user).delete()

    subject_ids = json.loads(request.POST['subjects'])['subjects']
    for subject_id in subject_ids:
        subject = Subject.objects.get(id=subject_id)
        TeacherSubject.objects.create(teacher=user, subject=subject)

    response = {'status': 'success'}
    return JsonResponse(response)


def get_subject(request):
    user = User.objects.get(username=request.GET['openid'])

    response = {'subjects': []}

    for record in TeacherSubject.objects.filter(teacher=user):
        response['subjects'].append(record.subject.id)

    return JsonResponse(response)


def bank_stat(request):
    user = User.objects.get(username=request.GET['openid'])
    profile = UserProfile.objects.get(user=user)

    if not profile.isTeacher:
        response = {'status': 'fail', 'errMsg': 'you are not teacher'}
        return JsonResponse(response)

    response = {'status': 'success', 'stat':[]}
    for record in TeacherSubject.objects.filter(teacher=user):
        response['stat'].append({
            'subject': record.subject.dict(),
            'choice': Choice.objects.filter(subject=record.subject).count(),
            'fill': Fill.objects.filter(subject=record.subject).count(),
            'judge': Judge.objects.filter(subject=record.subject).count(),
            'discuss': Discuss.objects.filter(subject=record.subject).count(),
        })

    return JsonResponse(response)
