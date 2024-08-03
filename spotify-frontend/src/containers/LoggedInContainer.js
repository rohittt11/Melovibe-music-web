import {
  useContext,
  useState,
  useLayoutEffect,
  useRef,
  useEffect,
} from "react";
import { Howl, Howler } from "howler";
import { Icon } from "@iconify/react";
import MeloVibe from "../assets/images/MeloVibe.png";
import IconText from "../components/shared/IconText";
import songContext from "../contexts/songContext";
import CreatePlaylistModal from "../modals/CreatePlaylistModal";
import AddToPlaylistModal from "../modals/AddToPlaylistModal";
import { makeAuthenticatedPOSTRequest } from "../utils/serverHelpers";
import SonglistConext from "../contexts/songListConext";
import Avatar from "./avatar";

const LoggedInContainer = ({ children, curActiveScreen }) => {
  const [createPlaylistModalOpen, setCreatePlaylistModalOpen] = useState(false);
  const [addToPlaylistModalOpen, setAddToPlaylistModalOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const { songList, setSongList } = useContext(SonglistConext);
  const [sound, setSound] = useState(null);
  const [count, setCount] = useState(0);
  const [songPlayed, setSongPlayed] = useState(0);
  const [volumnLevel, setVolumnLevel] = useState(1);
  const handleProfileClick = () => {
    // Navigate to the profile window
    window.location.href = "/profile";
  };
  const {
    currentSong,
    setCurrentSong,
    soundPlayed,
    setSoundPlayed,
    isPaused,
    setIsPaused,
  } = useContext(songContext);

  const firstUpdate = useRef(true);

  useLayoutEffect(() => {
    // the following if statement will prevent the useEffect from running on the first render.
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    if (!currentSong) {
      return;
    }
    changeSong(currentSong.track);
  }, [currentSong && currentSong.track]);

  const addSongToPlaylist = async (playlistId) => {
    const songId = currentSong._id;

    const payload = { playlistId, songId };
    const response = await makeAuthenticatedPOSTRequest(
      "/playlist/add/song",
      payload
    );
    if (response._id) {
      setAddToPlaylistModalOpen(false);
    }
  };
  let timer;
  const playSound = () => {
    if (!soundPlayed) {
      return;
    }
    soundPlayed.play();
  };

  const changeSong = (songSrc) => {
    if (soundPlayed) {
      soundPlayed.stop();
    }
    let sound = new Howl({
      src: [songSrc],
      html5: true,

      onend: () => {
        let selectedSong = songList.findIndex(
          (song) => song.track == currentSong.track
        );

        if (selectedSong + 1 == songList.length) {
          setCurrentSong(songList[0]);
        } else {
          setCurrentSong(songList[selectedSong + 1]);
        }
      },

      onseek: (jp) => {
        console.log("data:", jp);
      },
      onplay: function () {
        requestAnimationFrame(updateProgress);
        setCount((pre) => pre + 1);

        setSongPlayed(0);
        timer?.cancel();
        timer = setTimeout(() => {
          let time = soundPlayed.pos();
          console.log("time:", time);
          setSongPlayed(time);
        }, 1000);
      },
    });
    setSound(sound);
    setSoundPlayed(sound);
    sound.play();
    setVolumnLevel(sound.volume());

    setIsPaused(false);
  };

  const pauseSound = () => {
    soundPlayed.pause();
  };

  const togglePlayPause = () => {
    if (isPaused) {
      playSound();
      setIsPaused(false);
    } else {
      pauseSound();
      setIsPaused(true);
    }
  };
  const updateProgress = () => {
    if (soundPlayed && !soundPlayed.playing()) {
      // If the sound is not playing, don't update progress
      return;
    }
    const progressPercentage =
      (soundPlayed.seek() / soundPlayed.duration()) * 100;
    setProgress(progressPercentage);
    requestAnimationFrame(updateProgress);
  };

  return (
    <div className="h-full w-full bg-app-black">
      {createPlaylistModalOpen && (
        <CreatePlaylistModal
          closeModal={() => {
            setCreatePlaylistModalOpen(false);
          }}
        />
      )}
      {addToPlaylistModalOpen && (
        <AddToPlaylistModal
          closeModal={() => {
            setAddToPlaylistModalOpen(false);
          }}
          addSongToPlaylist={addSongToPlaylist}
        />
      )}
      <div
        className={`${currentSong ? "h-full pb-32 " : "h-full"} w-full flex`}
      >
        {/* This first div will be the left panel */}
        <div className="h-full w-1/5 bg-black flex flex-col justify-between pb-10">
          <div>
            {/* This div is for logo */}
            <div className="logoDiv p-1">
              <img src={MeloVibe} alt="MeloVibe logo" width={240} />
            </div>
            <div className="py-5">
              <IconText
                iconName={"material-symbols:home"}
                displayText={"Home"}
                targetLink={"/home"}
                active={curActiveScreen === "home"}
              />
              <IconText
                iconName={"material-symbols:search-rounded"}
                displayText={"Search"}
                active={curActiveScreen === "search"}
                targetLink={"/search"}
              />
              <IconText
                iconName={"icomoon-free:books"}
                displayText={"Library"}
                active={curActiveScreen === "library"}
                targetLink={"/library"}
              />
              <IconText
                iconName={"material-symbols:library-music-sharp"}
                displayText={"Songs"}
                targetLink="/myMusic"
                active={curActiveScreen === "myMusic"}
              />
            </div>

            <div className="pt-5">
              <IconText
                iconName={"material-symbols:add-box"}
                displayText={"Create Playlist"}
                onClick={() => {
                  setCreatePlaylistModalOpen(true);
                }}
              />
              <IconText
                iconName={"ep:upload-filled"}
                displayText={"Upload Song"}
                targetLink="/uploadsong"
                active={curActiveScreen === "uploadsong"}
              />
            </div>
          </div>
        </div>
        {/* This second div will be the right part(main content) */}
        <div className="h-full w-4/5 bg-app-black overflow-auto">
          <div className="navbar w-full h-1/10 bg-black bg-opacity-30 flex items-center justify-end">
            <div className="w-1/4 flex h-full">
              <div className="w-4/5 flex justify-around items-center">
                <IconText
                  displayText={<span className="text-lg">Support</span>}
                  targetLink="/support"
                  active={curActiveScreen === "Support"}
                />
                <div className="h-2/4 border-r border-white"></div>
              </div>

              <div className="w-1/3 flex justify-around h-full items-center">
                {/* <IconText
                  displayText={<span className="text-base">Logout</span>}
                  targetLink="/logout"
                  active={curActiveScreen === "Logout"}
                /> */}

                <div>
                  <a href="/profile" onClick={handleProfileClick}>
                    <Avatar />
                  </a>
                </div>
                <div></div>
              </div>
            </div>
          </div>
          <div className="content p-8 pt-0 overflow-auto">{children}</div>
        </div>
      </div>
      {/* This div is the current playing song */}
      {currentSong && (
        <div className="w-full bg-black flex flex-col gap-2 absolute bottom-0 left-0 right-0 ">
          <div>
            <SongDuration />
          </div>
          <div className="w-full  bg-black bg-opacity-30 text-white flex items-center px-4 pb-5">
            <div className="w-1/4 flex items-center">
              <img
                src={currentSong.thumbnail}
                alt="currentSongThumbail"
                className="h-14 w-14 rounded"
              />
              <div className="pl-4">
                <div className="text-sm hover:underline cursor-pointer">
                  {currentSong.name}
                </div>
                <div className="text-xs text-gray-500 hover:underline cursor-pointer">
                  {currentSong.artist.firstname +
                    " " +
                    currentSong.artist.lastname}
                </div>

                <div>
                  {/* {soundPlayed.duration(soundPlayed.).toString()} */}
                </div>
              </div>
            </div>
            <div className="w-1/2 flex justify-center h-full flex-col items-center">
              <div className="flex w-1/4 justify-between items-center">
                {/* controls for the playing song go here */}
                <Icon
                  icon="mdi:skip-previous-outline"
                  fontSize={40}
                  className="cursor-pointer text-gray-500 hover:text-white"
                  onClick={() => {
                    console.log({ songList });
                    console.log({ currentSong });
                    let selectedSong = songList.findIndex(
                      (song) => song.track == currentSong.track
                    );

                    if (selectedSong == 0) {
                      setCurrentSong(songList[songList.length - 1]);
                    } else {
                      setCurrentSong(songList[selectedSong - 1]);
                    }

                    console.log("selectedSong:", selectedSong);
                  }}
                />
                <Icon
                  icon={
                    isPaused
                      ? "ic:baseline-play-circle"
                      : "ic:baseline-pause-circle"
                  }
                  fontSize={55}
                  className="cursor-pointer text-gray-500 hover:text-white"
                  onClick={togglePlayPause}
                />
                <Icon
                  icon="mdi:skip-next-outline"
                  fontSize={40}
                  className="cursor-pointer text-gray-500 hover:text-white"
                  onClick={() => {
                    console.log({ songList });
                    console.log({ currentSong });
                    console.log("duration dsbfjsdgj", soundPlayed.duration());
                    let selectedSong = songList.findIndex(
                      (song) => song.track == currentSong.track
                    );

                    if (selectedSong + 1 == songList.length) {
                      setCurrentSong(songList[0]);
                    } else {
                      setCurrentSong(songList[selectedSong + 1]);
                    }

                    console.log("selectedSong:", selectedSong);
                  }}
                />
              </div>
            </div>
            <div className="w-1/4 flex justify-end pr-4 space-x-4 items-center">
              <div className="px-5 flex gap-7 ">
                <Icon
                  icon="icons8-minus"
                  fontSize={30}
                  className="cursor-pointer text-gray-500 hover:text-white"
                  onClick={() => {
                    if (soundPlayed == null) {
                      return;
                    }
                    const currVol = soundPlayed.volume();
                    if (currVol <= 0.1) {
                      soundPlayed.volume(0);
                      setVolumnLevel(0);
                      return;
                    }

                    soundPlayed.volume(currVol - 0.1);
                    setVolumnLevel(currVol - 0.1);
                  }}
                />
                {volumnLevel.toFixed(1)}
                <Icon
                  icon="icons8-plus"
                  fontSize={30}
                  className="cursor-pointer text-gray-500 hover:text-white"
                  onClick={() => {
                    if (soundPlayed == null) {
                      return;
                    }
                    const currVol = soundPlayed.volume();
                    if (currVol >= 0.9) {
                      soundPlayed.volume(1);
                      setVolumnLevel(1);
                      return;
                    }
                    soundPlayed.volume(currVol + 0.1);
                    setVolumnLevel(currVol + 0.1);
                  }}
                />
              </div>
              <Icon
                icon="ic:round-playlist-add"
                fontSize={35}
                className="cursor-pointer text-gray-500 hover:text-white"
                onClick={() => {
                  setAddToPlaylistModalOpen(true);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoggedInContainer;

const SongDuration = () => {
  const progressRef = useRef();
  const [count, setCount] = useState(0);
  useEffect(() => {
    let timer = setInterval(() => {
      setCount((pre) => pre + 1);
    }, 500);
    return () => {
      clearInterval(timer);
    };
  }, []);

  const { soundPlayed } = useContext(songContext);
  if (soundPlayed == undefined || soundPlayed == null) {
    return <></>;
  }

  let songDuration = soundPlayed.duration();
  let currTimer = (soundPlayed.seek() / songDuration) * 100 + "%";
  const minutes = Math.floor(soundPlayed.duration() / 60);
  const remainingScands = Math.floor(soundPlayed.duration() % 60);
  const currMinutes = Math.floor(soundPlayed.seek() / 60);
  const currRemainingScands = Math.floor(soundPlayed.seek() % 60);

  return (
    <div className="flex flex-col gap-3">
      <div
        className="cursor-pointer bg-gray-300 text-white h-2 relative   mx-8 rounded-2xl overflow-hidden z-10 "
        ref={progressRef}
        onClick={(e) => {
          const totalWidth = window.innerWidth;
          console.log("totalWidth:", totalWidth);
          console.log(" e.clientX:", e.clientX);
          const clickX = e.clientX / totalWidth;
          console.log("clickX:", clickX);

          let newPositionSeconds = clickX * soundPlayed.duration();
          console.log("newPositionSeconds:", newPositionSeconds);
          console.log("sound duration:", soundPlayed.duration());
          soundPlayed.seek(newPositionSeconds);
        }}
      >
        <div
          className="cursor-pointer bg-purple-500  h-2 "
          style={{ width: currTimer }}
        ></div>
      </div>
      <div className="flex flex-row justify-between text-white text-sm mx-10">
        <div>
          {currMinutes + " : "}
          {currRemainingScands.toString().padStart(2, "0")}
        </div>
        <div>
          {minutes == 0 ? "" : minutes + " : "}
          {remainingScands == 0 ? "" : remainingScands}
        </div>
      </div>
    </div>
  );
};

export { SongDuration };
