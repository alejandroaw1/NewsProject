import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

function NewsDetail() {
    const { slug } = useParams();

    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await api.get(`/news/${slug}/`);
                setNews(response.data);
            } catch (error) {
                console.error(error);
                setError("No se pudo cargar la noticia.");
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, [slug]);

    if (loading) {
        return <p>Cargando noticia...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!news) {
        return <p>Noticia no encontrada.</p>;
    }

    return (
        <main className="news-detail">
            <Link to="/" className="back-link">
                ← Volver a noticias
            </Link>

            <article>
                <span className="news-detail-category">
                    {news.category_name}
                </span>

                <h1>{news.title}</h1>

                <div className="news-detail-info">
                    <span>Por {news.author_name}</span>
                    <span>{news.location}</span>
                </div>

                {news.image_url && (
                    <img
                        src={news.image_url}
                        alt={news.title}
                        className="news-detail-image"
                    />
                )}

                <p className="news-detail-summary">
                    {news.summary}
                </p>

                <div className="news-detail-content">
                    {news.content}
                </div>
            </article>
        </main>
    );
}

export default NewsDetail;