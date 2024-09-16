import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import ProfilePage from "@/pages/ProfilePage";
import axiosClient from "@/api/axios";
import {
  getUsersStories,
  FamiliarStories,
  getUserFollowers,
  checkFollow,
} from "@/services/webApi";
import Dashboard from "@/pages/Dashboard/Dashboard";
import NotFound from "@/pages/404.jsx";

const ProfileRoute = () => {
  const { isAuthenticated, profileId, loading } = useAuth();
  const { profileId: routeProfileId } = useParams();
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [Stories, setStories] = useState([]);
  const [familiar, setFamiliar] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userNotFound, setUserNotFound] = useState(false);

  const fetchData = useCallback(async () => {
    //setIsLoading(true);
    setUserNotFound(false);

    try {
      const response = await axiosClient.get(`/users/${routeProfileId}`);
      if (response.status === 200) {
        setUserData(response.data);

        const stories = await getUsersStories(response.data.username);
        setStories(stories.data);

        const followersData = await getUserFollowers(response.data.username);
        setFollowers(followersData.status !== 204 ? followersData.data.followers : []);

        const familiarStories = await FamiliarStories("Fantasy", 3);
        setFamiliar(familiarStories.status !== 200 ? [] : familiarStories.data);

        if (isAuthenticated) {
          const followStatus = await checkFollow(response.data.username);
          setIsFollowing(followStatus.data.isFollowing);
        }
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setUserNotFound(true);
      }
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [routeProfileId, isAuthenticated]);

  useEffect(() => {
    if (loading) return;

    if (isAuthenticated && profileId.toLowerCase() === routeProfileId.toLowerCase()) {
      navigate(`/${profileId.toLowerCase()}`);
    } else {
      console.log("Fetching data...");
      fetchData();
    }
  }, [fetchData, isAuthenticated, profileId, routeProfileId, navigate, loading]);

  if (loading) return <></>;

  if (isAuthenticated && profileId.toLowerCase() === routeProfileId.toLowerCase()) {
    return <Dashboard />;
  }

  if (userNotFound) {
    return <NotFound />;
  }

  return (
    <ProfilePage
      userData={userData}
      setUserData={setUserData}
      userStories={Stories}
      userFamiliar={familiar}
      userFollowers={followers}
      setFollowers={setFollowers}
      isLoading={isLoading}
      isFollowing={isFollowing}
      setIsFollowing={setIsFollowing}
    />
  );
};

export default ProfileRoute;