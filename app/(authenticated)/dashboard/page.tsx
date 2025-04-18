'use client'

import Navbar from '@/components/main/Navbar'
import React, { useEffect, useState } from 'react'
import { databases } from '@/lib/appwrite'
import conf from '@/lib/conf'
import { useUser } from '@clerk/nextjs'
import { Query } from 'appwrite'
import {
  Calendar,
  CheckCircle,
  ClipboardList,
  Clock,
  Clock10Icon,
  Info,
  ShieldCheck
} from 'lucide-react'
import SidebarLayout from '@/components/main/SidebarLayout'

const Dashboard = () => {
  const { user } = useUser()
  const [loading, setLoading] = useState(true)
  const [registeredData, setData] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return
      try {
        const res = await databases.listDocuments(
          conf.appwriteDatabaseId,
          conf.appwriteCollectionId,
          [Query.equal('id', user.id)]
        )
        setData(res.documents)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user?.id])

  const totalEvents = 7
  const registeredEventsCount = registeredData.length
  const paymentApprovedCount = registeredData.filter(doc => doc.paymentapproval === true).length

  const rules = [
    "Be present 15 minutes before event starts.",
    "Bring your college ID card.",
    "Follow dress code if mentioned.",
    "Respect coordinators & participants.",
    "Mobile phones are not allowed during the event."
  ]

  return (
    <>
      {/* <Navbar /> */}
      <SidebarLayout>
      <div className="min-h-screen text-white px-4  flex flex-col items-center">
        <div className="w-full max-w-6xl space-y-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            Your Event Dashboard
          </h2>

      <h3 className="text-3xl md:text-4xl font-semibold text-white capitalize">
  Hello {user?.firstName || user?.username || 'Participant'} 👋

</h3>
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Clock className="animate-spin w-10 h-10 text-purple-500 mr-4" />
              <p className="text-xl text-gray-300">Loading your dashboard...</p>
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#1e1e30] p-6 rounded-2xl border border-purple-600/30 shadow-lg flex flex-col items-center">
                  <ClipboardList className="w-10 h-10 text-purple-400 mb-3" />
                  <h3 className="text-2xl font-bold">{totalEvents}</h3>
                  <p className="text-gray-400 mt-1">Total Events</p>
                </div>
                <div className="bg-[#1e1e30] p-6 rounded-2xl border border-pink-600/30 shadow-lg flex flex-col items-center">
                  <CheckCircle className="w-10 h-10 text-pink-400 mb-3" />
                  <h3 className="text-2xl font-bold">{registeredEventsCount}</h3>
                  <p className="text-gray-400 mt-1">Events Registered</p>
                </div>
                <div className="bg-[#1e1e30] p-6 rounded-2xl border border-green-600/30 shadow-lg flex flex-col items-center">
                 {paymentApprovedCount ? <ShieldCheck className="w-10 h-10 text-green-400 mb-3" /> : <Clock10Icon className="w-10 h-10 text-yellow-400 mb-3" />}  
                  <h3 className="text-2xl font-bold">{paymentApprovedCount ? "Approved":"Pending"}</h3>
                  <p className="text-gray-400 mt-1">Payment Status</p>
                </div>
              </div>

              {/* Rules Card */}
              <div className="bg-[#1e1e30] p-6 rounded-2xl border border-gray-700/40 shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <Info className="w-6 h-6 text-yellow-400" />
                  <h4 className="text-xl font-semibold text-white">Event Rules</h4>
                </div>
                <ul className="list-disc list-inside text-gray-300 pl-4 space-y-2">
                  {rules.map((rule, index) => (
                    <li key={index}>{rule}</li>
                  ))}
                </ul>
              </div>

              {/* Upcoming Events */}
              <div className="bg-[#1e1e30] p-6 rounded-2xl border border-gray-700/40 shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-6 h-6 text-blue-400" />
                  <h4 className="text-xl font-semibold text-white">Upcoming Events</h4>
                </div>
                <p className="text-gray-400">Stay tuned! Upcoming events will be listed here soon.</p>
              </div>
            </>
          )}
        </div>
      </div>
      </SidebarLayout>
    </>
  )
}

export default Dashboard
