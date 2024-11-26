import { useEffect } from "react";
import News from "./news";
import { GetServerSideProps } from "next";
import axios from "axios";
import { UserDetailsProvider, useUserDetails } from "@/context/userDetails";
import { jwtDecode } from 'jwt-decode'; // Correct way for newer versions
import { toast } from "react-toastify";
import { getAllNews } from "@/services/news";
import { useRouter } from "next/router";

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

interface ArticlesDetailProps {
  articles: Article[];
}

const Home: React.FC<ArticlesDetailProps> = ({ articles }) => {
  const router = useRouter();
  const { user, updateUser } = useUserDetails();
  const token  = router.query.token as string; // Ensure you fetch the ID from query params


  const getAllNewsApi = async () => {
    try {
      const response = await getAllNews();
      localStorage.setItem("news", JSON.stringify(response));
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    // Store articles in localStorage
    if (articles) {
      localStorage.setItem("news", JSON.stringify(articles));
    }
  }, [articles]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decoded: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");
        localStorage.removeItem("loginMessage");
        localStorage.removeItem("loginTime");
      }
      else {
        getAllNewsApi();
      }
    }
    const loginMessage = localStorage.getItem("loginMessage");
    if (loginMessage) {
      toast.success('User logged in successfully', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      localStorage.removeItem("loginMessage");
    }
  }, [])

  useEffect(() => {
    if (token) {
      const decoded: any = jwtDecode(token);
      const userData: any = {};
      userData.userId = decoded.id;
      userData.email = decoded.email;
      userData.firstName = decoded.firstName;
      userData.lastName = decoded.lastName;
      userData.profilePicture = decoded.profilePicture;
      userData.type = decoded.type;
      updateUser(userData);
      toast.success('User logged in successfully', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      localStorage.setItem("authToken", token);
      router.replace("/")
    }

  }, [token])



  return (
    <div>
      <News />
    </div>
  );
};

// Fetch the articles using getServerSideProps
export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const api = axios.create({
      baseURL: "http://localhost:8080/api/news", // Replace with your API base URL
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await api.get("/getAll");
    const articles: Article[] = response.data;

    return {
      props: {
        articles,
      },
    };
  } catch (error) {
    console.error("Error fetching news:", error);
    return {
      props: {
        articles: [], // Return an empty array to avoid breaking the UI
      },
    };
  }
};

export default Home;
