"use client";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Ellipsis } from "lucide-react";

import EditModal from "../editModal";
import DeleteModal from "../deleteModal";

import { TBookDetails } from "./bookModal.types";
import "react-quill/dist/quill.snow.css";

const BookOptions = ({ bookDetails }: { bookDetails: TBookDetails }) => {
  const { data: session } = useSession();
  if (session?.user && bookDetails) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative rounded-full w-8 h-8">
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuItem className="pt-3" onSelect={e => e.preventDefault()}>
            <EditModal
              id={bookDetails.id}
              title={bookDetails.title}
              rating={bookDetails.rating}
              description={bookDetails.description}
              author={bookDetails.author}
            />
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={e => e.preventDefault()}>
            <DeleteModal id={bookDetails.id} />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
};

export default BookOptions;
