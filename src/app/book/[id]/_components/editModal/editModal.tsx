"use client";
import dynamic from "next/dynamic";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Pencil } from "lucide-react";

import { Controller, useForm } from "react-hook-form";
import { Slider } from "@/components/ui/slider";
import { addBookFormSchemaResolver, TAddBookFormType } from "@/components/common/addBookModal/addBookModal.helper";

import { updateBook } from "@/lib/repositories/book.repository";
import { toast } from "sonner";

import "react-quill/dist/quill.snow.css";

import { IEditModalProps } from "./editModal.types";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
  
const EditModal = ({ id, title, rating, description, author }: IEditModalProps) => {
  const { control, handleSubmit, reset } = useForm<TAddBookFormType>({
    resolver: addBookFormSchemaResolver,
    defaultValues: { title, rating, description, author },
  })

  const onSubmit = async (data: TAddBookFormType) => {
    reset(data)
    const response = await updateBook(id, data);
    if(response){
        toast.success("Book updated successfully");
    } else {
        toast.error("Error updating book");
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex flex-row gap-3 cursor-pointer">
          <Pencil className="mr-2 w-4 h-4" />
          <span>Edit this book</span>
        </div>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 text-white sm:max-w-[425px] overflow-y-auto h-[70vh] mr-4">
          <DialogHeader>
            <DialogTitle>Edit Book</DialogTitle>
            <DialogDescription>
              Make changes to your book details. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="title" className="block mb-1 font-medium text-sm">
                Title
              </Label>
              <Controller
                control={control}
                name="title"
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      id="title"
                      {...field}
                      className={`border-gray-700 bg-gray-800 text-white ${
                        fieldState.error ? "border-red-500" : ""
                      }`}
                    />
                    {fieldState.error && (
                      <span className="text-red-500 text-sm">
                        {fieldState.error.message}
                      </span>
                    )}
                  </>
                )}
              />
            </div>

            <div>
              <Label htmlFor="author" className="block mb-1 font-medium text-sm">
                Author
              </Label>
              <Controller
                control={control}
                name="author"
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      id="author"
                      {...field}
                      className={`border-gray-700 bg-gray-800 text-white ${
                        fieldState.error ? "border-red-500" : ""
                      }`}
                    />
                    {fieldState.error && (
                      <span className="text-red-500 text-sm">
                        {fieldState.error.message}
                      </span>
                    )}
                  </>
                )}
              />
            </div>

            <div>
              <Label htmlFor="rating" className="block mb-1 font-medium text-sm">
                Rating (0-5)
              </Label>
              <Controller
                control={control}
                name="rating"
                render={({ field }) => (
                  <div className="my-4">
                    <Slider
                      id="rating"
                      max={5}
                      step={1}
                      value={[field.value]}
                      onValueChange={(value: number[]) => field.onChange(value[0])}
                      className="w-full"
                    />
                    <span>⭐ {field.value}</span>
                  </div>
                )}
              />
            </div>

            <div>
              <Label htmlFor="description" className="block mb-1 font-medium text-sm">
                Description
              </Label>
              <Controller
                control={control}
                name="description"
                render={({ field }) => (
                  <ReactQuill
                    theme="snow"
                    value={field.value}
                    onChange={field.onChange}
                    className="bg-gray-800 text-white border border-gray-700 rounded-md"
                  />
                )}
              />
            </div>

            <Button type="submit" className="w-full bg-white text-purple-500 hover:bg-purple-500 hover:text-white">
              <Pencil className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </form>
          <DialogFooter>
            <DialogClose asChild>
            <Button type="submit" className="my-2 hover:bg-white hover:text-black duration-300 w-full">Cancel changes</Button>
            </DialogClose>
          </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
 
export default EditModal;
