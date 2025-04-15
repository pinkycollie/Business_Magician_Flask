import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Video, Check, Star, Clock, MoreHorizontal, MessageSquare, Calendar as CalendarCheck, Phone, Award } from 'lucide-react';

interface PinkSyncTranslator {
  id: string;
  name: string;
  profileImageUrl?: string;
  languages: string[];
  specialties: string[];
  businessPhases: ('idea' | 'build' | 'grow' | 'manage')[];
  certifications: string[];
  availability: {
    timezone: string;
    availableHours: string[];
    availableDays: string[];
  };
  rating: number;
  ratingCount: number;
  hourlyRate?: number;
  biography: string;
  videoIntroUrl?: string;
}

// Mock data for PinkSync translators
const mockTranslators: PinkSyncTranslator[] = [
  {
    id: 'tr-0001',
    name: 'Sarah Johnson',
    profileImageUrl: 'https://i.pravatar.cc/150?u=tr-0001',
    languages: ['ASL', 'SEE'],
    specialties: ['Business Formation', 'Financial Planning', 'Marketing'],
    businessPhases: ['idea', 'build'],
    certifications: ['RID Certified', 'NIC Master', 'BEI Advanced'],
    availability: {
      timezone: 'America/New_York',
      availableHours: ['9:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'],
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday']
    },
    rating: 4.9,
    ratingCount: 127,
    hourlyRate: 75,
    biography: 'Sarah is a nationally certified interpreter with over 10 years of experience in business settings. She specializes in helping deaf entrepreneurs navigate the early stages of business development.',
    videoIntroUrl: 'https://example.com/videos/intro-sarah-johnson.mp4'
  },
  {
    id: 'tr-0002',
    name: 'Michael Chen',
    profileImageUrl: 'https://i.pravatar.cc/150?u=tr-0002',
    languages: ['ASL', 'PSE'],
    specialties: ['Technology', 'Web Development', 'E-commerce'],
    businessPhases: ['build', 'grow'],
    certifications: ['RID Certified', 'NIC', 'Tech Specialist'],
    availability: {
      timezone: 'America/Los_Angeles',
      availableHours: ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00'],
      availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday']
    },
    rating: 4.8,
    ratingCount: 93,
    hourlyRate: 80,
    biography: 'Michael specializes in technical interpreting for deaf business owners in the technology sector. He has a background in computer science and deep understanding of technical concepts.',
    videoIntroUrl: 'https://example.com/videos/intro-michael-chen.mp4'
  },
  {
    id: 'tr-0003',
    name: 'Jamal Washington',
    profileImageUrl: 'https://i.pravatar.cc/150?u=tr-0003',
    languages: ['ASL'],
    specialties: ['Legal', 'Business Operations', 'Management'],
    businessPhases: ['grow', 'manage'],
    certifications: ['RID Certified', 'SC:L', 'MBA'],
    availability: {
      timezone: 'America/Chicago',
      availableHours: ['10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'],
      availableDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    rating: 4.7,
    ratingCount: 85,
    hourlyRate: 85,
    biography: 'Jamal combines his MBA and interpreting certifications to provide specialized interpreting for business operations, legal matters, and management scenarios.',
    videoIntroUrl: 'https://example.com/videos/intro-jamal-washington.mp4'
  },
  {
    id: 'tr-0004',
    name: 'Elena Rodriguez',
    profileImageUrl: 'https://i.pravatar.cc/150?u=tr-0004',
    languages: ['ASL', 'Spanish', 'SEE'],
    specialties: ['Marketing', 'International Business', 'Customer Relations'],
    businessPhases: ['idea', 'grow'],
    certifications: ['RID Certified', 'NIC', 'Trilingual Certification'],
    availability: {
      timezone: 'America/New_York',
      availableHours: ['9:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'],
      availableDays: ['Monday', 'Wednesday', 'Thursday', 'Friday']
    },
    rating: 4.9,
    ratingCount: 112,
    hourlyRate: 90,
    biography: 'Elena is a trilingual interpreter specializing in international business contexts. She helps deaf entrepreneurs connect with global markets and develop marketing strategies.',
    videoIntroUrl: 'https://example.com/videos/intro-elena-rodriguez.mp4'
  },
  {
    id: 'tr-0005',
    name: 'David Kim',
    profileImageUrl: 'https://i.pravatar.cc/150?u=tr-0005',
    languages: ['ASL', 'Korean', 'PSE'],
    specialties: ['Financial Planning', 'Accounting', 'Tax Preparation'],
    businessPhases: ['build', 'manage'],
    certifications: ['RID Certified', 'CPA', 'Financial Specialist'],
    availability: {
      timezone: 'America/Los_Angeles',
      availableHours: ['8:00', '9:00', '10:00', '11:00', '13:00', '14:00', '15:00'],
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Friday']
    },
    rating: 4.8,
    ratingCount: 76,
    hourlyRate: 85,
    biography: 'David combines his accounting expertise with interpreting skills to provide specialized financial services for deaf business owners.',
    videoIntroUrl: 'https://example.com/videos/intro-david-kim.mp4'
  }
];

export default function PinkSyncTeam() {
  const [activePhase, setActivePhase] = useState<string>('idea');
  const [selectedTranslator, setSelectedTranslator] = useState<PinkSyncTranslator | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState<Date | undefined>(undefined);
  const [bookingTime, setBookingTime] = useState<string | undefined>(undefined);
  const [bookingTopic, setBookingTopic] = useState<string>('');
  const { toast } = useToast();
  
  const filteredTranslators = mockTranslators.filter(translator => 
    translator.businessPhases.includes(activePhase as any)
  );
  
  const handleViewProfile = (translator: PinkSyncTranslator) => {
    setSelectedTranslator(translator);
    setIsProfileOpen(true);
  };
  
  const handleBookSession = (translator: PinkSyncTranslator) => {
    setSelectedTranslator(translator);
    setBookingDate(undefined);
    setBookingTime(undefined);
    setBookingTopic('');
    setIsBookingOpen(true);
  };
  
  const handleConfirmBooking = () => {
    if (!bookingDate || !bookingTime || !selectedTranslator) {
      toast({
        title: 'Incomplete booking',
        description: 'Please select a date, time and topic for your session',
        variant: 'destructive',
      });
      return;
    }
    
    // This would be replaced with an actual API call
    setTimeout(() => {
      toast({
        title: 'Session Scheduled!',
        description: `Your session with ${selectedTranslator.name} has been confirmed.`,
      });
      setIsBookingOpen(false);
    }, 1000);
  };
  
  const renderRatingStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-3.5 w-3.5 ${
              i < Math.floor(rating) 
                ? 'text-yellow-500 fill-yellow-500' 
                : i < rating 
                  ? 'text-yellow-500 fill-yellow-500 opacity-50' 
                  : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm font-medium">{rating}</span>
      </div>
    );
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-3">PinkSync Certified Team</h2>
        <p className="text-gray-600 mb-6">
          Our dedicated team of ASL-fluent specialists provides support through every phase of your business lifecycle.
          Each PinkSync certified team member is trained to understand both business concepts and deaf culture.
        </p>
        
        <div className="bg-primary/5 border border-primary/10 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Video className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">PinkSync Intelligence SaaS Integration</h3>
              <p className="text-gray-700 mb-3">
                Every 360 Magicians specialist is equipped with PinkSync Intelligence technology, 
                providing real-time ASL interpretation, transcription, and communication tools 
                for seamless interaction between deaf and hearing team members.
              </p>
              <div className="flex flex-wrap gap-3 mb-2">
                <Badge variant="outline" className="bg-primary/5">Real-time ASL interpretation</Badge>
                <Badge variant="outline" className="bg-primary/5">AI-enhanced captions</Badge>
                <Badge variant="outline" className="bg-primary/5">Visual communication tools</Badge>
                <Badge variant="outline" className="bg-primary/5">Bilingual business support</Badge>
              </div>
              <Button variant="link" className="p-0 h-auto">Learn more about PinkSync Technology</Button>
            </div>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="idea" value={activePhase} onValueChange={setActivePhase} className="mb-8">
        <div className="mb-2 text-lg font-medium">Find specialists by business phase:</div>
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="idea" className="gap-2">
            <Lightbulb className="h-4 w-4" />
            Idea Phase
          </TabsTrigger>
          <TabsTrigger value="build" className="gap-2">
            <Hammer className="h-4 w-4" />
            Build Phase
          </TabsTrigger>
          <TabsTrigger value="grow" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Grow Phase
          </TabsTrigger>
          <TabsTrigger value="manage" className="gap-2">
            <Settings className="h-4 w-4" />
            Manage Phase
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="idea" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTranslators.map(translator => (
              <TranslatorCard 
                key={translator.id}
                translator={translator}
                onViewProfile={() => handleViewProfile(translator)}
                onBookSession={() => handleBookSession(translator)}
                renderRatingStars={renderRatingStars}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="build" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTranslators.map(translator => (
              <TranslatorCard 
                key={translator.id}
                translator={translator}
                onViewProfile={() => handleViewProfile(translator)}
                onBookSession={() => handleBookSession(translator)}
                renderRatingStars={renderRatingStars}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="grow" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTranslators.map(translator => (
              <TranslatorCard 
                key={translator.id}
                translator={translator}
                onViewProfile={() => handleViewProfile(translator)}
                onBookSession={() => handleBookSession(translator)}
                renderRatingStars={renderRatingStars}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="manage" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTranslators.map(translator => (
              <TranslatorCard 
                key={translator.id}
                translator={translator}
                onViewProfile={() => handleViewProfile(translator)}
                onBookSession={() => handleBookSession(translator)}
                renderRatingStars={renderRatingStars}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Translator Profile Dialog */}
      {selectedTranslator && (
        <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Interpreter Profile</DialogTitle>
              <DialogDescription>
                Learn more about this PinkSync certified interpreter
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex flex-col md:flex-row gap-6 py-4">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-3">
                  <AvatarImage src={selectedTranslator.profileImageUrl} alt={selectedTranslator.name} />
                  <AvatarFallback>{selectedTranslator.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {selectedTranslator.videoIntroUrl && (
                  <Button variant="outline" size="sm" className="gap-1 mt-2">
                    <Video className="h-3.5 w-3.5" /> Watch ASL Introduction
                  </Button>
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1">{selectedTranslator.name}</h3>
                <div className="flex items-center gap-1 mb-3">
                  {renderRatingStars(selectedTranslator.rating)}
                  <span className="text-gray-500 text-sm">({selectedTranslator.ratingCount} reviews)</span>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Biography</h4>
                    <p className="text-sm text-gray-700">{selectedTranslator.biography}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Languages</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedTranslator.languages.map(language => (
                          <Badge key={language} variant="secondary" className="text-xs">{language}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-1">Specialties</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedTranslator.specialties.map(specialty => (
                          <Badge key={specialty} variant="outline" className="text-xs">{specialty}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Certifications</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedTranslator.certifications.map(cert => (
                        <Badge key={cert} className="bg-primary/10 text-primary text-xs">{cert}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Business Phases</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedTranslator.businessPhases.map(phase => (
                        <Badge key={phase} variant="outline" className="capitalize text-xs">
                          {phase === 'idea' && <Lightbulb className="h-3 w-3 mr-1" />}
                          {phase === 'build' && <Hammer className="h-3 w-3 mr-1" />}
                          {phase === 'grow' && <TrendingUp className="h-3 w-3 mr-1" />}
                          {phase === 'manage' && <Settings className="h-3 w-3 mr-1" />}
                          {phase}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsProfileOpen(false)}>
                Close
              </Button>
              <Button onClick={() => {
                setIsProfileOpen(false);
                handleBookSession(selectedTranslator);
              }}>
                Book Session
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Booking Dialog */}
      {selectedTranslator && (
        <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Book a Session</DialogTitle>
              <DialogDescription>
                Schedule a session with {selectedTranslator.name}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={selectedTranslator.profileImageUrl} alt={selectedTranslator.name} />
                  <AvatarFallback>{selectedTranslator.name.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div>
                  <div className="font-medium">{selectedTranslator.name}</div>
                  <div className="text-sm text-gray-500">
                    {selectedTranslator.hourlyRate ? `$${selectedTranslator.hourlyRate}/hour` : 'Included with subscription'}
                  </div>
                </div>
              </div>
              
              <div className="grid gap-2">
                <label className="text-sm font-medium mb-1">Select a Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${!bookingDate && "text-muted-foreground"}`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {bookingDate ? format(bookingDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={bookingDate}
                      onSelect={setBookingDate}
                      initialFocus
                      disabled={(date) => {
                        const day = format(date, 'EEEE');
                        return !selectedTranslator.availability.availableDays.includes(day);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="grid gap-2">
                <label className="text-sm font-medium mb-1">Select a Time</label>
                <Select disabled={!bookingDate} onValueChange={setBookingTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a time" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedTranslator.availability.availableHours.map(time => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <label className="text-sm font-medium mb-1">Topic</label>
                <Select onValueChange={setBookingTopic}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a topic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="business_formation">Business Formation</SelectItem>
                    <SelectItem value="financial_planning">Financial Planning</SelectItem>
                    <SelectItem value="marketing_strategy">Marketing Strategy</SelectItem>
                    <SelectItem value="technology_setup">Technology Setup</SelectItem>
                    <SelectItem value="legal_consultation">Legal Consultation</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="bg-primary/5 p-3 rounded-md text-sm">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>
                    PinkSync Intelligence will be automatically enabled for this session
                  </span>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsBookingOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleConfirmBooking} disabled={!bookingDate || !bookingTime || !bookingTopic}>
                Confirm Booking
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Translator Card component
function TranslatorCard({ 
  translator, 
  onViewProfile, 
  onBookSession,
  renderRatingStars
}: { 
  translator: PinkSyncTranslator;
  onViewProfile: () => void;
  onBookSession: () => void;
  renderRatingStars: (rating: number) => React.ReactNode;
}) {
  return (
    <Card className="overflow-hidden flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={translator.profileImageUrl} alt={translator.name} />
              <AvatarFallback>{translator.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{translator.name}</CardTitle>
              <div className="flex items-center gap-1">
                {renderRatingStars(translator.rating)}
                <span className="text-xs text-gray-500">({translator.ratingCount})</span>
              </div>
            </div>
          </div>
          
          <Badge className="bg-pink-100 text-pink-800 hover:bg-pink-200">
            PinkSync
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-3 flex-1">
        <div className="space-y-3">
          <div className="line-clamp-2 text-sm text-gray-600 mb-2">
            {translator.biography}
          </div>
          
          <div>
            <div className="text-xs font-medium mb-1">Specialties</div>
            <div className="flex flex-wrap gap-1">
              {translator.specialties.slice(0, 3).map(specialty => (
                <Badge key={specialty} variant="outline" className="text-xs">
                  {specialty}
                </Badge>
              ))}
              {translator.specialties.length > 3 && (
                <Badge variant="outline" className="text-xs">+{translator.specialties.length - 3}</Badge>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs font-medium mb-1">Languages</div>
              <div className="flex flex-wrap gap-1">
                {translator.languages.map(language => (
                  <Badge key={language} variant="secondary" className="text-xs">{language}</Badge>
                ))}
              </div>
            </div>
            
            <div>
              <div className="text-xs font-medium mb-1">Certifications</div>
              <div className="flex flex-wrap gap-1">
                <Badge className="bg-primary/10 text-primary text-xs">
                  {translator.certifications[0]}
                </Badge>
                {translator.certifications.length > 1 && (
                  <Badge variant="outline" className="text-xs">+{translator.certifications.length - 1}</Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-3 border-t">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-1 text-sm">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">
              {translator.hourlyRate ? `$${translator.hourlyRate}/hr` : 'Subscription'}
            </span>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onViewProfile}>
              Profile
            </Button>
            <Button size="sm" onClick={onBookSession} className="gap-1">
              <CalendarCheck className="h-3.5 w-3.5" /> Book
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

// Import missing components
import { Lightbulb, Hammer, TrendingUp, Settings } from 'lucide-react';