from django.urls import path
from . import views

urlpatterns = [
    path('note/', views.NoteListCreateView.as_view(), name='note-list-create'),
    path('note/<int:pk>/', views.NoteDetailView.as_view(), name='note-detail'),
]