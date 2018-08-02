import json

from django.http import JsonResponse

from QuestionBank.models import User, UserProfile, Homework, Subject, Class, Choice, Fill, Judge, Discuss


def list_of_class(request):
    clas = Class.objects.get(id=request.GET['class_id'])

    homework_list = Homework.objects.filter(clas=clas)

    response = {'status': 'success',
                'homework': [homework.info() for homework in homework_list]}

    return JsonResponse(response)


def get(request):
    homework = Homework.objects.get(id=request.GET['homework_id'])

    response = {'status': 'success', 'homework': homework.dict()}

    return JsonResponse(response)


def list_of_teacher(request):
    teacher = User.objects.get(username=request.GET['teacher_openid'])

    homework_list = Homework.objects.filter(teacher=teacher).order_by('-release_date')

    response = {'status': 'success',
                'homework': [homework.info() for homework in homework_list]}

    return JsonResponse(response)


def assign(request):
    user = User.objects.get(username=request.POST['openid'])
    profile = UserProfile.objects.get(user=user)

    if not profile.isTeacher:
        response = {'status': 'fail', 'errMsg': 'permission denied.'}
        return JsonResponse(response)

    [choice_list, fill_list, judge_list, discuss_list] = json.loads(request.POST['questions'])

    class_list = json.loads(request.POST['class'])

    homework = Homework.objects.create(teacher=user,
                                       name=request.POST['name'],
                                       subject=Subject.objects.get(id=request.POST['subject_id']))

    for choice_id in choice_list:
        homework.choice.add(Choice.objects.get(id=choice_id))
    for fill_id in fill_list:
        homework.fill.add(Fill.objects.get(id=fill_id))
    for judge_id in judge_list:
        homework.judge.add(Judge.objects.get(id=judge_id))
    for discuss_id in discuss_list:
        homework.discuss.add(Discuss.objects.get(id=discuss_id))

    for clas_id in class_list:
        homework.clas.add(Class.objects.get(id=clas_id))

    response = {'status': 'success'}
    return JsonResponse(response)
