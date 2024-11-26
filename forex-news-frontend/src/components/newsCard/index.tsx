import { useRouter } from "next/router";
import React from "react";

interface Article {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  source: {
    id: string;
    name: string;
  };
  author: string;
  publishedAt: string;
  content: string;
}

const NewsCard: React.FC<{ article: Article }> = ({ article }) => {
  const router = useRouter();
  return (
    <div className="border rounded-lg shadow-md overflow-hidden">
      <img
        src={article.urlToImage}
        alt={article.title}
        className="w-full h-40 object-cover"
      />
      <div className="p-4">
        <h2 className="text-lg font-semibold">{article.title}</h2>
        <p className="text-sm text-gray-600">{article.description}</p>
        <button
          className="text-blue-500 hover:underline"
          onClick={() => router.push(`/news/${article.source.id}`)}
        >
          Read more
        </button>
      </div>
    </div>
  );
};

export default NewsCard;
