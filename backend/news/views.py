from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from .models import News
from .serializers import NewsSerializer
from .permissions import IsAdmin, IsReporterOrAdmin


class NewsViewSet(viewsets.ModelViewSet):
    queryset = News.objects.all()
    serializer_class = NewsSerializer

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [AllowAny()]

        if self.action == "destroy":
            return [IsAdmin()]

        return [IsReporterOrAdmin()]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
        