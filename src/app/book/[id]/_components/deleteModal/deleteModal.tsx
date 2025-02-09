"use client";
import { useState } from "react";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

import { Trash } from "lucide-react";

import { deleteBook } from "@/lib/repositories/book.repository";

import "react-quill/dist/quill.snow.css";

const DeleteModal = ({ id }: { id: string; } ) => {
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

export default DeleteModal;
