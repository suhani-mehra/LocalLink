import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MapPin, Users, Wrench, Calendar, Bell, Store } from 'lucide-react';

const LocalCircle = () => {
  const [activeTab, setActiveTab] = useState('community');
  const [userLocation, setUserLocation] = useState(null);
  const [neighbors, setNeighbors] = useState([]);
  const [marketplace, setMarketplace] = useState([]);
  const [events, setEvents] = useState([]);
  const [alerts, setAlerts] = useState([]);

  // Mock location verification
  const verifyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  // Mock nearby neighbors data
  const mockNeighbors = [
    { id: 1, name: 'Sarah Chen', distance: '0.3 miles', skills: ['Gardening', 'Piano Teaching'] },
    { id: 2, name: 'Mike Johnson', distance: '0.5 miles', skills: ['Home Repair', 'Programming'] },
    { id: 3, name: 'Lisa Wong', distance: '0.8 miles', skills: ['Cooking', 'Painting'] },
  ];

  // Mock marketplace items
  const mockMarketplace = [
    { id: 1, type: 'tool', name: 'Power Drill', owner: 'James', distance: '0.2 miles', rate: 'Free' },
    { id: 2, type: 'skill', name: 'Math Tutoring', owner: 'Emma', distance: '0.4 miles', rate: '$20/hr' },
    { id: 3, type: 'item', name: 'Camping Tent', owner: 'David', distance: '0.6 miles', rate: '$10/day' },
  ];

  // Mock community events
  const mockEvents = [
    { id: 1, name: 'Community Garden Day', date: '2024-02-15', location: 'Central Park', attendees: 12 },
    { id: 2, name: 'Block Party', date: '2024-02-20', location: 'Main Street', attendees: 45 },
    { id: 3, name: 'Skill Share Workshop', date: '2024-02-25', location: 'Community Center', attendees: 8 },
  ];

  useEffect(() => {
    verifyLocation();
    setNeighbors(mockNeighbors);
    setMarketplace(mockMarketplace);
    setEvents(mockEvents);
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Location Verification Banner */}
      {!userLocation && (
        <div className="bg-yellow-100 p-4 rounded-lg mb-6">
          <p className="text-yellow-800">Please enable location services to connect with your community.</p>
          <button
            onClick={verifyLocation}
            className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
          >
            Enable Location
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex gap-4 mb-6 overflow-x-auto">
        {[
          { id: 'community', icon: Users, label: 'Neighbors' },
          { id: 'marketplace', icon: Wrench, label: 'Marketplace' },
          { id: 'events', icon: Calendar, label: 'Events' },
          { id: 'alerts', icon: Bell, label: 'Alerts' },
          { id: 'businesses', icon: Store, label: 'Local Business' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              activeTab === tab.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <tab.icon className="h-5 w-5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Neighbors Section */}
        {activeTab === 'community' && neighbors.map(neighbor => (
          <Card key={neighbor.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{neighbor.name}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {neighbor.distance}
                  </p>
                </div>
                <button className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                  Connect
                </button>
              </div>
              <div className="mt-3">
                <p className="text-sm text-gray-600">Skills:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {neighbor.skills.map(skill => (
                    <span key={skill} className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Marketplace Section */}
        {activeTab === 'marketplace' && marketplace.map(item => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-500">Offered by {item.owner}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {item.distance}
                  </p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm">
                  {item.rate}
                </span>
              </div>
              <button className="mt-3 w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Request {item.type === 'skill' ? 'Service' : 'Item'}
              </button>
            </CardContent>
          </Card>
        ))}

        {/* Events Section */}
        {activeTab === 'events' && events.map(event => (
          <Card key={event.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{event.name}</h3>
                  <p className="text-sm text-gray-500">{event.date}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {event.location}
                  </p>
                </div>
                <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm">
                  {event.attendees} attending
                </span>
              </div>
              <button className="mt-3 w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Join Event
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LocalCircle;