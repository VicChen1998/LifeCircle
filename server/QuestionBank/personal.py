import json

from django.http import HttpResponse

from QuestionBank.models import User, Choice, Fill, Judge, Discuss


def get_upload(request):
    user = User.objects.get(username=request.GET['openid'])

    response = {'status': 'success',
                'choice_list': [choice.dict() for choice in Choice.objects.filter(author=user)],
                'fill_list': [fill.dict() for fill in Fill.objects.filter(author=user)],
                'judge_list': [judge.dict() for judge in Judge.objects.filter(author=user)],
                'discuss_list': [discuss.dict() for discuss in Discuss.objects.filter(author=user)]}

    return HttpResponse(json.dumps(response), content_type='application/json')
