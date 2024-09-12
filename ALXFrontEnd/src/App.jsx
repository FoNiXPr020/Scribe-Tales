import { ThemeProvider } from "./ThemeContext.jsx";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/routesv2.jsx";
import { AnimatePresence } from "framer-motion";
import { ToastContainer } from "react-toastify";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "react-toastify/dist/ReactToastify.css";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
  return (
    <>
      <AnimatePresence mode="wait">
        <ThemeProvider>
          <GoogleOAuthProvider clientId={clientId}>
            <RouterProvider router={router} />
          </GoogleOAuthProvider>
        </ThemeProvider>
      </AnimatePresence>
      <ToastContainer
        position="bottom-right"
        limit={3}
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        stacked
      />
    </>
  );
}

export default App;
