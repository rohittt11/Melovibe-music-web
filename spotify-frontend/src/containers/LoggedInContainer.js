import {
  useContext,
  useState,
  useLayoutEffect,
  useRef,
  useEffect,
} from "react";
import { Howl } from "howler";
import { Icon } from "@iconify/react";
import MeloVibe from "../assets/images/MeloVibe.png";
import IconText from "../components/shared/IconText";
import songContext from "../contexts/songContext";
import CreatePlaylistModal from "../modals/CreatePlaylistModal";
import AddToPlaylistModal from "../modals/AddToPlaylistModal";
import { makeAuthenticatedPOSTRequest } from "../utils/serverHelpers";
import SonglistConext from "../contexts/songListConext";
import Avatar from "./avatar";
import { Link, useNavigate } from "react-router-dom";

const LoggedInContainer = ({ children, curActiveScreen }) => {
  const [createPlaylistModalOpen, setCreatePlaylistModalOpen] = useState(false);
  const [addToPlaylistModalOpen, setAddToPlaylistModalOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const { songList, setSongList } = useContext(SonglistConext);
  const [sound, setSound] = useState(null);
  const [count, setCount] = useState(0);
  const [songPlayed, setSongPlayed] = useState(0);
  const [volumnLevel, setVolumnLevel] = useState(1);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleProfileClick = () => {
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
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    if (!currentSong) return;
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
    if (!soundPlayed) return;
    soundPlayed.play();
  };

  const changeSong = (songSrc) => {
    if (soundPlayed) soundPlayed.stop();
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
      onseek: (jp) => console.log("data:", jp),
      onplay: function () {
        requestAnimationFrame(updateProgress);
        setCount((pre) => pre + 1);
        setSongPlayed(0);
        timer?.cancel();
        timer = setTimeout(() => {
          setSongPlayed(soundPlayed.pos());
        }, 1000);
      },
    });
    setSound(sound);
    setSoundPlayed(sound);
    sound.play();
    setVolumnLevel(sound.volume());
    setIsPaused(false);
  };

  const pauseSound = () => soundPlayed.pause();

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
    if (soundPlayed && !soundPlayed.playing()) return;
    const progressPercentage =
      (soundPlayed.seek() / soundPlayed.duration()) * 100;
    setProgress(progressPercentage);
    requestAnimationFrame(updateProgress);
  };

  const sidebarWidth = sidebarCollapsed ? "md:pl-20" : "md:pl-64";

  return (
    <>
      {createPlaylistModalOpen && (
        <CreatePlaylistModal
          closeModal={() => setCreatePlaylistModalOpen(false)}
        />
      )}
      {addToPlaylistModalOpen && (
        <AddToPlaylistModal
          closeModal={() => setAddToPlaylistModalOpen(false)}
          addSongToPlaylist={addSongToPlaylist}
        />
      )}

      <div className="h-screen w-full bg-app-black flex overflow-hidden font-sans relative">
        {/* SIDEBAR */}
        <aside
          className={`
          hidden md:flex flex-col justify-between shrink-0
          bg-black h-full
          transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? "w-20" : "w-64"}
        `}
        >
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <div className="px-4 py-2 flex items-center justify-center">
              <img
                src={MeloVibe}
                alt="Logo"
                className={`object-contain transition-all ${
                  sidebarCollapsed ? "w-10 h-10" : "w-56 h-24"
                }`}
              />
            </div>

            <div className="py-2 space-y-1">
              <IconText
                iconName="material-symbols:home"
                displayText={sidebarCollapsed ? "" : "Home"}
                targetLink="/home"
                active={curActiveScreen === "home"}
                compact={sidebarCollapsed}
              />
              <IconText
                iconName="material-symbols:search-rounded"
                displayText={sidebarCollapsed ? "" : "Search"}
                targetLink="/search"
                active={curActiveScreen === "search"}
                compact={sidebarCollapsed}
              />
              <IconText
                iconName="icomoon-free:books"
                displayText={sidebarCollapsed ? "" : "Library"}
                targetLink="/library"
                active={curActiveScreen === "library"}
                compact={sidebarCollapsed}
              />
              <IconText
                iconName="material-symbols:library-music-sharp"
                displayText={sidebarCollapsed ? "" : "Songs"}
                targetLink="/myMusic"
                active={curActiveScreen === "myMusic"}
                compact={sidebarCollapsed}
              />
            </div>

            <div className="py-2 space-y-1">
              <IconText
                iconName="material-symbols:add-box"
                displayText={sidebarCollapsed ? "" : "Create Playlist"}
                onClick={() => setCreatePlaylistModalOpen(true)}
                compact={sidebarCollapsed}
              />
              <IconText
                iconName="ep:upload-filled"
                displayText={sidebarCollapsed ? "" : "Upload Song"}
                targetLink="/uploadsong"
                active={curActiveScreen === "uploadsong"}
                compact={sidebarCollapsed}
              />
              <IconText
                iconName="mdi:file-document"
                displayText={sidebarCollapsed ? "" : "My Contracts"}
                targetLink="/contracts"
                active={curActiveScreen === "contracts"}
                compact={sidebarCollapsed}
              />
            </div>
          </div>

          <div className="p-3 border-t border-gray-800">
            <button
              onClick={() => setSidebarCollapsed((v) => !v)}
              className="w-full flex items-center justify-center gap-3 p-3 rounded-lg bg-gray-900 hover:bg-gray-700 text-white transition-colors"
            >
              <Icon
                icon={sidebarCollapsed ? "mdi:menu" : "mdi:menu-open"}
                fontSize={24}
              />
              {!sidebarCollapsed && (
                <span className="font-semibold text-sm">Collapse Menu</span>
              )}
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <div className="flex-1 flex flex-col h-full relative overflow-hidden min-w-0">
          {/* HEADER */}
          <header className="h-16 shrink-0 bg-black backdrop-blur-md flex items-center justify-between px-4 md:px-8 z-10">
            {/* Mobile: bigger logo */}
            <div className="md:hidden flex items-center">
              <img src={MeloVibe} alt="Logo" className="h-12 object-contain" />
            </div>
            <div className="hidden md:block"></div>

            <div className="flex items-center gap-3 md:gap-4">
              {/* Support — desktop uses IconText, mobile uses icon button */}
              <div className="hidden md:block">
                <IconText
                  displayText={
                    <span className="text-sm md:text-base font-semibold text-white">
                      Support
                    </span>
                  }
                  targetLink="/support"
                  active={curActiveScreen === "Support"}
                />
              </div>

              {/* Mobile Support icon */}
              <button
                onClick={() => navigate("/support")}
                className={`md:hidden p-2 rounded-full transition-colors ${
                  curActiveScreen === "Support"
                    ? "text-purple-400 bg-purple-500/20"
                    : "text-gray-400 hover:text-white"
                }`}
                aria-label="Support"
              >
                <Icon icon="mdi:help-circle-outline" fontSize={24} />
              </button>

              <div className="hidden md:block h-5 border-r border-white/30"></div>

              <a
                href="/profile"
                onClick={handleProfileClick}
                className="cursor-pointer hover:opacity-80 transition-opacity"
              >
                <Avatar />
              </a>
            </div>
          </header>

          {/* Scrollable content */}
          <main
            className={`flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 ${
              currentSong ? "pb-56 md:pb-32" : "pb-24 md:pb-8"
            }`}
          >
            {children}
          </main>
        </div>

        {/* FIXED BOTTOM */}
        <div
          className={`absolute bottom-0 left-0 right-0 z-40 flex flex-col pointer-events-none transition-all duration-300 ${sidebarWidth}`}
        >
          <div className="w-full flex flex-col pointer-events-auto">
            {currentSong && (
              <div className="w-full bg-gray-900 py-2 flex flex-col">
                <SongDuration />
                <div className="w-full text-white flex items-center justify-between px-2 md:px-3 py-2 md:py-3 gap-2">
                  <div className="flex items-center min-w-0 flex-1 md:w-1/4 md:flex-none">
                    <img
                      src={currentSong.thumbnail}
                      alt="Thumb"
                      className="h-9 w-9 md:h-14 md:w-14 rounded shadow-lg object-cover shrink-0"
                    />
                    <div className="pl-2 md:pl-3 min-w-0">
                      <div className="text-[12px] md:text-sm font-semibold truncate text-white">
                        {currentSong.name}
                      </div>
                      <div className="text-[10px] md:text-xs text-gray-400 truncate mt-0.5">
                        {currentSong.artist.firstname +
                          " " +
                          currentSong.artist.lastname}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 md:gap-4 shrink-0">
                    <Icon
                      icon="mdi:skip-previous-outline"
                      className="cursor-pointer text-gray-400 hover:text-white text-2xl md:text-[40px]"
                      onClick={() => {
                        let selectedSong = songList.findIndex(
                          (s) => s.track == currentSong.track
                        );
                        setCurrentSong(
                          selectedSong === 0
                            ? songList[songList.length - 1]
                            : songList[selectedSong - 1]
                        );
                      }}
                    />
                    <Icon
                      icon={
                        isPaused
                          ? "ic:baseline-play-circle"
                          : "ic:baseline-pause-circle"
                      }
                      className="cursor-pointer text-white md:text-gray-400 hover:text-white text-3xl md:text-[55px]"
                      onClick={togglePlayPause}
                    />
                    <Icon
                      icon="mdi:skip-next-outline"
                      className="cursor-pointer text-gray-400 hover:text-white text-2xl md:text-[40px]"
                      onClick={() => {
                        let selectedSong = songList.findIndex(
                          (s) => s.track == currentSong.track
                        );
                        setCurrentSong(
                          selectedSong + 1 === songList.length
                            ? songList[0]
                            : songList[selectedSong + 1]
                        );
                      }}
                    />
                    <Icon
                      icon="ic:round-playlist-add"
                      className="md:hidden cursor-pointer text-gray-400 hover:text-white text-2xl ml-1"
                      onClick={() => setAddToPlaylistModalOpen(true)}
                    />
                  </div>

                  <div className="hidden md:flex w-1/4 justify-end pr-4 gap-4 items-center">
                    <div className="flex px-2 gap-3 items-center">
                      <Icon
                        icon="icons8-minus"
                        className="cursor-pointer text-gray-400 hover:text-white text-[22px]"
                        onClick={() => {
                          if (soundPlayed) {
                            const v = soundPlayed.volume();
                            soundPlayed.volume(v <= 0.1 ? 0 : v - 0.1);
                            setVolumnLevel(v <= 0.1 ? 0 : v - 0.1);
                          }
                        }}
                      />
                      <span className="text-sm">{volumnLevel.toFixed(1)}</span>
                      <Icon
                        icon="icons8-plus"
                        className="cursor-pointer text-gray-400 hover:text-white text-[22px]"
                        onClick={() => {
                          if (soundPlayed) {
                            const v = soundPlayed.volume();
                            soundPlayed.volume(v >= 0.9 ? 1 : v + 0.1);
                            setVolumnLevel(v >= 0.9 ? 1 : v + 0.1);
                          }
                        }}
                      />
                    </div>
                    <Icon
                      icon="ic:round-playlist-add"
                      className="cursor-pointer text-gray-400 hover:text-white text-[30px]"
                      onClick={() => setAddToPlaylistModalOpen(true)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* MOBILE BOTTOM NAV */}
            <div className="w-full bg-black border-t border-white/10 flex md:hidden items-center justify-around pb-safe pt-1 pb-1.5">
              <Link
                to="/home"
                className={`flex flex-col items-center p-2 ${
                  curActiveScreen === "home"
                    ? "text-white"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                <Icon icon="material-symbols:home" fontSize={24} />
                <span className="text-[10px] mt-1 font-medium">Home</span>
              </Link>
              <Link
                to="/search"
                className={`flex flex-col items-center p-2 ${
                  curActiveScreen === "search"
                    ? "text-white"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                <Icon icon="material-symbols:search-rounded" fontSize={24} />
                <span className="text-[10px] mt-1 font-medium">Search</span>
              </Link>
              <div className="flex flex-col items-center">
                <button
                  onClick={() => setCreatePlaylistModalOpen(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg -mt-5 border-4 border-black transition-transform active:scale-95"
                >
                  <Icon icon="ic:baseline-plus" fontSize={24} />
                </button>
                <span className="text-[10px] mt-1 font-medium text-gray-500">
                  Create
                </span>
              </div>
              <Link
                to="/library"
                className={`flex flex-col items-center p-2 ${
                  curActiveScreen === "library"
                    ? "text-white"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                <Icon icon="icomoon-free:books" fontSize={24} />
                <span className="text-[10px] mt-1 font-medium">Library</span>
              </Link>
              <Link
                to="/myMusic"
                className={`flex flex-col items-center p-2 ${
                  curActiveScreen === "myMusic"
                    ? "text-white"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                <Icon
                  icon="material-symbols:library-music-sharp"
                  fontSize={24}
                />
                <span className="text-[10px] mt-1 font-medium">Songs</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoggedInContainer;

/* ============ SONG DURATION ============ */
const SongDuration = () => {
  const progressRef = useRef();
  const [count, setCount] = useState(0);
  useEffect(() => {
    let timer = setInterval(() => {
      setCount((pre) => pre + 1);
    }, 500);
    return () => clearInterval(timer);
  }, []);

  const { soundPlayed } = useContext(songContext);
  if (!soundPlayed) return <></>;

  let songDuration = soundPlayed.duration();
  let currTimer = (soundPlayed.seek() / songDuration) * 100 + "%";
  const minutes = Math.floor(soundPlayed.duration() / 60);
  const remainingScands = Math.floor(soundPlayed.duration() % 60);
  const currMinutes = Math.floor(soundPlayed.seek() / 60);
  const currRemainingScands = Math.floor(soundPlayed.seek() % 60);

  return (
    <div className="flex flex-col gap-0 md:gap-2">
      <div
        className="cursor-pointer bg-gray-700 h-1 md:h-2 relative mx-0 md:mx-8 rounded-none md:rounded-2xl overflow-hidden z-10"
        ref={progressRef}
        onClick={(e) => {
          const rect = progressRef.current.getBoundingClientRect();
          const clickX = (e.clientX - rect.left) / rect.width;
          soundPlayed.seek(clickX * soundPlayed.duration());
        }}
      >
        <div
          className="cursor-pointer bg-purple-500 h-1 md:h-2"
          style={{ width: currTimer }}
        ></div>
      </div>
      <div className="hidden md:flex flex-row justify-between text-white text-[10px] md:text-xs mx-4 md:mx-10">
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
