import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-hot-toast";
import { Image as ImageIcon, Send } from "lucide-react";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      return toast.error("Title and content are required");
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("published", "true");
    if (image) {
      formData.append("image", image);
    }

    try {
      await api.post("/post/create-post", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Post published successfully!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to publish post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gradient">Create New Story</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full bg-transparent text-4xl font-bold border-none outline-none placeholder:text-muted-foreground/30 px-0"
          />
          <div className="h-px bg-white/10" />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="cursor-pointer group flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors">
              <div className="p-2 glassmorphism rounded-lg group-hover:bg-white/10">
                <ImageIcon size={20} />
              </div>
              {image ? "Change Image" : "Add Cover Image"}
              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
          </div>
          
          {imagePreview && (
            <div className="relative aspect-video rounded-2xl overflow-hidden glassmorphism border-white/10">
              <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
              <button 
                onClick={() => { setImage(null); setImagePreview(null); }}
                className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-black/70 transition-colors"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Tell your story..."
          className="w-full min-h-[400px] bg-transparent text-xl leading-relaxed border-none outline-none resize-none placeholder:text-muted-foreground/30 px-0"
        />

        <div className="sticky bottom-8 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-white/90 shadow-2xl hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
          >
            {loading ? "Publishing..." : (
              <>
                Publish Story
                <Send size={20} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
