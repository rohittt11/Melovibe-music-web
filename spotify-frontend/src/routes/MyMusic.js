import { useState, useEffect, useContext } from "react";
import SingleSongCard from "../components/shared/SingleSongCard";
import { makeAuthenticatedGETRequest } from "../utils/serverHelpers";
import LoggedInContainer from "../containers/LoggedInContainer";
import SonglistConext from "../contexts/songListConext";
import songContext from "../contexts/songContext";
import { Icon } from "@iconify/react";

const MyMusic = () => {
  const [songData, setSongData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  const { setSongList } = useContext(SonglistConext);
  const { setCurrentSong } = useContext(songContext);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await makeAuthenticatedGETRequest("/song/get/mysongs");
        setSongData(response.data || []);
        setSongList(response.data || []);
      } catch (err) {
        console.error("Failed to load songs:", err);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [setSongList]);

  // Filter + sort
  const filtered = songData.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "duration") return Number(a.duration) - Number(b.duration);
    return 0; // "recent" → keep server order
  });

  // Total duration of visible songs
  const totalSeconds = sorted.reduce(
    (sum, s) => sum + Number(s.duration || 0),
    0
  );
  const totalMin = Math.floor(totalSeconds / 60);
  const totalSec = Math.floor(totalSeconds % 60);
  const durationLabel = `${totalMin}:${totalSec.toString().padStart(2, "0")}`;

  return (
    <LoggedInContainer curActiveScreen="myMusic">
      {/* Header */}
      <div className="pt-6 md:pt-8 pb-4 px-1 md:px-2 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <div className="text-white text-xl md:text-2xl font-bold">
            My Songs
          </div>
          <div className="text-gray-400 text-xs md:text-sm mt-1">
            {songData.length} {songData.length === 1 ? "song" : "songs"}{" "}
            released
          </div>
        </div>

        {songData.length > 0 && (
          <button
            onClick={() => {
              setCurrentSong(sorted[0]);
              setSongList(sorted);
            }}
            className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-colors w-full md:w-auto"
          >
            <Icon icon="mdi:play" fontSize={20} /> Play All
          </button>
        )}
      </div>

      {/* Controls: search + sort */}
      {songData.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 mb-4 px-1 md:px-2">
          <div className="flex-1 flex items-center gap-2 bg-gray-800 rounded-full px-4 py-2 text-white">
            <Icon icon="ic:outline-search" className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Filter your songs..."
              className="w-full bg-transparent focus:outline-none text-sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-gray-400 hover:text-white shrink-0"
                aria-label="Clear"
              >
                <Icon icon="mdi:close" fontSize={18} />
              </button>
            )}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-800 text-white text-sm rounded-full px-4 py-2 focus:outline-none cursor-pointer w-full sm:w-auto"
          >
            <option value="recent">Recently uploaded</option>
            <option value="name">Name (A→Z)</option>
            <option value="duration">Duration (short → long)</option>
          </select>
        </div>
      )}

      {/* Songs */}
      <div className="space-y-2 pb-4">
        {loading ? (
          <div className="text-gray-400 text-sm mt-4">Loading songs...</div>
        ) : songData.length === 0 ? (
          <div className="text-gray-400 text-sm mt-4">
            You haven't uploaded any songs yet. Upload one from the sidebar.
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-gray-400 text-sm mt-4">
            No songs match "{query}".
          </div>
        ) : (
          sorted.map((item) => (
            <SingleSongCard
              key={item._id}
              info={item}
              playSound={() => {
                setCurrentSong(item);
                setSongList(sorted);
              }}
            />
          ))
        )}
      </div>
    </LoggedInContainer>
  );
};

export default MyMusic;
