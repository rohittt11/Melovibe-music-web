import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LoggedInContainer from "../containers/LoggedInContainer";
import { makeAuthenticatedGETRequest } from "../utils/serverHelpers";
import SingleSongCard from "../components/shared/SingleSongCard";
import { Icon } from "@iconify/react";
import songContext from "../contexts/songContext";
import SonglistConext from "../contexts/songListConext";

const ArtistPage = () => {
  const { artistId } = useParams();
  const navigate = useNavigate();
  const [songs, setSongs] = useState([]);
  const [artistName, setArtistName] = useState("");
  const [loading, setLoading] = useState(true);

  const { setCurrentSong } = useContext(songContext);
  const { setSongList } = useContext(SonglistConext);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await makeAuthenticatedGETRequest(
          "/song/get/artist/" + artistId
        );

        const songList = response.data || [];
        setSongs(songList);
        setSongList(songList);

        // Prefer top-level artist (new API shape). Fall back to populated song.artist.
        const artist =
          response.artist ||
          songList[0]?.artist || // populated object
          null;

        if (artist) {
          const first = artist.firstname || "";
          const last = artist.lastname || "";
          setArtistName(`${first} ${last}`.trim() || "Unknown artist");
        } else {
          // If API still returns raw string IDs, fall back to a placeholder
          setArtistName("Artist");
        }
      } catch (err) {
        console.error("Failed to load artist songs:", err);
        setArtistName("Artist");
      } finally {
        setLoading(false);
      }
    };
    fetchSongs();
  }, [artistId, setSongList]);

  return (
    <LoggedInContainer curActiveScreen="search">
      <div className="w-full">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4 mt-2 px-3 py-2 rounded-full bg-white/5 hover:bg-white/10 w-fit"
          aria-label="Go back"
        >
          <Icon icon="mdi:arrow-left" fontSize={22} />
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* Header */}
        <div className="flex items-end gap-4 py-6 md:py-8 border-b border-white/10 mb-6">
          <div className="w-24 h-24 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white text-4xl md:text-6xl font-bold shrink-0">
            {artistName?.[0]?.toUpperCase() || "?"}
          </div>
          <div className="min-w-0">
            <div className="text-gray-400 text-xs md:text-sm uppercase tracking-wider mb-1">
              Artist
            </div>
            <div className="text-white text-2xl md:text-5xl font-bold truncate">
              {loading ? "Loading..." : artistName || "Unknown artist"}
            </div>
            <div className="text-gray-400 text-xs md:text-sm mt-2">
              {songs.length} {songs.length === 1 ? "song" : "songs"}
            </div>
          </div>
        </div>

        {/* Songs */}
        {loading ? (
          <div className="text-gray-400 text-sm">Loading songs...</div>
        ) : songs.length === 0 ? (
          <div className="text-gray-400 text-sm">
            This artist hasn't uploaded any songs yet.
          </div>
        ) : (
          <div className="space-y-2 pb-4">
            {songs.map((song) => (
              <SingleSongCard
                key={song._id}
                info={song}
                playSound={() => {
                  setCurrentSong(song);
                  setSongList(songs);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </LoggedInContainer>
  );
};

export default ArtistPage;
