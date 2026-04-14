import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { profileService } from '../services/profileService'
import ProfileView from '../components/ProfileView'
import toast from 'react-hot-toast'

export default function OtherProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    profileService.getOther(id)
      .then((data) => {
        setProfile(data)

        if (user && user.id === data.id) {
          navigate('/my-profile')
        }
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false))
  }, [id, user, navigate])

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <span className="loading-text">Loading profile...</span>
      </div>
    )
  }

  return <ProfileView profile={profile} isOwn={false} />
}