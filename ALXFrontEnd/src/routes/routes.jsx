import React from "react";
import { createBrowserRouter } from "react-router-dom";

import Layout from "../layouts/Layout";
import ProfileRoute from "../layouts/ProfileRoute";
import ProtectedRoute from "../layouts/ProtectedRoute";
import AuthRoute from "../layouts/AuthRoute";

import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Explore from "@/pages/Explore";
import About from "@/pages/About";
import CreateStory from "@/pages/CreateStory";
import Profile from "@/pages/Profile";
import MyStories from "@/pages/MyStories";
import Story from "@/pages/Story/Story";
import Contact from "@/pages/Contact";
import Explore2 from "@/pages/Explore2"; // Testing purposes only (remove later)
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import NotFound from "@/pages/404";

// Public routes
export const LINK_HOME = "/";
export const LINK_ABOUT = "/about";
export const LINK_CONTACT = "/contact";

// Protected routes
export const LINK_LOGIN = "/login";
export const LINK_REGISTER = "/register";
export const LINK_FORGOT_PASSWORD = "/forgot-password";
export const LINK_RESET_PASSWORD = "/password-reset/:token";

// Open routes
export const LINK_EXPLORE = "/explore";
export const LINK_EXPLORE2 = "/explore2"; // Testing purposes only (remove later)
export const LINK_EXPLORE_STORY = "/explore/:id";

// Authenticated routes
export const LINK_CREATE_STORY = "/create-story";
export const LINK_USER_PROFILE = "/profile";
export const LINK_MY_STORIES = "/my-stories";
export const LINK_DASHBOARD = "/:profileId";

// Not found routes
export const LINK_NOT_FOUND = "*";

const routes = [
  {
    element: <Layout />,
    children: 
    [
      { path: LINK_HOME, element: <Home /> },
      { path: LINK_ABOUT, element: <About /> },
      { path: LINK_CONTACT, element: <Contact /> },
      { path: LINK_LOGIN, element: <ProtectedRoute children={<Login />} /> },
      { path: LINK_REGISTER, element: <ProtectedRoute children={<Register />} /> },
      { path: LINK_FORGOT_PASSWORD, element: <ProtectedRoute children={<ForgotPassword />} /> },
      { path: LINK_RESET_PASSWORD, element: <ProtectedRoute children={<ResetPassword />} /> },
      { path: LINK_EXPLORE, element: <Explore /> },
      { path: LINK_EXPLORE2, element: <Explore2 /> }, // Testing purposes only (remove later)
      { path: LINK_EXPLORE_STORY, element: <Story /> },
      { path: LINK_CREATE_STORY, element: <AuthRoute children={<CreateStory />} /> },
      { path: LINK_USER_PROFILE, element: <AuthRoute children={<Profile />} /> },
      { path: LINK_MY_STORIES, element: <AuthRoute children={<MyStories />} /> },
      { path: LINK_DASHBOARD, element: <ProfileRoute /> },
      { path: LINK_NOT_FOUND, element: <NotFound />, }
    ],
  },
  { path: LINK_NOT_FOUND, element: <NotFound />, },
];

export const router = createBrowserRouter(routes);
