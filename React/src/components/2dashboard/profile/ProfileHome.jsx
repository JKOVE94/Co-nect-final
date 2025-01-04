import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Profile from "./Profile";
import ProfileEdit from "./ProfileEdit";

const ProfileHome = () => {
  const [update, setUpdate] = useState(false);

  return (
    <Routes>
      <Route path="/:userNum" element={<Profile update={update} />} />
      <Route
        path="/:userNum/edit"
        element={<ProfileEdit setUpdate={setUpdate} />}
      />
    </Routes>
  );
};

export default ProfileHome;
