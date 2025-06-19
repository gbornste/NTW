import type React from "react"

interface VerificationEmailProps {
  firstName: string
  verificationPin: string
}

export const VerificationEmail: React.FC<VerificationEmailProps> = ({ firstName, verificationPin }) => {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ backgroundColor: "#f8f9fa", padding: "20px", textAlign: "center" }}>
        <img
          src="https://notrumpnway.com/images/logo.png"
          alt="NoTrumpNWay"
          style={{ height: "60px", marginBottom: "20px" }}
        />
      </div>

      <div style={{ padding: "20px" }}>
        <h1 style={{ color: "#333", fontSize: "24px" }}>Verify Your Account</h1>

        <p style={{ color: "#555", fontSize: "16px", lineHeight: "1.5" }}>Hello {firstName},</p>

        <p style={{ color: "#555", fontSize: "16px", lineHeight: "1.5" }}>
          Thank you for creating an account with NoTrumpNWay! We're excited to have you join our community.
        </p>

        <p style={{ color: "#555", fontSize: "16px", lineHeight: "1.5" }}>
          To complete your registration and verify your account, please use the following verification code:
        </p>

        <div
          style={{
            backgroundColor: "#f8f9fa",
            padding: "15px",
            textAlign: "center",
            margin: "20px 0",
            borderRadius: "5px",
            border: "1px solid #ddd",
          }}
        >
          <span
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              letterSpacing: "5px",
              color: "#333",
            }}
          >
            {verificationPin}
          </span>
        </div>

        <p style={{ color: "#555", fontSize: "16px", lineHeight: "1.5" }}>
          This verification code will expire in 24 hours. If you did not create an account with NoTrumpNWay, please
          ignore this email.
        </p>

        <div style={{ marginTop: "30px", borderTop: "1px solid #eee", paddingTop: "20px" }}>
          <p style={{ color: "#777", fontSize: "14px" }}>
            If you have any questions or need assistance, please contact our support team at support@notrumpnway.com.
          </p>
        </div>
      </div>

      <div style={{ backgroundColor: "#f8f9fa", padding: "20px", textAlign: "center" }}>
        <p style={{ color: "#777", fontSize: "14px", margin: "0" }}>&copy; 2023 NoTrumpNWay. All rights reserved.</p>
        <div style={{ marginTop: "10px" }}>
          <a
            href="https://notrumpnway.com/terms"
            style={{ color: "#777", fontSize: "12px", marginRight: "10px", textDecoration: "none" }}
          >
            Terms of Service
          </a>
          <a href="https://notrumpnway.com/privacy" style={{ color: "#777", fontSize: "12px", textDecoration: "none" }}>
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  )
}
