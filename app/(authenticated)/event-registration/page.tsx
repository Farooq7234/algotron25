'use client'

import Navbar from '@/components/main/Navbar'
import React, { useState, useEffect } from 'react'
import { databases } from '@/lib/appwrite'
import { ID } from 'appwrite'
import conf from '@/lib/conf'
import { toast, ToastContainer } from 'react-toastify'
import { useUser } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

const events = [
  { name: 'Coding Challenge' },
  { name: 'UI/UX Design' },
  { name: 'Debugging' },
  { name: 'Web Dev Sprint' },
]

const EventRegistration = () => {
  const router = useRouter()
  const { user } = useUser()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    college: '',
    department: '',
    phone: '',
    year: '',
    transactionId: '',
    selectedEvents: [] as string[],
    paymentapproval: false,
    paymentMode: 'online',
  })

  console.log(formData.year)

  useEffect(() => {
    if (user?.emailAddresses?.[0]?.emailAddress) {
      setFormData((prev) => ({
        ...prev,
        email: user.emailAddresses[0].emailAddress,
      }))
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleEventSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target
    const selected = formData.selectedEvents

    if (checked) {
      setFormData({ ...formData, selectedEvents: [...selected, value] })
    } else {
      setFormData({
        ...formData,
        selectedEvents: selected.filter((event) => event !== value),
      })
    }
  }

  const generateUID = () => {
    return Math.floor(1000 + Math.random() * 9000).toString()
  }

  const totalPrice = formData.paymentMode === 'online' ? 150 : 200

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const uid = generateUID()
      const response = await databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        ID.unique(),
        {
          ...formData,
          selectedEvents: JSON.stringify(formData.selectedEvents),
          id: user?.id,
          amount: totalPrice,
          uid: uid,
        }
      )
      toast.success('Registration successful! ✅', {
        autoClose: 1500,
        onClose: () => router.push('/dashboard'),
      })
    } catch (error) {
      console.error('Appwrite error:', error)
      toast.error('Something went wrong while submitting the form ❌')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#0a0a23] z-10 text-white px-4 py-40 flex items-center justify-center">
        <div className="bg-[#161634] shadow-2xl rounded-2xl p-8 max-w-xl w-full space-y-6 border border-gray-700">
          <h2 className="text-3xl font-extrabold text-center mb-6 text-gradient bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Register for Events
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-[#1e1e2e] text-white border border-gray-600 placeholder-gray-400"
              required
            />

            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="w-full p-3 rounded-lg bg-[#2a2a4d] text-white border border-gray-600 placeholder-gray-400"
            />

            <input
              type="text"
              name="college"
              placeholder="College Name"
              value={formData.college}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-[#1e1e2e] text-white border border-gray-600 placeholder-gray-400"
              required
            />

            <input
              type="text"
              name="department"
              placeholder="Department"
              value={formData.department}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-[#1e1e2e] text-white border border-gray-600 placeholder-gray-400"
              required
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-[#1e1e2e] text-white border border-gray-600 placeholder-gray-400"
              required
            />

            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-[#1e1e2e] text-white border border-gray-600"
            >
              <option value="">Select Year</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>

            <div>
              <p className="font-semibold mb-2 text-lg">Select Events</p>
              <div className="grid gap-3">
                {events.map((event) => (
                  <label
                    key={event.name}
                    className="flex items-center justify-between bg-[#2a2a4d] px-4 py-2 rounded-lg cursor-pointer hover:bg-[#3b3b5c] transition"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        value={event.name}
                        checked={formData.selectedEvents.includes(event.name)}
                        onChange={handleEventSelect}
                        className="accent-purple-600"
                      />
                      <span>{event.name}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <label className="block font-medium mb-2">Payment Mode</label>
              <select
                name="paymentMode"
                value={formData.paymentMode}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-[#1e1e2e] text-white border border-gray-600"
              >
                <option value="online">Online (₹150)</option>
                <option value="offline">Offline (₹200)</option>
              </select>
            </div>

            <div className="text-lg font-semibold">
              Total Price: <span className="text-green-400">₹{totalPrice}</span>
            </div>

            <div className="text-center mt-4">
              <p className="font-medium mb-2">Scan QR to Pay</p>
              <img
                src="/qr-code.png"
                alt="QR Code"
                className="mx-auto w-48 h-48 border-2 border-white rounded-md"
              />
            </div>

            <input
              type="text"
              name="transactionId"
              placeholder="Transaction ID"
              value={formData.transactionId}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-[#1e1e2e] text-white border border-gray-600 placeholder-gray-400"
              required
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 transition font-semibold text-lg shadow-md"
            >
              {isLoading ? (
                <>
                  Submitting <Loader2 className="animate-spin inline-block" />
                </>
              ) : (
                'Submit Registration'
              )}
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  )
}

export default EventRegistration
