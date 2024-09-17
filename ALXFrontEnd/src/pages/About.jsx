import React from "react";
import { Link } from "react-router-dom";
import {
  FeatherIcon,
  UsersIcon,
  BookIcon,
  ScalingIcon,
} from "@/components/ui/Icons";
import { useTheme } from "@/ThemeContext";
import AdvancedMotion from "@/components/motions/AdvancedMotion";
import { AnimatePresence, motion } from "framer-motion";
import Page from "@/Page";
export default function About() {
  const { theme } = useTheme();
  return (
    <AnimatePresence>
      <Page title="About" />
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">
          <section className="w-full py-12 md:py-6">
            <AdvancedMotion direction="top">
              <div className="space-y-3">
                <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-center">
                  About
                </h2>
                <p className="text-center">
                  Discover the story behind our platform. What is Scribe Tales?
                  and what does it mean?
                </p>
              </div>
            </AdvancedMotion>

            <div className="container grid gap-12 py-12 px-4 md:px-6 lg:grid-cols-2 lg:gap-24">
              <AdvancedMotion direction="left">
                <h1 className="mt-2 text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Scribe Tales
                </h1>
                <p className="mt-4 text-muted-foreground md:text-xl">
                  Scribe Tales is a platform that celebrates the art of
                  storytelling. We believe in the power of words to inspire,
                  entertain, and connect people from all walks of life.
                </p>
                <p className="mt-4 text-muted-foreground md:text-xl">
                  Our mission is to provide a space for writers, both aspiring
                  and established, to share their unique perspectives and
                  captivating tales. We curate a diverse collection of stories
                  that span various genres, from heartwarming memoirs to
                  thrilling adventures.
                </p>
                <p className="mt-4 text-muted-foreground md:text-xl">
                  At Scribe Tales, we are committed to fostering a vibrant
                  community of storytellers and readers. We offer resources,
                  workshops, and opportunities for writers to hone their craft
                  and connect with like-minded individuals.
                </p>
                <div className="mt-10">
                  <motion.button
                    transition={{ duration: 0.2 }}
                    whileHover={{ scale: 1.1 }}
                    className="p-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Link to="/explore" className="w-full sm:w-auto">
                      Explore Stories
                    </Link>
                  </motion.button>
                </div>
              </AdvancedMotion>

              <div className="flex overflow-hidden rounded-xl items-center justify-center">
                <AdvancedMotion
                  direction="bottom"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.img
                    src="/assets/main/about-1.png"
                    width="550"
                    height="550"
                    alt="About"
                    className="mx-auto aspect-square object-cover object-center sm:w-full"
                  />
                </AdvancedMotion>
              </div>
            </div>
          </section>

          <section
            className={`w-full ${
              theme === "light" ? "bg-background" : "bg-muted"
            } py-12 md:py-24 lg:py-32`}
          >
            <div className="container grid gap-12 px-4 md:px-6 lg:grid-cols-2 lg:gap-24">
              <div className="flex overflow-hidden rounded-xl items-center justify-center">
                <AdvancedMotion
                  direction="left"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src="/assets/main/about-2.png"
                    width="550"
                    height="550"
                    alt="Mission"
                    className="mx-auto aspect-square object-cover object-center sm:w-full"
                  />
                </AdvancedMotion>
              </div>

              <AdvancedMotion direction="top">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-6xl">
                  Our Mission
                </h2>
                <p className="mt-4 text-muted-foreground md:text-xl">
                  At Scribe Tales, our mission is to create a vibrant and
                  inclusive community of storytellers and readers. We believe
                  that the power of storytelling has the ability to transcend
                  boundaries, foster empathy, and inspire positive change.
                </p>
                <p className="mt-4 text-muted-foreground md:text-xl">
                  Through our platform, we aim to provide a space for writers to
                  share their unique voices and perspectives, and for readers to
                  discover captivating tales that challenge their assumptions
                  and broaden their horizons.
                </p>
                <p className="mt-4 text-muted-foreground md:text-xl">
                  We are committed to supporting writers at all stages of their
                  journey, offering resources, workshops, and opportunities to
                  connect with fellow storytellers. By cultivating a diverse and
                  thriving community, we hope to inspire a love of reading and
                  writing that will last a lifetime.
                </p>
              </AdvancedMotion>
            </div>
          </section>

          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container grid gap-12 px-4 md:px-6 lg:grid-cols-2 lg:gap-24">
              <AdvancedMotion direction="top">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-6xl">
                  Our Values
                </h2>
                <p className="mt-4 text-muted-foreground md:text-xl">
                  At the heart of Scribe Tales are a set of core values that
                  guide our actions and shape the community we strive to build.
                </p>
                <ul className="mt-6 space-y-4">
                  {[
                    {
                      icon: FeatherIcon,
                      title: "Creativity",
                      description:
                        "We believe in the power of creativity to transform lives and inspire change. We encourage and celebrate the unique voices and perspectives of our writers.",
                    },
                    {
                      icon: UsersIcon,
                      title: "Inclusivity",
                      description:
                        "We strive to create a welcoming and inclusive community that celebrates diversity and fosters a sense of belonging for all.",
                    },
                    {
                      icon: BookIcon,
                      title: "Storytelling",
                      description:
                        "We believe that storytelling has the power to connect people, foster empathy, and inspire positive change. We are dedicated to nurturing and celebrating the art of storytelling.",
                    },
                    {
                      icon: ScalingIcon,
                      title: "Growth",
                      description:
                        "We are committed to supporting the growth and development of our writers, providing them with the resources and opportunities they need to hone their craft and reach new heights.",
                    },
                  ].map((value, index) => (
                    <li key={index} className="flex items-start gap-4">
                      <div className="flex h-28 w-28 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <value.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{value.title}</h3>
                        <p className="text-muted-foreground">
                          {value.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </AdvancedMotion>

              <div className="flex overflow-hidden rounded-xl items-center justify-center">
                <AdvancedMotion
                  direction="bottom"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src="/assets/main/about-3.png"
                    width="550"
                    height="550"
                    alt="Values"
                    className="mx-auto aspect-square object-cover object-center sm:w-full"
                  />
                </AdvancedMotion>
              </div>
            </div>
          </section>
        </main>
      </div>
    </AnimatePresence>
  );
}
