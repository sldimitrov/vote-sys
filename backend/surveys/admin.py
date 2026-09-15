from django.contrib import admin
from surveys.models import Survey, Question, Choice, Vote


@admin.register(Survey)
class SurveyAdmin(admin.ModelAdmin):
    pass

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    pass

@admin.register(Choice)
class ChoiceAdmin(admin.ModelAdmin):
    pass

@admin.register(Vote)
class VoteAdmin(admin.ModelAdmin):
    pass

