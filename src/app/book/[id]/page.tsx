import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getBookById } from "@/lib/repositories/book.repository";
import BookOptions from "./_component";

import dynamic from "next/dynamic";

const LongText = dynamic(() => import("@/components/common/richText"), { ssr: false });

export default async function BookDetails({ params }: { params: { id: string } }) {
  const book = await getBookById(params.id);

  if (!book) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-black to-violet text-white">
        <div className="mt-32">No books found</div>
      </div>
    );
  }


  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black to-violet text-white">
      <main className="flex-grow flex flex-col items-center p-4 pt-20">
        <div className="w-full max-w-4xl">
          <Card className="bg-white/10 text-white border-none">
            <CardHeader className="flex flex-row justify-between">
              <CardTitle className="text-3xl">{book.title}</CardTitle>
              <BookOptions bookDetails={book}/>
            </CardHeader>
            <CardContent>
              <p className="text-xl text-gray-300 mb-4">{book.author}</p>
              <p className="text-gray-400">Rating: {book.rating}</p>
              <p className="text-gray-400">Written By: {book.author}</p>
              <LongText longText={book.description} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}