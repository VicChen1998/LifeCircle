import os

from django.http import HttpResponse

from QuestionBank.settings import QB_MEDIA_DIR


def image(request):

    name = request.GET['name']

    img_path = os.path.join(QB_MEDIA_DIR, name)

    print(img_path)

    file = open(img_path, 'rb')

    return HttpResponse(file.read(), content_type='image/png')
