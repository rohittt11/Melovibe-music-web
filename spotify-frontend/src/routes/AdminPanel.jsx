import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoggedInContainer from "../containers/LoggedInContainer";
import { makeAuthenticatedGETRequest } from "../utils/serverHelpers";
import { Icon } from "@iconify/react";

const AdminPanel = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState("");
  const navigate = useNavigate();

  const loadContracts = async () => {
    try {
      const res = await makeAuthenticatedGETRequest("/contract/all");
      setContracts(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContracts();
  }, []);

  const terminate = async (contractId) => {
    try {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
        "$1"
      );
      await fetch(`http://localhost:8080/contract/terminate/${contractId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      setActionMsg("Contract terminated");
      loadContracts();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteSong = async (songId) => {
    if (!window.confirm("Delete this song permanently?")) return;
    try {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
        "$1"
      );
      await fetch(`http://localhost:8080/song/delete/${songId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setActionMsg("Song deleted");
      loadContracts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <LoggedInContainer curActiveScreen="admin">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4 px-3 py-2 rounded-full bg-white/5 hover:bg-white/10 w-fit"
      >
        <Icon icon="mdi:arrow-left" fontSize={22} />
        <span className="text-sm font-semibold">Back</span>
      </button>

      <div className="flex items-center gap-3 mb-4">
        <Icon
          icon="mdi:shield-crown"
          className="text-purple-500"
          fontSize={28}
        />
        <div className="text-white text-xl md:text-2xl font-bold">
          Admin Panel — All Contracts
        </div>
      </div>

      {actionMsg && (
        <div className="bg-green-500/10 border border-green-500/30 text-green-300 text-xs rounded-lg px-3 py-2 mb-3">
          {actionMsg}
        </div>
      )}

      {loading ? (
        <div className="text-gray-400 text-sm">Loading contracts...</div>
      ) : contracts.length === 0 ? (
        <div className="text-gray-400 text-sm">No contracts yet.</div>
      ) : (
        <div className="space-y-3">
          {contracts.map((c) => (
            <div
              key={c._id}
              className="bg-[#181818] border border-white/10 rounded-xl p-4 flex flex-col md:flex-row gap-4"
            >
              {c.song?.thumbnail && (
                <img
                  src={c.song.thumbnail}
                  alt={c.songName}
                  className="w-16 h-16 rounded object-cover shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="text-white font-semibold truncate">
                  {c.songName}
                </div>
                <div className="text-gray-400 text-xs mt-1">
                  Artist: {c.artistName} ({c.artist?.email})
                </div>
                <div className="text-gray-500 text-xs mt-1">
                  Signed {new Date(c.signedAt).toLocaleDateString()} ·{" "}
                  {c.exclusivity} · {c.revenueSplit.artist}/
                  {c.revenueSplit.platform} split
                </div>
                <div className="text-xs text-gray-500 font-mono mt-1">
                  ✍ {c.signature}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 items-start">
                <span
                  className={`text-xs px-2 py-1 rounded-full self-start ${
                    c.status === "active"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {c.status}
                </span>
                {c.status === "active" && (
                  <button
                    onClick={() => terminate(c._id)}
                    className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 text-xs px-3 py-1 rounded-full"
                  >
                    Terminate
                  </button>
                )}
                {c.song && (
                  <button
                    onClick={() => deleteSong(c.song._id)}
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs px-3 py-1 rounded-full flex items-center gap-1"
                  >
                    <Icon icon="mdi:trash" fontSize={14} />
                    Delete Song
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </LoggedInContainer>
  );
};

export default AdminPanel;
