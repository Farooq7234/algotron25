"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { fetchEvents, fetchAllUsers, updateAttendance } from "../firebase/firebase"
import { useToast } from "@/hooks/use-toast"
import QRCodeScanner from "../components/QRCodeScanner"
import Navbar from "../components/Navbar"
import NeonCard from "../components/ui/NeonCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QrCode, Ticket, Search, CheckCircle, List, FileText } from "lucide-react"
import * as XLSX from "xlsx"

const AdminAttendance: React.FC = () => {
  const { currentUser, loading, isAdmin } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [events, setEvents] = useState<Record<string, any>>({})
  const [users, setUsers] = useState<Record<string, any>>({})
  const [selectedEvent, setSelectedEvent] = useState<string>("")
  const [manualCode, setManualCode] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [isScanning, setIsScanning] = useState<boolean>(false)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [searchResults, setSearchResults] = useState<Array<[string, any]>>([])
  const [allAttendees, setAllAttendees] = useState<Array<[string, any]>>([])

  useEffect(() => {
    if (!loading) {
      if (!currentUser) {
        navigate("/login")
      } else if (!isAdmin) {
        navigate("/dashboard")
      }
    }
  }, [currentUser, loading, isAdmin, navigate])

  useEffect(() => {
    const loadData = async () => {
      if (currentUser && isAdmin) {
        // Fetch events
        const eventsData = await fetchEvents()
        setEvents(eventsData)

        // Set first event as selected by default
        if (Object.keys(eventsData).length > 0 && !selectedEvent) {
          setSelectedEvent(Object.keys(eventsData)[0])
        }

        // Fetch all users
        const usersData = await fetchAllUsers()
        setUsers(usersData)
      }
    }

    loadData()
  }, [currentUser, isAdmin])

  // Update the event options to include both entry tickets under one dropdown
  const eventOptions = [
    { value: "all", label: "All Events" },
    ...Object.entries(events).map(([eventId, eventData]: [string, any]) => ({
      value: eventId,
      label: eventData.name,
    })),
    { value: "food", label: "Food Tickets (Individual & Team)" },
    { value: "entry", label: "Entry Tickets (Individual & Team)" },
  ]

  // Update the useEffect for attendees to handle combined entry tickets
  useEffect(() => {
    if (Object.keys(users).length > 0) {
      let attendeesList: Array<[string, any]> = []

      if (selectedEvent === "all") {
        // For "All Events", show all users with any ticket
        attendeesList = Object.entries(users).filter(([_, userData]: [string, any]) => {
          return userData.tickets && Object.keys(userData.tickets).length > 0
        })
      } else if (selectedEvent === "food") {
        // For food tickets, check both individual and team food tickets
        attendeesList = Object.entries(users).filter(([_, userData]: [string, any]) => {
          return userData.tickets && (userData.tickets.food || userData.tickets.foodTeam)
        })
      } else if (selectedEvent === "entry") {
        // For entry tickets, check both individual and team entry tickets
        attendeesList = Object.entries(users).filter(([_, userData]: [string, any]) => {
          return userData.tickets && (userData.tickets.entry || userData.tickets.entry_team)
        })
      } else {
        // For regular event tickets
        attendeesList = Object.entries(users).filter(([_, userData]: [string, any]) => {
          const hasMainTicket = userData.tickets && userData.tickets[selectedEvent]
          const hasTeamTicket = userData.tickets && userData.tickets[`${selectedEvent}_team`]
          return hasMainTicket || hasTeamTicket
        })
      }

      setAllAttendees(attendeesList)
    } else {
      setAllAttendees([])
    }
  }, [selectedEvent, users])

  // Handle search functionality
  useEffect(() => {
    if (searchQuery.trim()) {
      const results = allAttendees.filter(([_, userData]: [string, any]) => {
        const query = searchQuery.toLowerCase()
        return (
          userData.name?.toLowerCase().includes(query) ||
          userData.college?.toLowerCase().includes(query) ||
          userData.mobile?.includes(searchQuery)
        )
      })

      setSearchResults(results)
    } else {
      setSearchResults(allAttendees)
    }
  }, [searchQuery, allAttendees])

  const handleScanSuccess = async (data: string) => {
    setIsScanning(false)
    setIsProcessing(true)

    try {
      // Parse QR code data (format: QR_<userId>_<eventId>)
      const parts = data.split("_")
      if (parts.length !== 3 || parts[0] !== "QR") {
        throw new Error("Invalid QR code format")
      }

      const userId = parts[1]
      const eventId = parts[2]

      // Update attendance
      await updateAttendance(userId, eventId)

      // Update local state
      const updatedUsers = { ...users }
      if (updatedUsers[userId] && updatedUsers[userId].tickets && updatedUsers[userId].tickets[eventId]) {
        updatedUsers[userId].tickets[eventId].status =
          eventId === "food" || eventId === "foodTeam" ? "Ticket Used" : "Participated"
        updatedUsers[userId].tickets[eventId].color = "green"
      }
      setUsers(updatedUsers)

      const userName = updatedUsers[userId]?.name || "Unknown"
      const eventName =
        events[eventId]?.name || (eventId === "food" ? "Food" : eventId === "foodTeam" ? "Team Food" : "Unknown Event")

      toast({
        title: "Attendance marked successfully",
        description: `${userName} has been marked present for ${eventName}`,
        variant: "default",
      })
    } catch (error: any) {
      toast({
        title: "Failed to mark attendance",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleManualCodeSubmit = async () => {
    if (!manualCode.trim()) return

    setIsProcessing(true)

    try {
      // Find user with matching ticket code
      let foundUserId = ""
      let foundEventId = ""

      Object.entries(users).some(([userId, userData]: [string, any]) => {
        if (!userData.tickets) return false

        return Object.entries(userData.tickets).some(([eventId, ticketData]: [string, any]) => {
          if (ticketData.code === manualCode) {
            foundUserId = userId
            foundEventId = eventId
            return true
          }
          return false
        })
      })

      if (!foundUserId || !foundEventId) {
        throw new Error("No ticket found with this code")
      }

      // If checking for a specific event (not "all"), make sure the found ticket matches
      if (selectedEvent !== "all" && foundEventId !== selectedEvent) {
        throw new Error(`This code is for a different event, not for ${events[selectedEvent]?.name || selectedEvent}`)
      }

      // Update attendance
      await updateAttendance(foundUserId, foundEventId)

      // Update local state
      const updatedUsers = { ...users }
      if (
        updatedUsers[foundUserId] &&
        updatedUsers[foundUserId].tickets &&
        updatedUsers[foundUserId].tickets[foundEventId]
      ) {
        updatedUsers[foundUserId].tickets[foundEventId].status =
          foundEventId === "food" || foundEventId === "foodTeam" ? "Ticket Used" : "Participated"
        updatedUsers[foundUserId].tickets[foundEventId].color = "green"
      }
      setUsers(updatedUsers)

      const userName = updatedUsers[foundUserId]?.name || "Unknown"
      const eventName =
        events[foundEventId]?.name ||
        (foundEventId === "food" ? "Food" : foundEventId === "foodTeam" ? "Team Food" : "Unknown Event")

      toast({
        title: "Attendance marked successfully",
        description: `${userName} has been marked present for ${eventName}`,
        variant: "default",
      })

      // Clear the input
      setManualCode("")
    } catch (error: any) {
      toast({
        title: "Failed to mark attendance",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleMarkAttendance = async (userId: string, eventId: string) => {
    setIsProcessing(true)

    try {
      // Update attendance
      await updateAttendance(userId, eventId)

      // Update local state
      const updatedUsers = { ...users }
      if (updatedUsers[userId] && updatedUsers[userId].tickets && updatedUsers[userId].tickets[eventId]) {
        updatedUsers[userId].tickets[eventId].status =
          eventId === "food" || eventId === "foodTeam" ? "Ticket Used" : "Participated"
        updatedUsers[userId].tickets[eventId].color = "green"
      }
      setUsers(updatedUsers)

      toast({
        title: "Attendance marked successfully",
        description: `${updatedUsers[userId]?.name} has been marked present`,
        variant: "default",
      })
    } catch (error: any) {
      toast({
        title: "Failed to mark attendance",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (loading || !isAdmin) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  const handleExportToExcel = () => {
    // Create Excel data
    const excelData = allAttendees.map(([userId, userData]) => {
      // For "All Events", we need to include all tickets
      if (selectedEvent === "all") {
        const tickets = userData.tickets ? Object.entries(userData.tickets) : []
        return tickets.map(([eventId, ticketData]: [string, any]) => ({
          Name: userData.name || "",
          College: userData.college || "",
          Branch: userData.branch || "",
          Mobile: userData.mobile || "",
          Event: events[eventId]?.name || eventId,
          Status: ticketData.status || "Not Registered",
          Code: ticketData.code || "",
          Timestamp: new Date().toLocaleString(),
        }))
      } else {
        // For specific events, include only the relevant ticket
        const ticket = userData.tickets?.[selectedEvent]
        const teamTicket = userData.tickets?.[`${selectedEvent}_team`]
        
        const entries = []
        
        if (ticket) {
          entries.push({
            Name: userData.name || "",
            College: userData.college || "",
            Branch: userData.branch || "",
            Mobile: userData.mobile || "",
            Event: events[selectedEvent]?.name || selectedEvent,
            Status: ticket.status || "Not Registered",
            Code: ticket.code || "",
            Timestamp: new Date().toLocaleString(),
          })
        }
        
        if (teamTicket) {
          entries.push({
            Name: teamTicket.userName || userData.name || "",
            College: userData.college || "",
            Branch: userData.branch || "",
            Mobile: userData.mobile || "",
            Event: `${events[selectedEvent]?.name || selectedEvent} (Team)`,
            Status: teamTicket.status || "Not Registered",
            Code: teamTicket.code || "",
            Timestamp: new Date().toLocaleString(),
          })
        }
        
        return entries
      }
    }).flat() // Flatten the array of arrays into a single array

    // Convert to worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance")

    // Generate Excel file
    const eventName = selectedEvent === "all" ? "All_Events" : events[selectedEvent]?.name || selectedEvent
    XLSX.writeFile(workbook, `${eventName}_Attendance_${new Date().toLocaleDateString()}.xlsx`)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold gradient-text">Attendance Tracking</h1>
          <Button onClick={handleExportToExcel} className="bg-green-600 hover:bg-green-700">
            <FileText className="mr-2 h-4 w-4" />
            Export to Excel
          </Button>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium mb-2">Select Event</label>
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white"
          >
            {eventOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="list">
              <List className="h-4 w-4 mr-2" />
              Attendee List
            </TabsTrigger>
            <TabsTrigger value="scan">
              <QrCode className="h-4 w-4 mr-2" />
              Scan QR Code
            </TabsTrigger>
            <TabsTrigger value="manual">
              <Ticket className="h-4 w-4 mr-2" />
              Enter Code
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-6">
            <NeonCard type="faculty" className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">
                  {selectedEvent === "all" ? "All Tickets" : 
                   selectedEvent === "food" ? "Food Tickets" :
                   selectedEvent === "entry" ? "Entry Tickets" : 
                   events[selectedEvent]?.name || "Tickets"}
                </h2>
                <div className="relative w-64">
                  <Input
                    className="pl-10 bg-gray-900 border-gray-700 text-white"
                    placeholder="Search attendees..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {searchResults.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">No attendees found</div>
                ) : (
                  searchResults.map(([userId, userData]: [string, any]) => {
                    if (!userData.tickets) return null

                    if (selectedEvent === "all") {
                      // Show all tickets for the user
                      return (
                        <div
                          key={userId}
                          className="p-4 border border-gray-700 rounded-lg bg-gray-800 bg-opacity-50 mb-4"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">{userData.name}</h3>
                              <p className="text-sm text-gray-400">
                                {userData.college} - {userData.branch}
                              </p>
                              <p className="text-sm text-gray-400">Mobile: {userData.mobile}</p>

                              {Object.entries(userData.tickets).map(([eventId, ticketData]: [string, any]) => {
                                const isFoodTicket = eventId === "food" || eventId === "foodTeam"
                                const isEntryTicket = eventId === "entry" || eventId === "entry_team"
                                const isTeamTicket = eventId.endsWith("_team") || eventId === "foodTeam" || eventId === "entry_team"
                                const eventName = 
                                  events[eventId]?.name || 
                                  (eventId === "food" ? "Food" : 
                                   eventId === "foodTeam" ? "Team Food" :
                                   eventId === "entry" ? "Entry" :
                                   eventId === "entry_team" ? "Team Entry" : 
                                   eventId.replace("_team", ""))

                                return (
                                  <div key={eventId} className="mt-2 flex items-center">
                                    <span className="text-xs font-medium mr-2">
                                      {isTeamTicket ? `Team Ticket (${ticketData.userName || userData.name})` : "Ticket"}: {eventName}
                                    </span>
                                    <span className="text-xs font-medium mr-2">Code: {ticketData.code}</span>
                                    <span
                                      className={`inline-block w-3 h-3 rounded-full ${
                                        ticketData.status === "Participated" || ticketData.status === "Ticket Used" 
                                          ? "bg-green-500" 
                                          : "bg-yellow-400"
                                      }`}
                                    ></span>

                                    {(ticketData.status !== "Participated" && ticketData.status !== "Ticket Used") && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="ml-2 bg-green-600 hover:bg-green-700 text-white"
                                        disabled={isProcessing}
                                        onClick={() => handleMarkAttendance(userId, eventId)}
                                      >
                                        {isFoodTicket ? "Mark Used" : "Mark Present"}
                                      </Button>
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      )
                    }

                    // Rest of the code for specific event types (food, entry, regular events) remains the same
                    // ... [previous code for food, entry, and regular event tickets]
                    
                    // For food tickets section, show both individual and team food tickets
                    if (selectedEvent === "food") {
                      const foodTicket = userData.tickets.food
                      const teamFoodTicket = userData.tickets.foodTeam

                      if (!foodTicket && !teamFoodTicket) return null

                      return (
                        <div
                          key={userId}
                          className="p-4 border border-gray-700 rounded-lg bg-gray-800 bg-opacity-50 mb-4"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">{userData.name}</h3>
                              <p className="text-sm text-gray-400">
                                {userData.college} - {userData.branch}
                              </p>
                              <p className="text-sm text-gray-400">Mobile: {userData.mobile}</p>

                              {foodTicket && (
                                <div className="mt-2 flex items-center">
                                  <span className="text-xs font-medium mr-2">Individual Food Ticket</span>
                                  <span className="text-xs font-medium mr-2">Code: {foodTicket.code}</span>
                                  <span
                                    className={`inline-block w-3 h-3 rounded-full ${
                                      foodTicket.status === "Ticket Used" ? "bg-green-500" : "bg-yellow-400"
                                    }}`}
                                  ></span>

                                  {foodTicket.status !== "Ticket Used" && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="ml-2 bg-green-600 hover:bg-green-700 text-white"
                                      disabled={isProcessing}
                                      onClick={() => handleMarkAttendance(userId, "food")}
                                    >
                                      Mark Used
                                    </Button>
                                  )}
                                </div>
                              )}

                              {teamFoodTicket && (
                                <div className="mt-2 flex items-center">
                                  <span className="text-xs font-medium mr-2">
                                    Team Food Ticket ({teamFoodTicket.userName})
                                  </span>
                                  <span className="text-xs font-medium mr-2">Code: {teamFoodTicket.code}</span>
                                  <span
                                    className={`inline-block w-3 h-3 rounded-full ${
                                      teamFoodTicket.status === "Ticket Used" ? "bg-green-500" : "bg-yellow-400"
                                    }}`}
                                  ></span>

                                  {teamFoodTicket.status !== "Ticket Used" && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="ml-2 bg-green-600 hover:bg-green-700 text-white"
                                      disabled={isProcessing}
                                      onClick={() => handleMarkAttendance(userId, "foodTeam")}
                                    >
                                      Mark Used
                                    </Button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    }

                    // For entry tickets
                    if (selectedEvent === "entry") {
                      const entryTicket = userData.tickets.entry
                      const teamEntryTicket = userData.tickets.entry_team

                      if (!entryTicket && !teamEntryTicket) return null

                      return (
                        <div key={userId} className="p-4 border border-gray-700 rounded-lg bg-gray-800 bg-opacity-50 mb-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">{userData.name}</h3>
                              <p className="text-sm text-gray-400">
                                {userData.college} - {userData.branch}
                              </p>
                              <p className="text-sm text-gray-400">Mobile: {userData.mobile}</p>

                              {entryTicket && (
                                <div className="mt-2 flex items-center">
                                  <span className="text-xs font-medium mr-2">Entry Ticket</span>
                                  <span className="text-xs font-medium mr-2">Code: {entryTicket.code}</span>
                                  <span
                                    className={`inline-block w-3 h-3 rounded-full ${
                                      entryTicket.status === "Ticket Used" ? "bg-green-500" : "bg-yellow-400"
                                    }`}
                                  ></span>

                                  {entryTicket.status !== "Ticket Used" && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="ml-2 bg-green-600 hover:bg-green-700 text-white"
                                      disabled={isProcessing}
                                      onClick={() => handleMarkAttendance(userId, "entry")}
                                    >
                                      Mark Present
                                    </Button>
                                  )}
                                </div>
                              )}

                              {teamEntryTicket && (
                                <div className="mt-2 flex items-center">
                                  <span className="text-xs font-medium mr-2">
                                    Team Entry Ticket ({teamEntryTicket.userName})
                                  </span>
                                  <span className="text-xs font-medium mr-2">Code: {teamEntryTicket.code}</span>
                                  <span
                                    className={`inline-block w-3 h-3 rounded-full ${
                                      teamEntryTicket.status === "Ticket Used" ? "bg-green-500" : "bg-yellow-400"
                                    }`}
                                  ></span>

                                  {teamEntryTicket.status !== "Ticket Used" && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="ml-2 bg-green-600 hover:bg-green-700 text-white"
                                      disabled={isProcessing}
                                      onClick={() => handleMarkAttendance(userId, "entry_team")}
                                    >
                                      Mark Present
                                    </Button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    }

                    // For regular event tickets
                    const ticket = userData.tickets[selectedEvent]
                    const teamTicket = userData.tickets[`${selectedEvent}_team`]

                    if (!ticket && !teamTicket) return null

                    const eventName = events[selectedEvent]?.name || "Unknown Event"

                    return (
                      <div key={userId} className="p-4 border border-gray-700 rounded-lg bg-gray-800 bg-opacity-50 mb-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{userData.name}</h3>
                            <p className="text-sm text-gray-400">
                              {userData.college} - {userData.branch}
                            </p>
                            <p className="text-sm text-gray-400">Mobile: {userData.mobile}</p>

                            {ticket && (
                              <div className="mt-2 flex items-center">
                                <span className="text-xs font-medium mr-2">Event: {eventName}</span>
                                <span className="text-xs font-medium mr-2">Code: {ticket.code}</span>
                                <span
                                  className={`inline-block w-3 h-3 rounded-full ${
                                    ticket.status === "Participated" ? "bg-green-500" : "bg-yellow-400"
                                  }`}
                                ></span>

                                {ticket.status !== "Participated" && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="ml-2 bg-green-600 hover:bg-green-700 text-white"
                                    disabled={isProcessing}
                                    onClick={() => handleMarkAttendance(userId, selectedEvent)}
                                  >
                                    Mark Present
                                  </Button>
                                )}
                              </div>
                            )}

                            {teamTicket && (
                              <div className="mt-2 flex items-center">
                                <span className="text-xs font-medium mr-2">Team Member: {teamTicket.userName}</span>
                                <span className="text-xs font-medium mr-2">Code: {teamTicket.code}</span>
                                <span
                                  className={`inline-block w-3 h-3 rounded-full ${
                                    teamTicket.status === "Participated" ? "bg-green-500" : "bg-yellow-400"
                                  }`}
                                ></span>

                                {teamTicket.status !== "Participated" && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="ml-2 bg-green-600 hover:bg-green-700 text-white"
                                    disabled={isProcessing}
                                    onClick={() => handleMarkAttendance(userId, `${selectedEvent}_team`)}
                                  >
                                    Mark Present
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </NeonCard>
          </TabsContent>

          <TabsContent value="scan" className="mt-6">
            <NeonCard type="tech" className="p-6">
              <div className="flex flex-col items-center">
                {isScanning ? (
                  <>
                    <h2 className="text-xl font-bold mb-4">Scan Ticket QR Code</h2>
                    <div className="mb-4 ">
                      <QRCodeScanner onScan={handleScanSuccess} active={isScanning} />
                    </div>
                    <Button
                      variant="outline"
                      className="text-black"
                      onClick={() => setIsScanning(false)}
                      disabled={isProcessing}
                    >
                      Cancel Scanning
                    </Button>
                  </>
                ) : (
                  <>
                    <QrCode className="h-16 w-16 text-purple-400 mb-4" />
                    <h2 className="text-xl font-bold mb-2">QR Code Scanner</h2>
                    <p className="text-gray-300 mb-6 text-center">Scan attendee QR codes to mark attendance quickly</p>
                    <Button onClick={() => setIsScanning(true)} className="bg-purple-600 hover:bg-purple-700">
                      <QrCode className="mr-2 h-4 w-4" />
                      Start Scanning
                    </Button>
                  </>
                )}
              </div>
            </NeonCard>
          </TabsContent>

          <TabsContent value="manual" className="mt-6">
            <NeonCard type="nontech" className="p-6">
              <div className="flex flex-col">
                <h2 className="text-xl font-bold mb-4">Enter Ticket Code</h2>
                <p className="text-gray-300 mb-4">Enter the 4-digit code from the attendee's ticket</p>

                <div className="flex gap-2 mb-6">
                  <Input
                    type="text"
                    maxLength={4}
                    placeholder="Enter 4-digit code"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                  <Button
                    onClick={handleManualCodeSubmit}
                    disabled={!manualCode.trim() || manualCode.length !== 4 || isProcessing}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Verify
                  </Button>
                </div>

                <p className="text-sm text-gray-400">
                  Note: If "All Events" is selected, the system will find the correct event for the provided code
                </p>
              </div>
            </NeonCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default AdminAttendance