import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getBookById } from "@/lib/repositories/book.repository";
import BookOptions from "./_components/bookOptions";
import { getUserById } from "@/lib/repositories/user.repository";
import Link from "next/link";

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
  const addByUserName = await getUserById(book.userId);

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <>
        {Array(fullStars).fill("⭐").map((star, index) => (
          <span key={`full-${index}`}>{star}</span>
        ))}
        {hasHalfStar && <span>⭐️</span>}
        {Array(emptyStars).fill("☆").map((star, index) => (
          <span key={`empty-${index}`}>{star}</span>
        ))}
      </>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black to-violet text-white">
      <main className="flex-grow flex flex-col items-center p-4 pt-20">
        <div className="w-full max-w-4xl">
          <Card className="bg-white/10 text-white border-none">
            <CardHeader className="flex flex-row justify-between">
              <CardTitle className="text-3xl">{book.title}</CardTitle>
              <BookOptions bookDetails={book} />
            </CardHeader>
            <CardContent>
              <p className="text-xl text-gray-300 mb-4">{book.author}</p>
              <p className="text-gray-400">
                Rating: {renderStars(book.rating)}
              </p>
              <p className="text-gray-400 mb-6">Written By: {book.author}</p>
              <LongText longText={book.description} />
            </CardContent>
            <p className="px-5 py-2">
              This book was added by: {addByUserName?.name}
              <br />
              Click here to&nbsp;
              <Link href={`mailto:${addByUserName?.email}`} className="underline hover:underline">
                Contact
              </Link>
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
}