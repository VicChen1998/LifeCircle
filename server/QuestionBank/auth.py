import json
import requests

from django.http import HttpResponse

from QuestionBank.settings import AppID, AppSecret

from QuestionBank.models import User, UserProfile


def get_openid(js_code):
    data = {'appid': AppID,
            'secret': AppSecret,
            'js_code': js_code,
            'grant_type': 'authorization_code'}

    response = requests.get('https://api.weixin.qq.com/sns/jscode2session', params=data).json()

    return response['openid'] if 'openid' in response else False


def signin(request):
    openid = get_openid(request.GET['js_code'])
    if not openid:
        response = {'status': 'fail', 'errMsg': 'get openid fail'}
        return HttpResponse(json.dumps(response), content_type='application/json')

    user = User.objects.filter(username=openid)
    if user.count() == 0:
        user, profile = signup(openid)
        first_signin = True
    else:
        user = user.first()
        profile = UserProfile.objects.get(user=user)
        first_signin = False

    response = {'status': 'success',
                'userInfo': {'openid': openid,
                             'first_signin': first_signin,
                             'name': profile.name,
                             'college': profile.college.dict() if profile.college else None,
                             'major': profile.major.dict() if profile.major else None,
                             'isTeacher': profile.isTeacher}
                }

    return HttpResponse(json.dumps(response), content_type='application/json')


def signup(openid):
    user = User.objects.create(username=openid)
    profile = UserProfile.objects.create(user=user, username=openid)
    return user, profile
