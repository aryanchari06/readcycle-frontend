"use client";

import FileUploader from "@/components/FileUploader";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { bookRequestSchema } from "@/lib/zodSchema";
import { useUserStore } from "@/store/useUserStore";
import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderPinwheel, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ClientUploadedFileData } from "uploadthing/types";
import { GQLMutations } from "@/graphql/Mutations";

const Page = () => {
  const Genre = [
    "FICTION",
    "NON_FICTION",
    "MYSTERY",
    "FANTASY",
    "SCIENCE_FICTION",
    "ROMANCE",
    "THRILLER",
    "HORROR",
    "HISTORY",
    "BIOGRAPHY",
    "SELF_HELP",
    "POETRY",
    "BUSINESS",
    "RELIGION",
    "ART",
    "GRAPHIC_NOVEL",
    "CHILDREN",
    "YOUNG_ADULT",
    "EDUCATIONAL",
    "CLASSICS",
    "PHILOSOPHY",
    "HEALTH",
    "COOKING",
    "TRAVEL",
    "SPORTS",
  ];
  const router = useRouter();
  const [isMediaUploading, setIsMediaUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<
    ClientUploadedFileData<{ uploadedBy: string | undefined }>[]
  >([]);
  const [imagesMessage, setImagesMessage] = useState("");
  const [makeBookRequest, { loading }] = useMutation(
    GQLMutations.MAKE_BOOK_REQUEST
  );

  const user = useUserStore((state) => state.user);

  const requestForm = useForm({
    resolver: zodResolver(bookRequestSchema),
    defaultValues: {
      title: "",
      author: "",
      genre: "",
      description: "",
      price: 10,
    },
  });

  useEffect(() => {
    if (images.length > 5) {
      setImagesMessage("You can upload a maximum of 5 images/videos.");
    }
    console.log("images", images);
  }, [images]);

  const makeRequest = async (data: any) => {
    // console.log(data);
    const imgUrls = images.map((img) => img.url);
    data.media = imgUrls;
    console.log("data:", data);

    try {
      const response = await makeBookRequest({ variables: data });
      const requestId = await response.data.createBookRequest;
      router.replace(`/view-book/${requestId}`);
    } catch (error) {
      console.error(error);
      throw new Error("Failed to create book request");
    }
  };

  const deleteImage = (fileKey: string) => {
    setImages((prevImages) => prevImages.filter((img) => img.key !== fileKey));
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 bg-[#FDF6EC]">
        <h1 className="text-lg font-medium text-[#5D4037] text-center">
          User is unauthorized to make this request.
        </h1>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8 my-10">
      <h1 className="text-4xl font-semibold text-[#5D4037] mb-6 text-center sm:text-left">
        Sell Your Book
      </h1>
      <FormProvider {...requestForm}>
        <form
          onSubmit={requestForm.handleSubmit(makeRequest)}
          className="space-y-6 bg-white shadow-md rounded-lg p-6 sm:p-8"
        >
          <FormField
            control={requestForm.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#5D4037]">Book Title:</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter the book title"
                    {...field}
                    className="p-3 rounded-md w-full outline-none "
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={requestForm.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#5D4037]">Author:</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter the author's name"
                    {...field}
                    className="p-3  w-full outline-none border"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={requestForm.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#5D4037]">Description:</FormLabel>
                <FormControl>
                  <textarea
                    {...field}
                    placeholder="Enter the book description"
                    className="p-3 rounded-md w-full outline-none border resize-none min-h-[100px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={requestForm.control}
            name="genre"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#5D4037]">Genre:</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="p-3 border rounded-md w-full focus:outline-none "
                  >
                    <option value="" disabled>
                      Select a genre
                    </option>
                    {Genre.map((genre) => (
                      <option value={genre} key={genre}>
                        {genre}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={requestForm.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#5D4037]">Price (in ₹):</FormLabel>
                <FormControl>
                  <input
                    {...field}
                    type="number"
                    step="1"
                    min="10"
                    placeholder="Enter price"
                    className="p-3 border rounded-md w-full focus:outline-none"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <p className="text-[#5D4037] text-sm my-2 text-center sm:text-left">
              *Upload up to 5 images/videos of your book.
            </p>

            <FileUploader
              onUpload={(response) => {
                //@ts-ignore
                setImages((prev) => [...prev, { url: response }]);
              }}
            />
          </div>

          {imagesMessage && (
            <p className="text-sm text-red-500 mt-2">{imagesMessage}</p>
          )}
          {images.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {images.map((image) => (
                <div
                  key={image.url}
                  className="relative bg-gray-100 border border-[#8D6E63] rounded-md overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => deleteImage(image.key)}
                    className="absolute top-2 right-2 bg-[#5D4037] text-white p-1 rounded-full hover:bg-[#4E342E]"
                  >
                    <X size={16} />
                  </button>
                  <img
                    src={image.url}
                    alt="Uploaded file"
                    className="w-full h-[150px] sm:h-[200px] object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting || isMediaUploading}
            className="w-full py-3 bg-[#5D4037] text-white font-medium rounded-md hover:bg-[#4E342E] transition"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <LoaderPinwheel className="animate-spin" />
                Submitting
              </div>
            ) : (
              <>Submit</>
            )}
          </Button>
        </form>
      </FormProvider>
      {errorMessage && <p className="text-red-600 mt-4">{errorMessage}</p>}
    </div>
  );
};

export default Page;
