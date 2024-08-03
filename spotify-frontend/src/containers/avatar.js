import React, { useState, useEffect } from "react";

const Avatar = () => {
  const [name, setName] = useState("");
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("profileData"));
    if (storedData == null || storedData == undefined) {
      setName("");
    } else {
      var f = "";
      var l = "";
      if (storedData.firstname != null && storedData.firstname != undefined) {
        f = storedData.firstname?.substring(0, 1).toUpperCase();
      }
      if (storedData.lastname != null && storedData.lastname != undefined) {
        l = storedData.lastname?.substring(0, 1).toUpperCase();
      }

      setName(f + l);
    }
  }, []);

  if (name == "") {
    return (
      <div className="bg-purple-400 text-white w-12 h-12 flex items-center justify-center rounded-full font-semibold cursor-pointer">
        AC
      </div>
    );
  }

  return (
    <div className="bg-purple-400 text-white w-12 h-12 flex items-center justify-center rounded-full font-semibold cursor-pointer">
      {name}
    </div>
  );
};

export default Avatar;
