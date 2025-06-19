export {
  createUser,
  createSocialUser,
  getUserByEmail,
  getUserBySocialId,
  verifyUserAccount,
  resendVerificationPin,
  loginUser,
  socialLogin,
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
  sendCardViaEmail,
  getCurrentUser,
} from "./user-actions"

// Test function to verify exports are available
export function verifyExports() {
  console.log("All user-actions exports are available:", {
    createUser: typeof createUser,
    createSocialUser: typeof createSocialUser,
    getUserByEmail: typeof getUserByEmail,
    getUserBySocialId: typeof getUserBySocialId,
    verifyUserAccount: typeof verifyUserAccount,
    resendVerificationPin: typeof resendVerificationPin,
    loginUser: typeof loginUser,
    socialLogin: typeof socialLogin,
    getUserProfile: typeof getUserProfile,
    updateUserProfile: typeof updateUserProfile,
    updateUserPassword: typeof updateUserPassword,
    sendCardViaEmail: typeof sendCardViaEmail,
    getCurrentUser: typeof getCurrentUser,
  })
}
