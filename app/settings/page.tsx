
"use client"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { updateUserProfile, updateUserPassword, getUserProfile } from "../actions/user-actions"

export default function SettingsPage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    birthday: "",
    email: "",
    id: user?.id || ""
  })
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    async function fetchProfile() {
      if (user?.id) {
        const data = await getUserProfile(user.id)
        setProfile({ ...data, id: user.id })
      }
    }
    fetchProfile()
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfile(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage("")
    try {
      await updateUserProfile(profile)
      setMessage("Profile updated successfully.")
    } catch (err: any) {
      setMessage(err.message || "Failed to update profile.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="container py-12 max-w-lg mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" name="firstName" value={profile.firstName} onChange={handleChange} required />
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" name="lastName" value={profile.lastName} onChange={handleChange} required />
            <Label htmlFor="address">Address</Label>
            <Input id="address" name="address" value={profile.address} onChange={handleChange} required />
            <Label htmlFor="city">City</Label>
            <Input id="city" name="city" value={profile.city} onChange={handleChange} required />
            <Label htmlFor="state">State</Label>
            <Input id="state" name="state" value={profile.state} onChange={handleChange} required />
            <Label htmlFor="zipCode">ZIP Code</Label>
            <Input id="zipCode" name="zipCode" value={profile.zipCode} onChange={handleChange} required />
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" name="phone" value={profile.phone} onChange={handleChange} required />
            <Label htmlFor="birthday">Birthday</Label>
            <Input id="birthday" name="birthday" type="date" value={profile.birthday} onChange={handleChange} required />
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" value={profile.email} onChange={handleChange} required />
            {message && <div className="text-sm text-green-600 mt-2">{message}</div>}
            <Button type="submit" className="w-full" disabled={isSaving}>{isSaving ? "Saving..." : "Update Profile"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
