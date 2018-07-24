import json
import random

from django.http import HttpResponse

from QuestionBank.models import Choice


def get_choice(request):
    response = {'status': 'success', 'choice': Choice.random().dict()}
    return HttpResponse(json.dumps(response), content_type='application/json')
