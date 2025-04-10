'use client'

import Navbar from '@/components/main/Navbar'
import React, { useEffect, useState } from 'react'
import { databases } from '@/lib/appwrite'
import conf from '@/lib/conf'
import { useUser } from '@clerk/nextjs'
import { Query } from 'appwrite'
import { Loader2, Calendar, Building2, Phone, Receipt, Target } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { BorderBeam } from '@/components/magicui/border-beam'

const Dashboard = () => {
  const { user } = useUser()
  const router = useRouter()
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
      <div className="min-h-screen text-white px-4 py-28 md:py-36 flex flex-col items-center mt-10">
        <div className="w-full max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            Your Event Dashboard
          </h2>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="animate-spin w-10 h-10 text-purple-500 mb-4" />
              <p className="text-lg md:text-xl text-gray-300">Fetching your registration details...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="text-center bg-[#171732]/60 backdrop-blur-sm rounded-3xl p-10 border border-gray-700/30 shadow-xl max-w-xl mx-auto">
              <div className="rounded-full w-20 h-20 bg-purple-600/20 flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-10 h-10 text-purple-300" />
              </div>
              <p className="text-xl md:text-2xl text-gray-200 mb-3 font-medium">No registrations found</p>
              <p className="text-gray-400 mb-8">You haven't registered for any events yet.</p>
              <button
                onClick={() => router.push('/event-registration')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-8 rounded-full transition duration-300 text-base shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50"
              >
                Register Now
              </button>
            </div>
          ) : (
            <div className="w-full grid gap-8">
              {data.map((doc) => (
                <div
                  key={doc.$id}
                  className="bg-gradient-to-br from-[#1b1b36]/80 to-[#111123]/80 backdrop-blur-sm p-6 md:p-8 rounded-3xl shadow-xl border border-gray-700/30 hover:shadow-purple-600/20 transition duration-500 transform hover:-translate-y-1"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-700/50 pb-5 mb-6">
                    <h3 className="text-3xl md:text-4xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 capitalize">
                      {doc.name}
                    </h3>
                    <div className="mt-4 md:mt-0 bg-green-500/10 text-green-400 font-bold px-4 py-2 rounded-full flex items-center">
                      <span className="text-lg md:text-xl">₹{doc.amount}</span>
                    </div>
                  </div>

                  <div className="grid gap-5 text-base md:text-lg text-gray-300">
                    <div className="flex items-center gap-3">
                      <Building2 className="w-5 h-5 text-purple-400 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-gray-200">College:</span> 
                        <span className="ml-2 capitalize">{doc.college}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Building2 className="w-5 h-5 text-purple-400 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-gray-200">Department:</span> 
                        <span className="ml-2">{doc.department}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-purple-400 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-gray-200">Phone:</span> 
                        <span className="ml-2">{doc.phone}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Receipt className="w-5 h-5 text-purple-400 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-gray-200">Transaction ID:</span> 
                        <span className="ml-2 font-mono">{doc.transactionId}</span>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <div className="flex items-center gap-3 mb-3">
                        <Target className="w-5 h-5 text-purple-400 flex-shrink-0" />
                        <span className="font-medium text-gray-200">Selected Events:</span>
                      </div>
                      <div className="flex flex-wrap gap-2 pl-8">
                        {doc.selectedEvents
                          ? JSON.parse(doc.selectedEvents).map((event: string, index: number) => (
                              <span
                                key={index}
                                className="inline-block bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-200 px-4 py-2 rounded-full text-sm border border-purple-500/30"
                              >
                                {event}
                              </span>
                            ))
                          : <span className="text-gray-400">N/A</span>}
                      </div>
                    </div>
                  <BorderBeam duration={6} size={200}/>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Dashboard