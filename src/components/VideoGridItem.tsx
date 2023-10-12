import { useEffect, useRef, useState } from "react";
import { formatDuration, formatTimeAgo } from "../utils/formatDuration";

type VideoGridItemProps = {
  id: string;
  title: string;
  channel: {
    id: string;
    name: string;
    profileUrl: string;
  };
  views: number;
  postedAt: Date;
  duration: number;
  thumbnailUrl: string;
  videoUrl: string;
};
const VIEW_FOMATTER = new Intl.NumberFormat(undefined, { notation: "compact" });
export default function VideoGridItem({
  id,
  title,
  channel,
  videoUrl,
  views,
  postedAt,
  duration,
  thumbnailUrl,
}: VideoGridItemProps) {
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current === null) return;
    if (isVideoPlaying) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  }, [isVideoPlaying]);
  return (
    <div
      className="flex flex-col gap-2"
      onMouseEnter={() => setIsVideoPlaying(true)}
      onMouseLeave={() => setIsVideoPlaying(false)}
    >
      <a href={`/watch?v=${id}`} className="relative aspect-video">
        <img
          src={thumbnailUrl}
          alt="img-thumbnail"
          className={`block w-full h-full object-cover transition-all duration-200 ${
            isVideoPlaying ? "rounded-none" : "rounded-xl"
          }`}
        />
        <div className=" absolute bottom-1 right-1 bg-secondary-dark text-secondary text-sm px-0.5 rounded">
          {formatDuration(duration)}
        </div>
        <video
          ref={videoRef}
          src={videoUrl}
          playsInline
          muted
          className={`absolute inset-0 h-full w-full block object-cover transition-opacity duration-200 ${
            isVideoPlaying ? "opacity-100 delay-200" : "opacity-0"
          } `}
        />
      </a>
      <div className="flex gap-2">
        <a href={`/@${channel.id}`} className="flex-shrink-0">
          <img
            src={channel.profileUrl}
            alt={channel.name}
            className="rounded-full w-12 h-12"
          />
        </a>
        <div className="flex flex-col">
          <a href={`/watch/v${id}`} className="font-bold">
            {title}
          </a>
          <a href={`/@${channel.id}`} className="text-sm text-secondary-text">
            {channel.name}
          </a>
          <div className="text-sm text-secondary">
            {VIEW_FOMATTER.format(views)} views 👉🏼 {formatTimeAgo(postedAt)}
          </div>
        </div>
      </div>
    </div>
  );
}
