from django.contrib import admin
from .models import KnowledgeChunk

@admin.register(KnowledgeChunk)
class KnowledgeChunkAdmin(admin.ModelAdmin):
    list_display  = ("source", "source_id", "content_preview", "created_at")
    list_filter   = ("source",)
    search_fields = ("content",)

    def content_preview(self, obj):
        return obj.content[:80]
    content_preview.short_description = "Content"
