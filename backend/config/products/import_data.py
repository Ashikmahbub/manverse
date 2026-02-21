# import json
# from django.utils.text import slugify
# from products.models import Category, Product, ProductVariant
# from pathlib import Path
# from django.conf import settings


# def run():
#     file_path = Path(settings.BASE_DIR) / "products" / "products.json"

#     with open(file_path, "r", encoding="utf-8") as f:
#         data = json.load(f)

#     for item in data:
#         category, _ = Category.objects.get_or_create(
#             name=item["category"],
#             slug=slugify(item["category"])
#         )

#         product, _ = Product.objects.get_or_create(
#             name=item["name"],
#             slug=slugify(item["name"]),
#             defaults={
#                 "category": category,
#                 "description": f"{item['name']} by {item['seller']}",
#                 "price": item["price"],
#                 "is_active": True,
#             }
#         )

#         ProductVariant.objects.get_or_create(
#             product=product,
#             size="Default",
#             color="Default",
#             defaults={"stock": item["stock"]}
#         )

#     print("Products Imported Successfully")
import json
import requests
from django.utils.text import slugify
from django.core.files.base import ContentFile
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

        product, created = Product.objects.get_or_create(
            name=item["name"],
            slug=slugify(item["name"]),
            defaults={
                "category": category,
                "description": f"{item['name']} by {item['seller']}",
                "price": item["price"],
                "is_active": True,
            }
        )

        # Download and save image
        image_url = item.get("image")
        if image_url and not product.image:
            try:
                response = requests.get(image_url, timeout=10)
                if response.status_code == 200:
                    filename = f"{slugify(item['name'])}.jpg"
                    product.image.save(
                        filename,
                        ContentFile(response.content),
                        save=True
                    )
                    print(f"Image saved for: {item['name']}")
            except Exception as e:
                print(f"Failed to download image for {item['name']}: {e}")

        ProductVariant.objects.get_or_create(
            product=product,
            size="Default",
            color="Default",
            defaults={"stock": item["stock"]}
        )

    print("Products Imported Successfully")