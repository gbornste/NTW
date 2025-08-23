
import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

// Hash a plain password using bcrypt
async function hashPassword(plainPassword: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(plainPassword, saltRounds);
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Connect to DB using .env values
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Check for duplicate email
    const [rows] = await connection.execute(
      "SELECT UserID FROM users WHERE UserEmail = ?",
      [data.email]
    );
    if ((rows as any[]).length > 0) {
      await connection.end();
      return NextResponse.json({ success: false, error: "Email already in use." }, { status: 400 });
    }

    // Set default values for fields not in the form
    const now = new Date();
    const startDate = data.UserStartDate || now.toISOString().slice(0, 19).replace('T', ' ');
    const endDate = data.UserEndDate || new Date(now.setFullYear(now.getFullYear() + 200)).toISOString().slice(0, 19).replace('T', ' ');

    // Hash the password before storing
    const passwordHash = await hashPassword(data.password);

    // Insert new user
    await connection.execute(
      `INSERT INTO users
        (UserEmail, Password, SecureQuestion, SecureAnswer, Title, FName, LName, VIPStatus, Address, City, State, Zip, UserStartDate, UserLastLogin, UserPhone, SendMail, Birthday, PolParty, UserEndDate)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.email,
        passwordHash,
        data.secureQuestion,
        data.secureAnswer,
        data.title,
        data.firstName,
        data.lastName,
        '0', // VIPStatus
        data.address,
        data.city,
        data.state,
        data.zipCode,
        startDate,
        startDate,
        data.userPhone,
        data.sendMail ? 1 : 4,
        data.birthday,
        data.polParty,
        endDate,
      ]
    );
    await connection.end();
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Server error" }, { status: 500 });
  }
}
