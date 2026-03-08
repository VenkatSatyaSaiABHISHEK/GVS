import React, { useState } from "react";
import { Search, MapPin, Star, BookOpen, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const TeacherSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const subjects = [
    "Mathematics", "Physics", "Chemistry", "Biology", "English", 
    "Hindi", "Computer Science", "Economics", "History", "Geography"
  ];

  const locations = [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", 
    "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow"
  ];

  // Mock teacher data
  const teachers = [
    {
      id: 1,
      name: "Dr. Rajesh Kumar",
      subject: "Mathematics",
      experience: "8 Years",
      rating: 4.8,
      location: "Mumbai",
      mode: "Online + Offline",
      fee: "₹1200/hour",
      students: 45,
      description: "Expert in advanced mathematics with IIT background"
    },
    {
      id: 2,
      name: "Prof. Sneha Sharma",
      subject: "Physics",
      experience: "6 Years",
      rating: 4.9,
      location: "Delhi",
      mode: "Online",
      fee: "₹1000/hour",
      students: 38,
      description: "Specialized in JEE and NEET preparation"
    },
    {
      id: 3,
      name: "Ms. Priya Patel",
      subject: "Chemistry",
      experience: "5 Years",
      rating: 4.7,
      location: "Bangalore",
      mode: "Offline",
      fee: "₹900/hour",
      students: 32,
      description: "Organic chemistry specialist with proven results"
    }
  ];

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         teacher.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = !selectedSubject || teacher.subject === selectedSubject;
    const matchesLocation = !selectedLocation || teacher.location === selectedLocation;
    
    return matchesSearch && matchesSubject && matchesLocation;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1F2937] mb-2">Find Teachers</h2>
        <p className="text-[#6B7280]">Search and connect with qualified teachers for your child</p>
      </div>

      {/* Search Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280] h-4 w-4" />
            <input
              type="text"
              placeholder="Search teachers or subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B3DF5] focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B3DF5] focus:border-transparent"
          >
            <option value="">All Subjects</option>
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
          
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B3DF5] focus:border-transparent"
          >
            <option value="">All Locations</option>
            {locations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
          
          <Button className="bg-[#5B3DF5] hover:bg-[#4B2BBF] text-white">
            <Filter className="h-4 w-4 mr-2" />
            Apply Filters
          </Button>
        </div>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#1F2937]">
            {filteredTeachers.length} Teachers Found
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map(teacher => (
            <Card key={teacher.id} className="hover:shadow-lg transition-all border border-[#E5E7EB]">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="h-12 w-12 bg-gradient-to-r from-[#5B3DF5] to-[#7A5CFF] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {teacher.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1F2937]">{teacher.name}</h4>
                    <p className="text-sm text-[#6B7280]">{teacher.subject} Teacher</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#6B7280]">Experience:</span>
                    <span className="font-medium">{teacher.experience}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#6B7280]">Rating:</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{teacher.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#6B7280]">Location:</span>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3 text-[#6B7280]" />
                      <span className="font-medium">{teacher.location}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#6B7280]">Mode:</span>
                    <span className="font-medium">{teacher.mode}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#6B7280]">Students:</span>
                    <span className="font-medium">{teacher.students}</span>
                  </div>
                </div>

                <p className="text-sm text-[#6B7280] mb-4 line-clamp-2">
                  {teacher.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-bold text-[#5B3DF5]">{teacher.fee}</span>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    className="flex-1 bg-[#5B3DF5] hover:bg-[#4B2BBF] text-white"
                  >
                    <BookOpen className="h-4 w-4 mr-1" />
                    Send Request
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 border-[#5B3DF5] text-[#5B3DF5] hover:bg-[#5B3DF5] hover:text-white"
                  >
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTeachers.length === 0 && (
          <Card className="py-16 text-center border-dashed">
            <CardContent>
              <Search className="h-12 w-12 mx-auto text-[#6B7280] mb-4" />
              <h3 className="text-lg font-semibold text-[#1F2937] mb-2">No teachers found</h3>
              <p className="text-[#6B7280]">Try adjusting your search criteria or filters</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TeacherSearch;