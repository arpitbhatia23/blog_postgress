import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-hot-toast";
import { User, Calendar, Send, Trash2 } from "lucide-react";

interface Comment {
  id: number;
  text: string;
  user_id: number;
}

interface Post {
  id: number;
  title: string;
  content: string;
  comments: Comment[];
}

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchPost = async () => {
    try {
      const response = await api.get(`/post/get-post-by-id/${id}`);
      setPost(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch post");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmitting(true);
    try {
      await api.post(`/comment/post/${id}`, { content: commentText });
      setCommentText("");
      toast.success("Comment added!");
      fetchPost();
    } catch (error) {
      toast.error("Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await api.delete(`/comment/${commentId}`);
      toast.success("Comment deleted");
      fetchPost();
    } catch (error) {
      toast.error("Failed to delete comment");
    }
  };

  if (loading) return <div className="max-w-3xl mx-auto space-y-8 animate-pulse">
    <div className="h-12 bg-white/5 rounded-xl w-3/4" />
    <div className="h-4 bg-white/5 rounded-xl w-1/4" />
    <div className="h-64 bg-white/5 rounded-2xl" />
  </div>;

  if (!post) return <div className="text-center py-20">Post not found</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gradient">
          {post.title}
        </h1>
        <div className="flex items-center gap-4 text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User size={16} />
            </div>
            <span className="text-sm font-medium">Author #{id}</span>
          </div>
          <span className="text-white/20">•</span>
          <div className="flex items-center gap-2 text-sm">
            <Calendar size={14} />
            Published recently
          </div>
        </div>
      </header>

      <div className="prose prose-invert prose-lg max-w-none">
        <p className="text-xl leading-relaxed text-muted-foreground">
          {post.content}
        </p>
      </div>

      <section className="pt-12 border-t border-white/10 space-y-8">
        <h3 className="text-2xl font-bold">Comments ({post.comments.length})</h3>
        
        <form onSubmit={handleCommentSubmit} className="relative">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="What are your thoughts?"
            className="w-full min-h-[120px] p-6 glassmorphism rounded-2xl outline-none border-white/10 focus:border-white/30 transition-all resize-none"
          />
          <button
            disabled={submitting}
            className="absolute bottom-4 right-4 p-3 bg-white text-black rounded-xl hover:bg-white/90 transition-all disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </form>

        <div className="space-y-6">
          {post.comments.map((comment) => (
            <div key={comment.id} className="p-6 glassmorphism rounded-2xl border-white/5 flex gap-4">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                <User size={20} />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white/90">User #{comment.user_id}</span>
                  {comment.user_id === user.id && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                <p className="text-muted-foreground leading-relaxed">{comment.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PostDetail;
