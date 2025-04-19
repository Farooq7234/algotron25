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
  { name: 'Idea Forge (upto 3 members)' },
  { name: 'Code Storm (solo or duo)' },
  { name: 'QuizTronic (solo or duo)' },
  { name: 'Design Verse (solo or duo)' }
]

const nonTechnicalEvents = [
  { name: 'Rampage Rumble (solo or duo)' },
  { name: 'Frame Fusion (solo or duo)' },
  { name: 'Crick Witz (solo or duo)' }
]

type TeamMember = {
  name: string
  email: string
  college: string
  department: string
  phone: string
  year: string
}

const EventRegistration = () => {
  const router = useRouter()
  const { user } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [hasRegistered, setHasRegistered] = useState(false)
  const [registeredData, setRegisteredData] = useState<any>(null)

  const [leaderData, setLeaderData] = useState<TeamMember>({
    name: '',
    email: '',
    college: '',
    department: '',
    phone: '',
    year: '',
  })

  const [member1, setMember1] = useState<TeamMember>({
    name: '',
    email: '',
    college: '',
    department: '',
    phone: '',
    year: '',
  })

  const [member2, setMember2] = useState<TeamMember>({
    name: '',
    email: '',
    college: '',
    department: '',
    phone: '',
    year: '',
  })

  const [formData, setFormData] = useState({
    transactionId: '',
    selectedEvents: [] as string[],
    paymentapproval: false,
    paymentMode: 'online',
  })

  // Helper function to safely parse events data
  const safeParseEvents = (eventsData: any): string[] => {
    try {
      if (Array.isArray(eventsData)) return eventsData
      if (typeof eventsData === 'string') {
        const parsed = JSON.parse(eventsData)
        return Array.isArray(parsed) ? parsed : []
      }
      return []
    } catch (error) {
      console.error('Error parsing events:', error)
      return []
    }
  }

  useEffect(() => {
    if (user?.emailAddresses?.[0]?.emailAddress) {
      setLeaderData(prev => ({
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
          [Query.equal('userId', user.id)]
        )

        if (response.documents.length > 0) {
          setHasRegistered(true)
          const doc = response.documents[0]
          
          // Parse the array-stored JSON data
          setRegisteredData({
            ...doc,
            leader: doc.leader && doc.leader.length > 0 ? JSON.parse(doc.leader[0]) : null,
            member1: doc.member1 && doc.member1.length > 0 ? JSON.parse(doc.member1[0]) : null,
            member2: doc.member2 && doc.member2.length > 0 ? JSON.parse(doc.member2[0]) : null,
            selectedEvents: safeParseEvents(doc.selectedEvents)
          })
        }
      } catch (error) {
        console.error('Error checking registration:', error)
      }
    }

    checkRegistration()
  }, [user])

  const handleLeaderChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setLeaderData({ ...leaderData, [name]: value })
  }

  const handleMember1Change = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setMember1({ ...member1, [name]: value })
  }

  const handleMember2Change = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setMember2({ ...member2, [name]: value })
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  const calculatePrice = () => {
    // Base price
    let price = 0
    
    // Count number of team members (minimum 1 for leader)
    const teamSize = 1 + 
      (member1.name ? 1 : 0) + 
      (member2.name ? 1 : 0)
    
    // Pricing logic
    if (formData.paymentMode === 'online') {
      price = teamSize === 1 ? 150 : 250
    } else {
      price = teamSize === 1 ? 200 : 300
    }
    
    return price
  }

  const totalPrice = calculatePrice()

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
      await databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        ID.unique(),
        {
          userId: user?.id,
          // Store each member as an array containing stringified JSON
          leader: [JSON.stringify(leaderData)],
          member1: member1.name ? [JSON.stringify(member1)] : [],
          member2: member2.name ? [JSON.stringify(member2)] : [],
          transactionId: formData.transactionId,
          selectedEvents: formData.selectedEvents,
          paymentMode: formData.paymentMode,
          amount: calculatePrice(),
          uid: uid,
          paymentapproval: false,
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
          <div className="bg-gray-900 shadow-2xl rounded-2xl p-8 max-w-7xl w-full space-y-6 border border-green-500">
            {/* <h2 className="text-3xl font-extrabold text-center mb-6 text-gradient bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Register for Events
            </h2> */}

            {hasRegistered ? (
              <div className="max-w-xl mx-auto mt-10 px-6 py-8 sm:px-10 sm:py-10 text-white">
                <div className="text-center">
                  <h2 className="text-3xl sm:text-4xl font-bold text-green-400 mb-4">🎉 You&apos;re Registered!</h2>
                  <p className="text-lg sm:text-xl mb-2">
                    <span className="font-semibold text-white text-2xl">Hello, {registeredData?.leader?.name}!</span>
                  </p>
                  <p className="text-base sm:text-lg text-gray-300 mb-4">
                    You&apos;ve successfully registered for the following events:
                  </p>
              
                  <div className="mb-4">
                    <ul className="flex flex-wrap justify-center gap-3">
                      {safeParseEvents(registeredData?.selectedEvents).map((event: string, index: number) => (
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
                      <span className="font-medium text-white text-xl">Payment Mode:</span>{' '}
                      {registeredData?.paymentMode}
                    </p>
                    <p>
                      <span className="font-medium text-white">Amount to be Paid:</span> ₹{registeredData?.amount}
                    </p>
                    {registeredData?.member1?.name && (
                      <p>
                        <span className="font-medium text-white">Team Members:</span> {registeredData.member1.name}
                        {registeredData?.member2?.name && `, ${registeredData.member2.name}`}
                      </p>
                    )}
                  </div>
              
                  <p className="mt-6 text-xl text-gray-500">
                    Need help? Contact event organizers for assistance.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Leader Section */}
                 <h2 className="text-3xl font-extrabold text-center mb-6 text-gradient bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Register for Events
            </h2>
                <h2 className="text-3xl font-extrabold text-center mb-6 text-gradient bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                  Leader
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <input type="text" name="name" placeholder="Full Name" value={leaderData.name} onChange={handleLeaderChange}
                    className="w-full p-3 rounded-lg bg-[#1e1e2e] border border-gray-600 placeholder-gray-400" required />
                  <input type="text" name="college" placeholder="College Name" value={leaderData.college} onChange={handleLeaderChange}
                    className="w-full p-3 rounded-lg bg-[#1e1e2e] border border-gray-600 placeholder-gray-400" required />
                  <input type="text" name="department" placeholder="Department" value={leaderData.department} onChange={handleLeaderChange}
                    className="w-full p-3 rounded-lg bg-[#1e1e2e] border border-gray-600 placeholder-gray-400" required />
                  <input type="tel" name="phone" placeholder="Phone Number" value={leaderData.phone} onChange={handleLeaderChange}
                    className="w-full p-3 rounded-lg bg-[#1e1e2e] border border-gray-600 placeholder-gray-400" required />
                  <select name="year" value={leaderData.year} onChange={handleLeaderChange} required
                    className="w-full p-3 rounded-lg bg-[#1e1e2e] border border-gray-600">
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                  <input type="email" name="email" value={leaderData.email} disabled
                    className="w-full p-3 rounded-lg bg-[#2a2a4d] border border-gray-600 placeholder-gray-400" />
                </div>

                {/* Member 1 Section */}
                <h2 className="text-3xl font-extrabold text-center mb-6 text-gradient bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                  Team Member - 1
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <input type="text" name="name" placeholder="Full Name" value={member1.name} onChange={handleMember1Change}
                    className="w-full p-3 rounded-lg bg-[#1e1e2e] border border-gray-600 placeholder-gray-400" />
                  <input type="text" name="college" placeholder="College Name" value={member1.college} onChange={handleMember1Change}
                    className="w-full p-3 rounded-lg bg-[#1e1e2e] border border-gray-600 placeholder-gray-400" />
                  <input type="text" name="department" placeholder="Department" value={member1.department} onChange={handleMember1Change}
                    className="w-full p-3 rounded-lg bg-[#1e1e2e] border border-gray-600 placeholder-gray-400" />
                  <input type="tel" name="phone" placeholder="Phone Number" value={member1.phone} onChange={handleMember1Change}
                    className="w-full p-3 rounded-lg bg-[#1e1e2e] border border-gray-600 placeholder-gray-400" />
                  <select name="year" value={member1.year} onChange={handleMember1Change}
                    className="w-full p-3 rounded-lg bg-[#1e1e2e] border border-gray-600">
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                  <input type="email" name="email" placeholder="Email" value={member1.email} onChange={handleMember1Change}
                    className="w-full p-3 rounded-lg bg-[#1e1e2e] border border-gray-600 placeholder-gray-400" />
                </div>

                {/* Member 2 Section */}
                <h2 className="text-3xl font-extrabold text-center mb-6 text-gradient bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                  Team Member - 2
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <input type="text" name="name" placeholder="Full Name" value={member2.name} onChange={handleMember2Change}
                    className="w-full p-3 rounded-lg bg-[#1e1e2e] border border-gray-600 placeholder-gray-400" />
                  <input type="text" name="college" placeholder="College Name" value={member2.college} onChange={handleMember2Change}
                    className="w-full p-3 rounded-lg bg-[#1e1e2e] border border-gray-600 placeholder-gray-400" />
                  <input type="text" name="department" placeholder="Department" value={member2.department} onChange={handleMember2Change}
                    className="w-full p-3 rounded-lg bg-[#1e1e2e] border border-gray-600 placeholder-gray-400" />
                  <input type="tel" name="phone" placeholder="Phone Number" value={member2.phone} onChange={handleMember2Change}
                    className="w-full p-3 rounded-lg bg-[#1e1e2e] border border-gray-600 placeholder-gray-400" />
                  <select name="year" value={member2.year} onChange={handleMember2Change}
                    className="w-full p-3 rounded-lg bg-[#1e1e2e] border border-gray-600">
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                  <input type="email" name="email" placeholder="Email" value={member2.email} onChange={handleMember2Change}
                    className="w-full p-3 rounded-lg bg-[#1e1e2e] border border-gray-600 placeholder-gray-400" />
                </div>

                {/* Events Section */}
                <div>
                  <p className="font-semibold mb-2 text-xl">Select Events</p>
                  
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

                {/* Payment Section */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium mb-2">Payment Mode</label>
                    <select name="paymentMode" value={formData.paymentMode} onChange={handleFormChange}
                      className="w-full p-3 rounded-lg bg-[#1e1e2e] border border-gray-600">
                      <option value="online">Online (₹{member1.name || member2.name ? '250 for team' : '150 for individual'})</option>
                      <option value="offline">Offline (₹{member1.name || member2.name ? '300 for team' : '200 for individual'})</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="bg-[#1e1e2e] p-4 rounded-lg border border-gray-600">
                      <p className="font-medium">Total Amount: ₹{totalPrice}</p>
                    </div>
                  </div>
                </div>

                {/* QR & Transaction ID */}
                {formData.paymentMode === 'online' && (
                  <>
                    <div className="text-center mt-4">
                      <p className="font-medium mb-2">Scan QR to Pay</p>
                      <img src="/qrcode.jpg" alt="QR Code"
                        className="mx-auto w-80 h-80 border-2 border-white rounded-md" />
                    </div>
                    <input type="text" name="transactionId" placeholder="Transaction ID"
                      value={formData.transactionId} onChange={handleFormChange}
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