import Header from "@/components/header";
import { useUserDetails } from "@/context/userDetails";
import { newsImgUpload } from "@/services/admin";
import { getAllNews } from "@/services/news";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

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

const ArticleDetail: React.FC = () => {
    const router = useRouter();
    const { user, updateUser } = useUserDetails();
    const { newsId: id } = router.query; // Ensure you fetch the ID from query params
    const [theNews, setTheNews] = useState<Article | null>(null);
    const [image, setImage] = useState<any>(null)
    const [loading, setLoading] = useState(false)

    const handleNewsImgUpload = async (newsId: string, e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) {
            // alert("No file selected.");
            return;
        }

        const file = e.target.files[0];
        const allowedFormats = ["image/jpeg", "image/png", "image/webp"];
        const maxFileSize = 5 * 1024 * 1024; // 5 MB

        // Validate file type and size
        if (!allowedFormats.includes(file.type)) {
            // alert("Invalid file format. Please upload JPEG, PNG, or WebP images.");
            return;
        }
        if (file.size > maxFileSize) {
            // alert("File size exceeds 5MB. Please upload a smaller file.");
            return;
        }

        let body = { id: newsId, image: null as string | ArrayBuffer | null };

        try {
            // Read the file as Base64
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = async () => {
                body.image = reader.result;

                try {
                    const response = await newsImgUpload(body); // Assuming `newsImgUpload` is an API function
                    if (response.error) {
                        // alert("Image upload failed: " + response.error);
                    } else {
                        // alert("Image uploaded successfully!");
                        // Update the news image locally for immediate feedback
                        // setTheNews((prev) =>
                        //     prev ? { ...prev, urlToImage: response.imageUrl } : null
                        // );
                        fetchNews();
                        setLoading(true)
                    }
                } catch (error) {
                    console.error("Error uploading image:", error);
                    // alert("An error occurred during upload. Please try again.");
                }
            };

            reader.onerror = (error) => {
                console.error("File reading error:", error);
                // alert("Failed to read the file. Please try again.");
            };
        } catch (error) {
            console.error("Error processing file:", error);
            // alert("An error occurred during file processing. Please try again.");
        }
    };

    const fetchNews = async () => {

        try {
            const response = await getAllNews();
            localStorage.setItem("news", JSON.stringify(response));
            const matchedArticle = response.find(
                (news: Article) => news.source.id === id
            );
            setTheNews(matchedArticle || null);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };



    useEffect(() => {
        if (!id) return; // Wait until `id` is available
        const savedNews = localStorage.getItem("news");
        if (savedNews) {
            try {
                const parsedNews = JSON.parse(savedNews);
                const matchedArticle = parsedNews.find(
                    (news: Article) => news.source.id === id
                );
                setTheNews(matchedArticle || null); // Handle unmatched cases
            } catch (error) {
                console.error("Error parsing news data:", error);
            }
        }
    }, []);

    // If no article is found
    if (!theNews) {
        return (
            <p className="text-center text-lg text-gray-600">
                No article found for the given ID.
            </p>
        );
    }

    if (loading) return <p className="text-center text-lg">Loading...</p>;


    return (
        <div>
            <div className={`min-h-screen flex flex-col bg-gray-100 text-gray-900 transition-colors duration-300 hidden-scrollbar`}>
                <header className='sticky top-0 left-0 right-0 z-10 bg-primary text-white shadow-md'>
                    <Header setOpen={() => { user?.type === "User" ? router.push(`/user/${user?.userId}`) : router.push(`/admin/${user?.userId}`) }} />
                </header>
                <main className="container mx-auto p-4">
                    <div className="text-lg pb-4 cursor-pointer hover:text-slate-500" onClick={() => router.back()}>
                        {"<"}  Back
                    </div>
                    <div className="relative">
                        <img
                            src={theNews.urlToImage}
                            alt={theNews.title}
                            className="w-full h-96 object-cover rounded-lg mb-4"
                        />

                        {/* Change Button */}
                        {user?.type === "Admin" && <label
                            htmlFor="file-upload"
                            className="absolute bottom-0 right-0 bg-orange-600 hover:bg-orange-400 px-4 py-2 text-white font-semibold cursor-pointer"
                        >
                            Change
                        </label>}

                        {/* Hidden File Input */}
                        <input
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                handleNewsImgUpload(theNews.source.id, e)
                            }}
                        />                    </div>
                    <h1 className="text-2xl font-bold mb-2">{theNews.title}</h1>
                    <p className="text-gray-600 mb-4">By {theNews.author || "Unknown Author"}</p>
                    <p className="text-sm text-gray-500 mb-6">
                        {new Date(theNews.publishedAt).toLocaleString()}
                    </p>
                    <p className="text-lg mb-6">{theNews.content}</p>
                    <a
                        href={theNews.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                    >
                        Read the full article on {theNews.source.name}
                    </a>
                </main>
            </div>
        </div>
    );
};

export default ArticleDetail;
