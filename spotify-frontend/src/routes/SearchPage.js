import { useState, useEffect, useContext, useRef } from "react";
import LoggedInContainer from "../containers/LoggedInContainer";
import { Icon } from "@iconify/react";
import { makeAuthenticatedGETRequest } from "../utils/serverHelpers";
import { useNavigate } from "react-router-dom";
import SingleSongCard from "../components/shared/SingleSongCard";
import songContext from "../contexts/songContext";
import SonglistConext from "../contexts/songListConext";

const gradients = [
  "from-purple-600 to-pink-500",
  "from-blue-600 to-cyan-400",
  "from-orange-500 to-red-500",
  "from-green-600 to-emerald-400",
  "from-yellow-500 to-amber-400",
  "from-indigo-600 to-purple-500",
  "from-rose-500 to-pink-500",
  "from-teal-500 to-green-400",
];

const getGradient = (str = "") => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
};

const shuffleArray = (arr = []) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const buildShuffledQueue = (list = [], clickedSong) => {
  if (!clickedSong) return shuffleArray(list);
  const rest = list.filter((s) => s._id !== clickedSong._id);
  return [clickedSong, ...shuffleArray(rest)];
};

const SearchPage = () => {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [songData, setSongData] = useState([]);
  const [allSongs, setAllSongs] = useState([]);
  const [artistGroups, setArtistGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();

  const { setCurrentSong } = useContext(songContext);
  const { setSongList } = useContext(SonglistConext);

  const debounceRef = useRef(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [artistsRes, allSongsRes] = await Promise.all([
          makeAuthenticatedGETRequest("/song/get/all-with-songs"),
          makeAuthenticatedGETRequest("/song/get/all"),
        ]);
        setArtistGroups(
          (artistsRes?.data || []).filter((a) => a.songs && a.songs.length > 0)
        );
        setAllSongs(allSongsRes?.data || []);
      } catch (err) {
        console.error("Failed to load initial data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const q = searchText.trim();
    if (!q) {
      setSongData([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const response = await makeAuthenticatedGETRequest(
          "/song/get/songname/" + encodeURIComponent(q)
        );
        setSongData(response.data || []);
      } catch (err) {
        console.error("Search failed:", err);
        setSongData([]);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchText]);

  const showingSearch = searchText.trim().length > 0;

  const playShuffled = (song, sourceList) => {
    setCurrentSong(song);
    setSongList(buildShuffledQueue(sourceList, song));
  };

  return (
    <LoggedInContainer curActiveScreen="search">
      <div className="w-full py-4 md:py-6">
        <div
          className={`w-full md:w-1/3 p-3 text-sm rounded-full bg-gray-800 px-5 flex text-white space-x-3 items-center transition-all ${
            isInputFocused ? "border border-white" : ""
          }`}
        >
          <Icon icon="ic:outline-search" className="text-lg shrink-0" />
          <input
            type="text"
            placeholder="What do you want to listen to?"
            className="w-full bg-gray-800 focus:outline-none text-sm"
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          {searchText && (
            <button
              onClick={() => setSearchText("")}
              className="text-gray-400 hover:text-white shrink-0"
              aria-label="Clear search"
            >
              <Icon icon="mdi:close" fontSize={18} />
            </button>
          )}
        </div>

        {showingSearch ? (
          <div className="pt-6 md:pt-10 space-y-2">
            <div className="text-white text-sm md:text-base mb-3">
              Showing results for
              <span className="font-bold"> "{searchText}"</span>
            </div>

            {searching ? (
              <div className="text-gray-400 text-sm">Searching...</div>
            ) : songData.length === 0 ? (
              <div className="text-gray-400 text-sm">
                No songs found. Try a different keyword.
              </div>
            ) : (
              songData.map((item, idx) => (
                <SingleSongCard
                  key={item._id || idx}
                  info={item}
                  playSound={() => playShuffled(item, songData)}
                />
              ))
            )}
          </div>
        ) : (
          <>
            <div className="pt-6 md:pt-10">
              <div className="text-white text-lg md:text-2xl font-semibold mb-4 md:mb-6">
                Browse creators
              </div>

              {loading ? (
                <div className="text-gray-400 text-sm">Loading creators...</div>
              ) : artistGroups.length === 0 ? (
                <div className="text-gray-400 text-sm">
                  No creators with uploaded songs yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                  {artistGroups.map((artist) => (
                    <ArtistCard
                      key={artist._id}
                      artist={artist}
                      onExplore={() => navigate(`/artist/${artist._id}`)}
                      onPlaySong={(song) => playShuffled(song, artist.songs)}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="pt-8 md:pt-10">
              <div className="text-white text-lg md:text-2xl font-semibold mb-4 md:mb-6">
                All songs
              </div>

              {loading ? (
                <div className="text-gray-400 text-sm">Loading songs...</div>
              ) : allSongs.length === 0 ? (
                <div className="text-gray-400 text-sm">
                  No songs uploaded yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {allSongs.map((item, idx) => (
                    <SingleSongCard
                      key={item._id || idx}
                      info={item}
                      playSound={() => playShuffled(item, allSongs)}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </LoggedInContainer>
  );
};

const ArtistCard = ({ artist, onExplore, onPlaySong }) => {
  const fullName = `${artist.firstname} ${artist.lastname}`;
  const hasMultiple = artist.songs.length > 1;

  return (
    <div className="bg-[#181818] rounded-xl p-4 border border-white/5 hover:border-white/20 transition-colors">
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-12 h-12 rounded-full bg-gradient-to-br ${getGradient(
            artist._id
          )} flex items-center justify-center text-white font-bold text-lg shrink-0`}
        >
          {artist.firstname?.[0]?.toUpperCase() || "?"}
        </div>
        <div className="min-w-0">
          <div className="text-white font-semibold text-sm md:text-base truncate">
            {fullName}
          </div>
          <div className="text-gray-400 text-xs truncate">
            @{artist.username} · {artist.songs.length}{" "}
            {artist.songs.length === 1 ? "song" : "songs"}
          </div>
        </div>
      </div>

      {hasMultiple ? (
        <button
          onClick={onExplore}
          className="w-full flex items-center justify-between gap-3 px-3 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <Icon
              icon="material-symbols:library-music"
              className="text-purple-400 text-xl shrink-0"
            />
            <div className="text-left min-w-0">
              <div className="text-white text-sm font-medium">
                Explore songs
              </div>
              <div className="text-gray-400 text-[11px] truncate">
                All {artist.songs.length} tracks by {artist.firstname}
              </div>
            </div>
          </div>
          <Icon
            icon="mdi:arrow-right"
            className="text-gray-400 group-hover:text-white text-xl shrink-0"
          />
        </button>
      ) : (
        <div
          onClick={() => onPlaySong && onPlaySong(artist.songs[0])}
          className="flex items-center gap-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
        >
          <img
            src={artist.songs[0].thumbnail}
            alt={artist.songs[0].name}
            className="w-10 h-10 rounded object-cover shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="text-white text-sm font-medium truncate">
              {artist.songs[0].name}
            </div>
            <div className="text-gray-400 text-[11px] truncate">{fullName}</div>
          </div>
          <Icon
            icon="mdi:play-circle"
            className="text-purple-400 text-xl shrink-0"
          />
        </div>
      )}
    </div>
  );
};

export default SearchPage;
