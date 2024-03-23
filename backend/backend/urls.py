"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import include, path, re_path
from drf_spectacular.views import SpectacularAPIView

from docs.views import SpectacularElementsView
import authentication.urls
import notes.urls

urlpatterns = [
    path("admin/", admin.site.urls),
    re_path(r"^auth/", include(authentication.urls.auth_urlpatterns)),
    # API Docs
    path("schema/", SpectacularAPIView.as_view(), name="schema"),
    path("docs/", SpectacularElementsView.as_view(), name="docs"),
    # API
    re_path(r"", include(authentication.urls)),
    re_path(r"", include(notes.urls)),
]
