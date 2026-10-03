function NewsCard({ news }) {
    return (
        <article className="news-card">
            {news.image_url && (
                <img
                    src={news.image_url}
                    alt={news.title}
                    className="news-card-image"
                />
            )}

            <div className="news-card-content">
                <span className="news-card-category">
                    {news.category_name}
                </span>

                <h2>{news.title}</h2>

                <p className="news-card-summary">
                    {news.summary}
                </p>

                <div className="news-card-info">
                    <span>{news.location}</span>
                    <span>{news.author_name}</span>
                </div>
            </div>
        </article>
    );
}

export default NewsCard;