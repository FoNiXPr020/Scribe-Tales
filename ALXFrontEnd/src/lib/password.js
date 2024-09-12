import axiosClient from "@/api/axios";
import { handleAuthErrors } from "@/lib/errors";
import { csrf } from "@/services/authApi";

export const SendForgotPasswordLink = async (data) => {
    try {
        await csrf();
        const response = await axiosClient.post("/forgot-password", data, {
            baseURL: import.meta.env.VITE_BACKEND_URL,
        });

        console.log(response.data);
        return response.data;
    } catch (error) {
        //console.log(error);
        throw handleAuthErrors(error);
    }
}

export const PasswordReset = async (data) => {
    try {
        await csrf();
        const response = await axiosClient.post("/reset-password", data, {
            baseURL: import.meta.env.VITE_BACKEND_URL,
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        throw handleAuthErrors(error);
    }
}