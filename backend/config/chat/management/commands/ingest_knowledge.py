from django.core.management.base import BaseCommand
from fastembed import TextEmbedding
from chat.models import KnowledgeChunk
from products.models import Product

embedder = TextEmbedding("BAAI/bge-small-en-v1.5")

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
            text = (
                f"{p.name}. "
                f"Category: {p.category.name} ({p.category.gender}). "
                f"{p.description}. "
                f"Price: {p.price}."
            )
            embedding = list(embedder.embed([text]))[0].tolist()
            chunks.append(KnowledgeChunk(
                content=text,
                source="product",
                source_id=p.id,
                embedding=embedding,
            ))

        KnowledgeChunk.objects.bulk_create(chunks, batch_size=100)
        self.stdout.write(self.style.SUCCESS(
            f"Ingested {len(chunks)} products into pgvector."
        ))
