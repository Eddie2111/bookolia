import { prisma } from "@/lib/prisma";

// ✅ Create a book
export async function createBook(data: { title: string; author: string; rating?: number; userId: string }) {
    try {
        // Validate input data
        if (!data.title || !data.author || !data.userId) {
            throw new Error("Title, author, and userId are required.");
        }

        // Ensure rating is within valid range (0-5)
        if (data.rating !== undefined && (data.rating < 0 || data.rating > 5)) {
            throw new Error("Rating must be between 0 and 5.");
        }

        // Create the book
        return await prisma.book.create({
            data,
        });
    } catch (err) {
        const error = err as { code: string };
        console.error("Error creating book:", error);
        throw error; // Re-throw the error for the caller to handle
    }
}

// ✅ Get all books (optionally filter by user, with pagination)
export async function getBooks(userId?: string, page = 1, pageSize = 10) {
    try {
        const skip = (page - 1) * pageSize;

        // Fetch books with pagination and optional filtering by userId
        const [books, total] = await prisma.$transaction([
            prisma.book.findMany({
                where: userId ? { userId } : undefined,
                orderBy: { createdAt: "desc" },
                skip,
                take: pageSize,
                select: {
                    id: true,
                    title: true,
                    author: true,
                    rating: true,
                    createdAt: true,
                    updatedAt: true,
                },
            }),
            prisma.book.count({ where: userId ? { userId } : undefined }),
        ]);

        return {
            books,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
        };
    } catch (err) {
        const error = err as { code: string };
        console.error("Error fetching books:", error);
        throw error;
    }
}

// ✅ Get a single book by ID
export async function getBookById(id: string) {
    try {
        // Validate input
        if (!id) {
            throw new Error("Book ID is required.");
        }

        // Fetch the book
        const book = await prisma.book.findUnique({
            where: { id },
            select: {
                id: true,
                title: true,
                author: true,
                rating: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!book) {
            throw new Error("Book not found.");
        }

        return book;
    } catch (err) {
        const error = err as { code: string };
        console.error("Error fetching book by ID:", error);
        throw error;
    }
}

// ✅ Update a book
export async function updateBook(id: string, data: { title?: string; author?: string; rating?: number }) {
    try {
        // Validate input
        if (!id) {
            throw new Error("Book ID is required.");
        }

        // Ensure rating is within valid range (0-5)
        if (data.rating !== undefined && (data.rating < 0 || data.rating > 5)) {
            throw new Error("Rating must be between 0 and 5.");
        }

        // Update the book
        const updatedBook = await prisma.book.update({
            where: { id },
            data,
        });

        return updatedBook;
    } catch (err) {
        const error = err as { code: string };
        if (error.code === "P2025") {
            throw new Error("Book not found.");
        }
        console.error("Error updating book:", error);
        throw error;
    }
}

// ✅ Delete a book
export async function deleteBook(id: string) {
    try {
        // Validate input
        if (!id) {
            throw new Error("Book ID is required.");
        }

        // Delete the book
        await prisma.book.delete({ where: { id } });
    } catch (err) {
        const error = err as { code: string };
        if (error.code === "P2025") {
            throw new Error("Book not found.");
        }
        console.error("Error deleting book:", error);
        throw error;
    }
}