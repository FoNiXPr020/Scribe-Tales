import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdvancedMotion from "@/components/motions/AdvancedMotion";
import { Button } from "@/components/ui/button";
import Page from "@/Page";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { GetReviews } from "@/services/webApi";

export default function Home() {
  const coverImages = ["assets/covers/2.png", "assets/covers/5.png", "assets/covers/12.png"];
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const response = await GetReviews();
      console.log(response);
      setReviews(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [setReviews]);

  return (
    <>
      <Page title="Home" />
      <main className="mx-auto">
        <section className="relative">
          <Carousel className="w-full h-[60vh]">
            <CarouselContent>
              {coverImages.map((src, index) => (
                <CarouselItem key={index}>
                  <div className="relative w-full h-[60vh]">
                    <img
                      src={src}
                      alt={`Cover Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:block absolute top-1/2 left-3 -translate-y-1/2 w-4 h-8" />
            <CarouselNext className="hidden sm:block absolute top-1/2 right-3 -translate-y-1/2 w-4 h-8" />
          </Carousel>
          {/* <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-background to-transparent" /> */}
          <div className="absolute top-1/2 left-0 sm:left-12 md:left-26 lg:px-8 -translate-y-1/2 transform w-full md:w-1/2 p-8">
            <AdvancedMotion direction="bottom">
              <div className="space-y-6">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-orange-300">
                  Discover the Magic of Scribe Tales
                </h1>
                <p className="text-gray-200 md:text-xl">
                  Immerse yourself in a world of captivating stories, where the
                  written word comes alive. Scribe Tales invites you to explore
                  the boundless realms of imagination.
                </p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Link to="/explore">
                    <Button
                      variant="default"
                      className="w-full sm:w-auto rounded-xl"
                    >
                      Explore Stories
                    </Button>
                  </Link>
                  <Link to="/create-story">
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto rounded-xl bg-background/80 hover:bg-background"
                    >
                      Become a Writer
                    </Button>
                  </Link>
                </div>
              </div>
            </AdvancedMotion>
          </div>
        </section>

        <section className="container mt-12 grid gap-8 md:mt-24 md:grid-cols-2 md:gap-12">
          <div className="overflow-hidden rounded-xl">
            <AdvancedMotion
              direction="bottom"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <img
                src="/story-featured.png"
                width="800"
                height="600"
                alt="Featured Story"
                className="aspect-video w-full object-cover shadow-lg"
              />
            </AdvancedMotion>
          </div>

          <AdvancedMotion direction="top">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Featured Story
              </h2>
              <p className="text-muted-foreground md:text-xl">
                Discover a captivating tale that will transport you to a world
                of wonder and imagination. Immerse yourself in the rich
                narrative and let the words come alive.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Link
                  className="inline-flex items-center justify-center h-10"
                  to="/create-story"
                >
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      variant="default"
                      className="w-full sm:w-auto rounded-xl"
                    >
                      Read Now
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </div>
          </AdvancedMotion>
        </section>

        <section>
          <AdvancedMotion direction="bottom">
            <div className="mt-12 grid gap-8 md:mt-24 md:grid-cols-3 md:gap-12 justify-between">
              <div className="space-y-4 text-center">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-4xl">
                  Explore Our Stories
                </h2>
                <p className="text-muted-foreground md:text-xl">
                  Dive into a vast collection of captivating stories, each
                  offering a unique journey for your imagination.
                </p>
                <Link
                  className="inline-flex items-center justify-center h-10"
                  to="/explore"
                >
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      variant="default"
                      className="w-full sm:w-auto rounded-xl"
                    >
                      Explore Stories
                    </Button>
                  </motion.div>
                </Link>
              </div>
              <div className="space-y-4 text-center">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-4xl">
                  Become a Writer
                </h2>
                <p className="text-muted-foreground md:text-xl">
                  Share your unique voice and captivate readers with your
                  storytelling. Join our community of talented writers.
                </p>
                <Link
                  className="inline-flex items-center justify-center h-10"
                  to="/create-story"
                >
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      variant="default"
                      className="w-full sm:w-auto rounded-xl"
                    >
                      Share Your Story
                    </Button>
                  </motion.div>
                </Link>
              </div>
              <div className="space-y-4 text-center">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-4xl">
                  Join Our Community
                </h2>
                <p className="text-muted-foreground md:text-xl">
                  Connect with fellow readers and writers, share your thoughts,
                  and engage in captivating discussions.
                </p>
                <Link
                  className="inline-flex items-center justify-center h-10"
                  to="/register"
                >
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      variant="default"
                      className="w-full sm:w-auto rounded-xl"
                    >
                      Join Community
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </div>
          </AdvancedMotion>
        </section>

        <section className="mt-12 md:mt-24 mb-16">
          <h2 className="text-3xl font-bold tracking-tighter text-center mb-8 sm:text-4xl md:text-5xl">
            What Our Readers Say
          </h2>
          <Carousel className="w-full max-w-xs mx-auto sm:max-w-1xl md:max-w-2xl lg:max-w-3xl">
            <CarouselContent>
              {reviews.map((review, index) => (
                <CarouselItem key={index}>
                  <Card className="bg-background dark:bg-muted rounded-3xl">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center">
                        <Avatar className="w-20 h-20 mb-4">
                          <AvatarImage
                            src={
                              review.user.profile_photo ||
                              "/assets/placeholder-user.jpg"
                            }
                            alt={review.user.first_name}
                          />
                          <AvatarFallback className="bg-muted dark:bg-background">
                            {review.user.first_name[0] +
                              review.user.last_name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex items-center justify-center mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${
                                i < review.stars
                                  ? "text-orange-400 fill-current dark:text-orange-400"
                                  : "text-muted fill-current dark:text-background"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-lg mb-4">"{review.text}"</p>
                        <p className="font-semibold">
                          - {review.user.first_name} {review.user.last_name}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden sm:block">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </Carousel>
        </section>
      </main>
    </>
  );
}
