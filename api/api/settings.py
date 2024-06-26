"""
Django settings for api project.

Generated by 'django-admin startproject' using Django 5.0.3.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.0/ref/settings/
"""

import os
from pathlib import Path

import dj_database_url
from django.templatetags.static import static
from django.urls import reverse_lazy
from django.utils.translation import gettext_lazy as _
from dotenv import load_dotenv

from docs.utils import read_file

load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get(
    "DJANGO_SECRET_KEY", default="django-insecure-m^pcufu@nx9&$_rk_u&db+k!-$%&6+ktw%kea-i4g4c&rjcie*"
)

FERNET_SECRET_KEY = os.environ.get("FERNET_SECRET_KEY", default="NhjfsPJmNHnuQb5EFrSlapwe2tdse6rqN2TTAx9MgWI=")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = "RENDER" not in os.environ

# Application definition

INSTALLED_APPS = [
    "daphne",
    "unfold",  # before django.contrib.admin
    "unfold.contrib.filters",  # optional, if special filters are needed
    "unfold.contrib.forms",  # optional, if special form elements are needed
    "unfold.contrib.import_export",  # optional, if django-import-export package is used
    "unfold.contrib.simple_history",  # optional, if django-simple-history package is used
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # 3rd party apps
    "oauth2_provider",
    "social_django",
    "drf_social_oauth2",
    "django_filters",
    "corsheaders",
    "rest_framework",
    "drf_spectacular",
    # local apps
    "authentication",
    "docs",
    "notes",
]

ALLOWED_HOSTS = [
    ".napkinnotes.app",
    ".onrender.com",
]
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    "https://napkinnotes.app",
    "https://*.onrender.com",
]
CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^https:\/\/.*\.napkinnotes\.app$",
    r"^https:\/\/.*\.onrender\.com$",
]

RENDER_EXTERNAL_HOSTNAME = os.environ.get("RENDER_EXTERNAL_HOSTNAME")
if RENDER_EXTERNAL_HOSTNAME:
    ALLOWED_HOSTS.append(RENDER_EXTERNAL_HOSTNAME)

if DEBUG:
    ALLOWED_HOSTS += [
        "localhost",
        "127.0.0.1",
        "127.0.0.1:8000",
    ]

    CORS_ALLOWED_ORIGIN_REGEXES += [
        r"^http(s)?://localhost:5173$",
        r"^http(s)?://127.0.0.1:5173$",
    ]

# User & Authentication
AUTH_USER_MODEL = "authentication.User"

ACTIVATE_JWT = True
SOCIAL_AUTH_JSONFIELD_ENABLED = True
# Use email as core login field
SOCIAL_AUTH_USERNAME_IS_FULL_EMAIL = True

SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = os.environ.get("GOOGLE_OAUTH2_CLIENT_ID")
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = os.environ.get("GOOGLE_OAUTH2_SECRET")

SOCIAL_AUTH_PIPELINE = (
    # Order matters here
    "social_core.pipeline.social_auth.social_details",
    "social_core.pipeline.social_auth.social_uid",
    "social_core.pipeline.social_auth.social_user",
    "social_core.pipeline.user.get_username",
    "social_core.pipeline.social_auth.associate_by_email",
    "social_core.pipeline.user.create_user",
    "social_core.pipeline.social_auth.associate_user",
    "social_core.pipeline.social_auth.load_extra_data",
    "social_core.pipeline.user.user_details",
)

OAUTH2_PROVIDER = {
    "ACCESS_TOKEN_EXPIRE_SECONDS": 60 * 60 * 24 * 52,  # 1 year
}

AUTHENTICATION_BACKENDS = (
    "social_core.backends.google.GoogleOAuth2",
    "drf_social_oauth2.backends.DjangoOAuth2",
    "django.contrib.auth.backends.ModelBackend",
)

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

DEFAULT_RENDERER_CLASSES = [
    "rest_framework.renderers.JSONRenderer",
]

if DEBUG:
    DEFAULT_RENDERER_CLASSES += [
        "rest_framework.renderers.BrowsableAPIRenderer",
    ]

REST_FRAMEWORK = {
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    "DEFAULT_RENDERER_CLASSES": DEFAULT_RENDERER_CLASSES,
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.BasicAuthentication",
        "oauth2_provider.contrib.rest_framework.OAuth2Authentication",
        "drf_social_oauth2.authentication.SocialAuthentication",
    ],
    "DEFAULT_FILTER_BACKENDS": ["django_filters.rest_framework.DjangoFilterBackend"],
}

