import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [news, setNews] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchDashboard = async () => {
        const token = localStorage.getItem("access_token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            setLoading(true);

            const userResponse = await api.get("/auth/me/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const currentUser = userResponse.data;

            setUser(currentUser);

            const params = {};

            if (currentUser.role === "REPORTER") {
                params.author = currentUser.id;
            }

            const newsResponse = await api.get("/news/", {
                params,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setNews(newsResponse.data.results);

        } catch (error) {
            console.error(error);

            if (error.response?.status === 401) {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");

                navigate("/login");
                return;
            }

            setError("No se pudieron cargar los datos del dashboard.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        navigate("/login");
    };

    const handleDelete = async (newsId) => {
        const confirmed = window.confirm(
            "¿Estás seguro de que deseas eliminar esta noticia?"
        );

        if (!confirmed) {
            return;
        }

        const token = localStorage.getItem("access_token");

        try {
            await api.delete(`/news/${newsId}/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setNews((currentNews) =>
                currentNews.filter((item) => item.id !== newsId)
            );

        } catch (error) {
            console.error(error);

            if (error.response?.status === 403) {
                alert("No tienes permisos para eliminar esta noticia.");
            } else {
                alert("No se pudo eliminar la noticia.");
            }
        }
    };

    if (loading) {
        return (
            <main className="dashboard-container">
                <p>Cargando dashboard...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="dashboard-container">
                <p>{error}</p>
            </main>
        );
    }

    if (!user) {
        return null;
    }

    const publishedNews = news.filter(
        (item) => item.status === "PUBLISHED"
    );

    const draftNews = news.filter(
        (item) => item.status === "DRAFT"
    );

    return (
        <main className="dashboard-container">

            <section className="dashboard-header">
                <div>
                    <h1>Dashboard</h1>

                    <p>
                        Bienvenido,{" "}
                        {user.first_name || user.username}
                    </p>
                </div>

                <button
                    className="logout-button"
                    onClick={handleLogout}
                >
                    Cerrar sesión
                </button>
            </section>

            <section className="dashboard-stats">

                <div className="dashboard-stat">
                    <span>Total de noticias</span>
                    <strong>{news.length}</strong>
                </div>

                <div className="dashboard-stat">
                    <span>Publicadas</span>
                    <strong>{publishedNews.length}</strong>
                </div>

                <div className="dashboard-stat">
                    <span>Borradores</span>
                    <strong>{draftNews.length}</strong>
                </div>

            </section>

            <section className="dashboard-news">

                <div className="dashboard-section-header">
                    <div>
                        <h2>
                            {user.role === "ADMIN"
                                ? "Todas las noticias"
                                : "Mis noticias"}
                        </h2>

                        <p>
                            {user.role === "ADMIN"
                                ? "Gestiona todas las noticias del portal."
                                : "Gestiona las noticias que has creado."}
                        </p>
                    </div>

                    <button
                        className="dashboard-primary-button"
                        onClick={() =>
                            navigate("/dashboard/news/new")
                        }
                    >
                        Nueva noticia
                    </button>
                </div>

                {news.length === 0 ? (
                    <div className="dashboard-empty">
                        <p>
                            No hay noticias disponibles.
                        </p>

                        <button
                            className="dashboard-primary-button"
                            onClick={() =>
                                navigate("/dashboard/news/new")
                            }
                        >
                            Crear primera noticia
                        </button>
                    </div>
                ) : (
                    <div className="dashboard-news-list">

                        {news.map((item) => (
                            <article
                                className="dashboard-news-item"
                                key={item.id}
                            >

                                <div className="dashboard-news-info">

                                    {item.image_url && (
                                        <img
                                            src={item.image_url}
                                            alt={item.title}
                                            className="dashboard-news-image"
                                        />
                                    )}

                                    <div>
                                        <span className="dashboard-news-category">
                                            {item.category_name}
                                        </span>

                                        <h3>
                                            {item.title}
                                        </h3>

                                        <p>
                                            {item.summary}
                                        </p>

                                        <div className="dashboard-news-meta">
                                            <span>
                                                Autor:{" "}
                                                {item.author_name}
                                            </span>

                                            <span>
                                                Estado:{" "}
                                                {item.status}
                                            </span>
                                        </div>
                                    </div>

                                </div>

                                <div className="dashboard-news-actions">

                                    <button
                                        className="dashboard-secondary-button"
                                        onClick={() =>
                                            navigate(
                                                `/dashboard/news/${item.id}/edit`
                                            )
                                        }
                                    >
                                        Editar
                                    </button>

                                    {user.role === "ADMIN" && (
                                        <button
                                            className="dashboard-delete-button"
                                            onClick={() =>
                                                handleDelete(item.id)
                                            }
                                        >
                                            Eliminar
                                        </button>
                                    )}

                                </div>

                            </article>
                        ))}

                    </div>
                )}

            </section>

        </main>
    );
}

export default Dashboard;