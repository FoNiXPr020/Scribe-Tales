import React from "react";
import { createBrowserRouter } from "react-router-dom";

import Layout from "../layouts/Layout";

import ProfileRoute from "./testing/ProfileRoute";
import ProtectedRoute from "./testing/ProtectedRoute";
import AuthRoute from "./testing/AuthRoute";

import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Explore from "@/pages/Explore";
import About from "@/pages/About";
import CreateStory from "@/pages/CreateStory";
import Profile from "@/pages/Profile";
import MyStories from "@/pages/MyStories";
import NotFound from "@/pages/404";
import Story from "@/pages/Story";
import Contact from "@/pages/Contact";
import Explore2 from "@/pages/Explore2";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";

export const LINK_LOGIN = "/login";
export const LINK_REGISTER = "/register";
export const LINK_EXPLORE = "/explore";
export const LINK_EXPLORE2 = "/explore2";
export const LINK_ABOUT = "/about";
export const LINK_CONTACT = "/contact";
export const LINK_CREATE_STORY = "/create-story";
export const LINK_USER_PROFILE = "/profile";
export const LINK_MY_STORIES = "/my-stories";
export const LINK_FORGOT_PASSWORD = "/forgot-password";
export const LINK_RESET_PASSWORD = "/password-reset/:token";
export const LINK_STORY = "/explore/:id";

const routes = [
  {
    element: <Layout />,
    children: 
    [
      { path: "/", element: <Home /> },
      { path: LINK_LOGIN, element: <ProtectedRoute children={<Login />} /> },
      { path: LINK_REGISTER, element: <ProtectedRoute children={<Register />} /> },
      { path: LINK_FORGOT_PASSWORD, element: <ProtectedRoute children={<ForgotPassword />} /> },
      { path: LINK_RESET_PASSWORD, element: <ProtectedRoute children={<ResetPassword />} /> },
      { path: LINK_ABOUT, element: <About /> },
      { path: LINK_CONTACT, element: <Contact /> },
      { path: LINK_EXPLORE, element: <Explore /> },
      { path: LINK_EXPLORE2, element: <Explore2 /> },
      { path: LINK_STORY, element: <Story /> },
      { path: LINK_USER_PROFILE, element: <AuthRoute children={<Profile />} /> },
      { path: LINK_CREATE_STORY, element: <AuthRoute children={<CreateStory />} /> },
      { path: LINK_MY_STORIES, element: <AuthRoute children={<MyStories />} /> },
      { path: "/:profileId", element: <ProfileRoute /> },
      { path: "*", element: <NotFound />, }
    ],
  }
];

export const router = createBrowserRouter(routes);
