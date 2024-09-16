import React from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BadgePlus, PenLineIcon } from "lucide-react";

const DashboardProfile = ({ user }) => {
  return (
    <div>
      <div className="space-y-2">
        <div className="flex items-center justify-center">
          <Avatar className="h-36 w-36 border-4 border-background rounded-full md:h-32 md:w-32">
            <AvatarImage src={user?.profile_photo || "/placeholder-user.jpg"} />
            <AvatarFallback>{user?.first_name[0] + user?.last_name[0] || "ST"}</AvatarFallback>
          </Avatar>
        </div>
        <h1 className="mt-4 text-center text-xl font-bold md:text-2xl">
          {user?.first_name} {user?.last_name}
        </h1>
        <p className="mt-4 text-center text-muted-foreground">
          @{user?.username?.toLowerCase()}
        </p>
      </div>
      <div className="mt-4 flex justify-center">
        <div className="grid grid-cols-2 gap-4">
          <Link to="/create-story">
            <Button variant="outline" className="rounded-xl">
              <BadgePlus className="h-4 w-4 mr-2" />
              <span>Create Story</span>
            </Button>
          </Link>
          <Link to="/profile">
            <Button variant="outline" className="rounded-xl">
              <PenLineIcon className="h-4 w-4 mr-2" />
              <span>Editing Profile</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardProfile;
