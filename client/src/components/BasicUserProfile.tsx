import { useState, useEffect } from 'react';
import { 
  Building, 
  Calendar, 
  Globe, 
  Lightbulb, 
  Mail, 
  MapPin, 
  Settings, 
  TrendingUp, 
  UserIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useParams } from 'wouter';

// User profile interface
interface UserProfile {
  id: number;
  username: string;
  name: string;
  email: string;
  isDeaf: boolean;
  bio?: string;
  location?: string;
  company?: string;
  website?: string;
  avatarUrl?: string;
  joinedDate: string;
  businessPhase: 'idea' | 'build' | 'grow' | 'manage';
}

// A simple user profile component that can be used as a starting point
export default function BasicUserProfile() {
  const { username } = useParams();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const endpoint = username 
          ? `/api/profile/${username}` 
          : '/api/profile';
          
        const response = await fetch(endpoint);
        
        if (!response.ok) {
          throw new Error('Failed to load profile');
        }
        
        const data = await response.json();
        setUser(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Unable to load profile information');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [username]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="h-8 w-8 rounded-full border-4 border-t-transparent border-purple-600 animate-spin"></div>
      </div>
    );
  }
  
  if (error || !user) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-500">{error || 'Profile not found'}</p>
              <Button className="mt-4" variant="outline" onClick={() => window.location.href = '/'}>
                Return Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl">My Profile</CardTitle>
            <Button variant="outline" size="sm">Edit Profile</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-start">
            <Avatar className="h-20 w-20">
              {user.avatarUrl ? (
                <AvatarImage src={user.avatarUrl} alt={user.name} />
              ) : (
                <AvatarFallback className="text-xl bg-purple-100 text-purple-800">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              )}
            </Avatar>
            
            <div className="space-y-3 flex-1">
              <div>
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-slate-500">@{user.username}</p>
              </div>
              
              <div className="flex gap-2">
                {user.isDeaf && (
                  <Badge className="bg-purple-100 text-purple-800">
                    Deaf Entrepreneur
                  </Badge>
                )}
                <Badge variant="outline" className="text-slate-700">
                  {user.businessPhase === 'idea' ? 'Idea Phase' :
                    user.businessPhase === 'build' ? 'Build Phase' :
                    user.businessPhase === 'grow' ? 'Growth Phase' :
                    'Management Phase'}
                </Badge>
              </div>
              
              <p className="text-slate-700">{user.bio}</p>
              
              <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                {user.company && (
                  <div className="flex items-center gap-1">
                    <Building className="h-4 w-4" />
                    <span>{user.company}</span>
                  </div>
                )}
                {user.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{user.location}</span>
                  </div>
                )}
                {user.website && (
                  <div className="flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    <a 
                      href={user.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-purple-600"
                    >
                      {user.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {new Date(user.joinedDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  <a href={`mailto:${user.email}`} className="hover:text-purple-600">
                    {user.email}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <BusinessPhaseCard 
          icon={<Lightbulb className="h-5 w-5" />}
          title="Idea Phase"
          description="Generate and validate business ideas"
          isActive={user.businessPhase === 'idea'}
        />
        <BusinessPhaseCard 
          icon={<Settings className="h-5 w-5" />}
          title="Build Phase"
          description="Develop your business foundation"
          isActive={user.businessPhase === 'build'}
        />
        <BusinessPhaseCard 
          icon={<TrendingUp className="h-5 w-5" />}
          title="Growth Phase"
          description="Expand your business reach"
          isActive={user.businessPhase === 'grow'}
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>My Business</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-slate-700 italic">Add your business information to get started.</p>
            <Button className="mt-4" variant="outline">Create Business Profile</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// A helper component for business phase cards
function BusinessPhaseCard({ 
  icon, 
  title, 
  description, 
  isActive 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  isActive: boolean;
}) {
  return (
    <Card className={isActive ? 'border-purple-400 shadow-md' : ''}>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center">
          <div className={`p-3 rounded-full ${isActive ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-700'} mb-3`}>
            {icon}
          </div>
          <h3 className="font-medium mb-1">{title}</h3>
          <p className="text-sm text-slate-600">{description}</p>
          {isActive && (
            <Badge className="mt-3 bg-purple-100 text-purple-800">
              Current Phase
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}