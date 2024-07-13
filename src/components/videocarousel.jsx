import { useEffect, useRef, useState } from "react";
import { hightlightsSlides } from "../constants";
import gsap from "gsap";
import { pauseImg, playImg, replayImg } from "../utils";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const VideoCarousel = () => {
  const videoRef = useRef([]);
  const videoSpanRef = useRef([]);
  const videoDivRef = useRef([]);

  const [video, setVideo] = useState({
    isEnd: false,
    startPlay: false,
    videoId: 0,
    isLastVideo: false,
    isPlaying: false,
  });

  const [loadedData, setloadedData] = useState([]);

  const { isEnd, isLastVideo, startPlay, videoId, isPlaying } = video;

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.to("#slider", {
      transform: `translateX(${-100 * videoId}%)`,
      duration: 2,
      ease: "power2.inOut", 
    });

    gsap.to("#video", {
        scrollTrigger: {
          trigger: "#video",
          toggleActions: "play none none none",
          start: "top 80%", 
          end: "bottom 20%", 
          onEnter: () => {
            setVideo((prevState) => ({
              ...prevState,
              startPlay: true,
              isPlaying: true,
            }));
          },
          onLeaveBack: () => {
            setVideo((prevState) => ({
              ...prevState,
              isPlaying: false,
            }));
          },
        },
      });
    }, [isEnd, videoId]);

  
  useEffect(() => {
    let currentProgress = 0;
    let span = videoSpanRef.current;
    if (span[videoId]) {
      let animation = gsap.to(span[videoId], {
        onUpdate: () => {
          const progress = Math.ceil(animation.progress() * 100);

          if (progress != currentProgress) {
            currentProgress = progress;
          
          gsap.to(videoDivRef.current[videoId], {
            width:
              window.innerWidth < 760
                ? "10vw"
                : window.innerWidth < 1200
                ? "10vw"
                : "4vw",
          });

          gsap.to(span[videoId], {
            width: `${currentProgress}%`,
            backgroundColor: "white",
          });
         }
        },
        onComplete: () => {
          if (isPlaying) {
            gsap.to(videoDivRef.current[videoId], {
              width: "12px",
            });
            gsap.to(span[videoId], {
              backgroundColor: "#afafaf",
            });
          }
        },
      });

      if (videoId == 0) {
        animation.restart();
      }
      const animationUpdate = () => {
        animation.progress(
          videoRef.current[videoId].currentTime / hightlightsSlides[videoId].videoDuration
        );
      };
      if (isPlaying) {
        gsap.ticker.add(animationUpdate);
      } else {
        gsap.ticker.remove(animationUpdate);
      }
    }

  }, [videoId, startPlay]);

  useEffect(() => {
    if (loadedData.length > 3) {
      if (!isPlaying) {
        videoRef.current[videoId].pause();
      } else {
        startPlay && videoRef.current[videoId].play();
      }
    }
  }, [startPlay, videoId, isPlaying, loadedData]);

  const handleLoadedMetaData = (index, e) => {
    setloadedData((prev) => [...prev, e]);
  };

  const handleProcess = (type, index) => {
    switch (type) {
      case "video-end":
        setVideo((prevVideo) => ({
          ...prevVideo,
          isEnd: true,
          videoId: index + 1,
        }));
        break;
      case "video-last":
        setVideo((prevVideo) => ({
          ...prevVideo,
          isLastVideo: true,
        }));
        break;
      case "video-reset":
        setVideo((prevVideo) => ({
          ...prevVideo,
          isLastVideo: false,
          videoId: 0,
        }));
        break;
      case "pause": 
      setVideo((prevVideo)=>({
        ...prevVideo,
        isPlaying: !prevVideo.isPlaying,
      }));
      break;  
      case "play":
        setVideo((prevVideo) => ({
          ...prevVideo,
          isPlaying: !prevVideo.isPlaying,
        }));
        break;
      default:
        return video;
    }
  };

  
  return (
    <>
      <div className="flex items-center">
        {hightlightsSlides.map((list, index) => (
          <div key={list.id} id="slider" className="sm:pr-20 pr-10">
            <div className="video-carousel_container">
              <div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-black">
                <video
                className={`${list.id===2 && "translate-x-44"} pointer-events-none`}
                  id="video"
                  playsInline={true}
                  preload="auto"
                  muted
                  ref={(element) => (videoRef.current[index] = element)}
                  onEnded={() => {
                    index !== 3 ? handleProcess("video-end", index) : handleProcess("video-last")
                  }}
                  onPlay={() =>
                    setVideo((prevVideo) => ({
                      ...prevVideo,
                      isPlaying: true,
                    }))
                  }
                  onLoadedMetadata={(e) => handleLoadedMetaData(index, e)}
                >
                  <source src={list.video} type="video/mp4" />
                </video>
              </div>

              <div className="absolute top-12 left-[5%] z-10">
                {list.textLists.map((text) => (
                  <p key={text} className="md:text-2xl text-xl font-medium">
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>


      <div className="relative flex-center mt-10">
        <div className="flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full">
          {videoRef.current.map((_, index) => (
            <span
              key={index}
              className="mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer"
              ref={(element) => (videoDivRef.current[index] = element)}
            >
              <span
                className="absolute h-full w-full rounded-full"
                ref={(element) => (videoSpanRef.current[index] = element)}
              ></span>
            </span>
          ))}
        </div>

        <button className="control-btn"  onClick={
                isLastVideo
                  ? () => handleProcess("video-reset")
                  : !isPlaying
                  ? () => handleProcess("play")
                  : () => handleProcess("pause")
              }>
          <img
           src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
           alt={isLastVideo ? "replay" : !isPlaying ? "play" : "pause"}
           
          />
        </button>
      </div>
    </>
  );
};

export default VideoCarousel;
