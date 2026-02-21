import json
from django.utils.text import slugify
from products.models import Category, Product, ProductVariant
from pathlib import Path
from django.conf import settings


def run():
    file_path = Path(settings.BASE_DIR) / "products" / "products.json"

    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    for item in data:
        category, _ = Category.objects.get_or_create(
            name=item["category"],
            slug=slugify(item["category"])
        )

        product, _ = Product.objects.get_or_create(
            name=item["name"],
            slug=slugify(item["name"]),
            defaults={
                "category": category,
                "description": f"{item['name']} by {item['seller']}",
                "price": item["price"],
                "is_active": True,
            }
        )

        ProductVariant.objects.get_or_create(
            product=product,
            size="Default",
            color="Default",
            defaults={"stock": item["stock"]}
        )

    print("Products Imported Successfully")