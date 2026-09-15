from rest_framework import serializers
from .models import Survey, Question, Choice, Vote


class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ["id", "text"]


class QuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True, read_only=True, source="choice_set")

    class Meta:
        model = Question
        fields = ["id", "title", "description", "allow_multiple", "choices"]


class SurveySerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True, source="question_set")

    class Meta:
        model = Survey
        fields = ["id", "title", "questions"]


class VoteSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Vote
        fields = ["id", "choice", "user"]
        validators = []

    def validate(self, data):
        choice = data["choice"]
        question = choice.question
        user = data["user"]

        if question.allow_multiple:
            already_voted = Vote.objects.filter(user=user, choice=choice).exists()
        else:
            already_voted = Vote.objects.filter(
                user=user, choice__question=question
            ).exists()

        if already_voted:
            raise serializers.ValidationError(
                "Вече си гласувал/а на този въпрос."
            )
        return data


class ChoiceResultSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    text = serializers.CharField()
    question_id = serializers.IntegerField()
    vote_count = serializers.IntegerField()
