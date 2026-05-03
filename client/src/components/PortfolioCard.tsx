import { useState } from "react";
import { ThumbsUp, Share2, MessageCircle, Play } from "lucide-react";

interface PortfolioCardProps {
  item: {
    id: string | number;
    title: string;
    imageUrl: string;
    category: string;
    description?: string;
  };
  onClick: () => void;
}

export default function PortfolioCard({ item, onClick }: PortfolioCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 200) + 50);
  const [shareCount, setShareCount] = useState(Math.floor(Math.random() * 50) + 10);
  const [commentCount] = useState(Math.floor(Math.random() * 30) + 5);

  const isVideo = (url: string) => {
    return url.includes(".mp4") || url.includes(".webm") || url.includes(".mov");
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShareCount(shareCount + 1);
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: item.description || "Check out this work from KretivMay!",
        url: window.location.href,
      }).catch(() => {
        navigator.clipboard.writeText(window.location.href);
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleComment = (e: React.MouseEvent) => {
    e.stopPropagation();
    // In a real app, this might open a comment modal or section
    // For now, we'll just trigger the main click to open the lightbox
    onClick();
  };

  return (
    <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-white border border-slate-100">
      {/* Image/Video Container */}
      <div 
        className="relative aspect-[4/5] overflow-hidden bg-slate-50 cursor-pointer flex items-center justify-center p-2"
        onClick={onClick}
      >
        {isVideo(item.imageUrl) ? (
          <>
            <video
              src={item.imageUrl}
              className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
              onMouseEnter={(e) => e.currentTarget.play()}
              onMouseLeave={(e) => e.currentTarget.pause()}
              muted
              loop
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
              <Play className="w-10 h-10 text-white fill-white drop-shadow-lg" />
            </div>
          </>
        ) : (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        )}
        
        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <div className="text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="font-bold text-lg leading-tight">{item.title}</h3>
            <p className="text-xs text-blue-200 capitalize tracking-wide">{item.category}</p>
          </div>
        </div>
      </div>

      {/* Social Actions Section */}
      <div className="p-3 bg-white flex items-center justify-between border-t border-slate-50">
        <div className="flex gap-4">
          {/* Like Button */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 transition-colors ${
              isLiked ? "text-red-500" : "text-slate-500 hover:text-red-500"
            }`}
            aria-label="Like"
          >
            <ThumbsUp className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
            <span className="text-xs font-bold">{likeCount}</span>
          </button>

          {/* Comment Button */}
          <button
            onClick={handleComment}
            className="flex items-center gap-1.5 text-slate-500 hover:text-blue-500 transition-colors"
            aria-label="Comment"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-xs font-bold">{commentCount}</span>
          </button>
        </div>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 text-slate-500 hover:text-green-500 transition-colors"
          aria-label="Share"
        >
          <Share2 className="w-4 h-4" />
          <span className="text-xs font-bold">{shareCount}</span>
        </button>
      </div>
    </div>
  );
}
