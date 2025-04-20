"use client"

import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { fetchEvents, fetchUserData } from "../firebase/firebase"
import Navbar from "../components/Navbar"
import NeonCard from "../components/ui/NeonCard"
import QRCodeGenerator from "../components/QRCodeGenerator"
import QRCodePopup from "../components/QRCodePopup"
import { Clock, AlertCircle } from "lucide-react"

interface TicketData {
  qrCode: string
  code: string
  status: string
  color: string
  userName?: string
}

const UserTickets: React.FC = () => {
  const { currentUser, loading } = useAuth()
  const navigate = useNavigate()

  const [userData, setUserData] = useState<any>(null)
  const [events, setEvents] = useState<any>({})
  const [tickets, setTickets] = useState<any>({})
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [isQRPopupOpen, setIsQRPopupOpen] = useState(false)

  useEffect(() => {
    if (!loading && !currentUser) {
      navigate("/login")
    }
  }, [currentUser, loading, navigate])

  useEffect(() => {
    const loadData = async () => {
      if (currentUser) {
        // Fetch user data
        const data = await fetchUserData(currentUser.uid)
        setUserData(data)

        // Fetch events
        const eventsData = await fetchEvents()
        setEvents(eventsData)

        // Extract tickets
        if (data && data.tickets) {
          setTickets(data.tickets)
        }
      }
    }

    loadData()
  }, [currentUser])

  const handleTicketClick = (eventId: string, ticket: any) => {
    const eventName =
      eventId === "food"
        ? "Food Ticket"
        : eventId === "foodTeam"
          ? "Team Food Ticket"
          : eventId === "entry"
            ? "Entry Ticket"
            : events[eventId]?.name || "Event Ticket"

    // Get the proper user name
    const userName = ticket.userName || userData?.name || "Participant"

    setSelectedTicket({
      eventId,
      eventName,
      userName,
      ...ticket,
    })

    setIsQRPopupOpen(true)
  }

  const closeQRPopup = () => {
    setIsQRPopupOpen(false)
    setSelectedTicket(null)
  }

  if (loading || !userData) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  // Check if user has registered for events but payment is pending
  const hasRegisteredEvents = userData.eventsRegistered && userData.eventsRegistered.length > 0
  const isPendingPayment = userData.payment && userData.payment.status === "pending"

  // Check if user has no tickets
  const hasTickets = userData.tickets && Object.keys(userData.tickets).length > 0

  // Show pending payment message if registered but payment pending
  if (hasRegisteredEvents && isPendingPayment) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="container mx-auto px-4 py-8 mt-16">
          <h1 className="text-3xl font-bold mb-8 gradient-text">Your Tickets</h1>

          <NeonCard type="faculty" className="p-8 max-w-2xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <Clock className="w-16 h-16 text-yellow-500 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Payment Pending Approval</h2>
              <p className="text-gray-300 mb-6">
                Your tickets will be generated once your payment is approved by the admin. You have registered for{" "}
                {userData.eventsRegistered.length} event(s).
              </p>

              <div className="w-full bg-gray-800 bg-opacity-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                  <div>
                    <p className="text-gray-400">Payment Method</p>
                    <p className="font-semibold capitalize">{userData.payment.method}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Amount</p>
                    <p className="font-semibold">₹{userData.payment.amount}</p>
                  </div>
                  {userData.payment.txnId && (
                    <div>
                      <p className="text-gray-400">Transaction ID</p>
                      <p className="font-semibold">{userData.payment.txnId}</p>
                    </div>
                  )}
                  {userData.payment.teamMember && (
                    <div>
                      <p className="text-gray-400">Team Member</p>
                      <p className="font-semibold">{userData.payment.teamMember}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => navigate("/user/events")}
                  className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Manage Events
                </button>
                <button
                  onClick={() => navigate("/user/payments")}
                  className="px-6 py-2 border border-purple-600 text-purple-400 rounded hover:bg-purple-900 hover:bg-opacity-30"
                >
                  View Payment
                </button>
              </div>
            </div>
          </NeonCard>
        </div>
      </div>
    )
  }

  // Show no tickets message if no events registered
  if (!hasRegisteredEvents || !hasTickets) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="container mx-auto px-4 py-8 mt-16">
          <h1 className="text-3xl font-bold mb-8 gradient-text">Your Tickets</h1>

          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-center max-w-md">
              <AlertCircle className="w-16 h-16 text-purple-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">No Tickets Available</h2>
              <p className="text-gray-400 mb-6">
                You don't have any tickets yet. Register for events and complete payment to get tickets.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate("/user/events")}
                  className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Register for Events
                </button>
                <button
                  onClick={() => navigate("/user/payments")}
                  className="px-6 py-2 border border-purple-600 text-purple-400 rounded hover:bg-purple-900 hover:bg-opacity-30"
                >
                  Complete Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Filter for event tickets and food tickets
  const eventTickets = Object.entries(tickets).filter(
    ([key]) => key !== "food" && key !== "foodTeam" && key !== "entry" && !key.includes("_team"),
  )
  const teamEventTickets = Object.entries(tickets).filter(([key]) => key.includes("_team"))
  const foodTickets = Object.entries(tickets).filter(([key]) => key === "food" || key === "foodTeam")
  const entryTickets = Object.entries(tickets).filter(([key]) => key === "entry" || key === "entry_team")

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="container mx-auto px-4 py-8 mt-16">
        <h1 className="text-3xl font-bold mb-8 gradient-text">Your Tickets</h1>

        {entryTickets.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-6">Entry Tickets</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {entryTickets.map(([ticketKey, ticketData]: [string, any]) => {
                const isUsed = ticketData.status === "Not Yet Used" ? false : true

                return (
                  <NeonCard
                    key={ticketKey}
                    type="tech"
                    className={`p-6 cursor-pointer ${isUsed ? "opacity-60" : ""}`}
                    onClick={() => handleTicketClick(ticketKey, ticketData)}
                  >
                    <div className="mb-4 flex justify-between items-center">
                      <h3 className="text-xl font-semibold">
                        {ticketKey === "entry_team" ? "Team Entry Ticket" : "Entry Ticket"}
                      </h3>
                      <div
                        className={`w-3 h-3 rounded-full ${ticketData.color === "yellow" ? "bg-yellow-400" : "bg-green-500"}`}
                      ></div>
                    </div>

                    {ticketData.userName && <p className="text-sm text-gray-300 mb-4">For: {ticketData.userName}</p>}

                    <div className="flex justify-center mb-4">
                      <QRCodeGenerator value={ticketData.qrCode} size={150} />
                    </div>

                    <div className="text-center">
                      <p className="text-sm text-gray-400">Ticket Code</p>
                      <p className="text-2xl font-bold tracking-wider">{ticketData.code}</p>
                      <p className="mt-2 text-sm text-gray-300">Status: {ticketData.status}</p>
                    </div>
                  </NeonCard>
                )
              })}
            </div>
          </div>
        )}

        {foodTickets.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-6">Food Tickets</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {foodTickets.map(([ticketKey, ticketData]: [string, any]) => {
                const isUsed = ticketData.status === "Not Yet Used" ? false : true

                return (
                  <NeonCard
                    key={ticketKey}
                    type="faculty"
                    className={`p-6 cursor-pointer ${isUsed ? "opacity-60" : ""}`}
                    onClick={() => handleTicketClick(ticketKey, ticketData)}
                  >
                    <div className="mb-4 flex justify-between items-center">
                      <h3 className="text-xl font-semibold">
                        {ticketKey === "foodTeam" ? "Team Food Ticket" : "Food Ticket"}
                      </h3>
                      <div
                        className={`w-3 h-3 rounded-full ${ticketData.color === "yellow" ? "bg-yellow-400" : "bg-green-500"}`}
                      ></div>
                    </div>

                    {ticketData.userName && <p className="text-sm text-gray-300 mb-4">For: {ticketData.userName}</p>}

                    <div className="flex justify-center mb-4">
                      <QRCodeGenerator value={ticketData.qrCode} size={150} />
                    </div>

                    <div className="text-center">
                      <p className="text-sm text-gray-400">Ticket Code</p>
                      <p className="text-2xl font-bold tracking-wider">{ticketData.code}</p>
                      <p className="mt-2 text-sm text-gray-300">Status: {ticketData.status}</p>
                    </div>
                  </NeonCard>
                )
              })}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold mb-6">Event Tickets</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventTickets.map(([eventId, ticketData]: [string, any]) => {
              const eventData = events[eventId] || { name: "Unknown Event", type: "technical" }
              const isParticipated = ticketData.status === "Participated"

              // Find corresponding team ticket if exists
              const teamTicketEntry = teamEventTickets.find(([key]) => key === `${eventId}_team`) as
                | [string, TicketData]
                | undefined

              return (
                <React.Fragment key={eventId}>
                  <NeonCard
                    type={eventData.type === "technical" ? "tech" : "nontech"}
                    className={`p-6 cursor-pointer ${isParticipated ? "opacity-60" : ""}`}
                    onClick={() => handleTicketClick(eventId, ticketData)}
                  >
                    <div className="mb-4 flex justify-between items-center">
                      <h3 className="text-xl font-semibold">{eventData.name}</h3>
                      <div
                        className={`w-3 h-3 rounded-full ${ticketData.color === "yellow" ? "bg-yellow-400" : "bg-green-500"}`}
                      ></div>
                    </div>

                    <div className="text-sm text-gray-400 mb-4">
                      <p>Venue: {eventData.venue}</p>
                      <p>Time: {eventData.time}</p>
                    </div>

                    <div className="flex justify-center mb-4">
                      <QRCodeGenerator value={ticketData.qrCode} size={150} />
                    </div>

                    <div className="text-center">
                      <p className="text-sm text-gray-400">Ticket Code</p>
                      <p className="text-2xl font-bold tracking-wider">{ticketData.code}</p>
                      <p className="mt-2 text-sm text-gray-300">Status: {ticketData.status}</p>
                      {userData.name && <p className="mt-1 text-sm text-gray-300">For: {userData.name}</p>}
                    </div>
                  </NeonCard>

                  {/* Render team ticket if exists */}
                  {teamTicketEntry && (
                    <NeonCard
                      type={eventData.type === "technical" ? "tech" : "nontech"}
                      className={`p-6 cursor-pointer ${teamTicketEntry[1].status === "Participated" ? "opacity-60" : ""}`}
                      onClick={() => handleTicketClick(teamTicketEntry[0], teamTicketEntry[1])}
                    >
                      <div className="mb-4 flex justify-between items-center">
                        <h3 className="text-xl font-semibold">{eventData.name} (Team)</h3>
                        <div
                          className={`w-3 h-3 rounded-full ${teamTicketEntry[1].color === "yellow" ? "bg-yellow-400" : "bg-green-500"}`}
                        ></div>
                      </div>

                      <div className="text-sm text-gray-400 mb-4">
                        <p>Venue: {eventData.venue}</p>
                        <p>Time: {eventData.time}</p>
                      </div>

                      <div className="flex justify-center mb-4">
                        <QRCodeGenerator value={teamTicketEntry[1].qrCode} size={150} />
                      </div>

                      <div className="text-center">
                        <p className="text-sm text-gray-400">Ticket Code</p>
                        <p className="text-2xl font-bold tracking-wider">{teamTicketEntry[1].code}</p>
                        <p className="mt-2 text-sm text-gray-300">Status: {teamTicketEntry[1].status}</p>
                        {teamTicketEntry[1].userName && (
                          <p className="mt-1 text-sm text-gray-300">For: {teamTicketEntry[1].userName}</p>
                        )}
                      </div>
                    </NeonCard>
                  )}
                </React.Fragment>
              )
            })}
          </div>
        </div>
      </div>

      {selectedTicket && (
        <QRCodePopup
          isOpen={isQRPopupOpen}
          onClose={closeQRPopup}
          qrValue={selectedTicket.qrCode}
          code={selectedTicket.code}
          userName={selectedTicket.userName}
          eventName={selectedTicket.eventName}
        />
      )}
    </div>
  )
}

export default UserTickets
