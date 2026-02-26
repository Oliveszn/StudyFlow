"use client";

import { useRef, useEffect, useState, useCallback } from "react";

import { CheckCircle } from "lucide-react";
import {
  useLessonVideoUrl,
  useMarkLessonComplete,
  useUpdateVideoProgress,
} from "@/hooks/endpoints/student/useProgress";
import LoadingSpinner from "@/components/common/LoadingSpinner";

interface Props {
  lessonId: string;
  onComplete?: () => void;
}

const COMPLETION_THRESHOLD = 0.9; // 90% watched triggers auto-complete
const SAVE_INTERVAL_SECONDS = 10; // save progress every 10s

export default function LessonVideoPlayer({ lessonId, onComplete }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastSavedTimeRef = useRef<number>(0);
  const hasAutoCompletedRef = useRef<boolean>(false);

  const [showBanner, setShowBanner] = useState(false);

  const { data: videoData, isLoading } = useLessonVideoUrl(lessonId);
  const { mutate: updateProgress } = useUpdateVideoProgress();
  const { mutate: markComplete } = useMarkLessonComplete();

  // Reset state when lesson changes
  useEffect(() => {
    hasAutoCompletedRef.current = false;
    lastSavedTimeRef.current = 0;
    setShowBanner(false);
  }, [lessonId]);

  const triggerComplete = useCallback(() => {
    if (hasAutoCompletedRef.current) return;
    hasAutoCompletedRef.current = true;

    markComplete(lessonId, {
      onSuccess: () => {
        setShowBanner(true);
        setTimeout(() => {
          setShowBanner(false);
          onComplete?.();
        }, 2000);
      },
    });
  }, [lessonId, markComplete, onComplete]);

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const currentTime = Math.floor(video.currentTime);

    ///// periodic progress saves
    if (currentTime - lastSavedTimeRef.current >= SAVE_INTERVAL_SECONDS) {
      lastSavedTimeRef.current = currentTime;
      updateProgress({ lessonId, watchedDuration: currentTime });
    }

    /////auto comeplete at 90% which is set threshold
    if (
      !hasAutoCompletedRef.current &&
      currentTime / video.duration >= COMPLETION_THRESHOLD
    ) {
      triggerComplete();
    }
  }, [lessonId, updateProgress, triggerComplete]);

  const handleEnded = useCallback(() => {
    triggerComplete();
  }, [triggerComplete]);

  if (isLoading) {
    return (
      <div className="flex aspect-video w-full items-center justify-center bg-black">
        <LoadingSpinner />
      </div>
    );
  }

  if (!videoData?.videoUrl) {
    return (
      <div className="flex aspect-video w-full items-center justify-center bg-black text-sm text-white/30">
        Video unavailable
      </div>
    );
  }

  return (
    <div className="relative w-full bg-black">
      <video
        ref={videoRef}
        key={lessonId}
        src={videoData.videoUrl}
        controls
        controlsList="nodownload"
        className="aspect-video w-full"
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      {showBanner && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-3 rounded-2xl bg-emerald-500/90 px-6 py-3 text-sm font-medium text-white shadow-2xl backdrop-blur-sm">
            <CheckCircle className="h-5 w-5" />
            Lesson completed!
          </div>
        </div>
      )}
    </div>
  );
}
