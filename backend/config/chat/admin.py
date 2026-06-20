from django.contrib import admin
from .models import KnowledgeChunk

@admin.register(KnowledgeChunk)
class KnowledgeChunkAdmin(admin.ModelAdmin):
    list_display  = ("source", "source_id", "created_at")
    list_filter   = ("source",)
    search_fields = ("content",)
