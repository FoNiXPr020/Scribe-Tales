import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HeartIcon, HeartOffIcon } from "@/components/ui/Icons";
import { CalendarCheck } from "lucide-react";
import { formatDate, cleanDescription } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import TextToSpeech from "@/utils/TextToSpeech";

const StoryView = ({ story, handleLike, liked }) => {
  return (
    <section className="container px-3 py-2 md:py-2 grid md:grid-cols-2 gap-6">
      <div className="space-y-2">
        {/* Story Content */}
        <Card className="w-full rounded-xl ">
          <CardContent className="grid gap-4 mt-5">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={story?.user.profile_photo || "/placeholder-user.jpg"}
                  />
                  <AvatarFallback>GP</AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-lg font-medium">
                    {story?.user.first_name} {story?.user.last_name}
                  </div>

                  <Link to={`/${story?.user.username.toLowerCase()}`}>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm text-muted-foreground"
                    >
                      @{story?.user.username.toLowerCase()}
                    </motion.div>
                  </Link>
                </div>
              </div>
              <div>
                <div className="flex flex-col gap-2 text-muted-foreground md:flex-col md:items-start">
                  <div className="flex items-center gap-2 md:mt-2">
                    <CalendarCheck className="h-5 w-5" />
                    <span className="block">
                      {formatDate(story?.created_at)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HeartIcon className="h-5 w-5" />
                    <span className="block">{story?.likes_count} Likes</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4 w-full block sm:hidden">
          <TextToSpeech text={story?.content} />
        </div>

        <Card className="w-full h-5/5 rounded-xl col-span-2">
          <CardContent className="grid mt-5">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center">
                <div className="text-3xl font-medium line-clamp-2">
                  {story?.title}
                </div>
              </div>
              <div className="flex items-center gap-4 space-x-2 hidden sm:block">
                <TextToSpeech text={story?.content} />
              </div>
            </div>
            <CardDescription className="mt-5 text-muted-foreground text-xl whitespace-pre-line">
              {cleanDescription(story?.content)}
            </CardDescription>
          </CardContent>
        </Card>
      </div>
      <div className="relative overflow-hidden rounded-xl w-full h-full md:h-96">
        <img
          src={story?.image || "/story-placeholder.png"}
          alt={story.user.username || "story image"}
          className="object-cover w-full h-full rounded-xl shadow-xl"
        />
        <motion.button
          aria-label="Like Story"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleLike}
          type="button"
          className="absolute top-4 right-4 p-2 rounded-full shadow-md bg-background hover:bg-muted"
        >
          {liked ? (
            <HeartOffIcon className="w-6 h-6 text-gray-500" />
          ) : (
            <HeartIcon className="w-6 h-6 text-gray-500" />
          )}
        </motion.button>
      </div>
    </section>
  );
};

export default StoryView;
