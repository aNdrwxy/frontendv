import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { profileService } from '../services/profileService'
import ProfileView from '../components/ProfileView'
import toast from 'react-hot-toast'

export default function MyProfile() {
  const { token } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    profileService.getMe(token)
      .then(setProfile)
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false))
  }, [token])

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <span className="loading-text">Loading profile...</span>
      </div>
    )
  }

  return <ProfileView profile={profile} isOwn />
}
