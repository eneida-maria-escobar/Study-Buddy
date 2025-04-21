from django.contrib import admin
from .models import Note  # Import the Note modelfrom .models import Note  # Import the Note model

# Register the Note model# Register the Note model
@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ('title', 'back', 'type', 'author', 'created_at')  # Fields to display in the admin list view
    search_fields = ('title', 'back', 'type', 'author__username')  # Fields to enable search functionality
    list_filter = ('type', 'author')  # Fields to filter by in the admin interface
