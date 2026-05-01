"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
    src: string;
    title?: string;
    poster?: string;
}

function formatTime(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    return `${m}:${String(s).padStart(2, "0")}`;
}

export default function VideoPlayer({ src, title, poster }: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const hideControlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [isBuffering, setIsBuffering] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [showSpeedMenu, setShowSpeedMenu] = useState(false);
    const [hoverTime, setHoverTime] = useState<number | null>(null);
    const [hoverX, setHoverX] = useState(0);
    const [isSeeking, setIsSeeking] = useState(false);
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);

    const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

    // Auto-hide controls
    const resetHideTimer = useCallback(() => {
        if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
        setShowControls(true);
        if (isPlaying) {
            hideControlsTimer.current = setTimeout(() => setShowControls(false), 3000);
        }
    }, [isPlaying]);

    useEffect(() => {
        resetHideTimer();
        return () => {
            if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
        };
    }, [isPlaying, resetHideTimer]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            const tag = (e.target as HTMLElement).tagName;
            if (tag === "INPUT" || tag === "TEXTAREA") return;

            switch (e.key.toLowerCase()) {
                case " ":
                case "k":
                    e.preventDefault();
                    togglePlay();
                    break;
                case "f":
                    e.preventDefault();
                    toggleFullscreen();
                    break;
                case "m":
                    toggleMute();
                    break;
                case "arrowleft":
                    e.preventDefault();
                    seek(-5);
                    break;
                case "arrowright":
                    e.preventDefault();
                    seek(5);
                    break;
                case "arrowup":
                    e.preventDefault();
                    changeVolume(0.1);
                    break;
                case "arrowdown":
                    e.preventDefault();
                    changeVolume(-0.1);
                    break;
            }
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    });

    // Fullscreen change listener
    useEffect(() => {
        const handler = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener("fullscreenchange", handler);
        return () => document.removeEventListener("fullscreenchange", handler);
    }, []);

    const togglePlay = () => {
        const v = videoRef.current;
        if (!v) return;
        if (v.paused) {
            v.play();
            setHasStarted(true);
        } else {
            v.pause();
        }
    };

    const seek = (seconds: number) => {
        const v = videoRef.current;
        if (!v) return;
        v.currentTime = Math.min(Math.max(v.currentTime + seconds, 0), v.duration);
    };

    const changeVolume = (delta: number) => {
        const v = videoRef.current;
        if (!v) return;
        const newVol = Math.min(Math.max(v.volume + delta, 0), 1);
        v.volume = newVol;
        setVolume(newVol);
        setIsMuted(newVol === 0);
    };

    const toggleMute = () => {
        const v = videoRef.current;
        if (!v) return;
        v.muted = !v.muted;
        setIsMuted(v.muted);
    };

    const toggleFullscreen = () => {
        const container = containerRef.current;
        if (!container) return;
        if (!document.fullscreenElement) {
            container.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const bar = progressRef.current;
        if (!bar || !videoRef.current) return;
        const rect = bar.getBoundingClientRect();
        const ratio = (e.clientX - rect.left) / rect.width;
        videoRef.current.currentTime = ratio * duration;
    };

    const handleProgressHover = (e: React.MouseEvent<HTMLDivElement>) => {
        const bar = progressRef.current;
        if (!bar) return;
        const rect = bar.getBoundingClientRect();
        const ratio = (e.clientX - rect.left) / rect.width;
        setHoverTime(ratio * duration);
        setHoverX(e.clientX - rect.left);
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = videoRef.current;
        if (!v) return;
        const val = parseFloat(e.target.value);
        v.volume = val;
        v.muted = val === 0;
        setVolume(val);
        setIsMuted(val === 0);
    };

    const handleSpeedChange = (speed: number) => {
        const v = videoRef.current;
        if (!v) return;
        v.playbackRate = speed;
        setPlaybackRate(speed);
        setShowSpeedMenu(false);
    };

    const progressPercent = duration ? (currentTime / duration) * 100 : 0;

    const VolumeIcon = () => {
        if (isMuted || volume === 0)
            return (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06A8.82 8.82 0 0 0 17.73 19l2 2L21 19.73 4.27 3zM12 4 9.91 6.09 12 8.18V4z" />
                </svg>
            );
        if (volume < 0.5)
            return (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M18.5 12A4.5 4.5 0 0 0 16 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z" />
                </svg>
            );
        return (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
        );
    };

    return (
        <div
            ref={containerRef}
            className={cn(
                "relative bg-black select-none group",
                "rounded-xl overflow-hidden",
                isFullscreen ? "rounded-none" : ""
            )}
            style={{ aspectRatio: "16/9", width: "100%" }}
            onMouseMove={resetHideTimer}
            onMouseLeave={() => isPlaying && setShowControls(false)}
            onClick={togglePlay}
        >
            {/* Video */}
            <video
                ref={videoRef}
                src={src}
                poster={poster}
                className="w-full h-full object-contain"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime ?? 0)}
                onLoadedMetadata={() => setDuration(videoRef.current?.duration ?? 0)}
                onWaiting={() => setIsBuffering(true)}
                onCanPlay={() => setIsBuffering(false)}
                onVolumeChange={() => {
                    setVolume(videoRef.current?.volume ?? 1);
                    setIsMuted(videoRef.current?.muted ?? false);
                }}
                preload="metadata"
            />

            {/* Big play button overlay (before video starts) */}
            {!hasStarted && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-transform group-hover:scale-110">
                        <svg viewBox="0 0 24 24" fill="white" className="w-9 h-9 ml-1">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                </div>
            )}

            {/* Buffering spinner */}
            {isBuffering && hasStarted && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                </div>
            )}

            {/* Controls overlay */}
            <div
                className={cn(
                    "absolute inset-0 flex flex-col justify-end transition-opacity duration-300 pointer-events-none",
                    showControls || !isPlaying ? "opacity-100" : "opacity-0"
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Gradient fade */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

                {/* Title */}
                {title && (
                    <div className="relative px-4 pt-4 pb-1">
                        <p className="text-white/80 text-sm font-medium truncate">{title}</p>
                    </div>
                )}

                {/* Bottom controls */}
                <div className="relative px-3 pb-3 pt-1 pointer-events-auto space-y-2">
                    {/* Progress bar */}
                    <div
                        ref={progressRef}
                        className="relative h-1 group/progress cursor-pointer"
                        onClick={handleProgressClick}
                        onMouseMove={handleProgressHover}
                        onMouseLeave={() => setHoverTime(null)}
                    >
                        {/* Track */}
                        <div className="absolute inset-0 bg-white/25 rounded-full group-hover/progress:scale-y-150 transition-transform origin-bottom" />
                        {/* Filled */}
                        <div
                            className="absolute left-0 top-0 h-full bg-white rounded-full group-hover/progress:scale-y-150 transition-transform origin-bottom"
                            style={{ width: `${progressPercent}%` }}
                        />
                        {/* Thumb */}
                        <div
                            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white opacity-0 group-hover/progress:opacity-100 transition-opacity shadow-md"
                            style={{ left: `calc(${progressPercent}% - 6px)` }}
                        />
                        {/* Hover tooltip */}
                        {hoverTime !== null && (
                            <div
                                className="absolute -top-8 -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded pointer-events-none"
                                style={{ left: hoverX }}
                            >
                                {formatTime(hoverTime)}
                            </div>
                        )}
                    </div>

                    {/* Buttons row */}
                    <div className="flex items-center gap-1">
                        {/* Play/Pause */}
                        <button
                            className="text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                            onClick={togglePlay}
                            aria-label={isPlaying ? "Pause" : "Lecture"}
                        >
                            {isPlaying ? (
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                                </svg>
                            ) : (
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            )}
                        </button>

                        {/* Skip -5s */}
                        <button
                            className="text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                            onClick={() => seek(-5)}
                            aria-label="Reculer 5s"
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8zm-1.1 11H10v-3.26L9 13.12V12.2l1.8-.65H11V16zm4.28-1.05c0 .32-.04.6-.12.82s-.19.42-.34.57-.33.26-.55.33-.46.1-.72.1-.51-.03-.72-.1-.41-.18-.57-.33-.28-.34-.37-.57-.13-.5-.13-.82v-.74c0-.32.04-.6.12-.82s.19-.42.34-.57.33-.26.55-.33.46-.1.72-.1.51.03.72.1.41.18.57.33.28.34.37.57.13.5.13.82v.74zm-.92-.86c0-.19-.01-.35-.04-.48s-.07-.23-.12-.31-.12-.14-.2-.17-.17-.05-.27-.05-.2.02-.28.05-.15.09-.2.17-.1.18-.13.31-.04.29-.04.48v.97c0 .19.01.35.04.48s.07.24.12.32.12.14.2.17.17.05.28.05.2-.02.27-.05.15-.09.2-.17.09-.19.12-.32.04-.29.04-.48v-.97z" />
                            </svg>
                        </button>

                        {/* Skip +5s */}
                        <button
                            className="text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                            onClick={() => seek(5)}
                            aria-label="Avancer 5s"
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                <path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8zm-1.1 11H10v-3.26L9 13.12V12.2l1.8-.65H11V16zm4.28-1.05c0 .32-.04.6-.12.82s-.19.42-.34.57-.33.26-.55.33-.46.1-.72.1-.51-.03-.72-.1-.41-.18-.57-.33-.28-.34-.37-.57-.13-.5-.13-.82v-.74c0-.32.04-.6.12-.82s.19-.42.34-.57.33-.26.55-.33.46-.1.72-.1.51.03.72.1.41.18.57.33.28.34.37.57.13.5.13.82v.74zm-.92-.86c0-.19-.01-.35-.04-.48s-.07-.23-.12-.31-.12-.14-.2-.17-.17-.05-.27-.05-.2.02-.28.05-.15.09-.2.17-.1.18-.13.31-.04.29-.04.48v.97c0 .19.01.35.04.48s.07.24.12.32.12.14.2.17.17.05.28.05.2-.02.27-.05.15-.09.2-.17.09-.19.12-.32.04-.29.04-.48v-.97z" />
                            </svg>
                        </button>

                        {/* Volume */}
                        <div
                            className="relative flex items-center"
                            onMouseEnter={() => setShowVolumeSlider(true)}
                            onMouseLeave={() => setShowVolumeSlider(false)}
                        >
                            <button
                                className="text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                                onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                                aria-label="Volume"
                            >
                                <VolumeIcon />
                            </button>
                            <div
                                className={cn(
                                    "flex items-center overflow-hidden transition-all duration-200",
                                    showVolumeSlider ? "w-24 opacity-100" : "w-0 opacity-0"
                                )}
                            >
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.05"
                                    value={isMuted ? 0 : volume}
                                    onChange={handleVolumeChange}
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-20 accent-white h-1 cursor-pointer"
                                    style={{ accentColor: "white" }}
                                />
                            </div>
                        </div>

                        {/* Time */}
                        <span className="text-white/80 text-xs tabular-nums ml-1">
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </span>

                        {/* Spacer */}
                        <div className="flex-1" />

                        {/* Speed */}
                        <div className="relative">
                            <button
                                className="text-white text-xs font-semibold px-2 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
                                onClick={(e) => { e.stopPropagation(); setShowSpeedMenu((v) => !v); }}
                            >
                                {playbackRate === 1 ? "1×" : `${playbackRate}×`}
                            </button>
                            {showSpeedMenu && (
                                <div className="absolute bottom-10 right-0 bg-black/95 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-2xl min-w-[90px]">
                                    {SPEEDS.map((s) => (
                                        <button
                                            key={s}
                                            className={cn(
                                                "w-full text-left px-4 py-2 text-sm transition-colors",
                                                playbackRate === s
                                                    ? "bg-white text-black font-semibold"
                                                    : "text-white hover:bg-white/10"
                                            )}
                                            onClick={(e) => { e.stopPropagation(); handleSpeedChange(s); }}
                                        >
                                            {s === 1 ? "Normal" : `${s}×`}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Fullscreen */}
                        <button
                            className="text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                            onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
                            aria-label={isFullscreen ? "Quitter le plein écran" : "Plein écran (F)"}
                        >
                            {isFullscreen ? (
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
                                </svg>
                            ) : (
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <span className="text-white/40 text-xs bg-black/40 px-2 py-1 rounded-md font-mono">F = plein écran</span>
            </div>
        </div>
    );
}