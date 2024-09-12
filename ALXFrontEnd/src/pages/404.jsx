import { Link } from "react-router-dom";
import { useTheme } from "@/ThemeContext";
import Page from "@/Page";

export default function NotFound() {
  const { theme } = useTheme();
  return (
    <>
    <Page title="Not Found" />
      <div className="mt-12 py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600">
            404
          </h1>
          <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl">
            Something's missing.
          </p>
          <p className="mb-4 text-lg font-light text-dark-800">
            Sorry, we can't find that page. You'll find lots to explore on the
            home page.{" "}
          </p>
          <div className="flex justify-center mt-5">
            <Link
                to={"/"}
                className={`inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-6 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
                  theme === "light"
                    ? "border-muted text-foreground hover:bg-accent/50 hover:text-accent-foreground"
                    : "border-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                Back to Homepage
              </Link>
          </div>
        </div>
      </div>
    </>
  );
}
