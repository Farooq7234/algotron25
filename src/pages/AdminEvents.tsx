
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { fetchEvents, updateEventStatus, updateEventDetails } from '../firebase/firebase';
import { useToast } from '@/hooks/use-toast';
import Navbar from '../components/Navbar';
import NeonCard from '../components/ui/NeonCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Calendar, Users, Clock, MapPin, Edit, Save } from 'lucide-react';

const AdminEvents: React.FC = () => {
  const { currentUser, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [events, setEvents] = useState<Record<string, any>>({});
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [eventToEdit, setEventToEdit] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!currentUser) {
        navigate('/login');
      } else if (!isAdmin) {
        navigate('/dashboard');
      }
    }
  }, [currentUser, loading, isAdmin, navigate]);

  useEffect(() => {
    const loadData = async () => {
      if (currentUser && isAdmin) {
        const eventsData = await fetchEvents();
        setEvents(eventsData);
      }
    };
    
    loadData();
  }, [currentUser, isAdmin]);

  const handleToggleRegistration = async (eventId: string, isOpen: boolean) => {
    if (!currentUser || !isAdmin) return;
    
    try {
      setIsUpdating(eventId);
      
      await updateEventStatus(eventId, isOpen);
      
      // Update local state
      setEvents(prev => ({
        ...prev,
        [eventId]: {
          ...prev[eventId],
          registrationOpen: isOpen
        }
      }));
      
      toast({
        title: "Registration status updated",
        description: `Registration is now ${isOpen ? 'open' : 'closed'} for this event`,
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(null);
    }
  };

  const handleEditEvent = (eventId: string, eventData: any) => {
    setEventToEdit({
      id: eventId,
      ...eventData
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateEvent = async () => {
    if (!currentUser || !isAdmin || !eventToEdit) return;
    
    try {
      setIsUpdating(eventToEdit.id);
      
      // Create updated event data from form
      const updatedEventData = {
        name: eventToEdit.name,
        description: eventToEdit.description,
        rules: eventToEdit.rules,
        venue: eventToEdit.venue,
        time: eventToEdit.time,
        type: eventToEdit.type,
        registrationOpen: eventToEdit.registrationOpen
      };
      
      await updateEventDetails(eventToEdit.id, updatedEventData);
      
      // Update local state
      setEvents(prev => ({
        ...prev,
        [eventToEdit.id]: updatedEventData
      }));
      
      toast({
        title: "Event updated",
        description: `The event "${eventToEdit.name}" has been updated successfully`,
        variant: "default",
      });
      
      setIsEditDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(null);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    if (!eventToEdit) return;
    
    setEventToEdit({
      ...eventToEdit,
      [field]: value
    });
  };

  if (loading || !isAdmin) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // Split events by type
  const technicalEvents = Object.entries(events).filter(([_, event]) => event.type === 'technical');
  const nonTechnicalEvents = Object.entries(events).filter(([_, event]) => event.type === 'non-technical');

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 mt-16">
        <h1 className="text-3xl font-bold mb-8 gradient-text">Event Management</h1>
        
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Technical Events</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {technicalEvents.map(([eventId, eventData]) => (
              <NeonCard key={eventId} type="tech" className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">{eventData.name}</h3>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <span className="text-sm mr-2">{eventData.registrationOpen ? 'Open' : 'Closed'}</span>
                      <Switch
                        checked={eventData.registrationOpen}
                        disabled={isUpdating === eventId}
                        onCheckedChange={(checked) => handleToggleRegistration(eventId, checked)}
                      />
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditEvent(eventId, eventData)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-4">{eventData.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-purple-400 mr-2" />
                    <span>{eventData.venue}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-purple-400 mr-2" />
                    <span>{eventData.time}</span>
                  </div>
                </div>
                
                <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Rules</h4>
                  <p className="text-gray-300">{eventData.rules}</p>
                </div>
              </NeonCard>
            ))}
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-6">Non-Technical Events</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {nonTechnicalEvents.map(([eventId, eventData]) => (
              <NeonCard key={eventId} type="nontech" className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">{eventData.name}</h3>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <span className="text-sm mr-2">{eventData.registrationOpen ? 'Open' : 'Closed'}</span>
                      <Switch
                        checked={eventData.registrationOpen}
                        disabled={isUpdating === eventId}
                        onCheckedChange={(checked) => handleToggleRegistration(eventId, checked)}
                      />
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditEvent(eventId, eventData)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-4">{eventData.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-indigo-400 mr-2" />
                    <span>{eventData.venue}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-indigo-400 mr-2" />
                    <span>{eventData.time}</span>
                  </div>
                </div>
                
                <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Rules</h4>
                  <p className="text-gray-300">{eventData.rules}</p>
                </div>
              </NeonCard>
            ))}
          </div>
        </div>
      </div>
      
      {/* Edit Event Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-gray-900 text-white border-purple-600">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          
          {eventToEdit && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-300">Event Name</label>
                <Input 
                  value={eventToEdit.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-300">Description</label>
                <Textarea 
                  value={eventToEdit.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-300">Rules</label>
                <Textarea 
                  value={eventToEdit.rules}
                  onChange={(e) => handleInputChange('rules', e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-300">Venue</label>
                  <Input 
                    value={eventToEdit.venue}
                    onChange={(e) => handleInputChange('venue', e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white mt-1"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-300">Time</label>
                  <Input 
                    value={eventToEdit.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white mt-1"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-300">Registration Status:</label>
                <div className="flex items-center">
                  <span className="text-sm mr-2">{eventToEdit.registrationOpen ? 'Open' : 'Closed'}</span>
                  <Switch
                    checked={eventToEdit.registrationOpen}
                    onCheckedChange={(checked) => handleInputChange('registrationOpen', checked)}
                  />
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button
              onClick={() => setIsEditDialogOpen(false)}
              variant="outline"
              className="border-gray-600"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateEvent}
              disabled={isUpdating === eventToEdit?.id}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Save className="mr-2 h-4 w-4" />
              {isUpdating === eventToEdit?.id ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminEvents;
