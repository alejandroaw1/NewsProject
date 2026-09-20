from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    """
    Permite el acceso únicamente a usuarios con rol ADMIN.
    """

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "ADMIN"
        )


class IsReporterOrAdmin(BasePermission):
    """
    Permite crear noticias a usuarios REPORTER o ADMIN.
    Para editar/eliminar, el control sobre el objeto
    se realiza mediante has_object_permission().
    """

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role in ["REPORTER", "ADMIN"]
        )

    def has_object_permission(self, request, view, obj):
        # El administrador puede modificar cualquier noticia.
        if request.user.role == "ADMIN":
            return True

        # Un reportero solamente puede modificar sus propias noticias.
        return obj.author == request.user
