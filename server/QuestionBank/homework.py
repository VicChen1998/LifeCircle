import json
from datetime import timedelta

from django.http import JsonResponse

from QuestionBank.models import *

'''
homework.py
作业相关接口
学生获取作业列表/做作业/提交
老师获取布置的作业列表/布置作业
'''


# 学生接口 获取所在班级被布置的作业列表
# 不包含题目 只包含题目数等信息
def list_of_class(request):
    clas = Class.objects.get(id=request.GET['class_id'])

    homework_list = Homework.objects.filter(clas=clas)

    response = {'status': 'success',
                'homework': [homework.info() for homework in homework_list]}

    return JsonResponse(response)


# 获取作业题目等具体内容
def get(request):
    user = User.objects.get(username=request.GET['openid'])

    homework = Homework.objects.get(id=request.GET['homework_id'])

    response = {'status': 'success', 'homework': homework.dict()}

    if HomeworkSubmit.objects.filter(student=user, homework=homework).count() != 0:
        submit = HomeworkSubmit.objects.get(homework=homework, student=user).dict()
        response['has_submit'] = True
        response['submit'] = submit
    else:
        response['has_submit'] = False

    return JsonResponse(response)


# 学生接口 提交作业
def submit(request):
    user = User.objects.get(username=request.POST['openid'])

    homework = Homework.objects.get(id=request.POST['homework_id'])

    if HomeworkSubmit.objects.filter(student=user, homework=homework).count() != 0:
        response = {'status': 'fail', 'errMsg': '不能重复提交'}
        return JsonResponse(response)

    if datetime.date.today() > homework.expire_date:
        response = {'status': 'fail', 'errMsg': '作业缴交已截止'}
        return JsonResponse(response)

    # 直接把json存入数据库
    # 分离出来好像也没什么用
    HomeworkSubmit.objects.create(student=user,
                                  homework=homework,
                                  choice=request.POST['choice'],
                                  fill=request.POST['fill'],
                                  judge=request.POST['judge'],
                                  discuss=request.POST['discuss'])

    response = {'status': 'success'}
    return JsonResponse(response)


# 教师接口 获取该教师布置的作业列表
def list_of_teacher(request):
    teacher = User.objects.get(username=request.GET['teacher_openid'])

    homework_list = Homework.objects.filter(teacher=teacher).order_by('-release_date')

    response = {'status': 'success',
                'homework': [homework.info() for homework in homework_list]}

    return JsonResponse(response)


# 教师接口 布置作业
def assign(request):
    user = User.objects.get(username=request.POST['openid'])
    profile = UserProfile.objects.get(user=user)

    # 检测是否教师
    if not profile.isTeacher:
        response = {'status': 'fail', 'errMsg': 'permission denied.'}
        return JsonResponse(response)

    subject = Subject.objects.get(id=request.POST['subject_id'])

    # 获取题目信息
    [choice_list, fill_list, judge_list, discuss_list] = json.loads(request.POST['questions'])

    # 获取班级信息
    class_list = json.loads(request.POST['class'])

    # 创建作业记录
    homework = Homework.objects.create(teacher=user,
                                       name=request.POST['name'],
                                       subject=subject)

    homework.expire_date = homework.release_date + timedelta(days=int(request.POST['active_day']))
    homework.save()

    # 建立与各题型题目联系
    for choice_id in choice_list:
        homework.choice.add(Choice.objects.get(id=choice_id))
    for fill_id in fill_list:
        homework.fill.add(Fill.objects.get(id=fill_id))
    for judge_id in judge_list:
        homework.judge.add(Judge.objects.get(id=judge_id))
    for discuss_id in discuss_list:
        homework.discuss.add(Discuss.objects.get(id=discuss_id))

    # 建立与班级联系
    for clas_id in class_list:
        homework.clas.add(Class.objects.get(id=clas_id))

    response = {'status': 'success'}
    return JsonResponse(response)


# 教师接口 查看作业缴交情况
def detail(request):
    user = User.objects.get(username=request.GET['openid'])
    profile = UserProfile.objects.get(user=user)

    # 检测是否教师
    if not profile.isTeacher:
        response = {'status': 'fail', 'errMsg': 'permission denied.'}
        return JsonResponse(response)

    homework = Homework.objects.get(id=request.GET['homework_id'])

    submits = []
    for s in HomeworkSubmit.objects.filter(homework=homework):
        submits.append(s.student_info())

    response = {'status': 'success', 'homework': homework.dict(), 'submits': submits}

    return JsonResponse(response)


def detail_of_student(request):
    user = User.objects.get(username=request.GET['openid'])
    profile = UserProfile.objects.get(user=user)

    # 检测是否教师
    if not profile.isTeacher:
        response = {'status': 'fail', 'errMsg': 'permission denied.'}
        return JsonResponse(response)

    submit = HomeworkSubmit.objects.get(
        homework=Homework.objects.get(id=request.GET['homework_id']),
        student=User.objects.get(username=request.GET['student_openid']))

    response = {'status': 'success', 'submit': submit.dict()}
    return JsonResponse(response)


def detail_of_stat(request):
    user = User.objects.get(username=request.GET['openid'])
    profile = UserProfile.objects.get(user=user)

    # 检测是否教师
    if not profile.isTeacher:
        response = {'status': 'fail', 'errMsg': 'permission denied.'}
        return JsonResponse(response)

    homework = Homework.objects.get(id=request.GET['homework_id'])
    homework_info = homework.info()

    submits = HomeworkSubmit.objects.filter(homework=homework)

    choice_stat = [{'A': 0, 'B': 0, 'C': 0, 'D': 0, 'sum': 0} for i in range(homework_info['choice_num'])]
    judge_stat = [{'T': 0, 'F': 0, 'sum': 0} for i in range(homework_info['judge_num'])]

    for s in submits:
        choice_answers = json.loads(s.choice)
        for i in range(len(choice_answers)):
            c = choice_answers[i]
            choice_stat[i][c] += 1
            choice_stat[i]['sum'] += 1

        judge_answers = json.loads(s.judge)
        for i in range(len(judge_answers)):
            j = judge_answers[i]
            judge_stat[i][j] += 1
            judge_stat[i]['sum'] += 1

    response = {'status': 'success',
                'choice_stat': choice_stat,
                'judge_stat': judge_stat}
    return JsonResponse(response)


def answer(request):
    profile = UserProfile.objects.get(username=request.GET['openid'])

    # 检测是否教师
    if not profile.isTeacher:
        response = {'status': 'fail', 'errMsg': 'permission denied.'}
        return JsonResponse(response)

    answers = Homework.objects.get(id=request.GET['homework_id']).answer()

    response = {'status': 'success', 'answer': answers}
    return JsonResponse(response)
