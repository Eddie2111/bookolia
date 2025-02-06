import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, PlusCircle } from "lucide-react";

export default function Home() {
  return (
    <div className='flex flex-col justify-center items-center bg-gradient-to-br from-black to-violet p-4 min-h-screen text-white'>
      <main className='w-full max-w-4xl text-center'>
        <h1 className='mb-6 font-bold text-6xl'>BookFolio</h1>
        <p className='mb-12 text-xl'>
          Your personal book collection, curated and shared.
        </p>
        <div className='flex justify-center space-x-6'>
          <Button
            asChild
            size='lg'
            className='bg-white hover:bg-gray-200 text-violet'
          >
            <Link href='/portfolio'>
              <BookOpen className='mr-2 w-5 h-5' />
              View Portfolio
            </Link>
          </Button>
          <Button
            asChild
            size='lg'
            variant='outline'
            className='border-white hover:bg-white/10 text-white'
          >
            <Link href='/upload'>
              <PlusCircle className='mr-2 w-5 h-5' />
              Add New Book
            </Link>
          </Button>
        </div>
      </main>
      <footer className='mt-16 text-gray-400 text-sm'>
        © 2023 BookFolio. All rights reserved.
      </footer>
    </div>
  );
}
