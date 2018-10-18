import random

from django.db import models
from django.contrib.auth.models import User

'''
models.py
本应用的模型
与数据库关联
一个类建立一张表
以及多个关系表

更多信息查阅Web MVC模型
这个就是M
'''


# 学院
class College(models.Model):
    id = models.CharField(primary_key=True, max_length=2)
    # 名称
    name = models.CharField(max_length=16)

    class Meta:
        db_table = 'College'

    def dict(self):
        return {'id': self.id,
                'name': self.name}


# 专业
class Major(models.Model):
    id = models.CharField(primary_key=True, max_length=3)
    # 名称
    name = models.CharField(max_length=16)
    # 所属学院
    college = models.ForeignKey(College, on_delete=models.CASCADE)

    class Meta:
        db_table = 'Major'

    def dict(self):
        return {'id': self.id,
                'name': self.name}


# 班级
class Class(models.Model):
    id = models.CharField(primary_key=True, max_length=9)
    # 名称
    name = models.CharField(max_length=16)
    # 简称
    shortname = models.CharField(max_length=8)
    # 所属专业
    major = models.ForeignKey(Major, on_delete=models.CASCADE)
    # 年级
    grade = models.PositiveIntegerField()

    class Meta:
        db_table = 'Class'

    def dict(self):
        return {
            'id': self.id,
            'grade': self.grade,
            'name': self.name,
            'shortname': self.shortname
        }


# 学科
class Subject(models.Model):
    id = models.PositiveIntegerField(primary_key=True, auto_created=True)
    # 名称
    name = models.CharField(max_length=32)

    class Meta:
        db_table = 'Subject'

    def dict(self):
        return {'id': self.id,
                'name': self.name}


# 班级科目关系
class MajorSubject(models.Model):
    # 班级
    major = models.ForeignKey(Major, on_delete=models.CASCADE)
    # 科目
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)

    class Meta:
        db_table = 'Major_Subject'
        # 联合主键
        unique_together = ('major', 'subject')


# 教师科目关系
class TeacherSubject(models.Model):
    # 教师
    teacher = models.ForeignKey(User, on_delete=models.CASCADE)
    # 科目
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)

    class Meta:
        db_table = 'Teacher_Subject'
        # 联合主键
        unique_together = ('teacher', 'subject')


# 用户信息
class UserProfile(models.Model):
    # 用户
    user = models.OneToOneField(User, primary_key=True, on_delete=models.CASCADE)
    username = models.CharField(max_length=32)

    # 从微信拿到的数据
    # 昵称
    nickname = models.CharField(max_length=32, null=True)
    # 性别
    gender = models.IntegerField(3, null=True, blank=True)
    # 语言
    language = models.CharField(max_length=16, null=True)
    # 城市
    city = models.CharField(max_length=32, null=True)
    # 省份
    province = models.CharField(max_length=32, null=True)
    # 国家
    country = models.CharField(max_length=32, null=True)
    # 头像url
    avatarUrl = models.CharField(max_length=256, null=True)

    # 本应用数据
    # 姓名
    name = models.CharField(max_length=8, null=True, default=None)
    # 学号
    student_id = models.CharField(max_length=11, null=True, default=None)
    # 学院
    college = models.ForeignKey(College, null=True, default=None, on_delete=models.SET_NULL)
    # 专业
    major = models.ForeignKey(Major, null=True, default=None, on_delete=models.SET_NULL)
    # 班级
    clas = models.ForeignKey(Class, null=True, default=None, on_delete=models.SET_NULL)
    # 是否教师
    isTeacher = models.BooleanField(default=False)

    # 答题统计
    # 选择题
    choice = models.IntegerField(default=0)
    # 填空题
    fill = models.IntegerField(default=0)
    # 判断题
    judge = models.IntegerField(default=0)
    # 简答题
    discuss = models.IntegerField(default=0)

    def answer_stat(self):
        return {
            'choice': self.choice,
            'fill': self.fill,
            'judge': self.judge,
            'discuss': self.discuss
        }

    class Meta:
        db_table = 'UserProfile'


# 选择题
class Choice(models.Model):
    # 所属学科
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    # 题目
    question = models.CharField(max_length=128)
    # 选项
    option_A = models.CharField(max_length=64)
    option_B = models.CharField(max_length=64)
    option_C = models.CharField(max_length=64)
    option_D = models.CharField(max_length=64, null=True)
    # 答案
    answer = models.CharField(max_length=1)
    # 解析
    comment = models.CharField(max_length=128)
    # 提交者
    author = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)

    class Meta:
        db_table = 'QB_Choice'

    def dict(self, with_answer=True):
        return {
            'id': self.id,
            'subject': self.subject.dict(),
            'question': self.question,
            'option_A': self.option_A,
            'option_B': self.option_B,
            'option_C': self.option_C,
            'option_D': self.option_D,
            'answer': self.answer if with_answer else None,
            'comment': self.comment if with_answer else None,
        }

    @staticmethod
    def random(subject):
        if subject:
            index = random.randint(0, Choice.objects.filter(subject=subject).count() - 1)
            return Choice.objects.filter(subject=subject)[index]
        else:
            index = random.randint(0, Choice.objects.count() - 1)
            return Choice.objects.all()[index]


