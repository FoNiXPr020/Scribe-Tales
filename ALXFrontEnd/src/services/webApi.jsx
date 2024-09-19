import axiosClient from "@/api/axios";


export const getUserFollowers = async (username) => {
  return await axiosClient.get("/user/followers/" + username);
};

export const getUserLikes = async (username) => {
  return await axiosClient.get("/user/likes/" + username);
};

export const follow = async (username) => {
  return await axiosClient.post("/follow/" + username);
};

export const unfollow = async (username) => {
  return await axiosClient.delete("/unfollow/" + username);
};

export const checkFollow = async (username) => {
  return await axiosClient.post("/check/follow/" + username);
};

export const like = async (storyId) => {
  return await axiosClient.post("/like/" + storyId);
};

export const unlike = async (storyId) => {
  return await axiosClient.delete("/unlike/" + storyId);
};

export const FamiliarStories = async (writer_type, limit) => {
  return await axiosClient.get("/familiar?writer_type=" + writer_type + "&limit=" + limit);
};

export const getUsersStories = async (username) => {
  return await axiosClient.get("/users/stories/" + username);
}

export const GetReviews = async () => {
  return await axiosClient.get("/reviews");
}

export const getMyReview = async () => {
  return await axiosClient.get("/my-review");
}

export const createReview = async (data) => {
  return await axiosClient.post("/reviews", data);
}
export const updateReview = async (id) => {
  return await axiosClient.post(`/reviews/${id}`);
}

export const deleteReview = async (id) => { 
  return await axiosClient.delete(`/reviews/${id}`); 
}
