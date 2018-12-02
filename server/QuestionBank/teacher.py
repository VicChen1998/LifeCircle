import json

from django.http import JsonResponse
from django.db.models import Count

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

    response = {'status': 'success', 'stat': []}
    for record in TeacherSubject.objects.filter(teacher=user):
        response['stat'].append({
            'subject': record.subject.dict(),
            'choice': Choice.objects.filter(subject=record.subject).count(),
            'fill': Fill.objects.filter(subject=record.subject).count(),
            'judge': Judge.objects.filter(subject=record.subject).count(),
            'discuss': Discuss.objects.filter(subject=record.subject).count(),
        })

    return JsonResponse(response)


def bank_stat_by_student(request):
    user = User.objects.get(username=request.GET['openid'])
    profile = UserProfile.objects.get(user=user)

    if not profile.isTeacher:
        response = {'status': 'fail', 'errMsg': 'you are not teacher'}
        return JsonResponse(response)

    subject = Subject.objects.get(id=request.GET['subject_id'])

    choice_rank = Choice.objects.filter(subject=subject).values_list('author_id').annotate(Count('author_id'))
    fill_rank = Fill.objects.filter(subject=subject).values_list('author_id').annotate(Count('author_id'))
    judge_rank = Judge.objects.filter(subject=subject).values_list('author_id').annotate(Count('author_id'))
    discuss_rank = Discuss.objects.filter(subject=subject).values_list('author_id').annotate(Count('author_id'))

    ranks = {}

    for record in choice_rank:
        ranks[record[0]] = {'choice': record[1]}

    for record in fill_rank:
        if record[0] in ranks:
            ranks[record[0]]['fill'] = record[1]
        else:
            ranks[record[0]] = {'fill': record[1]}

    for record in judge_rank:
        if record[0] in ranks:
            ranks[record[0]]['judge'] = record[1]
        else:
            ranks[record[0]] = {'judge': record[1]}

    for record in discuss_rank:
        if record[0] in ranks:
            ranks[record[0]]['discuss'] = record[1]
        else:
            ranks[record[0]] = {'discuss': record[1]}

    for key in ranks:

        record = ranks[key]

        student_profile = UserProfile.objects.get(user_id=key)
        record['name'] = student_profile.name
        record['student_id'] = student_profile.student_id

        if 'choice' not in record:
            record['choice'] = 0
        if 'fill' not in record:
            record['fill'] = 0
        if 'judge' not in record:
            record['judge'] = 0
        if 'discuss' not in record:
            record['discuss'] = 0

        record['total'] = record['choice'] + record['fill'] + record['judge'] + record['discuss']

    ranks = list(ranks.values())

    ranks.sort(key=lambda el: el['total'], reverse=True)

    response = {'status': 'success',
                'subject': subject.dict(),
                'ranks': ranks}

    return JsonResponse(response)
