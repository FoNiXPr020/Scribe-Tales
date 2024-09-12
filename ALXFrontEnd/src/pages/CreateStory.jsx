"use client";

import React, { useState, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  UploadIcon,
  BrushIcon,
  PenToolIcon,
  XIcon,
  DiscIcon,
  FeatherIcon,
} from "@/components/ui/Icons";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
} from "@/components/ui/select";
import CreateStorySkeleton from "@/components/skeletons/CreateStorySkeleton";
import grammarChecker from "@/utils/grammarChecker";
import generateImageLocal from "@/utils/generateImageLocal";
import { storyCreate } from "@/services/storiesApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const genreList = [
  "Fantasy Writer",
  "Historical Fiction",
  "Sci-Fi Writer",
  "Romance Writer",
  "Dystopian Writer",
  "Mystery Writer",
  "Poetry Writer",
  "Science Fiction Writer",
  "Paranormal Writer",
  "Suspense Writer",
  "Thriller Writer",
  "Fiction Writer",
  "Horror Writer",
];

export default function CreateStory() {
  const [FormData, setFormData] = useState({
    storyTitle: "",
    storyDescription: "",
    storyGenre: "",
  });

  const [isLoading, setIsLoading] = useState({
    isLoading: true,
    isLoadingGrammarCheck: false,
    isGeneratingImage: false,
    isCreatingStory: false,
  });

  const [errors, setErrors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [grammarOutput, setGrammarOutput] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [GeneratedImages, setGeneratedImages] = useState([]);

  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(
      () => setIsLoading((prev) => ({ ...prev, isLoading: false })),
      200
    );
    return () => clearTimeout(timer);
  }, []);

  const handleCloseModal = () => setShowModal(false);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleApplyChanges = () => {
    setErrors({});
    setFormData((prevFormData) => ({
      ...prevFormData,
      storyDescription: grammarOutput,
    }));
    setShowModal(false);
  };

  const handleGenerateImage = async (event) => {
    event.preventDefault();
    setErrors([]);

    if (isLoading.isGeneratingImage) {
      setErrors({ image: "Please wait while the image is being generated" });
      return;
    }
    if (!FormData.storyDescription || FormData.storyDescription.length <= 10) {
      setErrors({
        description: "Story length should be longer than 100 characters",
      });
      return;
    }

    setIsLoading((prevLoading) => ({
      ...prevLoading,
      isGeneratingImage: true,
    }));

    try {
      const imageUrl = await generateImageLocal(FormData.storyDescription);
      setImageFile(imageUrl);
      setImagePreview(imageUrl);
      setGeneratedImages((prevImages) =>
        prevImages.length >= 3
          ? [imageUrl, ...prevImages.shift()]
          : [...prevImages, imageUrl]
      );
      // Log the generated image URL in arrays
      console.log("Generated image URL:", imageUrl);
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error(error.message);
    } finally {
      setIsLoading((prevLoading) => ({
        ...prevLoading,
        isGeneratingImage: false,
      }));
    }
  };

  const handleGrammarChecker = async (event) => {
    event.preventDefault();
    if (isLoading.isLoadingGrammarCheck) return;
    await grammarChecker(
      FormData.storyDescription,
      setErrors,
      setGrammarOutput,
      (loading) =>
        setIsLoading((prev) => ({ ...prev, isLoadingGrammarCheck: loading })),
      setShowModal
    );
  };

  const handleRegenerateGrammar = async () => {
    await grammarChecker(
      grammarOutput,
      setErrors,
      setGrammarOutput,
      (loading) =>
        setIsLoading((prev) => ({ ...prev, isLoadingGrammarCheck: loading })),
      setShowModal
    );
  };

  const handleShare = async (event) => {
    event.preventDefault();
    setErrors([]);
    if (!FormData.storyTitle) {
      setErrors({ title: "Please enter a story title" });
      return;
    }
    if (!FormData.storyDescription || FormData.storyDescription.length <= 100) {
      setErrors({
        description: "Story length should be longer than 100 characters",
      });
      return;
    }
    if (!imageFile) {
      setErrors({ image: "Please generate or upload an image" });
      return;
    }
    if (!FormData.storyGenre) {
      setErrors({ genre: "Please select a genre" });
      return;
    }

    setIsLoading((prevLoading) => ({
      ...prevLoading,
      isCreatingStory: true,
    }));

    const formData = new window.FormData();
    formData.append("title", FormData.storyTitle);
    formData.append("writer_type", FormData.storyGenre);
    formData.append("image", imageFile);
    formData.append("content", FormData.storyDescription);

    try {
      const response = await storyCreate(formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 201) {
        setIsLoading((prevLoading) => ({
          ...prevLoading,
          isCreatingStory: false,
        }));

        navigate(`/explore/${response.data.story_id}`);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.error(error);
      setIsLoading((prevLoading) => ({
        ...prevLoading,
        isCreatingStory: false,
      }));
    }
  };

  const handleImageUpload = (event) => {
    setErrors([]);
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageClick = () => fileInputRef.current?.click();

  const setLastImage = (filterImages) => {
    const lastImage =
      filterImages[Math.floor(Math.random() * filterImages.length)];

    return lastImage;
  };

  const handleDeleteImage = async (imageUrl) => {
    const filterV = (prevImages) => {
      const index = prevImages.indexOf(imageUrl);
      const updatedImages = [...prevImages];
      if (index !== -1) {
        updatedImages.splice(index, 1);
      }
      return updatedImages.reverse();
    };

    const filterImages = filterV(GeneratedImages);
    const lastImage = await setLastImage(filterImages);
    setImageFile(lastImage !== null ? lastImage : null);
    setImagePreview(lastImage !== null ? lastImage : null);
    setGeneratedImages(filterImages);
  };

  if (isLoading.isLoading) {
    return <CreateStorySkeleton />;
  }

  const defaultTitle = "A Magical Adventure Awaits";
  const defaultDescription =
    "Embark on a captivating journey through a world of wonder and enchantment. Discover the hidden secrets that lie within the pages of this enchanting tale.";

  return (
    <main className="flex-1">
      <section className="w-full py-12 md:py-12 lg:py-16">
        <div className="container px-4 md:px-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Unleash Your Imagination with Scribe Tales
            </h1>
            <p className="mt-4 text-muted-foreground md:text-xl">
              Create and share your captivating stories with the world. Our
              platform empowers you to bring your literary visions to life.
            </p>
          </div>
          <div className="mt-12 flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <Card className="rounded-xl">
                <CardHeader>
                  <CardTitle>Create a New Story</CardTitle>
                  <CardDescription>
                    Fill in the details and let your creativity flow.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form
                    className="grid gap-4"
                    encType="multipart/form-data"
                    onSubmit={(e) => e.preventDefault()}
                  >
                    <Input
                      name="storyTitle"
                      placeholder="Story Title"
                      value={FormData.storyTitle}
                      onChange={handleFormChange}
                    />
                    {errors.title && (
                      <p className="text-sm text-red-500">{errors.title}</p>
                    )}
                    <Textarea
                      name="storyDescription"
                      placeholder="Story Description"
                      rows={6}
                      value={FormData.storyDescription}
                      onChange={handleFormChange}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-500">
                        {errors.description}
                      </p>
                    )}
                    <Select
                      onValueChange={(value) =>
                        setFormData((prevFormData) => ({
                          ...prevFormData,
                          storyGenre: value,
                        }))
                      }
                      value={FormData.storyGenre}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a genre" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Genre</SelectLabel>
                          {genreList.map((genre) => (
                            <SelectItem
                              key={genre}
                              value={genre}
                              className="capitalize"
                            >
                              {genre}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {errors.genre && (
                      <p className="text-sm text-red-500">{errors.genre}</p>
                    )}
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
                        disabled={isLoading.isGeneratingImage}
                        className="flex items-center"
                      >
                        {isLoading.isGeneratingImage ? (
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
                        disabled={isLoading.isLoadingGrammarCheck}
                        className={`flex items-center ${
                          isLoading.isLoadingGrammarCheck
                            ? "cursor-not-allowed"
                            : ""
                        }`}
                      >
                        {isLoading.isLoadingGrammarCheck ? (
                          <Loader2 className="h-5 w-5 mx-auto animate-spin" />
                        ) : (
                          <>
                            <PenToolIcon className="h-4 w-4 mr-2" />
                            Grammar Check
                          </>
                        )}
                      </Button>
                    </div>

                    {errors.image && (
                      <p className="text-sm text-red-500">{errors.image}</p>
                    )}

                    <Card
                      className={`rounded-xl ${
                        GeneratedImages.length > 0 ? "p-2" : "p-12"
                      }`}
                    >
                      {GeneratedImages.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {GeneratedImages.map((imageUrl, index) => (
                            <div
                              key={index}
                              className="relative overflow-hidden"
                            >
                              <img
                                key={index}
                                src={imageUrl}
                                alt="Generated Images"
                                onClick={() => {
                                  setImageFile(imageUrl);
                                  setImagePreview(imageUrl);
                                }}
                                width={400}
                                height={225}
                                className="object-cover h-26 w-30 rounded-xl shadow-xl cursor-pointer"
                              />
                              <button
                                type="button"
                                className="absolute top-2 right-2 p-1 rounded-full shadow-md bg-background hover:bg-muted"
                                onClick={() => handleDeleteImage(imageUrl)}
                              >
                                <XIcon className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-sm">
                          No Generated Images. Please generate an image first.
                        </p>
                      )}
                    </Card>
                  </form>
                </CardContent>
              </Card>
            </div>
            <div className="flex-1">
              <Card className="rounded-xl">
                <CardHeader>
                  <CardTitle>Story Preview</CardTitle>
                  <CardDescription>
                    See how your story will look before sharing.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <img
                      src={imagePreview || "/stroy-placeholder.png"}
                      alt="Story Image"
                      width={400}
                      height={225}
                      className="object-cover w-full h-full rounded-xl shadow-xl"
                    />
                    <div>
                      <h3 className="mt-4 text-lg font-semibold">
                        {FormData.storyTitle || defaultTitle}
                      </h3>
                      <p className="mt-4 text-muted-foreground whitespace-pre-line whitespace-pre-wrap">
                        {FormData.storyDescription || defaultDescription}
                      </p>
                    </div>
                    <Button
                      onClick={handleShare}
                      disabled={isLoading.isCreatingStory}
                      className={`w-full mt-2 items-center gap-2 ${
                        isLoading.isCreatingStory ? "cursor-not-allowed" : ""
                      }`}
                    >
                      {isLoading.isCreatingStory ? (
                        <Loader2 className="h-5 w-5 mx-auto animate-spin" />
                      ) : (
                        <>
                          <FeatherIcon className="h-4 w-4" />
                          Share Story
                        </>
                      )}
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
            <DialogDescription>
              Are you sure you want to apply the grammar changes?
            </DialogDescription>
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
              disabled={isLoading.isLoadingGrammarCheck}
              className={`flex items-center ${
                isLoading.isLoadingGrammarCheck ? "cursor-not-allowed" : ""
              }`}
            >
              {isLoading.isLoadingGrammarCheck ? (
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
