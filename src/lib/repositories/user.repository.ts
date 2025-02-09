"use server";
import { prisma } from "@/lib/prisma";

// ✅ Create or update a user
export async function upsertUser(data: {
  id?: string;
  name?: string;
  email: string;
  image?: string;
}) {
  try {
    // Validate input data
    if (!data.email) {
      throw new Error("Email is required.");
    }

    // Upsert the user
    return await prisma.user.upsert({
      where: { email: data.email },
      update: {
        name: data.name,
        image: data.image,
      },
      create: {
        id: data.id,
        name: data.name,
        email: data.email,
        image: data.image,
      },
    });
  } catch (err) {
    const error = err as { code: string };
    console.error("Error upserting user:", error);
    throw error;
  }
}

// ✅ Get user by ID
export async function getUserById(id: string) {
  try {
    if (!id) {
      throw new Error("User ID is required.");
    }
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });
    if (!user) {
      throw new Error("User not found.");
    }
    return user;
  } catch (err) {
    const error = err as { code: string };
    console.error("Error fetching user by ID:", error);
    throw error;
  }
}

// ✅ Get user by email
export async function getUserByEmail(email: string) {
  try {
    if (!email) {
      throw new Error("Email is required.");
    }
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });
    if (!user) {
      throw new Error("User not found.");
    }
    return user;
  } catch (err) {
    const error = err as { code: string };
    console.error("Error fetching user by email:", error);
    throw error;
  }
}

// ✅ Delete user
export async function deleteUser(id: string) {
  try {
    // Validate input
    if (!id) {
      throw new Error("User ID is required.");
    }

    // Delete the user
    await prisma.user.delete({ where: { id } });
  } catch (err) {
    const error = err as { code: string };
    if (error.code === "P2025") {
      throw new Error("User not found.");
    }
    console.error("Error deleting user:", error);
    throw error;
  }
}
