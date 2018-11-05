import os
import docx
import json
import time

from django.http import JsonResponse, HttpResponse

from QuestionBank.settings import QB_MEDIA_DIR
from QuestionBank.models import User, UserProfile, Subject, Choice, Fill, Judge, Discuss

PAPER_DIR = os.path.join(QB_MEDIA_DIR, 'paper')

DOCX_CONTENT_TYPE = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'


def create_paper(request):
    user = User.objects.get(username=request.POST['openid'])
    profile = UserProfile.objects.get(user=user)

    # 检测是否教师
    if not profile.isTeacher:
        response = {'status': 'fail', 'errMsg': 'permission denied.'}
        return JsonResponse(response)

    doc = docx.Document()
    doc.styles['Normal'].font.name = u'宋体'
    doc.styles['Normal']._element.rPr.rFonts.set(docx.oxml.ns.qn('w:eastAsia'), u'宋体')

    # 获取学科信息
    subject = Subject.objects.get(id=request.POST['subject_id'])

    main_title = doc.add_paragraph(subject.name + '试卷')
    main_title.paragraph_format.alignment = docx.enum.text.WD_ALIGN_PARAGRAPH.CENTER
    main_title_style = doc.styles.add_style('MainTitleStyle', docx.enum.style.WD_STYLE_TYPE.PARAGRAPH)
    main_title_style.font.size = docx.shared.Pt(20)
    main_title.style = main_title_style

    nameplace = doc.add_paragraph('学院_________专业_________班级_________姓名_________学号_________')
    nameplace.paragraph_format.alignment = docx.enum.text.WD_ALIGN_PARAGRAPH.CENTER

    # 获取题目信息
    [choice_list, fill_list, judge_list, discuss_list] = json.loads(request.POST['questions'])

    index_str = ['一、', '二、', '三、', '四、']
    index_i = 0

    # 选择
    if len(choice_list) > 0:
        doc.add_paragraph()
        doc.add_paragraph(index_str[index_i] + '选择题')
        index_i += 1

        for i in range(len(choice_list)):
            choice = Choice.objects.get(id=choice_list[i])
            doc.add_paragraph(str(i + 1) + '. ' + choice.question)
            if len(choice.option_A + choice.option_B + choice.option_C + choice.option_D) < 25:
                doc.add_paragraph(
                    'A. ' + choice.option_A + '     B. ' + choice.option_B + '     C. ' + choice.option_C + '     D. ' + choice.option_D)
            elif len(choice.option_A) < 15:
                doc.add_paragraph('A. ' + choice.option_A + '     B. ' + choice.option_B)
                doc.add_paragraph('C. ' + choice.option_C + '     D. ' + choice.option_D)
            else:
                doc.add_paragraph('A. ' + choice.option_A)
                doc.add_paragraph('B. ' + choice.option_B)
                doc.add_paragraph('C. ' + choice.option_C)
                doc.add_paragraph('D. ' + choice.option_D)

    # 填空
    if len(fill_list) > 0:
        doc.add_paragraph()
        doc.add_paragraph(index_str[index_i] + '填空题')
        index_i += 1

        for i in range(len(fill_list)):
            fill = Fill.objects.get(id=fill_list[i])
            doc.add_paragraph(str(i + 1) + '. ' + fill.question)

    # 判断
    if len(judge_list) > 0:
        doc.add_paragraph()
        doc.add_paragraph(index_str[index_i] + '判断题')
        index_i += 1

        for i in range(len(judge_list)):
            judge = Judge.objects.get(id=judge_list[i])
            doc.add_paragraph('(     )  ' + str(i + 1) + '. ' + judge.question)

    # 简答
    if len(discuss_list) > 0:
        doc.add_paragraph()
        doc.add_paragraph(index_str[index_i] + '简答题')
        index_i += 1
        for i in range(len(discuss_list)):
            discuss = Discuss.objects.get(id=discuss_list[i])
            doc.add_paragraph(str(i + 1) + '. ' + discuss.question)
            doc.add_paragraph()
            doc.add_paragraph()
            doc.add_paragraph()
            doc.add_paragraph()
            doc.add_paragraph()

    filedir = os.path.join(PAPER_DIR, user.username)
    if not os.path.exists(filedir):
        os.makedirs(filedir)
    filename = time.strftime('%Y%m%d-%H%M%S', time.localtime()) + '.docx'
    doc.save(os.path.join(filedir, filename))

    response = {'status': 'success', 'filename': filename}
    return JsonResponse(response)


def download(request):
    user = User.objects.get(username=request.GET['openid'])
    profile = UserProfile.objects.get(user=user)

    # 检测是否教师
    if not profile.isTeacher:
        response = {'status': 'fail', 'errMsg': 'permission denied.'}
        return JsonResponse(response)

    filedir = os.path.join(PAPER_DIR, user.username)
    filename = request.GET['name']
    paper = open(os.path.join(filedir, filename), 'rb')

    response = HttpResponse(paper.read(), content_type=DOCX_CONTENT_TYPE)
    response['Content-Disposition'] = 'attachment;filename="%s"' % filename
    return response


def get_list(request):
    user = User.objects.get(username=request.GET['openid'])
    profile = UserProfile.objects.get(user=user)

    # 检测是否教师
    if not profile.isTeacher:
        response = {'status': 'fail', 'errMsg': 'permission denied.'}
        return JsonResponse(response)

    filedir = os.path.join(PAPER_DIR, user.username)
    files = tuple(os.walk(filedir))[0][2]

    response = {'status': 'success', 'paper_list': files}
    return JsonResponse(response)
