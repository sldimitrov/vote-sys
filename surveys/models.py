from django.db import models
from django.contrib.auth.models import User
from base.models import Timestamped

class Survey(Timestamped):
    title = models.CharField(max_length=200)


class Question(Timestamped):
    survey = models.ForeignKey(Survey, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.CharField(max_length=250)
    allow_multiple = models.BooleanField(default=False)


class Choice(Timestamped):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    text = models.CharField(max_length=200)


class Vote(Timestamped):
    choice = models.ForeignKey(Choice, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user", "choice"], name="unique_user_choice_vote")
        ]
