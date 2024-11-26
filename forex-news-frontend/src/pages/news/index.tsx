import { useState, useEffect } from "react";
import NewsCard from "../../components/newsCard";
import { getAllNews } from "@/services/news";
import Header from "@/components/header";
import { toast, ToastContainer } from "react-toastify";
import { useUserDetails } from "@/context/userDetails";
import { Avatar, Drawer } from "@mui/material";
import { useRouter } from "next/router";
import Footer from "@/components/footer";

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

interface NewsType {
  title?: string;
  description?: string;
  topics?: string[];
}

const News: React.FC = () => {
  const { user, updateUser } = useUserDetails();
  const [news, setNews] = useState<Article[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [topics, setTopics] = useState([
    "Currency Pairs",
    "Technical News",
    "Fundamental News",
    "Market Trends",
    "EUR"
  ]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");
  const filter = ["title", "description"]; // Can be 'title' or 'description'
  const categories: (keyof NewsType)[] = ["title", "description"]; // Categories to filter

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    localStorage.removeItem("loginMessage");
    localStorage.removeItem("loginTime");
    updateUser(null);
    toast.success('User logged out successfully', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  function newsDetails() {
    if (!news) return []; // Handle null case

    if (selectedTopics.length > 0 || searchText.trim() !== "") {
      return news.filter((task: NewsType) => {
        const matchesTopics = selectedTopics.length > 0
          ? selectedTopics.some((topic) => task.topics?.includes(topic))
          : true;

        const matchesSearchText = searchText.trim() !== ""
          ? (
            (task.title?.toLowerCase().includes(searchText.toLowerCase()) ||
              task.description?.toLowerCase().includes(searchText.toLowerCase()))
          )
          : true;

        return matchesTopics && matchesSearchText;
      });
    }

    return news; // Return all news if no filters are applied
  }

  useEffect(() => {
    const savedNews = localStorage.getItem("news");
    if (savedNews) {
      setNews(JSON.parse(savedNews));
      setLoading(false);
    } else {
      const fetchNews = async () => {
        try {
          const response = await getAllNews();
          setNews(response as any);
          setLoading(false);
        } catch (error) {
          console.error(error);
        }
      };
      fetchNews();
    }
  }, []);

  if (loading) return <p className="text-center text-lg">Loading...</p>;

  return (
    <div>
      <ToastContainer />
      <div className={`min-h-screen flex flex-col bg-gray-100 text-gray-900 transition-colors duration-300 hidden-scrollbar`}>
        <header className='sticky top-0 left-0 right-0 z-10 w-full'>
          <Header setOpen={() => { user?.type === "User" ? router.replace(`/user/${user?.userId}`) : router.replace(`/admin/${user?.userId}`) }} />
        </header>
        <main className='container mx-auto px-4 py-6'>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Enter search text..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div className="mb-4">
            <h2 className="font-semibold mb-2">Sort by</h2>
            <div className="flex flex-wrap gap-2">
              {topics.map((topic) => (
                <label key={topic} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={topic}
                    checked={selectedTopics.includes(topic)}
                    onChange={(e) => setSelectedTopics(prev =>
                      e.target.checked
                        ? [...prev, topic]
                        : prev.filter(t => t !== topic)
                    )}
                    className="h-4 w-4"
                  />
                  <span className="text-sm">{topic}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {newsDetails().map((article, index) => (
              <NewsCard key={index} article={article} />
            ))}
          </div>
          <Drawer open={open} anchor="right" onClose={() => setOpen(false)}>
            <div className={`px-5 py-4 h-screen bg-gray-100 text-gray-900 transition-colors duration-300`}>
              {user ? (
                <div className="flex flex-col items-center p-6 space-y-4">
                  <h2 className="text-2xl font-bold mb-3">My Profile</h2>
                  <Avatar
                    src={user?.gender == "Male"
                      ? "https://png.pngtree.com/png-clipart/20200224/original/pngtree-cartoon-color-simple-male-avatar-png-image_5230557.jpg"
                      : user?.gender == "Female" ? "https://w7.pngwing.com/pngs/4/736/png-transparent-female-avatar-girl-face-woman-user-flat-classy-users-icon.png" : user?.profilePicture ? user?.profilePicture : ''}
                    sx={{ height: 120, width: 120 }}
                    className="object-cover mb-4 shadow-md"
                    alt={`${user?.gender} Avatar`}
                  />
                  <div className="text-center space-y-1">
                    <div className="text-xl font-semibold">
                      {user?.firstName} {user?.lastName}
                    </div>
                    <div className={`text-gray-600`}>{user?.email}</div>
                    <div className={`text-gray-600 capitalize`}>{user?.gender}</div>
                  </div>

                  <button
                    className="mt-5 px-4 py-2 bg-red-600 text-white rounded-lg font-medium shadow hover:bg-red-500 transition-colors duration-300"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col justify-center items-center px-8">
                  <div className='text-2xl font-medium pb-5'>No User found</div>
                  <img src="https://img.freepik.com/premium-vector/flat-design-no-user-found_108061-1605.jpg" className='max-h-[300px] max-w-[300px]' alt="no user found" />
                  <p className={`text-lg text-center max-w-md mb-4`}>
                    It seems you’re not logged in. If you already have an account, please log in below. Otherwise, create a new account to get started.
                  </p>
                  <div className="flex flex-col items-center space-y-4">
                    <div
                      className="px-6 py-2 text-lg font-semibold text-blue-600 rounded-md bg-blue-100 hover:bg-blue-200 transition-colors duration-300"
                      onClick={() => router.push("/signIn")}
                    >
                      Login
                    </div>
                    <span className="text-lg font-medium text-gray-500">or</span>
                    <div
                      className="px-6 py-2 text-lg font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-500 transition-colors duration-300"
                      onClick={() => router.push("/signUp")}
                    >
                      Register
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Drawer>
        </main>
        {/* Ensure Footer takes full width */}
        <footer className='w-full py-5'>
          <Footer />
        </footer>
      </div>
    </div>
  );
};

export default News;
