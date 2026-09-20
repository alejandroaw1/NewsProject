from rest_framework import viewsets, filters
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend


from .models import News
from .serializers import NewsSerializer
from .permissions import IsAdmin, IsReporterOrAdmin


class NewsViewSet(viewsets.ModelViewSet):
    queryset = News.objects.all()
    serializer_class = NewsSerializer

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_fields = [
        'author',
        'category',
        'location',
        'status',
        'featured',
    ]

    search_fields = [
        'title',
        'summary',
        'content',
    ]

    ordering_fields = [
        'publication_date',
        'created_at',
        'updated_at', 
        'title',
    ]

    ordering = ['-publication_date', '-created_at']

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [AllowAny()]

        if self.action == "destroy":
            return [IsAdmin()]

        return [IsReporterOrAdmin()]

    def get_queryset(self):
        queryset = News.objects.all()

        if not self.request.user.is_authenticated:
            queryset = queryset.filter(status=News.Status.PUBLISHED)

        return queryset
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
        