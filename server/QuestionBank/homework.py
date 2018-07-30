import json

from django.http import JsonResponse

from QuestionBank.models import User, UserProfile, Homework, Choice, Fill, Judge, Discuss


def list_by_teacher(request):
    teacher = User.objects.get(username=request.GET['teacher_openid'])

    response = {'status': 'success',
                'homework': [homework.info() for homework in Homework.objects.filter(teacher=teacher)]}

    return JsonResponse(response)


def assign(request):
    user = User.objects.get(username=request.POST['openid'])
    profile = UserProfile.objects.get(user=user)

    if not profile.isTeacher:
        response = {'status': 'fail', 'errMsg': 'permission denied.'}
        return JsonResponse(response)

    [choice_list, fill_list, judge_list, discuss_list] = json.loads(request.POST['questions'])

    homework = Homework.objects.create(teacher=user, name=request.POST['name'])

    for choice_id in choice_list:
        homework.choice.add(Choice.objects.get(id=choice_id))
    for fill_id in fill_list:
        homework.fill.add(Fill.objects.get(id=fill_id))
    for judge_id in judge_list:
        homework.judge.add(Judge.objects.get(id=judge_id))
    for discuss_id in discuss_list:
        homework.discuss.add(Discuss.objects.get(id=discuss_id))

    response = {'status': 'success'}
    return JsonResponse(response)
