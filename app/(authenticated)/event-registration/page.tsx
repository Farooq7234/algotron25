'use client'

import Navbar from '@/components/main/Navbar'
import StarsCanvas from '@/components/main/StarCanvas'
import React, { useState } from 'react'
import { databases } from '@/lib/appwrite'
import { ID } from 'appwrite'
import conf from '@/lib/conf'
import {  toast, ToastContainer } from 'react-toastify';
import { useUser } from '@clerk/nextjs'
import { Loader2 } from "lucide-react";
import { useRouter } from 'next/navigation'


const events = [
  { name: 'Coding Challenge', price: 100 },
  { name: 'UI/UX Design', price: 150 },
  { name: 'Debugging', price: 80 },
  { name: 'Web Dev Sprint', price: 120 },
]

const EventRegistration = () => {
  const router = useRouter()
  const {  user } = useUser()
  const [isLoading, setIsLoading] = useState(false)

  console.log(user?.id)
  const [formData, setFormData] = useState({
    name: '',
    college: '',
    department: '',
    phone: '',
    transactionId: '',
    selectedEvents: [] as string[],
   
  })

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

  const totalPrice = formData.selectedEvents.reduce((sum, eventName) => {
    const event = events.find((e) => e.name === eventName)
    return event ? sum + event.price : sum
  }, 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await databases.createDocument(
        conf.appwriteDatabaseId,         // Replace with your database ID
        conf.appwriteCollectionId,       // Replace with your collection ID
        ID.unique(),                // Auto-generated unique ID
        {
          ...formData,
          selectedEvents: JSON.stringify(formData.selectedEvents),
          id:user?.id,
          amount:totalPrice 
        }
      )
      console.log('Success:', response)
      toast.success('Registration successful! ✅')
      setIsLoading(false)
      router.push('/dashboard')
    } catch (error) {
      console.error('Appwrite error:', error)
      toast.error('Something went wrong while submitting the form ❌')
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
            {['name', 'college', 'department', 'phone'].map((field) => (
              <input
                key={field}
                type={field === 'phone' ? 'tel' : 'text'}
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={(formData as any)[field]}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-[#1e1e2e] text-white border border-gray-600 placeholder-gray-400 focus:ring-2 focus:ring-purple-600 outline-none"
                required
              />
            ))}

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
                    <span className="text-sm font-medium">₹{event.price}</span>
                  </label>
                ))}
              </div>
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
              className="w-full p-3 rounded-lg bg-[#1e1e2e] text-white border border-gray-600 placeholder-gray-400 focus:ring-2 focus:ring-purple-600 outline-none"
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

      {/* You can enable this back if not causing input issues */}
      {/* <StarsCanvas /> */}
    </>
  )
}

export default EventRegistration
