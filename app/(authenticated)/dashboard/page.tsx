'use client'

import React, { useEffect, useState } from 'react'
import { databases } from '@/lib/appwrite'
import conf from '@/lib/conf'
import { useUser } from '@clerk/nextjs'
import { Query } from 'appwrite'
import { User, Mail, Phone, Calendar, Hash, ClipboardList, CheckCircle, ShieldCheck, Clock10Icon, Users } from 'lucide-react'
import SidebarLayout from '@/components/main/SidebarLayout'
const Dashboard = () => {
  const { user } = useUser()
  const [loading, setLoading] = useState(true)
  const [registration, setRegistration] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return
      try {
        const res = await databases.listDocuments(
          conf.appwriteDatabaseId,
          conf.appwriteCollectionId,
          [Query.equal('userId', user.id)]
        )

        if (res.documents.length > 0) {
          const doc = res.documents[0]
          const processed = {
            ...doc,
            selectedEvents: tryParseEvents(doc.selectedEvents)
          }
          setRegistration(processed)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user?.id])

  const tryParseEvents = (eventsData: any) => {
    try {
      if (!eventsData) return []

      if (Array.isArray(eventsData)) {
        return eventsData
      }

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

  const totalEvents = 7
  const registeredEventsCount = registration?.selectedEvents?.length || 0
  const paymentApproved = registration?.paymentapproval || false
  const paymentAmount = registration?.amount || 0

  return (
    <SidebarLayout>
      <div className="min-h-screen text-white px-4 flex flex-col items-center py-8">
        <div className="w-full max-w-6xl space-y-8">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            Your Event Dashboard
          </h2>

          <h3 className="text-3xl md:text-4xl font-semibold text-white capitalize">
            Hello {user?.firstName || user?.username || 'Participant'} 👋
          </h3>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Clock10Icon className="animate-spin w-10 h-10 text-purple-500 mr-4" />
              <p className="text-xl text-gray-300">Loading your dashboard...</p>
            </div>
          ) : registration ? (
            <div className="space-y-8">
              <div className="bg-[#1e1e30] p-6 rounded-2xl border border-gray-700/40 shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="flex flex-col items-center p-4 rounded-xl bg-[#252538]">
                    <ClipboardList className="w-8 h-8 text-purple-400 mb-2" />
                    <h3 className="text-xl font-bold">{totalEvents}</h3>
                    <p className="text-gray-400 text-xl">Total Events</p>
                  </div>

                  <div className="flex flex-col items-center p-4 rounded-xl bg-[#252538]">
                    <CheckCircle className="w-8 h-8 text-pink-400 mb-2" />
                    <h3 className="text-xl font-bold">{registeredEventsCount}</h3>
                    <p className="text-gray-400 text-xl">Registered Events</p>
                    {registration.selectedEvents?.length > 0 && (
                      <p className="text-xl text-gray-500 mt-1 text-center">
                        {registration.selectedEvents.join(', ')}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-center p-4 rounded-xl bg-[#252538]">
                    {paymentApproved ? (
                      <ShieldCheck className="w-8 h-8 text-green-400 mb-2" />
                    ) : (
                      <Clock10Icon className="w-8 h-8 text-yellow-400 mb-2" />
                    )}
                    <h3 className="text-xl font-bold">
                      {paymentApproved ? "Approved" : "Pending"}
                    </h3>
                    <p className="text-gray-400 text-xl">Payment Status</p>
                    {paymentAmount > 0 && (
                      <p className="text-xl text-gray-500 mt-1">₹{paymentAmount}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-xl font-semibold flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-400" />
                   UID
                  </h4>

                  <div className="bg-[#252538] p-3 rounded-lg flex items-center gap-2">
                    <Hash className="w-5 h-5 text-gray-400" />
                    <span className="text-xl">
                     {registration.uid}
                    </span>
                  </div>

                  {/* Rules Section */}
                  <div className="bg-[#252538] p-4 rounded-lg">
                    <h4 className="text-4xl font-semibold text-white py-4">Event Rules</h4>
                    <ol className=" pl-5 space-y-4 text-2xl text-gray-300">
                      <li>Individual participation or teams of up to 2 members are allowed.</li>
                      <li>For the PPT event, teams of 3 members are required.</li>
                      <li>Each participant may register separately or as a team.</li>
                      <li>Ensure you submit your presentations on time.</li>
                      <li>Follow all guidelines provided during the event.</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-gray-300">No registration found. Please register for events first.</p>
            </div>
          )}
        </div>
      </div>
    </SidebarLayout>
  )
}

export default Dashboard
