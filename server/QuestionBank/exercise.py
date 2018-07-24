import json
import random

from django.http import HttpResponse

from QuestionBank.models import Choice, Judge


def get_choice(request):
    response = {'status': 'success', 'choice': Choice.random().dict()}
    return HttpResponse(json.dumps(response), content_type='application/json')


def get_judge(request):
    response = {'status': 'success', 'judge': Judge.random().dict()}
    return HttpResponse(json.dumps(response), content_type='application/json')