import { type NextRequest, NextResponse } from "next/server"
import mysql from "mysql2/promise"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required" }, { status: 400 });
    }

    // Connect to DB
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Get user by email
    const [rows] = await connection.execute(
      "SELECT UserID, UserEmail, Password, FName, LName, UserLastLogin FROM users WHERE UserEmail = ?",
      [email]
    );
    await connection.end();

    if ((rows as any[]).length === 0) {
      return NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 401 });
    }

    const user = (rows as any)[0];
    const passwordMatch = await bcrypt.compare(password, user.Password);
    if (!passwordMatch) {
      return NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 401 });
    }

    // Check if this is the first login (UserLastLogin is null or empty)
    const isFirstLogin = !user.UserLastLogin;

    // Create session token (in production, use proper JWT)
    const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Set session cookie

    // Return user object with id, email, name (to match frontend expectations)
    const response = NextResponse.json({
      success: true,
      user: {
        id: String(user.UserID),
        email: user.UserEmail,
        name: `${user.FName} ${user.LName}`.trim(),
        isFirstLogin,
      },
      token: sessionToken,
      requireVerification: isFirstLogin,
    });

    response.cookies.set("session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
