import type React from "react"

interface PasswordResetEmailProps {
  userName: string
  resetUrl: string
}

export const PasswordResetEmail: React.FC<PasswordResetEmailProps> = ({ userName, resetUrl }) => {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ backgroundColor: "#f8f9fa", padding: "20px", textAlign: "center" }}>
        <img src="/images/logo.png" alt="NoTrumpNWay Logo" style={{ height: "50px", marginBottom: "10px" }} />
        <h1 style={{ color: "#333", margin: "0" }}>Password Reset</h1>
      </div>

      <div style={{ padding: "20px", backgroundColor: "#ffffff", border: "1px solid #eaeaea" }}>
        <p style={{ fontSize: "16px", lineHeight: "1.5", color: "#333" }}>Hello {userName},</p>

        <p style={{ fontSize: "16px", lineHeight: "1.5", color: "#333" }}>
          We received a request to reset your password for your NoTrumpNWay account. If you didn't make this request,
          you can safely ignore this email.
        </p>

        <p style={{ fontSize: "16px", lineHeight: "1.5", color: "#333" }}>
          To reset your password, click the button below:
        </p>

        <div style={{ textAlign: "center", margin: "30px 0" }}>
          <a
            href={resetUrl}
            style={{
              backgroundColor: "#0070f3",
              color: "#ffffff",
              padding: "12px 24px",
              borderRadius: "4px",
              textDecoration: "none",
              fontWeight: "bold",
              display: "inline-block",
            }}
          >
            Reset Password
          </a>
        </div>

        <p style={{ fontSize: "16px", lineHeight: "1.5", color: "#333" }}>
          Or copy and paste this URL into your browser:
        </p>

        <p
          style={{
            fontSize: "14px",
            backgroundColor: "#f5f5f5",
            padding: "10px",
            borderRadius: "4px",
            wordBreak: "break-all",
          }}
        >
          {resetUrl}
        </p>

        <p style={{ fontSize: "16px", lineHeight: "1.5", color: "#333" }}>
          This password reset link will expire in 1 hour for security reasons.
        </p>

        <p style={{ fontSize: "16px", lineHeight: "1.5", color: "#333", marginTop: "30px" }}>
          Best regards,
          <br />
          The NoTrumpNWay Team
        </p>
      </div>

      <div
        style={{ backgroundColor: "#f8f9fa", padding: "20px", textAlign: "center", fontSize: "12px", color: "#666" }}
      >
        <p>If you have any questions, please contact us at support@notrumpnway.com</p>
        <p>&copy; {new Date().getFullYear()} NoTrumpNWay. All rights reserved.</p>
      </div>
    </div>
  )
}

export default PasswordResetEmail
