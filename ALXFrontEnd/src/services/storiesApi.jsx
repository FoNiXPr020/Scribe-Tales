import axiosClient from "@/api/axios";

// Story API functions
export const getStories = async () => {
  return await axiosClient.get("/explore");
};

export const getStory = async (id) => {
  return await axiosClient.get(`/explore/${id}`);
};

export const storyCreate = async (data) => {
  return await axiosClient.post("/stories", data);
};

export const storyDelete = async (id) => {
  return await axiosClient.delete(`/stories/${id}`);
};

export const storyUpdate = async (id, data) => {
  return await axiosClient.put(`/stories/${id}`, data);
};

// Comment API functions
export const getComments = async (storyId) => {
  return await axiosClient.get(`/comments/${storyId}`);
};

export const postComment = async (data) => {
  return await axiosClient.post("/comments", data);
};

export const updateComment = async (id, data) => {
  return await axiosClient.put(`/comments/${id}`, data);
};

export const deleteComment = async (id) => {
  return await axiosClient.delete(`/comments/${id}`);
};
