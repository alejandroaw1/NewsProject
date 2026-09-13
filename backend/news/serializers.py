from rest_framework import serializers
from .models import News


class NewsSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(
        source="author.username",
        read_only=True
    )

    category_name = serializers.CharField(
        source="category.name",
        read_only=True
    )

    class Meta:
        model = News
        fields = [
            "id",
            "title",
            "slug",
            "summary",
            "content",
            "main_image",
            "publication_date",
            "location",
            "author",
            "author_name",
            "category",
            "category_name",
            "status",
            "featured",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "slug",
            "author_name",
            "category_name",
            "created_at",
            "updated_at",
        ]