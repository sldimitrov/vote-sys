from rest_framework import viewsets, generics, permissions
from django.db.models import Count
from surveys.models import Survey, Choice
from surveys.serializers import (
    SurveySerializer,
    VoteSerializer,
    ChoiceResultSerializer,
)


class SurveyViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Survey.objects.all()
    serializer_class = SurveySerializer


class VoteCreateView(generics.CreateAPIView):
    serializer_class = VoteSerializer


class SurveyResultsView(generics.ListAPIView):
    serializer_class = ChoiceResultSerializer

    def get_queryset(self):
        survey_id = self.kwargs["survey_id"]
        return (
            Choice.objects.filter(question__survey_id=survey_id)
            .annotate(vote_count=Count("vote"))
            .values("id", "text", "question_id", "vote_count")
        )
