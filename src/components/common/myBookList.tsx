"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getBooksByUserId } from "@/lib/repositories/book.repository";
import Pagination from "@/components/common/pagination";
import RichText from "./richText";
import { useSession } from "next-auth/react";

export type TBook = {
  id: string;
  title: string;
  author: string;
  description: string;
  rating?: number;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
};

export default function MyBookList({ initialPage = 1, pageSize = 10 }) {
  const [books, setBooks] = useState<TBook[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { data: session } = useSession();

  useEffect(() => {
    async function fetchBooks() {
      setLoading(true);
      setError("");
      try {
        const { books, totalPages } = await getBooksByUserId(
          session?.user?.id ?? "",
          page,
          pageSize,
        );
        if (books) {
          setBooks(books as TBook[]);
          setTotalPages(totalPages);
        }
      } catch (err) {
        console.log(err);
        setError("Failed to fetch books.");
      }
      setLoading(false);
    }
    fetchBooks();
  }, [page, pageSize, session?.user?.id, session?.user]);

  if (loading) return <p className="text-white">Loading books...</p>;
  if (error)
    return <p className="text-red-500">{error}, you are not logged in</p>;

  if (books.length < 1) {
    return (
      <p className="text-white">
        You have added no books, add one to make appear here
      </p>
    );
  }
  return (
    <div>
      <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-8">
        {books.map(book => (
          <Link href={`/book/${book.id}`} key={book.id}>
            <Card className="flex flex-col bg-white/10 hover:bg-white/20 border-none h-full text-white transition-colors cursor-pointer">
              <CardHeader className="flex-grow">
                <CardTitle className="line-clamp-2">{book.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-2 line-clamp-1 text-gray-300">{book.author}</p>
                <RichText longText={book.description} truncate={true} />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <Pagination
          currentPage={page}
          setCurrentPage={setPage}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}
