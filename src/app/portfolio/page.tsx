"use client"

import { useState } from "react"
import BookList from "@/components/common/bookList"
import SearchBar from "@/components/common/searchBar"
import AddBookModal from "@/components/common/addBookModal"

import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { useSession } from "next-auth/react"

import type { TBook } from "@/components/common/bookList"

export default function Portfolio() {
  const { data: session } = useSession();
  const [books, setBooks] = useState<TBook[]>([]);
  const currentPage = 1;
  const booksPerPage = 10;
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);

  const handleAddBook = (newBook: TBook) => {
    setBooks((prevBooks) => [newBook, ...prevBooks]);
  };
  console.log(books);

  return (
    <div className="flex flex-col bg-gradient-to-br from-black to-violet min-h-screen text-white">
      <main className="flex flex-col flex-grow items-center p-4 pt-20">
        <div className="w-full max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="font-bold text-4xl">Book Portfolio</h1>
            <div className="flex items-center space-x-4">
              <SearchBar />
              {
                session?.user?.email ?
                <Button onClick={() => setIsAddBookModalOpen(true)} className="bg-white hover:bg-gray-200 text-violet">
                  <PlusCircle className="mr-2 w-5 h-5" />
                  Add New Book
                </Button>
                :
                <Button disabled className="bg-gray-200 text-gray-500">
                  <PlusCircle className="mr-2 w-5 h-5" />
                  Login to add Book
                </Button>
              }
            </div>
          </div>
          <BookList initialPage={currentPage} pageSize={booksPerPage} />
        </div>
      </main>
      <AddBookModal isOpen={isAddBookModalOpen} setIsOpen={setIsAddBookModalOpen} userId={session?.user?.id ?? "0"} onBookAdded={handleAddBook} />
    </div>
  )
}

