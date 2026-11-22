import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoggedInContainer from "../containers/LoggedInContainer";
import { makeAuthenticatedGETRequest } from "../utils/serverHelpers";
import { Icon } from "@iconify/react";

const MyContracts = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const res = await makeAuthenticatedGETRequest("/contract/mine");
        setContracts(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchContracts();
  }, []);

  return (
    <LoggedInContainer curActiveScreen="contracts">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4 px-3 py-2 rounded-full bg-white/5 hover:bg-white/10 w-fit"
      >
        <Icon icon="mdi:arrow-left" fontSize={22} />
        <span className="text-sm font-semibold">Back</span>
      </button>

      <div className="text-white text-xl md:text-2xl font-bold mb-4">
        My Contracts
      </div>

      {loading ? (
        <div className="text-gray-400 text-sm">Loading contracts...</div>
      ) : contracts.length === 0 ? (
        <div className="text-gray-400 text-sm">
          No contracts signed yet. Upload a song to sign your first contract
          with <span className="text-purple-400">Melovibe</span>.
        </div>
      ) : (
        <div className="space-y-3">
          {contracts.map((c) => (
            <div
              key={c._id}
              className="bg-[#181818] border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row gap-4"
            >
              {c.song?.thumbnail && (
                <img
                  src={c.song.thumbnail}
                  alt={c.songName}
                  className="w-16 h-16 rounded object-cover shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="text-white font-semibold truncate">
                    {c.songName}
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      c.status === "active"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
                <div className="text-gray-400 text-xs mt-1">
                  Signed by {c.artistName} · {c.exclusivity} ·{" "}
                  {c.revenueSplit.artist}/{c.revenueSplit.platform} split
                </div>
                <div className="text-gray-500 text-xs mt-1">
                  Signed on {new Date(c.signedAt).toLocaleDateString()}
                </div>
              </div>
              <div className="text-xs text-gray-500 font-mono bg-black/40 px-3 py-2 rounded self-start">
                ✍ {c.signature}
              </div>
            </div>
          ))}
        </div>
      )}
    </LoggedInContainer>
  );
};

export default MyContracts;
