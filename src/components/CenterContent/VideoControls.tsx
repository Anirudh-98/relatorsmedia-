"use client";

import React, { useState } from "react";
import {
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
  FaCog,
  FaExpand,
  FaCompress,
  FaYoutube,
} from "react-icons/fa";
import { MdPictureInPictureAlt } from "react-icons/md";

interface VideoControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
}

export const VideoControls: React.FC<VideoControlsProps> = ({
  isPlaying,
  onTogglePlay,
  onToggleFullscreen,
  isFullscreen,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  return (
    <div className="w-full bg-black/90 text-white px-2.5 py-1.5 flex items-center justify-between text-[11px] select-none border-t border-white/10 z-20">
      {/* Left controls */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onTogglePlay}
          className="hover:text-[#E21F2F] transition-colors cursor-pointer p-1"
          aria-label={isPlaying ? "Pause stream" : "Play stream"}
        >
          {isPlaying ? <FaPause className="text-[12px]" /> : <FaPlay className="text-[12px]" />}
        </button>

        <button
          type="button"
          onClick={() => setIsMuted(!isMuted)}
          className="hover:text-gray-300 transition-colors cursor-pointer p-1"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <FaVolumeMute className="text-[13px] text-red-400" />
          ) : (
            <FaVolumeUp className="text-[13px]" />
          )}
        </button>

        {/* LIVE Indicator & Title */}
        <div className="flex items-center gap-1.5 ml-1">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E21F2F]"></span>
          </span>
          <span className="bg-[#E21F2F] text-white text-[9px] font-black px-1 py-0.2 rounded-xs uppercase">
            LIVE
          </span>
          <span className="text-[11px] font-semibold text-gray-200 hidden sm:inline-block truncate max-w-[220px]">
            Realtors Media TV - Live Streaming
          </span>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          className="hover:text-gray-300 transition-colors cursor-pointer p-1"
          title="Settings"
          aria-label="Settings"
        >
          <FaCog className="text-[12px]" />
        </button>

        <button
          type="button"
          className="hover:text-gray-300 transition-colors cursor-pointer p-1 hidden sm:block"
          title="Picture-in-picture"
          aria-label="Picture-in-picture"
        >
          <MdPictureInPictureAlt className="text-[14px]" />
        </button>

        {/* YouTube Subscribe Button */}
        <button
          type="button"
          onClick={() => setIsSubscribed(!isSubscribed)}
          className={`flex items-center gap-1 px-2 py-0.5 rounded-[3px] text-[10px] font-extrabold transition-all cursor-pointer ${
            isSubscribed
              ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
              : "bg-[#E21F2F] text-white hover:bg-[#F11D32]"
          }`}
          aria-label="Subscribe to Realtors Media TV"
        >
          <FaYoutube className="text-[12px]" />
          <span>{isSubscribed ? "SUBSCRIBED" : "SUBSCRIBE"}</span>
        </button>

        <button
          type="button"
          onClick={onToggleFullscreen}
          className="hover:text-gray-300 transition-colors cursor-pointer p-1"
          title="Fullscreen"
          aria-label="Toggle fullscreen"
        >
          {isFullscreen ? (
            <FaCompress className="text-[12px]" />
          ) : (
            <FaExpand className="text-[12px]" />
          )}
        </button>
      </div>
    </div>
  );
};
