"use client";
import dynamic from "next/dynamic";

import { useSession } from "next-auth/react";
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Ellipsis, Pencil, Trash } from "lucide-react";


import { useState } from "react";

import { Controller, useForm } from "react-hook-form";
import { Slider } from "@/components/ui/slider";
import { addBookFormSchemaResolver, TAddBookFormType } from "@/components/common/addBookModal/addBookModal.helper";
import { ScrollArea } from "@/components/ui/scroll-area";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import { deleteBook, updateBook } from "@/lib/repositories/book.repository";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type TBookDetails = {
    id: string;
    title: string;
    author: string;
    rating: number;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

const BookOptions = ({bookDetails}: {bookDetails: TBookDetails}) => {
    const { data: session } = useSession();
    if (session?.user && bookDetails) {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant='ghost'
                        className='relative rounded-full w-8 h-8'
                    >
                        <Ellipsis />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-56' align='end' forceMount>
                    <DropdownMenuItem className="pt-3" onSelect={(e) => e.preventDefault()}>
                        <EditModal 
                            id={bookDetails.id}
                            title={bookDetails.title} 
                            rating={bookDetails.rating} 
                            description={bookDetails.description} 
                            author={bookDetails.author}
                        />
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <DeleteModal id={bookDetails.id}/>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }
}

interface EditModalProps {
  id: string
  title: string
  rating: number
  description: string
  author: string
}
  
const EditModal = ({ id, title, rating, description, author }: EditModalProps) => {
  const { control, handleSubmit, reset } = useForm<TAddBookFormType>({
    resolver: addBookFormSchemaResolver,
    defaultValues: { title, rating, description, author },
  })

  const onSubmit = async (data: TAddBookFormType) => {
    reset(data)
    await updateBook(id, data);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex flex-row gap-3 cursor-pointer">
          <Pencil className="mr-2 w-4 h-4" />
          <span>Edit this book</span>
        </div>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 text-white sm:max-w-[425px] overflow-y-auto h-[60vh] mr-4">
        <ScrollArea>
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
            <Button type="submit" className="my-2 hover:bg-white hover:text-black duration-300">Cancel changes</Button>
            </DialogClose>
          </DialogFooter>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
  

const DeleteModal = ({id}:{id:string;}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleDelete=async()=>{
    setIsLoading(true);
    const response = await deleteBook(id);
    if(response){
      setIsLoading(false);
      setOpen(false);
      toast.success("Book deleted successfully");
      router.push('/portfolio');
    } else {
      setIsLoading(false);
      toast.error("Something went wrong, cannot delete book");
    }
    
  }
    return (
      <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex flex-row gap-3 text-red-500 cursor-pointer">
          <Trash className="mr-2 w-4 h-4" />
          <span>Delete this book</span>
        </div>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 max-w-[425px] text-white">
        <DialogHeader>
          <DialogTitle>Delete book</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to delete this book?</p>
        <DialogFooter className="flex flex-row justify-end gap-3">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button
            onClick={handleDelete}
            variant="destructive"
            className="bg-white text-red-600 hover:bg-red-300 border-1 border-slate-300"
            disabled={isLoading}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    )
}

export default BookOptions;