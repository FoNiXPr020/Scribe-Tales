export const handleAuthErrors = (error) => {
    if (error.response && error.response.data) {
        const { data } = error.response;

        // Handle specific field errors from Laravel
        if (data.errors) {
            const formErrors = {};
            for (const key in data.errors) {
                formErrors[key] = { message: data.errors[key][0] };
            }
            return formErrors;
        }

        // Handle custom error messages for login issues
        if (data.email) {
            return { email: { message: data.email } };
        }
        if (data.password) {
            return { password: { message: data.password } };
        }

        // Handle custom error messages for password issues
        if (data.current_password) {
            return { current_password: { message: data.current_password } };
        }

        // Return generic error message
        return {
            general: {
                message: data.message || "An unknown error occurred. Please try again later.",
            },
        };
    }

    // Handle other cases where error.response.data is not present
    console.error("Error:", error);
    return {
        general: { message: "An unexpected error occurred, please try again later." },
    };
};