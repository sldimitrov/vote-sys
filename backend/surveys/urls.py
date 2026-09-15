# surveys/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from surveys.views import SurveyViewSet, VoteCreateView, SurveyResultsView

router = DefaultRouter()
router.register("surveys", SurveyViewSet, basename="survey")

urlpatterns = [
    path("", include(router.urls)),
    path("votes/", VoteCreateView.as_view(), name="vote-create"),
    path("surveys/<int:survey_id>/results/", SurveyResultsView.as_view(), name="survey-results"),
]
