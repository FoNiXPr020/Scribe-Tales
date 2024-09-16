"use client";

import React, { useState, useEffect } from "react";
import Page from "@/Page";
import DashboardSkeleton from "@/components/skeletons/DashboardSkeleton";
import { useAuth } from "../../contexts/AuthContext";
import { getUserStories } from "@/services/authApi";
import {
  FamiliarStories,
  getUserFollowers,
  getUserLikes,
} from "@/services/webApi";

import DashboardCover from "./DashboardCover";
import DashboardProfile from "./DashboardProfile";
import DashboardExplore from "./DashboardExplore";
import Familiar from "@/pages/Familiar";

export default function Dashboard() {
  const { loading, user, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [stories, setStories] = useState([]);
  const [familiar, setFamiliar] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [likesCount, setLikesCount] = useState(0); // Changed to camelCase

  const fetchUserStories = async () => {
    try {
      if (!user) return; // Ensure user is available before fetching data

      // Fetch user stories
      const { data: storiesData, status: storiesStatus } =
        await getUserStories();
      setStories(storiesStatus !== 200 ? [] : storiesData);

      // Fetch user followers
      const followers = await getUserFollowers(user.username);
      const { data: followersData, status: followersStatus } = followers;
      setFollowers(followersStatus !== 204 ? followersData.followers : []);
      setFollowersCount(
        followersStatus !== 204 ? followersData.followers_count : 0
      );

      // Fetch user likes
      const likes = await getUserLikes(user.username);
      setLikesCount(likes.status !== 204 ? likes.data.likes_count : 0);

      // Fetch familiar stories
      const familiar = await FamiliarStories(null, 3);
      setFamiliar(familiar.status !== 200 ? [] : familiar.data);
    } catch (error) {
      console.error("Error fetching user stories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserStories();
    }
  }, [user, setUser]); // Added setUser to the dependency array for safety

  if (loading || isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <>
      <Page title="Dashboard" />
      <main>
        {/* Cover Image */}
        <DashboardCover
          user={user}
          setUser={setUser}
          likesCount={likesCount}
          followersCount={followersCount}
        />

        <div className="container mx-auto mt-2 max-w-6xl px-4 md:mt-10 md:px-6 grid md:grid-cols-3 gap-8">
          <DashboardProfile user={user} />

          <DashboardExplore
            user={user}
            stories={stories}
            followers={followers}
          />
        </div>

        <Familiar familiar={familiar} />
      </main>
    </>
  );
}
