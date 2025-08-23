import { updateUserProfile, updateUserPassword, sendCardViaEmail } from "./user-actions"

export {
  loginUser,
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
  sendCardViaEmail,
} from "./user-actions"

// Test function to verify exports are available
export function verifyExports() {
  console.log("All user-actions exports are available:", {
    updateUserProfile: typeof updateUserProfile,
    updateUserPassword: typeof updateUserPassword,
    sendCardViaEmail: typeof sendCardViaEmail,
  })
}
