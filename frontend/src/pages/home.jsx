import { useEffect, useState } from "react";
import api from "../services/api";

function Home() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await api.get("/news/");
                setNews(response.data.results);
            } catch (error) {
                console.error(error);
                setError("No se pudieron cargar las noticias.");
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    if (loading) {
        return <p>Cargando noticias...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <main>
            <h1>Noticias</h1>

            {news.length === 0 ? (
                <p>No hay noticias disponibles.</p>
            ) : (
                news.map((item) => (
                    <article key={item.id}>
                        <h2>{item.title}</h2>

                        {item.image_url && (
                            <img
                                src={item.image_url}
                                alt={item.title}
                            />
                        )}

                        <p>{item.summary}</p>

                        <p>
                            {item.category_name} · {item.location}
                        </p>
                    </article>
                ))
            )}
        </main>
    );
}

export default Home;