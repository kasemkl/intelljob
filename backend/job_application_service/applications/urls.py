from django.urls import path
from .views import ApplyForJobView, ApplicationStatusView, UpdateApplicationStatusView

urlpatterns = [
    path('apply/', ApplyForJobView.as_view(), name='apply_for_job'),
    path('application/<int:application_id>/', ApplicationStatusView.as_view(), name='application_status'),
    path('application/<int:application_id>/update/', UpdateApplicationStatusView.as_view(), name='update_application_status'),
]
