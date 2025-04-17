'use client'

import React, { useState, useEffect } from 'react'
import { databases } from '@/lib/appwrite'
import { ID, Query } from 'appwrite'
import conf from '@/lib/conf'
import { toast, ToastContainer } from 'react-toastify'
import { useUser } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import SidebarLayout from '@/components/main/SidebarLayout'

const technicalEvents = [
  { name: 'Idea Forge' },
  { name: 'Code Storm' },
  { name: 'QuizTronic' },
  { name: 'Design Verse' }
]

const nonTechnicalEvents = [
  { name: 'Rampage Rumble' },
  { name: 'Frame Fusion' },
  { name: 'Crick Witz' }
]


const EventRegistration = () => {
  const router = useRouter()
  const { user } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [hasRegistered, setHasRegistered] = useState(false)
  const [registeredData, setRegisteredData] = useState<any>(null)

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

  useEffect(() => {
    if (user?.emailAddresses?.[0]?.emailAddress) {
      setFormData((prev) => ({
        ...prev,
        email: user.emailAddresses[0].emailAddress,
      }))
    }
  }, [user])

  useEffect(() => {
    const checkRegistration = async () => {
      if (!user?.id) return

      try {
        const response = await databases.listDocuments(
          conf.appwriteDatabaseId,
          conf.appwriteCollectionId,
          [Query.equal('id', user.id)]
        )

        if (response.documents.length > 0) {
          setHasRegistered(true)
          setRegisteredData(response.documents[0])
        }
      } catch (error) {
        console.error('Error checking registration:', error)
      }
    }

    checkRegistration()
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

    if (formData.paymentMode === 'online' && !formData.transactionId.trim()) {
      toast.error('Please enter the Transaction ID for online payment')
      setIsLoading(false)
      return
    }

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
      <SidebarLayout>
        <div className="min-h-screen z-10 text-white px-2 flex items-center justify-center">
          <div className="bg-gray-900 shadow-2xl rounded-2xl p-8 max-w-7xl w-full space-y-6 border  border-green-500">
            <h2 className="text-3xl font-extrabold text-center mb-6 text-gradient bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Register for Events
            </h2>

            {hasRegistered ? (
          <div className="max-w-xl mx-auto mt-10   px-6 py-8 sm:px-10 sm:py-10 text-white">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-green-400 mb-4">🎉 You're Registered!</h2>
            <p className="text-lg sm:text-xl mb-2">
               <span className="font-semibold text-white text-2xl">Hello,{registeredData?.name}!</span>
            </p>
            <p className="text-base sm:text-lg text-gray-300 mb-4">
              You&apos;ve successfully registered for the following events:
            </p>
        
            <div className="mb-4">
              <ul className="flex flex-wrap justify-center gap-3">
                {JSON.parse(registeredData?.selectedEvents || '[]').map((event:any, index:any) => (
                  <li
                    key={index}
                    className="bg-green-700/20 border border-green-500 text-sm sm:text-base px-4 py-2 rounded-full"
                  >
                    {event}
                  </li>
                ))}
              </ul>
            </div>
        
            <div className="space-y-2 mt-4 text-base sm:text-lg text-gray-300">
              <p>
                <span className="font-medium text-white">Payment Mode:</span>{' '}
                {registeredData?.paymentMode}
              </p>
              <p>
                <span className="font-medium text-white">Amount Paid:</span> ₹{registeredData?.amount}
              </p>
            </div>
        
            <p className="mt-6 text-sm text-gray-500">
              Need help? Contact event organizers for assistance.
            </p>
          </div>
        </div>
        
          
           
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Input Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-[#1e1e2e] border border-gray-600 placeholder-gray-400" required />
                  <input type="text" name="college" placeholder="College Name" value={formData.college} onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-[#1e1e2e] border border-gray-600 placeholder-gray-400" required />
                  <input type="text" name="department" placeholder="Department" value={formData.department} onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-[#1e1e2e] border border-gray-600 placeholder-gray-400" required />
                  <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-[#1e1e2e] border border-gray-600 placeholder-gray-400" required />
                  <select name="year" value={formData.year} onChange={handleChange} required
                    className="w-full p-3 rounded-lg bg-[#1e1e2e] border border-gray-600">
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                  <input type="email" name="email" value={formData.email} disabled
                    className="w-full p-3 rounded-lg bg-[#2a2a4d] border border-gray-600 placeholder-gray-400" />
                </div>

                {/* Events */}
                <div>
  <p className="font-semibold mb-2 text-lg">Select Events</p>
  
  <div className="mb-6">
    <h3 className="text-base font-semibold text-purple-400 mb-2">Technical Events</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {technicalEvents.map((event) => (
        <label key={event.name}
          className="flex items-center justify-between bg-[#2a2a4d] px-4 py-2 rounded-lg cursor-pointer hover:bg-[#3b3b5c] transition">
          <div className="flex items-center gap-3">
            <input type="checkbox" value={event.name}
              checked={formData.selectedEvents.includes(event.name)}
              onChange={handleEventSelect} className="accent-purple-600" />
            <span>{event.name}</span>
          </div>
        </label>
      ))}
    </div>
  </div>

  <div>
    <h3 className="text-base font-semibold text-pink-400 mb-2">Non-Technical Events</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {nonTechnicalEvents.map((event) => (
        <label key={event.name}
          className="flex items-center justify-between bg-[#2a2a4d] px-4 py-2 rounded-lg cursor-pointer hover:bg-[#3b3b5c] transition">
          <div className="flex items-center gap-3">
            <input type="checkbox" value={event.name}
              checked={formData.selectedEvents.includes(event.name)}
              onChange={handleEventSelect} className="accent-pink-500" />
            <span>{event.name}</span>
          </div>
        </label>
      ))}
    </div>
  </div>
</div>


                {/* Payment */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium mb-2">Payment Mode</label>
                    <select name="paymentMode" value={formData.paymentMode} onChange={handleChange}
                      className="w-full p-3 rounded-lg bg-[#1e1e2e] border border-gray-600">
                      <option value="online">Online (₹150)</option>
                      <option value="offline">Offline (₹200)</option>
                    </select>
                  </div>
                  <div className="text-lg font-semibold mt-8 md:mt-0">
                    Total Price: <span className="text-green-400">₹{totalPrice}</span>
                  </div>
                </div>

                {/* QR & Transaction ID */}
                {formData.paymentMode === 'online' && (
                  <>
                    <div className="text-center mt-4">
                      <p className="font-medium mb-2">Scan QR to Pay</p>
                      <img src="/qr-code.png" alt="QR Code"
                        className="mx-auto w-48 h-48 border-2 border-white rounded-md" />
                    </div>
                    <input type="text" name="transactionId" placeholder="Transaction ID"
                      value={formData.transactionId} onChange={handleChange}
                      className="w-full p-3 rounded-lg bg-[#1e1e2e] border border-gray-600 placeholder-gray-400" required />
                  </>
                )}

                {/* Submit Button */}
                <button type="submit" disabled={isLoading}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 transition font-semibold text-lg shadow-md">
                  {isLoading ? <>Submitting <Loader2 className="animate-spin inline-block" /></> : 'Submit Registration'}
                </button>
              </form>
            )}
          </div>
        </div>
      </SidebarLayout>
      <ToastContainer />
    </>
  )
}

export default EventRegistration
