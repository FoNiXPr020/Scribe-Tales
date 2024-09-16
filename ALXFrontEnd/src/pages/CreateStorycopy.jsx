"use client";

import React, { useState, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent
} from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  UploadIcon, BrushIcon, PenToolIcon, XIcon, DiscIcon
} from "@/components/ui/Icons";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem, SelectLabel
} from "@/components/ui/select";
import CreateStorySkeleton from "@/components/skeletons/CreateStorySkeleton";
import grammarChecker from "@/utils/grammarChecker";
import generateImageLocal from "@/utils/generateImageLocal";

const genreList = [
  "Fantasy Writer", "Historical Fiction", "Sci-Fi Writer", "Romance Writer",
  "Dystopian Writer", "Mystery Writer", "Poetry Writer", "Science Fiction Writer",
  "Paranormal Writer", "Suspense Writer", "Thriller Writer", "Fiction Writer",
  "Horror Writer"
];

export default function CreateStory() {
  const [storyTitle, setStoryTitle] = useState("");
  const [storyDescription, setStoryDescription] = useState("");
  const [storyGenre, setStoryGenre] = useState("");
  const [errors, setErrors] = useState([]);
  const [isLoadingGrammarCheck, setIsLoadingGrammarCheck] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [grammarOutput, setGrammarOutput] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 200); // Simulate a loading delay
    return () => clearTimeout(timer);
  }, []);

  const handleCloseModal = () => setShowModal(false);

  const handleApplyChanges = () => {
    setErrors([]);
    setStoryDescription(grammarOutput);
    setShowModal(false);
  };

  const handleGenerateImage = async (event) => {
    event.preventDefault();
    setErrors([]);
    if (isGeneratingImage) {
      setErrors([{ message: "Please wait while the image is being generated" }]);
      return;
    }
    if (!storyDescription || storyDescription.length <= 100) {
      setErrors([{ message: "Story length should be longer than 100 characters" }]);
      return;
    }
    setIsGeneratingImage(true);
    try {
      const imageUrl = await generateImageLocal(storyDescription);
      setImageFile(imageUrl);
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleGrammarChecker = async (event) => {
    event.preventDefault();
    if (isLoadingGrammarCheck) return;
    await grammarChecker(
      storyDescription, setErrors, setGrammarOutput, setIsLoadingGrammarCheck, setShowModal
    );
  };

  const handleRegenerateGrammar = async () => {
    await grammarChecker(
      grammarOutput, setErrors, setGrammarOutput, setIsLoadingGrammarCheck, setShowModal
    );
  };

  const handleShare = (event) => {
    event.preventDefault();
    setErrors([]);
    if (!storyTitle) {
      setErrors([{ message: "Please enter a story title" }]);
      return;
    }
    if (!storyDescription || storyDescription.length <= 100) {
      setErrors([{ message: "Story length should be longer than 100 characters" }]);
      return;
    }
    if (!imageFile) {
      setErrors([{ message: "Please generate or upload an image" }]);
      return;
    }
    if (!storyGenre) {
      setErrors([{ message: "Please select a genre" }]);
      return;
    }
    const data = {
      title: storyTitle, writer_type: storyGenre, image: imageFile, content: storyDescription
    };
    console.log(data);
  };

  const handleImageUpload = (event) => {
    setErrors([]);
    const file = event.target.files[0];
    if (file) {
      setImageFile(URL.createObjectURL(file));
    }
  };

  const handleImageClick = () => fileInputRef.current?.click();

  if (loading) {
    return <CreateStorySkeleton />;
  }

  return (
    <main className="flex-1">
      <section className="w-full py-12 md:py-12 lg:py-16">
        <div className="container px-4 md:px-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Unleash Your Imagination with Scribe Tales
            </h1>
            <p className="mt-4 text-muted-foreground md:text-xl">
              Create and share your captivating stories with the world. Our platform empowers you to bring your literary visions to life.
            </p>
          </div>
          <div className="mt-12 flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <Card className="rounded-xl">
                <CardHeader>
                  <CardTitle>Create a New Story</CardTitle>
                  <CardDescription>Fill in the details and let your creativity flow.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="grid gap-4" encType="multipart/form-data" onSubmit={(e) => e.preventDefault()}>
                    <Input
                      placeholder="Story Title"
                      value={storyTitle}
                      onChange={(e) => setStoryTitle(e.target.value)}
                    />
                    <Textarea
                      placeholder="Story Description"
                      rows={6}
                      value={storyDescription}
                      onChange={(e) => setStoryDescription(e.target.value)}
                    />
                    <Select
                      onValueChange={(value) => setStoryGenre(value)}
                      defaultValue={storyGenre}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a genre" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Genre</SelectLabel>
                          {genreList.map((genre) => (
                            <SelectItem key={genre} value={genre} className="capitalize">
                              {genre}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleImageClick}
                        className="flex items-center"
                      >
                        <UploadIcon className="h-4 w-4 mr-2" />
                        Upload Image
                      </Button>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        ref={fileInputRef}
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleGenerateImage}
                        disabled={isGeneratingImage}
                        className="flex items-center"
                      >
                        {isGeneratingImage ? (
                          <Loader2 className="h-5 w-5 mx-auto animate-spin" />
                        ) : (
                          <>
                            <BrushIcon className="h-4 w-4 mr-2" />
                            Generate Image
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleGrammarChecker}
                        disabled={isLoadingGrammarCheck}
                        className={`flex items-center ${isLoadingGrammarCheck ? "cursor-not-allowed" : ""}`}
                      >
                        {isLoadingGrammarCheck ? (
                          <Loader2 className="h-5 w-5 mx-auto animate-spin" />
                        ) : (
                          <>
                            <PenToolIcon className="h-4 w-4 mr-2" />
                            Grammar Check
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                  {errors.length > 0 && (
                    <div className="mt-4">
                      {errors.map((error, index) => (
                        <h2 key={index} className="text-sm md:text-medium font-semibold tracking-tight text-red-600">
                          <strong>Oops!</strong> {error.message}
                        </h2>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            <div className="flex-1">
              <Card className="rounded-xl">
                <CardHeader>
                  <CardTitle>Story Preview</CardTitle>
                  <CardDescription>See how your story will look before sharing.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <img
                      src={imageFile || "/placeholder.svg"}
                      alt="Story Image"
                      width={400}
                      height={225}
                      className="object-cover w-full h-72 rounded-xl shadow-xl"
                    />
                    <div>
                      <h3 className="text-lg font-semibold">A Magical Adventure Awaits</h3>
                      <p className="text-muted-foreground">
                        Embark on a captivating journey through a world of wonder and enchantment. Discover the hidden secrets that lie within the pages of this enchanting tale.
                      </p>
                    </div>
                    <Button
                      type="submit"
                      onClick={handleShare}
                      className="w-full"
                    >
                      Share Story
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-[400px] md:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Apply Grammar Changes</DialogTitle>
            <DialogDescription>Are you sure you want to apply the grammar changes?</DialogDescription>
          </DialogHeader>
          <div className="px-0 py-6">
            <Textarea
              value={grammarOutput}
              onChange={(e) => setGrammarOutput(e.target.value)}
              placeholder="Story text"
              className="min-h-[200px]"
            />
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              className="gap-1"
              onClick={handleCloseModal}
            >
              <XIcon className="h-5 w-5" />
              Close
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRegenerateGrammar}
              disabled={isLoadingGrammarCheck}
              className={`flex items-center ${isLoadingGrammarCheck ? "cursor-not-allowed" : ""}`}
            >
              {isLoadingGrammarCheck ? (
                <Loader2 className="h-5 w-5 mx-auto animate-spin" />
              ) : (
                <>
                  <PenToolIcon className="h-4 w-4 mr-2" />
                  Regenerate Grammar
                </>
              )}
            </Button>
            <Button className="gap-2" onClick={handleApplyChanges}>
              <DiscIcon className="h-5 w-5" />
              Apply Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
