from django.db import models
from pgvector.django import VectorField

class KnowledgeChunk(models.Model):
    content    = models.TextField()
    source     = models.CharField(max_length=100)  # "product"
    source_id  = models.IntegerField(null=True, blank=True)
    embedding  = VectorField(dimensions=384)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.source}] {self.content[:60]}"
