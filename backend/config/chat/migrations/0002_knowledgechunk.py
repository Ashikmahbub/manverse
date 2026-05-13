from django.db import migrations, models
import pgvector.django

class Migration(migrations.Migration):
    dependencies = [
        ("chat", "0001_pgvector_extension"),
    ]

    operations = [
        migrations.CreateModel(
            name="KnowledgeChunk",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True)),
                ("content", models.TextField()),
                ("source", models.CharField(max_length=100)),
                ("source_id", models.IntegerField(blank=True, null=True)),
                ("embedding", pgvector.django.VectorField(dimensions=384)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
