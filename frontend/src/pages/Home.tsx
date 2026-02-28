import { useState, useEffect } from "react";
import api from "../services/api";
import { MessageSquare, User as UserIcon, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

interface Post {
  id: number;
  title: string;
  content: string;
  image_url: string;
  author_id: number;
  created_At: string;
}

const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      console.log("this my api", api.toString);
      try {
        const response = await api.get("/post/get-all-post?page=1&limit=10");
        setPosts(response.data.data);
      } catch (error) {
        console.error("Failed to fetch posts", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-80 glassmorphism rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <header className="max-w-2xl">
        <h1 className="text-5xl font-bold tracking-tight mb-4 text-gradient">
          Explore the latest stories in tech. test 1
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          The best insights from developers, designers, and creators worldwide.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <article
            key={post.id}
            className="group glassmorphism rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300 flex flex-col"
          >
            {post.image_url && (
              <div className="aspect-video overflow-hidden">
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <UserIcon size={12} />
                  Author #{post.author_id}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {new Date(post.created_At).toLocaleDateString()}
                </span>
              </div>
              <h2 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                <Link to={`/post/${post.id}`}>{post.title}</Link>
              </h2>
              <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1">
                {post.content}
              </p>
              <div className="flex items-center justify-between pt-6 border-t border-white/10">
                <Link
                  to={`/post/${post.id}`}
                  className="text-sm font-semibold hover:underline underline-offset-4"
                >
                  Read Story
                </Link>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <span className="flex items-center gap-1 text-xs">
                    <MessageSquare size={14} />4
                  </span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Home;
