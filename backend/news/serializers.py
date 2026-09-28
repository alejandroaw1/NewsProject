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

    image_url = serializers.SerializerMethodField()

    class Meta:
        model = News
        fields = [
            "id",
            "title",
            "slug",
            "summary",
            "content",
            "image_url",
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
            "author",
            "author_name",
            "category_name",
            "image_url",
            "created_at",
            "updated_at",
        ]

    def get_image_url(self, obj):
        request = self.context.get("request")

        if obj.main_image and request:
            return request.build_absolute_uri(obj.main_image.url)

        return None