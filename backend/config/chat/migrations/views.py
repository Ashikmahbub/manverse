from django.http import JsonResponse
from django.views.decorators.http import require_GET
from sentence_transformers import SentenceTransformer
from pgvector.django import CosineDistance
from .models import KnowledgeChunk

embedder = SentenceTransformer("all-MiniLM-L6-v2")

@require_GET
def rag_search(request):
    query = request.GET.get("q", "").strip()
    if not query:
        return JsonResponse({"chunks": []})

    query_vec = embedder.encode(query).tolist()

    chunks = (
        KnowledgeChunk.objects
        .annotate(dist=CosineDistance("embedding", query_vec))
        .filter(dist__lt=0.6)
        .order_by("dist")[:5]
    )

    return JsonResponse({
        "chunks": [
            {
                "content": c.content,
                "source_id": c.source_id,
                "relevance": round(1 - c.dist, 4),
            }
            for c in chunks
        ]
    })
