import { useState } from "react";
import { ThumbsUp, Share2, MessageCircle } from "lucide-react";

interface VideoCardProps {
  id: string;
  title: string;
  description?: string;
  reelUrl: string;
  likes?: number;
  shares?: number;
  comments?: number;
}

export default function VideoCard({
  id,
  title,
  description,
  reelUrl,
  likes = 0,
  shares = 0,
  comments = 0,
}: VideoCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [shareCount, setShareCount] = useState(shares);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const handleShare = () => {
    setShareCount(shareCount + 1);
    if (navigator.share) {
      navigator.share({
        title: title,
        text: description || "Check out this amazing video from KretivMay!",
        url: reelUrl,
      }).catch(() => {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(reelUrl);
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(reelUrl);
      alert("Link copied to clipboard!");
    }
  };

  const handleComment = () => {
    // Open Facebook Reel in new tab for commenting
    window.open(reelUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-white">
      {/* Video Container */}
      <div className="relative w-full aspect-[9/16] bg-black overflow-hidden">
        {/* Facebook Reel Embed */}
        <iframe
          src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(reelUrl)}&show_text=false&appId=1234567890`}
          width="100%"
          height="100%"
          style={{
            border: "none",
            overflow: "hidden",
            borderRadius: "0.75rem",
          }}
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          allowFullScreen={true}
          className="w-full h-full"
        />
      </div>

      {/* Content Section */}
      <div className="p-4 bg-gradient-to-b from-white to-slate-50">
        <h3 className="font-bold text-lg text-slate-900 mb-1 line-clamp-2">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-slate-600 mb-4 line-clamp-2">
            {description}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-3 border-t border-slate-200">
          {/* Like Button */}
          <button
            onClick={handleLike}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-semibold transition-all duration-200 group/btn ${
              isLiked
                ? "bg-red-50 text-red-600 hover:bg-red-100"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
            aria-label="Like video"
          >
            <ThumbsUp
              className={`w-4 h-4 transition-transform group-hover/btn:scale-110 ${
                isLiked ? "fill-current" : ""
              }`}
            />
            <span className="text-xs">{likeCount}</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-semibold bg-slate-100 text-slate-700 hover:bg-blue-100 hover:text-blue-600 transition-all duration-200 group/btn"
            aria-label="Share video"
          >
            <Share2 className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
            <span className="text-xs">{shareCount}</span>
          </button>

          {/* Comment Button */}
          <button
            onClick={handleComment}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-semibold bg-slate-100 text-slate-700 hover:bg-green-100 hover:text-green-600 transition-all duration-200 group/btn"
            aria-label="Comment on video"
          >
            <MessageCircle className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
            <span className="text-xs">{comments}</span>
          </button>
        </div>
      </div>

      {/* Hover Overlay Badge */}
      <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        Video
      </div>
    </div>
  );
}