# 判断题
class Judge(models.Model):
    # 所属学科
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    # 题目
    question = models.CharField(max_length=128)
    # 答案
    answer = models.CharField(max_length=1)
    # 解析
    comment = models.CharField(max_length=128)
    # 提交者
    author = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)

    class Meta:
        db_table = 'QB_Judge'

    def dict(self, with_answer=True):
        return {
            'id': self.id,
            'subject': self.subject.dict(),
            'question': self.question,
            'answer': self.answer if with_answer else None,
            'comment': self.comment if with_answer else None,
        }

    @staticmethod
    def random(subject):
        if subject:
            index = random.randint(0, Judge.objects.filter(subject=subject).count() - 1)
            return Judge.objects.filter(subject=subject)[index]
        else:
            index = random.randint(0, Judge.objects.count() - 1)
            return Judge.objects.all()[index]


# 填空题
class Fill(models.Model):
    # 所属学科
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    # 题目
    question = models.CharField(max_length=128)
    # 答案
    answer = models.CharField(max_length=128)
    # 答案个数
    answer_count = models.IntegerField(32)
    # 解析
    comment = models.CharField(max_length=128)
    # 提交者
    author = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)

    class Meta:
        db_table = 'QB_Fill'

    def dict(self, with_answer=True):
        return {
            'id': self.id,
            'subject': self.subject.dict(),
            'question': self.question,
            'answer': self.answer if with_answer else None,
            'answer_count': self.answer_count,
            'comment': self.comment if with_answer else None,
        }

    @staticmethod
    def random(subject):
        if subject:
            index = random.randint(0, Fill.objects.filter(subject=subject).count() - 1)
            return Fill.objects.filter(subject=subject)[index]
        else:
            index = random.randint(0, Fill.objects.count() - 1)
            return Fill.objects.all()[index]


# 简答题
class Discuss(models.Model):
    # 所属学科
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    # 题目
    question = models.CharField(max_length=128)
    # 答案
    answer = models.CharField(max_length=512)
    # 提交者
    author = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)

    class Meta:
        db_table = 'QB_Discuss'

    def dict(self, with_answer=True):
        return {
            'id': self.id,
            'subject': self.subject.dict(),
            'question': self.question,
            'answer': self.answer if with_answer else None,
        }

    @staticmethod
    def random(subject):
        if subject:
            index = random.randint(0, Discuss.objects.filter(subject=subject).count() - 1)
            return Discuss.objects.filter(subject=subject)[index]
        else:
            index = random.randint(0, Discuss.objects.count() - 1)
            return Discuss.objects.all()[index]


# 作业
class Homework(models.Model):
    # 名称
    name = models.CharField(max_length=32)
    # 所属学科
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    # 出卷老师
    teacher = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
    # 发布日期
    release_date = models.DateField(auto_now_add=True)
    # 有效性
    valid = models.BooleanField(default=True)
    # 班级
    clas = models.ManyToManyField(Class, db_table='QB_Homework_Class')
    # 选择题
    choice = models.ManyToManyField(Choice, db_table='QB_Homework_Choice')
    # 填空题
    fill = models.ManyToManyField(Fill, db_table='QB_Homework_Fill')
    # 判断题
    judge = models.ManyToManyField(Judge, db_table='QB_Homework_Judge')
    # 简答题
    discuss = models.ManyToManyField(Discuss, db_table='QB_Homework_Discuss')

    class Meta:
        db_table = 'QB_Homework'

    # 返回包含所有题目的具体信息
    def dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'valid': self.valid,
            'subject': self.subject.dict(),
            'release_date': self.release_date.strftime('%m-%d'),
            'class': [clas.shortname for clas in self.clas.all()],
            'choice': [choice.dict(with_answer=False) for choice in self.choice.all()],
            'fill': [fill.dict(with_answer=False) for fill in self.fill.all()],
            'judge': [judge.dict(with_answer=False) for judge in self.judge.all()],
            'discuss': [discuss.dict(with_answer=False) for discuss in self.discuss.all()]
        }

    # 只返回作业属性信息
    # 包括各题型题目数等
    # 不包括具体题目
    def info(self):
        return {
            'id': self.id,
            'name': self.name,
            'valid': self.valid,
            'subject': self.subject.dict(),
            'release_date': self.release_date.strftime('%m-%d'),
            'class': [clas.shortname for clas in self.clas.all()],
            'post_count': HomeworkSubmit.objects.filter(homework=self).count(),
            'choice_num': self.choice.count(),
            'fill_num': self.fill.count(),
            'judge_num': self.judge.count(),
            'discuss_num': self.discuss.count()
        }

    # 返回答案
    def answer(self):
        return {
            'choice': [choice.answer for choice in self.choice.all()],
            'fill': [fill.answer for fill in self.fill.all()],
            'judge': [judge.answer for judge in self.judge.all()],
            'discuss': [discuss.answer for discuss in self.discuss.all()],
        }


# 作业上交
class HomeworkSubmit(models.Model):
    # 作业
    homework = models.ForeignKey(Homework, on_delete=models.CASCADE)
    # 学生
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    # 选择题
    choice = models.CharField(max_length=128)
    # 填空题
    fill = models.CharField(max_length=1024)
    # 判断题
    judge = models.CharField(max_length=128)
    # 简答题
    discuss = models.TextField()

    class Meta:
        db_table = 'QB_Homework_Submit'
        # 联合主键
        unique_together = ('homework', 'student')

    def dict(self):
        profile = UserProfile.objects.get(user=self.student)
        return {
            'student': {
                'name': profile.name,
                'student_id': profile.student_id,
                'college': profile.college.dict(),
                'major': profile.major.dict(),
                'class': profile.clas.dict(),
            },
            'choice': self.choice,
            'fill': self.fill,
            'judge': self.judge,
            'discuss': self.discuss,
        }

    def student_info(self):
        profile = UserProfile.objects.get(user=self.student)
        return {
            'openid': profile.username,
            'name': profile.name,
        }