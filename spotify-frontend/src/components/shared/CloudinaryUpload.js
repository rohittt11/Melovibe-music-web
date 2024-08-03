import { openUploadWidget } from "../../utils/CloudinaryService";
// import {nkgwnnjm} from "../../utils/config";

const CloudinaryUpload = ({ setUrl, setName, setDuration }) => {
  const uploadImageWidget = () => {
    let myUploadWidget = openUploadWidget(
      {
        cloudName: "dhfpuygh1",
        uploadPreset: "nkgwnnjm",
        sources: ["local"],
      },
      function (error, result) {
        if (!error && result.event === "success") {
          setUrl(result.info.secure_url);
          setName(result.info.original_filename);
          setDuration(result.info.duration);
        } else {
          if (error) {
            console.log(error);
          }
        }
      }
    );
    myUploadWidget.open();
  };

  return (
    <button
      className="bg-white text-black  rounded-full p-4 font-semibold"
      onClick={uploadImageWidget}
    >
      Select Track
    </button>
  );
};

export default CloudinaryUpload;
