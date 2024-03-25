<div align="center">
   <img src="https://github.com/thalida/napkinnotes/assets/3401715/75867e3a-150a-406b-89c9-69406a159096" alt="Napkin Notes Logo" />
   <h1>Napkin Notes</h1>
   <p>
      <strong>Napkin Notes is a simple, lightweight, note-taking app for quick math, short-term tasks, and temporary notes.</strong>
   </p>
   <p>
      <a href="https://napkinnotes.app" target="_blank"><strong>Website</strong></a> | 
      <a href="https://api.napkinnotes.app" target="_blank"><strong>API Docs</strong></a>
   </p>
</div>

<br /><br />

![napkin-notes](https://github.com/thalida/napkinnotes/assets/3401715/7c94cbc2-1702-42b5-a7e1-b8e5fbdedb75)

<br /><br />

## Backstory

Napkin Notes was built over the course of a weekend as part of a solo-mission hack-a-thon.  
As a result, I paried down the feature set to only things I'd need when I need to quickly paste content or perform quick math during my day-to-day.


## Quick Start

**Napkin Notes is available at [https://napkinnotes.app/](https://napkinnotes.app/)**  
You can try it out anonymously, but to sync your notes across devices you'll need to create a free account!

✨  Napkin Notes is a Progressive Web App, so on supported browsers and devices you'll be able to install the app to your desktop. ✨ 


## Supported Features & Widgets
| Feature | Trigger Action |
|---------|----------------|
| Bold    | Highlight text and `CTRL+B` |
| Italics | Highlight text and `CTRL+I` |
| Underline | Highlight text and `CTRL+Y` |
| Link | Highlight text and `CTRL+K` |
| Unordered List | Type `* ` (`*` + `SPACE`) |
| Ordered List | Type `1. ` (`1.` + `SPACE`) |
| Math ✨ | Type `$ ` (`$` + `SPACE`) |


## Dev Log

### Development Stack
Catalog of the tools, resources, and services used in the creation of this project.

#### App
| Tool or Service | Link | Description |
|-----------------|------|-------------|
| Vue (Vue3) | https://vuejs.org/ | Frontend framework |
| Vite PWA | https://vite-pwa-org.netlify.app/ | Adds PWA Support to Vue |
| Tailwind | https://tailwindcss.com/ | Design system and CSS Components |
| Tailwind Components | https://tailwindui.com/ | Pre-built components from Tailwind; Uses [Headless UI](https://headlessui.com/) and [Heroicons](https://heroicons.com/) |
| Vue Google Login | https://github.com/devbaji/vue3-google-login | Powers "Login with Google" functionality |
| Hero Icons | https://heroicons.com/ | |
| Bootstrap Icons Vue | https://github.com/tommyip/bootstrap-icons-vue | Vue components for [Bootstrap Icons](https://icons.getbootstrap.com/) |


#### Api
| Tool or Service | Link | Description |
|-----------------|------|-------------|
| Django | https://www.djangoproject.com/ | Backend framework |
| Django Rest Framework | https://www.django-rest-framework.org/ | RESTFul Django APIs |
| DRF Social Oauth | https://github.com/wagnerdelima/drf-social-oauth2 | Provides support for social login; Uses [Python Social Auth](https://python-social-auth.readthedocs.io/en/latest/) and [Django OAuth2 Toolkit](https://django-oauth-toolkit.readthedocs.io/en/latest/); |
| DRF Spectactular | https://drf-spectacular.readthedocs.io/en/latest/ | Open API Schema Generator & Viewer |
| Stoplight Elements | https://github.com/stoplightio/elements | Beautiful Open API Schema Docs |
| Django Unfold Admin | https://github.com/unfoldadmin/django-unfold | A better Django Admin Experience |  


#### Hosting & Deployment
| Tool or Service | Link | Description |
|-----------------|------|-------------|
| Render | https://render.com/ | Hosts both the app and api | 


## Caveats & Known Issues

Napkin Notes is built using `contenteditable` which is prone to issues across browsers. Napkin Notes was built and tested on Chrome.


## Get in Touch!

* Email: napkinnotes@thalida.com
* Web: https://thalida.com/
