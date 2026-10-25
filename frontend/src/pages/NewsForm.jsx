import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function NewsForm() {
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);

    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("");
    const [location, setLocation] = useState("");
    const [publicationDate, setPublicationDate] = useState("");
    const [status, setStatus] = useState("DRAFT");
    const [featured, setFeatured] = useState(false);
    const [image, setImage] = useState(null);

    const [loading, setLoading] = useState(false);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCategories = async () => {
            const token = localStorage.getItem("access_token");

            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const response = await api.get("/categories/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setCategories(response.data.results);
            } catch (error) {
                console.error(error);
                setError("No se pudieron cargar las categorías.");
            } finally {
                setLoadingCategories(false);
            }
        };

        fetchCategories();
    }, [navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        const token = localStorage.getItem("access_token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const formData = new FormData();

            formData.append("title", title);
            formData.append("summary", summary);
            formData.append("content", content);
            formData.append("category", category);
            formData.append("location", location);
            formData.append("status", status);
            formData.append("featured", featured);

            if (publicationDate) {
                formData.append(
                    "publication_date",
                    publicationDate
                );
            }

            if (image) {
                formData.append("main_image", image);
            }

            await api.post("/news/", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            navigate("/dashboard");

        } catch (error) {
            console.error(error);

            if (error.response?.status === 401) {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");

                navigate("/login");
                return;
            }

            if (error.response?.data) {
                console.error(
                    "Validation errors:",
                    error.response.data
                );
            }

            setError(
                "No se pudo crear la noticia. Revisa los datos e inténtalo nuevamente."
            );
        } finally {
            setLoading(false);
        }
    };

    if (loadingCategories) {
        return (
            <main className="news-form-container">
                <p>Cargando formulario...</p>
            </main>
        );
    }

    return (
        <main className="news-form-container">

            <div className="news-form-header">
                <div>
                    <button
                        className="back-link"
                        onClick={() => navigate("/dashboard")}
                    >
                        ← Volver al dashboard
                    </button>

                    <h1>Nueva noticia</h1>

                    <p>
                        Completa la información de la noticia.
                    </p>
                </div>
            </div>

            {error && (
                <div className="news-form-error">
                    {error}
                </div>
            )}

            <form
                className="news-form"
                onSubmit={handleSubmit}
            >

                <section className="news-form-section">
                    <h2>Información principal</h2>

                    <div className="news-form-field">
                        <label htmlFor="title">
                            Título
                        </label>

                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(event) =>
                                setTitle(event.target.value)
                            }
                            maxLength={200}
                            required
                        />
                    </div>

                    <div className="news-form-field">
                        <label htmlFor="summary">
                            Resumen
                        </label>

                        <textarea
                            id="summary"
                            value={summary}
                            onChange={(event) =>
                                setSummary(event.target.value)
                            }
                            maxLength={500}
                            rows={4}
                            required
                        />
                    </div>

                    <div className="news-form-field">
                        <label htmlFor="content">
                            Contenido
                        </label>

                        <textarea
                            id="content"
                            value={content}
                            onChange={(event) =>
                                setContent(event.target.value)
                            }
                            rows={12}
                            required
                        />
                    </div>
                </section>

                <section className="news-form-section">
                    <h2>Detalles</h2>

                    <div className="news-form-grid">

                        <div className="news-form-field">
                            <label htmlFor="category">
                                Categoría
                            </label>

                            <select
                                id="category"
                                value={category}
                                onChange={(event) =>
                                    setCategory(event.target.value)
                                }
                                required
                            >
                                <option value="">
                                    Selecciona una categoría
                                </option>

                                {categories.map((item) => (
                                    <option
                                        key={item.id}
                                        value={item.id}
                                    >
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="news-form-field">
                            <label htmlFor="location">
                                Ubicación
                            </label>

                            <input
                                id="location"
                                type="text"
                                value={location}
                                onChange={(event) =>
                                    setLocation(event.target.value)
                                }
                                maxLength={150}
                            />
                        </div>

                    </div>

                    <div className="news-form-grid">

                        <div className="news-form-field">
                            <label htmlFor="publicationDate">
                                Fecha de publicación
                            </label>

                            <input
                                id="publicationDate"
                                type="datetime-local"
                                value={publicationDate}
                                onChange={(event) =>
                                    setPublicationDate(
                                        event.target.value
                                    )
                                }
                            />
                        </div>

                        <div className="news-form-field">
                            <label htmlFor="status">
                                Estado
                            </label>

                            <select
                                id="status"
                                value={status}
                                onChange={(event) =>
                                    setStatus(event.target.value)
                                }
                            >
                                <option value="DRAFT">
                                    Borrador
                                </option>

                                <option value="PUBLISHED">
                                    Publicado
                                </option>

                                <option value="ARCHIVED">
                                    Archivado
                                </option>
                            </select>
                        </div>

                    </div>

                    <div className="news-form-field">
                        <label htmlFor="image">
                            Imagen principal
                        </label>

                        <input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={(event) =>
                                setImage(
                                    event.target.files[0] || null
                                )
                            }
                        />
                        {image && (
                            <p>
                                Archivo seleccionado: {image.name}
                                ({Math.round(image.size / 1024)} KB)
                            </p>
                        )}
                    </div>

                    <label className="news-form-checkbox">
                        <input
                            type="checkbox"
                            checked={featured}
                            onChange={(event) =>
                                setFeatured(event.target.checked)
                            }
                        />

                        <span>
                            Marcar como noticia destacada
                        </span>
                    </label>

                </section>

                <div className="news-form-actions">

                    <button
                        type="button"
                        className="dashboard-secondary-button"
                        onClick={() => navigate("/dashboard")}
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        className="dashboard-primary-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Guardando..."
                            : "Guardar noticia"}
                    </button>

                </div>

            </form>

        </main>
    );
}

export default NewsForm;