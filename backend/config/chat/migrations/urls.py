from django.urls import path
from .views import rag_search

urlpatterns = [
    path("rag-search/", rag_search, name="rag_search"),
]
