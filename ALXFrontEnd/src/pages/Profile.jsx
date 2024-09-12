"use client";

import ProfileUpdate from "./ProfileUpdate";
import ProfilePassword from "./ProfilePassword";

export default function Profile() {
  return (
    <div className="flex flex-col mb-20">
      <main className="flex-1 py-4 px-2 md:px-8">
        <div className="rounded-lg p-4 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            My Profile
          </h1>
          <p className="text-muted-foreground dark:text-muted-foreground-dark">
            Update your profile, change your password, and more.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 mt-4">
          <ProfileUpdate />

          <ProfilePassword />
        </div>
      </main>
    </div>
  );
}
