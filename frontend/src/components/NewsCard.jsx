import { Link } from "react-router-dom";

function NewsCard({ news }) {
    return (
        <article className="news-card">
            {news.image_url && (
                <Link to={`/news/${news.slug}`}>
                    <img
                        src={news.image_url}
                        alt={news.title}
                        className="news-card-image"
                    />
                </Link>
            )}

            <div className="news-card-content">
                <span className="news-card-category">
                    {news.category_name}
                </span>

                <h2>
                    <Link to={`/news/${news.slug}`}>
                        {news.title}
                    </Link>
                </h2>

                <p className="news-card-summary">
                    {news.summary}
                </p>

                <div className="news-card-info">
                    <span>{news.location}</span>
                    <span>{news.author_name}</span>
                </div>

                <Link
                    to={`/news/${news.slug}`}
                    className="read-more"
                >
                    Leer noticia →
                </Link>
            </div>
        </article>
    );
}

export default NewsCard;