import { NextRequest, NextResponse } from "next/server";

// Force dynamic rendering to prevent build-time execution
export const dynamic = "force-dynamic";

/**
 * API endpoint to create or update user profile after authentication
 * This is called from the client after successful Google login/signup
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, email, displayName, photoURL } = body;

    if (!userId || !email) {
      return NextResponse.json(
        { error: "Missing required fields: userId and email" },
        { status: 400 }
      );
    }

    const { createOrUpdateUserProfile } = await import(
      "@/lib/firebase/firestore"
    );
    await createOrUpdateUserProfile(userId, {
      email,
      displayName: displayName || null,
      photoURL: photoURL || null,
    });

    return NextResponse.json({
      success: true,
      message: "User profile created/updated successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to create/update user profile",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
