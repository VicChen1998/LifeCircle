import requests

from django.http import JsonResponse

from QuestionBank.settings import AppID, AppSecret

from QuestionBank.models import User, UserProfile

'''
auth.py
登录、注册等相关操作
'''


# 登录
def signin(request):
    openid = get_openid(request.GET['js_code'])
    # 没有openid则返回登录失败
    if not openid:
        response = {'status': 'fail', 'errMsg': 'get openid fail'}
        return JsonResponse(response)
    # 检测此用户是否首次登陆
    # 是则创建用户
    # 否则返回用户及用户信息
    user = User.objects.filter(username=openid)
    if user.count() == 0:
        user, profile = signup(openid)
        first_signin = True
    else:
        user = user.first()
        profile = UserProfile.objects.get(user=user)
        first_signin = False

    # 返回用户信息
    response = {'status': 'success',
                'userInfo': {'openid': openid,
                             'first_signin': first_signin,
                             'name': profile.name,
                             'student_id': profile.student_id,
                             'college': profile.college.dict() if profile.college else None,
                             'major': profile.major.dict() if profile.major else None,
                             'class': profile.clas.dict() if profile.clas else None,
                             'isTeacher': profile.isTeacher}
                }

    return JsonResponse(response)


# 注册 创建用户及用户信息
def signup(openid):
    user = User.objects.create(username=openid)
    profile = UserProfile.objects.create(user=user, username=openid)
    return user, profile


'''
前端登录时从微信服务器获取js_code提交到服务器
服务器再把js_code提交到微信服务器进行验证换取open_id
open_id可用于识别unique_user 只对本小程序有效
多个关联于同一个公众号的小程序在此可以得到union_id 这个以后再说吧
'''


# 获取openid
def get_openid(js_code):
    data = {'appid': AppID,
            'secret': AppSecret,
            'js_code': js_code,
            'grant_type': 'authorization_code'}

    response = requests.get('https://api.weixin.qq.com/sns/jscode2session', params=data).json()

    return response['openid'] if 'openid' in response else False
