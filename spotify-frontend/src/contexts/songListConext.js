import {createContext} from "react";
const SonglistConext=createContext({
    songList:[],
    setSongList:(list)=>{},
})

export default SonglistConext;