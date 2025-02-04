import { useState } from "react";
import { Howl, Howler } from "howler";
import { Icon } from "@iconify/react";
// import spotify_logo from "../assets/images/spotify_logo_white.svg";
//  import spotify_logo from "../assets/images/MelodiVibe.png";
import IconText from "../components/shared/IconText";
import TextWithHover from "../components/shared/TextWithHover";
import LoggedInContainer from "../containers/LoggedInContainer";

const focusCardsData = [
  {
    title: "Mohammed Rafi",
    description:
      "Mohammed Rafi was an Indian playback singer and musician. He is considered to have been one of the greatest and most influential singers of the Indian subcontinent.",
    imgUrl:
      "data:image/jpeg;base64,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",
  },
  {
    title: "Kumar Sanu",
    description:
      "Kedarnath Bhattacharya, professionally known as Kumar Sanu, is an Indian playback singer who primarily sings in Hindi film songs.",
    imgUrl: "https://i.scdn.co/image/ab676161000051745e2e7e61d371b31ef6a8e935",
  },
  {
    title: "Lata Mangeshkar",
    description:
      "Lata Mangeshkar was an Indian playback singer and occasional music composer. She is considered to be one of the greatest and most influential singers of the Indian subcontinent.",
    imgUrl: "https://static.toiimg.com/thumb/56933883.cms?width=170&height=180",
  },

  {
    title: "Asha bhosale",
    description:
      "Asha Bhosle is an Indian playback singer, entrepreneur, actress and television personality who predominantly works in Indian cinema. Known for her versatility.",
    imgUrl:
      "https://im.rediff.com/movies/2013/sep/05asha-bhosle-birthday1.jpg?width=170&height=400",
  },
  {
    title: "Kishor Kumar",
    description:
      "Kishore Kumar was an Indian playback singer, musician and actor. He is widely regarded as one of the greatest, most influential and dynamic singers in the history of Indian music.",
    imgUrl:
      "https://i.scdn.co/image/ab6761610000e5ebc9ac92d87de28795c1c49730?width=170&height=180",
  },
];

const Melovibemale = [
  {
    title: "Shankar Mahadevan",
    description:
      "Shankar Mahadevan is among the greatest Indian vocalists alive, having risen to fame in Mumbai's fabled Bollywood film industry as a composer, playback singer.",
    imgUrl:
      "data:image/jpeg;base64,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",
  },
  {
    title: "Sonu Nigam",
    description:
      "Sonu Nigam is an Indian playback singer, music director, dubbing artist and actor. He has been described in the media as one of the best.",
    imgUrl:
      "https://images.news18.com/ibnlive/uploads/2023/02/sonu-nigam-attacked.jpg",
  },
  {
    title: "Ajay - Atul",
    description:
      "Ajay-Atul is the music composer duo of brothers Ajay Gogavale and Atul Gogavale from Maharashtra, India. They have made a significant impact on the Indian music industry.",
    imgUrl: "https://pbs.twimg.com/media/DgH6lWFUwAAavox.jpg",
  },

  {
    title: "Arijit singh",
    description:
      "Arijit Singh is an Indian playback singer and music composer. The recipient of several accolades including a National Film Award and seven Filmfare Awards.",
    imgUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAw1_00y4YhsVN6tmQly3a-tO1igM8i1-K8Q&usqp=CAU",
  },
  {
    title: "Vishal Mishra",
    description:
      "Vishal Mishra is an Indian music composer and singer. He first appeared in a reality show aired on DD National.In his initial days of the music industry.",
    imgUrl:
      "data:image/jpeg;base64,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",
  },
];

const MeloVibefemale = [
  {
    title: "Alka Yagnik",
    description:
      "Alka Yagnik’s soothing and melodious voice has made her one of the most beloved female playback singers in Bollywood. Her emotional depth and seamless control over her vocals make her a perfect fit for romantic and soul-stirring melodies.",
    imgUrl:
      "https://i0.wp.com/www.socialnews.xyz/wp-content/uploads/2020/02/24/5d09b06c416f981d1867cbec_15609160768075295351.jpg?quality=80&zoom=1&ssl=1",
  },
  {
    title: "Shreya Ghoshal",
    description:
      "Shreya Ghoshal’s enchanting voice has made her one of the most sought-after playback Indian best female singers.Shreya’s versatility and ability to effortlessly transition between different musical genres have earned her numerous accolades.",
    imgUrl:
      "https://st1.bollywoodlife.com/wp-content/uploads/2020/03/shreya-ghoshal-birthday-feature.jpg?impolicy=Medium_Widthonly&w=412&h=290",
  },
  {
    title: "Sunidhi Chauhan",
    description:
      "Sunidhi Chauhan is an Indian playback singer. Known for her versatile singing style, Chauhan possesses a high octave vocal range, and has the ability to reach lower octaves and dropping notes with transition.",
    imgUrl:
      "https://im.whatshot.in/event/2016/May/1464255602-sunidhi-chauhan-wallpaper.jpg?q=90",
  },
  {
    title: "Niti Mohan",
    description:
      "Neeti Mohan’s soulful voice and versatility have earned her a special place among Bollywood’s top female singers. Her angelic renditions and ability to convey emotions through her songs have garnered critical acclaim.",
    imgUrl:
      "https://www.bookbollywoodsingers.com/wp-content/uploads/2023/06/bollywood-female-singer-for-wedding-298x300.jpg",
  },
  {
    title: " Shweta Subram",
    description:
      "A rising star in the Bollywood music industry, Shweta Subram is known for her melodious voice and impeccable classical training.Shweta’s ability to blend traditional Indian music with contemporary styles sets her apart and makes her one of the best female singers in Bollywood in today.",
    imgUrl:
      "https://pbs.twimg.com/profile_images/1367667070926786560/CTEloPod_400x400.jpg",
  },
];

const Home = () => {
  return (
    <LoggedInContainer curActiveScreen="home">
      <PlaylistView
        titleText="Tribute to 90's Singers"
        cardsData={focusCardsData}
      />
      <PlaylistView titleText="Popular Male Singers" cardsData={Melovibemale} />
      <PlaylistView
        titleText="Popular Female Singers"
        cardsData={MeloVibefemale}
      />
    </LoggedInContainer>
  );
};

const PlaylistView = ({ titleText, cardsData }) => {
  return (
    <div className="text-white mt-8">
      <div className="text-2xl font-semibold mb-5">{titleText}</div>
      <div className="w-full flex justify-between space-x-4">
        {
          // cardsData will be an array
          cardsData.map((item) => {
            return (
              <Card
                title={item.title}
                description={item.description}
                imgUrl={item.imgUrl}
              />
            );
          })
        }
      </div>
    </div>
  );
};

const Card = ({ title, description, imgUrl }) => {
  return (
    <div className="bg-black bg-opacity-40 w-1/5 p-4 rounded-lg">
      <div className="pb-4 pt-2">
        <img className="w-full rounded-md" src={imgUrl} alt="label" />
      </div>
      <div className="text-white font-semibold py-3">{title}</div>
      <div className="text-gray-500 text-sm">{description}</div>
    </div>
  );
};

export default Home;
