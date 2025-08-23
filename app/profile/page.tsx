"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { getUserProfile, updateUserProfile, updateUserPassword } from "../actions/user-actions"
import { useAuth } from "@/contexts/auth-context"
import { ArrowLeft, Save, LogOut, User, ShoppingBag, Heart, Settings } from "lucide-react"

// List of US states for the dropdown
const US_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
]

export default function ProfilePage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  // Profile form state
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    birthday: "",
    email: "",
  })

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Form validation state
  const [profileErrors, setProfileErrors] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    birthday: "",
    email: "",
  })

  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!user) {
          router.push("/login")
          return
        }
        const userData = await getUserProfile(user.id)
        // Format the birthday for the date input
        const formattedBirthday = userData.birthday ? new Date(userData.birthday).toISOString().split("T")[0] : ""
        setProfileData({
          ...userData,
          birthday: formattedBirthday,
        })
      } catch (error) {
        toast({
          title: "Error loading profile",
          description: "Please try again later or contact support.",
          variant: "destructive",
        })
        router.push("/login")
      } finally {
        setIsLoading(false)
      }
    }
    fetchProfile()
  }, [router, toast, user])

  // Handle profile input changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (profileErrors[name as keyof typeof profileErrors]) {
      setProfileErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  // Handle state selection
  const handleStateChange = (value: string) => {
    setProfileData((prev) => ({ ...prev, state: value }))
    if (profileErrors.state) {
      setProfileErrors((prev) => ({ ...prev, state: "" }))
    }
  }

  // Handle password input changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (passwordErrors[name as keyof typeof passwordErrors]) {
      setPasswordErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  // Validate profile form
  const validateProfileForm = () => {
    let valid = true
    const newErrors = { ...profileErrors }

    // Validate required fields
    if (!profileData.firstName.trim()) {
      newErrors.firstName = "First name is required"
      valid = false
    }

    if (!profileData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
      valid = false
    }

    if (!profileData.address.trim()) {
      newErrors.address = "Address is required"
      valid = false
    }

    if (!profileData.city.trim()) {
      newErrors.city = "City is required"
      valid = false
    }

    if (!profileData.state) {
      newErrors.state = "State is required"
      valid = false
    }

    if (!profileData.zipCode.trim()) {
      newErrors.zipCode = "ZIP code is required"
      valid = false
    } else if (!/^\d{5}(-\d{4})?$/.test(profileData.zipCode)) {
      newErrors.zipCode = "Please enter a valid ZIP code"
      valid = false
    }

    if (!profileData.birthday) {
      newErrors.birthday = "Birthday is required"
      valid = false
    }

    if (!profileData.email.trim()) {
      newErrors.email = "Email is required"
      valid = false
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = "Please enter a valid email address"
      valid = false
    }

    setProfileErrors(newErrors)
    return valid
  }

  // Validate password form
  const validatePasswordForm = () => {
    let valid = true
    const newErrors = { ...passwordErrors }

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Current password is required"
      valid = false
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = "New password is required"
      valid = false
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters"
      valid = false
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
      valid = false
    }

    setPasswordErrors(newErrors)
    return valid
  }

  // Handle profile form submission
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateProfileForm()) {
      return
    }

    setIsSaving(true)

    try {
      // In a real app, this would call a server action to update the profile
      await updateUserProfile(profileData)

      toast({
        title: "Profile updated successfully!",
        description: "Your profile information has been saved.",
      })
    } catch (error) {
      toast({
        title: "Error updating profile",
        description: "Please try again later or contact support.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Handle password form submission
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validatePasswordForm()) {
      return
    }

    setIsChangingPassword(true)

    try {
      // In a real app, this would call a server action to update the password
      // Pass user id and new password to updateUserPassword
      await updateUserPassword(user?.id, passwordData.newPassword)

      toast({
        title: "Password changed successfully!",
        description: "Your password has been updated.",
      })

      // Reset password form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error) {
      toast({
        title: "Error changing password",
        description: "Please check your current password and try again.",
        variant: "destructive",
      })
    } finally {
      setIsChangingPassword(false)
    }
  }

  // Handle logout
  const handleLogout = () => {
    // In a real app, this would call a server action to log out
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    })

    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="container py-10 px-4 md:px-6">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10 px-4 md:px-6">
      <div className="mb-6 flex items-center">
        <Button variant="ghost" asChild className="mr-4">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">My Account</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col items-center space-y-3 pb-4 border-b">
                <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-10 w-10 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <h2 className="font-medium">
                    {profileData.firstName} {profileData.lastName}
                  </h2>
                  <p className="text-sm text-muted-foreground">{profileData.email}</p>
                </div>
              </div>

              <nav className="mt-4 space-y-2">
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/orders">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Orders
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/wishlist">
                    <Heart className="mr-2 h-4 w-4" />
                    Wishlist
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </Button>
              </nav>
            </CardContent>
            <CardFooter className="px-4 py-3 border-t">
              <Button variant="outline" className="w-full" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Main Content */}
        <div>
          <Tabs defaultValue="profile">
            <TabsList className="mb-4">
              <TabsTrigger value="profile">Profile Information</TabsTrigger>
              <TabsTrigger value="password">Change Password</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal information and address.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={profileData.firstName}
                          onChange={handleProfileChange}
                          className={profileErrors.firstName ? "border-red-500" : ""}
                        />
                        {profileErrors.firstName && <p className="text-sm text-red-500">{profileErrors.firstName}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={profileData.lastName}
                          onChange={handleProfileChange}
                          className={profileErrors.lastName ? "border-red-500" : ""}
                        />
                        {profileErrors.lastName && <p className="text-sm text-red-500">{profileErrors.lastName}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        className={profileErrors.email ? "border-red-500" : ""}
                      />
                      {profileErrors.email && <p className="text-sm text-red-500">{profileErrors.email}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="birthday">Birthday</Label>
                      <Input
                        id="birthday"
                        name="birthday"
                        type="date"
                        value={profileData.birthday}
                        onChange={handleProfileChange}
                        className={profileErrors.birthday ? "border-red-500" : ""}
                      />
                      {profileErrors.birthday && <p className="text-sm text-red-500">{profileErrors.birthday}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={profileData.address}
                        onChange={handleProfileChange}
                        className={profileErrors.address ? "border-red-500" : ""}
                      />
                      {profileErrors.address && <p className="text-sm text-red-500">{profileErrors.address}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          name="city"
                          value={profileData.city}
                          onChange={handleProfileChange}
                          className={profileErrors.city ? "border-red-500" : ""}
                        />
                        {profileErrors.city && <p className="text-sm text-red-500">{profileErrors.city}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Select value={profileData.state} onValueChange={handleStateChange}>
                          <SelectTrigger id="state" className={profileErrors.state ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            {US_STATES.map((state) => (
                              <SelectItem key={state} value={state}>
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {profileErrors.state && <p className="text-sm text-red-500">{profileErrors.state}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          name="zipCode"
                          value={profileData.zipCode}
                          onChange={handleProfileChange}
                          className={profileErrors.zipCode ? "border-red-500" : ""}
                        />
                        {profileErrors.zipCode && <p className="text-sm text-red-500">{profileErrors.zipCode}</p>}
                      </div>
                    </div>

                    <Button type="submit" className="w-full md:w-auto" disabled={isSaving}>
                      <Save className="mr-2 h-4 w-4" />
                      {isSaving ? "Saving Changes..." : "Save Changes"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your password to keep your account secure.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className={passwordErrors.currentPassword ? "border-red-500" : ""}
                      />
                      {passwordErrors.currentPassword && (
                        <p className="text-sm text-red-500">{passwordErrors.currentPassword}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className={passwordErrors.newPassword ? "border-red-500" : ""}
                      />
                      {passwordErrors.newPassword && (
                        <p className="text-sm text-red-500">{passwordErrors.newPassword}</p>
                      )}
                      <p className="text-xs text-muted-foreground">Password must be at least 8 characters long.</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className={passwordErrors.confirmPassword ? "border-red-500" : ""}
                      />
                      {passwordErrors.confirmPassword && (
                        <p className="text-sm text-red-500">{passwordErrors.confirmPassword}</p>
                      )}
                    </div>

                    <Button type="submit" className="w-full md:w-auto" disabled={isChangingPassword}>
                      {isChangingPassword ? "Changing Password..." : "Change Password"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