ROOT_URLCONF = "api.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [f"{BASE_DIR}/templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
                # 3rd party
                "social_django.context_processors.backends",
                "social_django.context_processors.login_redirect",
            ],
        },
    },
]

WSGI_APPLICATION = "api.wsgi.application"
ASGI_APPLICATION = "api.asgi.application"

REDIS_HOST = os.environ.get("REDIS_HOST", "127.0.0.1")
REDIS_PORT = os.environ.get("REDIS_PORT", "6379")

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [(REDIS_HOST, REDIS_PORT)],
        },
    },
}


# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

DATABASES = {
    "default": dj_database_url.config(
        default="postgresql://postgres:postgres@localhost:5432/postgres",
        conn_max_age=600,
    )
}


# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

STATIC_URL = "static/"
MEDIA_URL = "media/"

if not DEBUG:
    MEDIA_ROOT = os.path.join(BASE_DIR, "media")
    STATIC_ROOT = os.path.join(BASE_DIR, "static")
    STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"


# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

SPECTACULAR_SETTINGS = {
    "VERSION": "1.0.0",
    "TITLE": "Napkin Notes API",
    "CONTACT": {
        "url": "https://thalida.com/",
        "email": "napkinnotes@thalida.com",
    },
    "DESCRIPTION": read_file("docs/markdown/introduction.md"),
    "PREPROCESSING_HOOKS": ["docs.hooks.custom_preprocessing_hook"],
    "POSTPROCESSING_HOOKS": [
        "drf_spectacular.hooks.postprocess_schema_enums",
        "docs.hooks.custom_postprocessing_hook",
    ],
    # Servers are set dynamically via the post processing hook
    "SERVERS": [],
    "SERVE_INCLUDE_SCHEMA": False,
    "SCHEMA_COERCE_PATH_PK": True,
    "SCHEMA_COERCE_PATH_PK_SUFFIX": True,
    "COMPONENT_SPLIT_PATCH": True,
    "COMPONENT_SPLIT_REQUEST": True,
    "COMPONENT_NO_READ_ONLY_REQUIRED": True,
    "EXTENSIONS_INFO": {
        "x-logo": {
            "url": f"{STATIC_URL}docs/images/logo.svg",
            "backgroundColor": "transparent",
            "altText": "Napkin Notes Logo",
            "href": "/",
        },
    },
    "EXTENSIONS_ROOT": {
        "x-tagGroups": [
            {
                "name": "Overview",
                "tags": [
                    "Introduction",
                ],
            },
        ],
    },
    "TAGS": [
        {
            "name": "Introduction",
            "description": read_file("docs/markdown/introduction.md"),
            "x-traitTag": True,
        },
        # {"name": SchemaTags.AUTH.value, "x-displayName": SchemaTags.AUTH.value},
    ],
}


UNFOLD = {
    "SITE_TITLE": "Napkin Notes Admin",
    "SITE_HEADER": "Napkin Notes Admin",
    "SITE_URL": "https://napkinnotes.app",
    "SITE_ICON": lambda request: static("docs/images/logo.svg"),
    "SHOW_VIEW_ON_SITE": False,
    "LOGIN": {
        "redirect_after": lambda r: reverse_lazy("admin:index"),
    },
    "STYLES": [],
    "SCRIPTS": [],
    "SIDEBAR": {
        "show_search": True,
        "show_all_applications": True,
        "navigation": [
            {
                "title": _("Navigation"),
                "separator": False,
                "items": [
                    {
                        "title": _("Dashboard"),
                        "icon": "dashboard",
                        "link": reverse_lazy("admin:index"),
                    },
                ],
            },
            {
                "title": _("Core"),
                "separator": True,
                "items": [
                    {
                        "title": _("Notes"),
                        "icon": "person",
                        "link": reverse_lazy("admin:notes_note_changelist"),
                    },
                ],
            },
            {
                "title": _("Users & Groups"),
                "separator": True,
                "items": [
                    {
                        "title": _("Users"),
                        "icon": "person",
                        "link": reverse_lazy("admin:authentication_user_changelist"),
                    },
                    {
                        "title": _("Groups"),
                        "icon": "admin_panel_settings",
                        "link": reverse_lazy("admin:auth_group_changelist"),
                    },
                ],
            },
        ],
    },
    "TABS": [
        {
            "models": [
                "authentication.user",
                "social_django.usersocialauth",
            ],
            "items": [
                {
                    "title": _("All Users"),
                    "link": reverse_lazy("admin:authentication_user_changelist"),
                },
                {
                    "title": _("All Social Accounts"),
                    "link": reverse_lazy("admin:social_django_usersocialauth_changelist"),
                },
            ],
        },
    ],
}
