import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Sidebar() {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get("/categories/");
                setCategories(response.data.results);
            } catch (error) {
                console.error(error);
                setError("No se pudieron cargar las categorías.");
            }
        };

        fetchCategories();
    }, []);

    return (
        <aside className="sidebar">

            <section className="sidebar-section">
                <h3>Buscar noticias</h3>

                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Buscar noticias..."
                    />

                    <button>
                        Buscar
                    </button>
                </div>
            </section>

            <section className="sidebar-section">
                <h3>Categorías</h3>

                {error ? (
                    <p>{error}</p>
                ) : (
                    <ul className="category-list">
                        {categories.map((category) => (
                            <li key={category.id}>
                                <Link to={`/?category=${category.id}`}>
                                    {category.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            <section className="sidebar-section">
                <h3>Sobre nosotros</h3>

                <p>
                    News Portal es una plataforma informativa
                    dedicada a ofrecer noticias de actualidad
                    de manera clara y accesible.
                </p>
            </section>

        </aside>
    );
}

export default Sidebar;