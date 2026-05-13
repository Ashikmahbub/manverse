from django.core.management.base import BaseCommand
from sentence_transformers import SentenceTransformer
from chat.models import KnowledgeChunk
from products.models import Product

embedder = SentenceTransformer("all-MiniLM-L6-v2")

class Command(BaseCommand):
    help = "Embed products into pgvector for RAG"

    def handle(self, *args, **kwargs):
        self.stdout.write("Deleting old product chunks...")
        KnowledgeChunk.objects.filter(source="product").delete()

        products = Product.objects.filter(is_active=True).select_related("category")
        if not products.exists():
            self.stdout.write(self.style.WARNING("No active products found."))
            return

        chunks = []
        for p in products:
            # Rich text so embeddings carry category + variant context
            text = (
                f"{p.name}. "
                f"Category: {p.category.name} ({p.category.gender}). "
                f"{p.description}. "
                f"Price: ৳{p.price}."
            )
            embedding = embedder.encode(text).tolist()
            chunks.append(KnowledgeChunk(
                content=text,
                source="product",
                source_id=p.id,
                embedding=embedding,
            ))

        KnowledgeChunk.objects.bulk_create(chunks, batch_size=100)
        self.stdout.write(self.style.SUCCESS(
            f"✓ Ingested {len(chunks)} products into pgvector."
        ))
