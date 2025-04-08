'use client'

import Navbar from '@/components/main/Navbar'
import React, { useEffect, useState } from 'react'
import { databases } from '@/lib/appwrite'
import conf from '@/lib/conf'
import { useUser } from '@clerk/nextjs'
import { Query } from 'appwrite'
import { Loader2 } from 'lucide-react'
import StarsCanvas from '@/components/main/StarCanvas'

const Dashboard = () => {
  const { user } = useUser()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any[]>([])

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

  return (
    <>
      <Navbar />
      <StarsCanvas/>
      <div className="min-h-screen bg-[#0a0a23] text-white px-4 py-40 flex flex-col items-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-10 text-center text-gradient bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          Your Event Dashboard
        </h2>

        {loading ? (
          <div className="flex items-center gap-3 text-lg md:text-xl text-gray-300">
            <Loader2 className="animate-spin w-6 h-6" />
            Fetching your registration details...
          </div>
        ) : data.length === 0 ? (
          <p className="text-lg md:text-xl text-gray-400 text-center">No registrations found. Join an event to get started!</p>
        ) : (
          <div className="w-full max-w-4xl grid gap-8 ">
            {data.map((doc) => (
              <div
                key={doc.$id}
                className="bg-[#1c1c3a] p-6 md:p-8 rounded-2xl shadow-xl border border-gray-700 transition hover:shadow-purple-800/40"
              >
                <div className="flex flex-col md:flex-row md:justify-between mb-4">
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white tracking-wide">{doc.name}</h3>
                  <span className="text-lg md:text-xl text-green-400 font-semibold mt-2 md:mt-0">
                    ₹{doc.amount}
                  </span>
                </div>

                <div className="grid gap-3 md:gap-10 text-base md:text-2xl text-gray-300 leading-relaxed">
                  <div>
                    <span className="font-medium text-white">🎓 College:</span> {doc.college}
                  </div>
                  <div>
                    <span className="font-medium text-white">🏢 Department:</span> {doc.department}
                  </div>
                  <div>
                    <span className="font-medium text-white">📞 Phone:</span> {doc.phone}
                  </div>
                  <div>
                    <span className="font-medium text-white">🧾 Transaction ID:</span> {doc.transactionId}
                  </div>
                  <div>
                    <span className="font-medium text-white">🎯 Selected Events:</span>{' '}
                    {doc.selectedEvents
                      ? JSON.parse(doc.selectedEvents).map((event: string, index: number) => (
                          <span
                            key={index}
                            className="inline-block bg-purple-600/20 text-purple-300 px-3 py-1 rounded-md mr-2 mt-1 text-sm md:text-lg"
                          >
                            {event}
                          </span>
                        ))
                      : 'N/A'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default Dashboard
