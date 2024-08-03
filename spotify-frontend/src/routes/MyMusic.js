import {useState, useEffect} from "react";
import SingleSongCard from "../components/shared/SingleSongCard";
import {makeAuthenticatedGETRequest} from "../utils/serverHelpers";
import LoggedInContainer from "../containers/LoggedInContainer";
import SonglistConext from "../contexts/songListConext";
import { useContext } from "react";

const MyMusic = () => {
    const [songData, setSongData] = useState([]);
    const {
    songList,setSongList
    } = useContext(SonglistConext);
    useEffect(() => {
        const getData = async () => {
            const response = await makeAuthenticatedGETRequest(
                "/song/get/mysongs"
            );
            setSongData(response.data);
            setSongList(response.data);
            
        };
        getData();
    }, []);

    return (
        <LoggedInContainer curActiveScreen="myMusic">
            <div className="text-white text-xl font-semibold pb-4 pl-2 pt-8">
                My Songs
            </div>
            <div className="space-y-3 overflow-auto">
                {songData.map((item,i) => {
                    return <SingleSongCard key={i} info={item} playSound={() => {}} />;
                })}
            </div>
        </LoggedInContainer>
    );
};

export default MyMusic;
