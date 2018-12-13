import os

from django.http import HttpResponse

from LifeCircle.settings import BASE_DIR


def auth(request):
    with open(os.path.join(BASE_DIR, 'LifeCircle', 'CmTeSArXWL.txt')) as f:
        response = HttpResponse(f.read())
        response['Content-Disposition'] = 'attachment;filename=CmTeSArXWL.txt'
        return response
