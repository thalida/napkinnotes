from django.urls import include, re_path
from rest_framework import routers

from .views import NotesViewSet

router = routers.SimpleRouter()

router.register(r"notes", NotesViewSet, basename="notes")

urlpatterns = [
    re_path(r"^", include(router.urls)),
]
