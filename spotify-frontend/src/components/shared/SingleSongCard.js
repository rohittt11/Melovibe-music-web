import { useContext } from "react";
import songContext from "../../contexts/songContext";

const SingleSongCard = ({ info, playSound }) => {
  const { currentSong, setCurrentSong, soundPlayed } = useContext(songContext);

  const duration =
    info.duration != null
      ? (Number(info.duration["$numberDecimal"]) / 60).toFixed(2)
      : 3.44;
  const minutes = Math.floor(Number(info.duration["$numberDecimal"]) / 60);
  const remainingScands = Math.floor(
    Number(info.duration["$numberDecimal"]) % 60
  );

  return (
    <div
      className="flex hover:bg-gray-400 hover:bg-opacity-20 p-2 rounded-sm"
      onClick={() => {
        setCurrentSong(info);
      }}
    >
      <div
        className="w-12 h-12 bg-cover bg-center"
        style={{
          backgroundImage: `url("${info.thumbnail}")`,
        }}
      ></div>
      <div className="flex w-full">
        <div className="text-white flex justify-center  flex-col pl-4 w-5/6">
          <div className="cursor-pointer hover:underline">{info.name}</div>
          <div className="text-xs text-gray-400 cursor-pointer hover:underline">
            {info.artist.firstname + " " + info.artist.lastname}
          </div>
        </div>
        <div className="w-1/6 flex items-center justify-center text-gray-400 text-sm">
          <div>
            {minutes == 0 ? "" : minutes + " : "}
            {remainingScands == 0 ? "" : remainingScands}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleSongCard;
