import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import NewsCard from "../components/newsCard";
import Sidebar from "../components/Sidebar";

function Home() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchParams] = useSearchParams();

    const category = searchParams.get("category");
    const search = searchParams.get("search");

    useEffect(() => {
        const fetchNews = async () => {
            try {
                setLoading(true);
                const params = {};

                if (category) {
                    params.category = category;
                }

                if (search) {
                    params.search = search;
                }

                const response = await api.get("/news/", {
                    params,
                });

                setNews(response.data.results);
            } catch (error) {
                console.error(error);
                setError("No se pudieron cargar las noticias.");
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, [category, search]);

    if (loading) {
        return <p>Cargando noticias...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
    <main className="home-container">

        <section className="news-section">
            <h1>Noticias</h1>

            {news.length === 0 ? (
                <p>No hay noticias disponibles.</p>
            ) : (
                <div className="news-grid">
                    {news.map((item) => (
                        <NewsCard
                            key={item.id}
                            news={item}
                        />
                    ))}
                </div>
            )}
        </section>

        <Sidebar />

    </main>
);
}

export default Home;