import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BarChart, 
  Calendar, 
  Card as CardIcon, 
  Clipboard, 
  Clock, 
  Cog, 
  File, 
  FileCheck, 
  FileText, 
  HandHelping, 
  Landmark, 
  MessageSquare, 
  MessageSquareCheck, 
  PersonStanding, 
  Phone, 
  Search, 
  Upload, 
  User, 
  Video, 
  X,
  Download,
  Copy,
  Mail
} from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from '@/components/ui/checkbox';

// VR4Deaf Dashboard Main Component
export default function VR4DeafDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();
  
  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-bold tracking-tight">VR4Deaf Dashboard</h1>
            <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
              PinkSync Powered
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Your vocational rehabilitation services, powered by PinkSync technology
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button size="sm" variant="outline" className="gap-2">
            <Search className="h-4 w-4" />
            Find VR Counselor
          </Button>
          <Button size="sm" className="gap-2 bg-purple-600 hover:bg-purple-700">
            <MessageSquare className="h-4 w-4" />
            Request Support
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <VRStatusOverviewCard />
        <VRCounselorCard />
        <UpcomingMeetingsCard />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid md:w-full md:grid-cols-4">
          <TabsTrigger value="overview" className="gap-2">
            <CardIcon className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="documents" className="gap-2">
            <FileText className="h-4 w-4" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="services" className="gap-2">
            <HandHelping className="h-4 w-4" />
            VR Services
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Cog className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>
      
        <TabsContent value="overview" className="space-y-4">
          <VRApplicationStatusCard />
          <div className="grid gap-4 md:grid-cols-2">
            <VRFundingSummaryCard />
            <VRTimelineCard />
          </div>
        </TabsContent>
        
        <TabsContent value="documents" className="space-y-4">
          <VRDocumentsTab />
        </TabsContent>
        
        <TabsContent value="services" className="space-y-4">
          <VRServicesTab />
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <VRSettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Overview Cards
function VRStatusOverviewCard() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">VR Application Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            Approved
          </Badge>
          <span className="text-sm text-muted-foreground">
            Case #VR-2023-05422
          </span>
        </div>
        <div className="mt-4 grid gap-2">
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 p-1.5 rounded">
              <Landmark className="h-3.5 w-3.5 text-blue-600" />
            </div>
            <div className="grid gap-0.5">
              <p className="text-sm font-medium">California DOR</p>
              <p className="text-xs text-muted-foreground">State VR Agency</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-green-100 p-1.5 rounded">
              <CardIcon className="h-3.5 w-3.5 text-green-600" />
            </div>
            <div className="grid gap-0.5">
              <p className="text-sm font-medium">Business Plan Funding</p>
              <p className="text-xs text-muted-foreground">Self-Employment Track</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-yellow-100 p-1.5 rounded">
              <Clock className="h-3.5 w-3.5 text-yellow-600" />
            </div>
            <div className="grid gap-0.5">
              <p className="text-sm font-medium">IPE Active: 9 months</p>
              <p className="text-xs text-muted-foreground">Renewal in 3 months</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" className="w-full gap-1">
          <Search className="h-3.5 w-3.5" />
          View full details
        </Button>
      </CardFooter>
    </Card>
  );
}

function VRCounselorCard() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base">Your VR Counselor</CardTitle>
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
            PinkSync Certified
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 border-2 border-primary/10">
            <AvatarImage src="https://i.pravatar.cc/100?img=45" />
            <AvatarFallback>JM</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">Jennifer Martinez</p>
            <p className="text-sm text-muted-foreground">
              Deaf & HH Business Specialist
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs bg-blue-50">
                ASL Fluent
              </Badge>
              <Badge variant="outline" className="text-xs bg-green-50">
                Deaf Entrepreneur
              </Badge>
            </div>
          </div>
        </div>
        <div className="mt-4 grid gap-2">
          <Button size="sm" variant="default" className="gap-2 w-full bg-purple-600 hover:bg-purple-700">
            <Video className="h-3.5 w-3.5" />
            Schedule PinkSync Meeting
          </Button>
          <Button size="sm" variant="outline" className="gap-2 w-full">
            <MessageSquare className="h-3.5 w-3.5" />
            Message
          </Button>
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Last meeting: 2 weeks ago
      </CardFooter>
    </Card>
  );
}

function UpcomingMeetingsCard() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Upcoming Meetings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-100 rounded-md p-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-sm">Business Plan Review</p>
                <p className="text-xs text-muted-foreground">with Jennifer Martinez</p>
              </div>
              <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Tomorrow</Badge>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-xs">10:00 AM - 11:00 AM</p>
              <Button size="sm" variant="ghost" className="h-7 gap-1">
                <Video className="h-3 w-3" />
                Join
              </Button>
            </div>
          </div>
          
          <div className="border rounded-md p-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-sm">Funding Assessment</p>
                <p className="text-xs text-muted-foreground">with Financial Team</p>
              </div>
              <Badge variant="outline" className="text-xs">Next Week</Badge>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-xs">Wednesday, 2:00 PM</p>
              <Button size="sm" variant="ghost" className="h-7">Details</Button>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" className="w-full gap-1">
          <Calendar className="h-3.5 w-3.5" />
          Schedule New Meeting
        </Button>
      </CardFooter>
    </Card>
  );
}

function VRApplicationStatusCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Application Progress</CardTitle>
            <CardDescription>
              Track your VR application status and required steps
            </CardDescription>
          </div>
          <Badge className="bg-purple-100 text-purple-800 border-purple-200">
            PinkSync Assisted
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-green-100 p-1.5 rounded-full">
                  <FileCheck className="h-4 w-4 text-green-600" />
                </div>
                <span className="font-medium">Initial Application</span>
              </div>
              <Badge className="bg-green-100 text-green-800">Completed</Badge>
            </div>
            <Progress value={100} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-green-100 p-1.5 rounded-full">
                  <FileCheck className="h-4 w-4 text-green-600" />
                </div>
                <span className="font-medium">Eligibility Determination</span>
              </div>
              <Badge className="bg-green-100 text-green-800">Completed</Badge>
            </div>
            <Progress value={100} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-green-100 p-1.5 rounded-full">
                  <FileCheck className="h-4 w-4 text-green-600" />
                </div>
                <span className="font-medium">Individualized Plan (IPE)</span>
              </div>
              <Badge className="bg-green-100 text-green-800">Completed</Badge>
            </div>
            <Progress value={100} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 p-1.5 rounded-full">
                  <Clipboard className="h-4 w-4 text-blue-600" />
                </div>
                <span className="font-medium">Business Plan Development</span>
              </div>
              <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
            </div>
            <Progress value={75} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-gray-100 p-1.5 rounded-full">
                  <Landmark className="h-4 w-4 text-gray-600" />
                </div>
                <span className="font-medium">Funding Approval</span>
              </div>
              <Badge variant="outline">Pending</Badge>
            </div>
            <Progress value={30} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-gray-100 p-1.5 rounded-full">
                  <CardIcon className="h-4 w-4 text-gray-600" />
                </div>
                <span className="font-medium">Business Launch Support</span>
              </div>
              <Badge variant="outline">Not Started</Badge>
            </div>
            <Progress value={0} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function VRFundingSummaryCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Funding Summary</CardTitle>
        <CardDescription>
          Available VR funding for your business
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">Total Approved Budget</span>
              <span className="font-bold">$25,000</span>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Case #VR-2023-05422</span>
              <span>Self-Employment Track</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Equipment & Technology</span>
                <span>$12,000 approved</span>
              </div>
              <Progress value={40} className="h-2" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>$4,800 disbursed</span>
                <span>$7,200 remaining</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Training & Certifications</span>
                <span>$5,000 approved</span>
              </div>
              <Progress value={60} className="h-2" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>$3,000 disbursed</span>
                <span>$2,000 remaining</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Marketing & Website</span>
                <span>$3,000 approved</span>
              </div>
              <Progress value={10} className="h-2" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>$300 disbursed</span>
                <span>$2,700 remaining</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Business Services</span>
                <span>$5,000 approved</span>
              </div>
              <Progress value={0} className="h-2" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>$0 disbursed</span>
                <span>$5,000 remaining</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full gap-1">
          <BarChart className="h-3.5 w-3.5" />
          Request Funding
        </Button>
      </CardFooter>
    </Card>
  );
}

function VRTimelineCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Latest updates from your VR case
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80 pr-4">
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="bg-purple-100 p-1.5 rounded-full">
                  <MessageSquareCheck className="h-3.5 w-3.5 text-purple-600" />
                </div>
                <div className="flex-1 w-px bg-border my-1"></div>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <p className="font-medium text-sm">Business Plan Feedback</p>
                  <Badge className="text-xs bg-purple-50 text-purple-800">PinkSync</Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-1">Yesterday at 2:34 PM</p>
                <p className="text-xs text-muted-foreground">
                  Your counselor provided feedback on your business plan draft through PinkSync. 
                  They've requested additional information about your marketing strategy.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="bg-green-100 p-1.5 rounded-full">
                  <FileCheck className="h-3.5 w-3.5 text-green-600" />
                </div>
                <div className="flex-1 w-px bg-border my-1"></div>
              </div>
              <div>
                <p className="font-medium text-sm">Equipment Quote Approved</p>
                <p className="text-xs text-muted-foreground mb-1">3 days ago</p>
                <p className="text-xs text-muted-foreground">
                  Your quote for computer equipment has been approved. 
                  Funding will be disbursed within 5-7 business days.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="bg-purple-100 p-1.5 rounded-full">
                  <Video className="h-3.5 w-3.5 text-purple-600" />
                </div>
                <div className="flex-1 w-px bg-border my-1"></div>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <p className="font-medium text-sm">VR Counseling Session</p>
                  <Badge className="text-xs bg-purple-50 text-purple-800">PinkSync</Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-1">Last week</p>
                <p className="text-xs text-muted-foreground">
                  Completed quarterly review meeting with Jennifer via PinkSync video. Discussed progress on 
                  business plan and upcoming funding needs.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="bg-yellow-100 p-1.5 rounded-full">
                  <Upload className="h-3.5 w-3.5 text-yellow-600" />
                </div>
                <div className="flex-1 w-px bg-border my-1"></div>
              </div>
              <div>
                <p className="font-medium text-sm">Documents Submitted</p>
                <p className="text-xs text-muted-foreground mb-1">2 weeks ago</p>
                <p className="text-xs text-muted-foreground">
                  Uploaded business plan draft, equipment quotes, and training course information.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="bg-red-100 p-1.5 rounded-full">
                  <X className="h-3.5 w-3.5 text-red-600" />
                </div>
                <div className="flex-1 w-px bg-border my-1"></div>
              </div>
              <div>
                <p className="font-medium text-sm">Quote Rejection</p>
                <p className="text-xs text-muted-foreground mb-1">3 weeks ago</p>
                <p className="text-xs text-muted-foreground">
                  Initial equipment quote was rejected. Need to provide additional 
                  justification for specialized equipment.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="bg-green-100 p-1.5 rounded-full">
                  <CardIcon className="h-3.5 w-3.5 text-green-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-sm">IPE Approved</p>
                <p className="text-xs text-muted-foreground mb-1">2 months ago</p>
                <p className="text-xs text-muted-foreground">
                  Your Individualized Plan for Employment (IPE) has been approved. 
                  Self-employment track initiated.
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

// Document Tab
function VRDocumentsTab() {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const handleFileUpload = () => {
    toast({
      title: "Document uploaded",
      description: "Your document has been successfully uploaded and is pending review.",
    });
    setIsUploadDialogOpen(false);
  };
  
  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">VR Documents</h3>
        <Button size="sm" onClick={() => setIsUploadDialogOpen(true)} className="gap-2">
          <Upload className="h-4 w-4" />
          Upload Document
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <DocumentCard
          title="Individualized Plan for Employment"
          type="PDF"
          date="3 months ago"
          status="approved"
          icon={<FileText className="h-8 w-8 text-blue-500" />}
          hasAslTranslation={true}
        />
        <DocumentCard
          title="Business Plan Draft"
          type="DOCX"
          date="2 weeks ago"
          status="pending"
          icon={<FileText className="h-8 w-8 text-indigo-500" />}
          hasAslTranslation={false}
        />
        <DocumentCard
          title="Equipment Quotes"
          type="PDF"
          date="3 days ago"
          status="approved"
          icon={<FileText className="h-8 w-8 text-green-500" />}
          hasAslTranslation={false}
        />
        <DocumentCard
          title="Disability Documentation"
          type="PDF"
          date="3 months ago"
          status="approved"
          icon={<FileText className="h-8 w-8 text-red-500" />}
          hasAslTranslation={true}
        />
        <DocumentCard
          title="Training Course Information"
          type="PDF"
          date="2 weeks ago"
          status="approved"
          icon={<FileText className="h-8 w-8 text-yellow-500" />}
          hasAslTranslation={true}
        />
        <DocumentCard
          title="VR Rights and Responsibilities"
          type="PDF"
          date="3 months ago"
          status="informational"
          icon={<FileText className="h-8 w-8 text-purple-500" />}
          hasAslTranslation={true}
        />
      </div>
      
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Upload a document to your VR case file. Documents will be reviewed by your counselor.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="document-type">Document Type</Label>
              <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1">
                <option value="business-plan">Business Plan</option>
                <option value="equipment-quote">Equipment Quote</option>
                <option value="training-info">Training Information</option>
                <option value="invoice">Invoice</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" placeholder="Briefly describe this document" />
            </div>
            <div className="grid gap-2">
              <Label>Upload File</Label>
              <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-1">Drag and drop or click to upload</p>
                <p className="text-xs text-muted-foreground">PDF, DOC, DOCX, JPG, PNG (Max 10MB)</p>
                <Button size="sm" variant="outline" className="mt-4">Select File</Button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="request-asl" />
              <Label htmlFor="request-asl" className="text-sm">Request PinkSync ASL translation of this document</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleFileUpload}>Upload Document</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function DocumentCard({ title, type, date, status, icon, hasAslTranslation }: { 
  title: string, 
  type: string, 
  date: string, 
  status: 'approved' | 'pending' | 'rejected' | 'informational', 
  icon: React.ReactNode,
  hasAslTranslation: boolean
}) {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center p-4 bg-muted/30">
        <div className="bg-background p-3 rounded-md mr-3">
          {icon}
        </div>
        <div>
          <div className="flex items-center gap-1">
            <h4 className="font-medium">{title}</h4>
            {hasAslTranslation && (
              <Badge className="ml-1 text-xs bg-purple-50 text-purple-800">ASL</Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{type} • {date}</p>
        </div>
      </div>
      <CardContent className="p-4 pt-4 flex justify-between items-center">
        <Badge className={`
          ${status === 'approved' ? 'bg-green-100 text-green-800' : 
            status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
            status === 'rejected' ? 'bg-red-100 text-red-800' :
            'bg-blue-100 text-blue-800'}
        `}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
            <Download className="h-4 w-4" />
          </Button>
          {hasAslTranslation && (
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
              <Video className="h-4 w-4" />
            </Button>
          )}
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Services Tab
function VRServicesTab() {
  const { toast } = useToast();
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  
  const handleRequestService = () => {
    toast({
      title: "Service requested",
      description: "Your service request has been submitted and will be reviewed by your counselor.",
    });
    setIsRequestDialogOpen(false);
  };
  
  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Available VR Services</h3>
        <Button size="sm" onClick={() => setIsRequestDialogOpen(true)} className="gap-2">
          <HandHelping className="h-4 w-4" />
          Request Service
        </Button>
      </div>
      
      <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 mb-6">
        <div className="flex gap-3">
          <div className="p-2 rounded-full bg-purple-100">
            <Video className="h-5 w-5 text-purple-700" />
          </div>
          <div>
            <h3 className="font-medium mb-1 text-purple-900">PinkSync Communication Services</h3>
            <p className="text-sm text-gray-700 mb-2">
              All VR services include PinkSync ASL communication support. You can request PinkSync-certified
              interpreters for any meeting, have documents translated to ASL, and access all VR services
              in your preferred communication mode.
            </p>
            <Button variant="outline" size="sm" className="bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200">
              Learn More About PinkSync VR Services
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <ServiceCard 
          title="Business Plan Development"
          description="Get help developing a comprehensive business plan for VR approval"
          status="active"
          icon={<Clipboard className="h-5 w-5 text-blue-600" />}
          isPinkSyncEnabled={true}
        />
        <ServiceCard 
          title="Assistive Technology Assessment"
          description="Evaluation of assistive technology needs for your business"
          status="available"
          icon={<Cog className="h-5 w-5 text-purple-600" />}
          isPinkSyncEnabled={true}
        />
        <ServiceCard 
          title="ASL Interpreter Services"
          description="Professional interpreters for business meetings and calls"
          status="active"
          icon={<MessageSquare className="h-5 w-5 text-green-600" />}
          isPinkSyncEnabled={true}
        />
        <ServiceCard 
          title="Business Startup Training"
          description="Entrepreneur training courses specialized for deaf business owners"
          status="available"
          icon={<User className="h-5 w-5 text-amber-600" />}
          isPinkSyncEnabled={true}
        />
        <ServiceCard 
          title="Equipment Funding"
          description="Financial assistance for business equipment and technology"
          status="active"
          icon={<CardIcon className="h-5 w-5 text-red-600" />}
          isPinkSyncEnabled={false}
        />
        <ServiceCard 
          title="Marketing Support"
          description="Help with developing accessible marketing materials"
          status="available"
          icon={<BarChart className="h-5 w-5 text-indigo-600" />}
          isPinkSyncEnabled={true}
        />
      </div>
      
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Active Service Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-md p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <Clipboard className="h-5 w-5 text-blue-600" />
                  <h4 className="font-medium">Business Plan Development</h4>
                </div>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Assistance with developing and refining your business plan to meet VR requirements and 
                prepare for funding approval.
              </p>
              <div className="p-3 bg-purple-50 border border-purple-100 rounded-md mb-3">
                <div className="flex items-center gap-2">
                  <Video className="h-4 w-4 text-purple-700" />
                  <span className="text-sm font-medium text-purple-900">PinkSync ASL Support Included</span>
                </div>
                <p className="text-xs text-gray-700 mt-1">
                  All sessions include ASL-fluent business consultants and video recording with ASL translation.
                </p>
              </div>
              <div className="grid gap-2 mt-4">
                <div className="flex justify-between text-sm">
                  <span>Start Date:</span>
                  <span className="font-medium">October 15, 2023</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Provider:</span>
                  <span className="font-medium">360 Magicians Business Consulting</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Hours Approved:</span>
                  <span className="font-medium">20 hours</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Hours Used:</span>
                  <span className="font-medium">12 hours</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Next Session:</span>
                  <span className="font-medium">Tomorrow, 10:00 AM</span>
                </div>
              </div>
            </div>
            
            <div className="border rounded-md p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                  <h4 className="font-medium">ASL Interpreter Services</h4>
                </div>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Professional ASL interpreting services for business meetings, training sessions, and 
                networking events.
              </p>
              <div className="p-3 bg-purple-50 border border-purple-100 rounded-md mb-3">
                <div className="flex items-center gap-2">
                  <Video className="h-4 w-4 text-purple-700" />
                  <span className="text-sm font-medium text-purple-900">PinkSync Enhanced Interpreting</span>
                </div>
                <p className="text-xs text-gray-700 mt-1">
                  AI-powered interpreting with business terminology specialization and recording capabilities.
                </p>
              </div>
              <div className="grid gap-2 mt-4">
                <div className="flex justify-between text-sm">
                  <span>Start Date:</span>
                  <span className="font-medium">August 3, 2023</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Provider:</span>
                  <span className="font-medium">PinkSync Interpreting Services</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Hours Approved:</span>
                  <span className="font-medium">50 hours</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Hours Used:</span>
                  <span className="font-medium">22 hours</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Next Request:</span>
                  <span className="font-medium">Pending for Supplier Meeting</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request VR Service</DialogTitle>
            <DialogDescription>
              Submit a request for a vocational rehabilitation service to support your business goals.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="service-type">Service Type</Label>
              <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1">
                <option value="assistive-tech">Assistive Technology Assessment</option>
                <option value="business-training">Business Startup Training</option>
                <option value="marketing">Marketing Support</option>
                <option value="interpreter">ASL Interpreter for Specific Event</option>
                <option value="mentoring">Business Mentoring</option>
                <option value="other">Other Service</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Business Need</Label>
              <Textarea 
                id="description" 
                placeholder="Describe how this service will help your business" 
                rows={4}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="timeline">Timeline</Label>
              <Input id="timeline" placeholder="When do you need this service?" />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="pinksync-interpreter" defaultChecked />
              <Label htmlFor="pinksync-interpreter" className="text-sm">Request PinkSync ASL support for this service</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRequestDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleRequestService}>Submit Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ServiceCard({ title, description, status, icon, isPinkSyncEnabled }: {
  title: string;
  description: string;
  status: 'active' | 'available' | 'completed';
  icon: React.ReactNode;
  isPinkSyncEnabled: boolean;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-background border">
              {icon}
            </div>
            <CardTitle className="text-base">{title}</CardTitle>
          </div>
          <Badge className={`
            ${status === 'active' ? 'bg-green-100 text-green-800' : 
              status === 'available' ? 'bg-blue-100 text-blue-800' : 
              'bg-gray-100 text-gray-800'}
          `}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2">{description}</p>
        {isPinkSyncEnabled && (
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-purple-100 text-purple-800 border-purple-200">
              PinkSync Enabled
            </Badge>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          variant={status === 'active' ? 'outline' : 'default'} 
          size="sm" 
          className="w-full"
        >
          {status === 'active' ? 'View Details' : 'Request Service'}
        </Button>
      </CardFooter>
    </Card>
  );
}

// Settings Tab
function VRSettingsTab() {
  const { toast } = useToast();
  
  const handleSavePreferences = () => {
    toast({
      title: "Preferences saved",
      description: "Your communication preferences have been updated.",
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">PinkSync Communication Preferences</h3>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label>Preferred Communication Method</Label>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" className="gap-2 bg-primary/5">
                    <Video className="h-4 w-4" />
                    Video Call
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Text Chat
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Call
                  </Button>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label>Preferred Language</Label>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" className="gap-2 bg-primary/5">
                    <PersonStanding className="h-4 w-4" />
                    ASL
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <MessageSquare className="h-4 w-4" />
                    English
                  </Button>
                </div>
              </div>
              
              <div className="p-4 bg-purple-50 border border-purple-100 rounded-md">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 rounded-full mt-0.5">
                    <Video className="h-4 w-4 text-purple-700" />
                  </div>
                  <div>
                    <h4 className="font-medium text-purple-900 mb-1">PinkSync Accessibility Settings</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="automatic-captions" defaultChecked />
                        <label htmlFor="automatic-captions" className="text-sm">Automatic captions on videos</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="asl-translations" defaultChecked />
                        <label htmlFor="asl-translations" className="text-sm">ASL translations for documents</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="visual-alerts" defaultChecked />
                        <label htmlFor="visual-alerts" className="text-sm">Visual meeting alerts</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="interpreter-preference" defaultChecked />
                        <label htmlFor="interpreter-preference" className="text-sm">Same interpreter when possible</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label>Interpreter Preferences</Label>
                <Textarea 
                  placeholder="Specific interpreter requests or preferences" 
                  rows={2}
                  value="Prefer same interpreter for consecutive business planning sessions for consistency."
                />
              </div>
              
              <div className="grid gap-2">
                <Label>Meeting Notification Preferences</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="email-notifications" checked />
                    <label htmlFor="email-notifications" className="text-sm">Email notifications</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="text-notifications" checked />
                    <label htmlFor="text-notifications" className="text-sm">Text message reminders</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="calendar-invites" checked />
                    <label htmlFor="calendar-invites" className="text-sm">Calendar invites</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="app-notifications" />
                    <label htmlFor="app-notifications" className="text-sm">App notifications</label>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button onClick={handleSavePreferences} className="bg-purple-600 hover:bg-purple-700">Save PinkSync Preferences</Button>
          </CardFooter>
        </Card>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-2">VR Case Information</h3>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="grid gap-1">
                <Label>VR Case Number</Label>
                <div className="flex items-center justify-between">
                  <Input value="VR-2023-05422" readOnly className="bg-muted" />
                  <Button variant="ghost" size="sm" className="gap-1 ml-2">
                    <Copy className="h-4 w-4" />
                    Copy
                  </Button>
                </div>
              </div>
              
              <div className="grid gap-1">
                <Label>VR Counselor</Label>
                <div className="flex items-center justify-between">
                  <Input value="Jennifer Martinez" readOnly className="bg-muted" />
                  <Button variant="ghost" size="sm" className="gap-1 ml-2">
                    <MessageSquare className="h-4 w-4" />
                    Contact
                  </Button>
                </div>
              </div>
              
              <div className="grid gap-1">
                <Label>VR Office</Label>
                <div className="flex items-center">
                  <Input value="California DOR - San Francisco Office" readOnly className="bg-muted" />
                </div>
              </div>
              
              <div className="grid gap-1">
                <Label>IPE Date</Label>
                <div className="flex items-center">
                  <Input value="August 15, 2023" readOnly className="bg-muted" />
                </div>
              </div>
              
              <div className="grid gap-1">
                <Label>IPE Renewal Date</Label>
                <div className="flex items-center">
                  <Input value="August 15, 2024" readOnly className="bg-muted" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-2">Emergency Contact</h3>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="grid gap-1">
                <Label>Name</Label>
                <Input value="Michael Johnson" />
              </div>
              
              <div className="grid gap-1">
                <Label>Relationship</Label>
                <Input value="Spouse" />
              </div>
              
              <div className="grid gap-1">
                <Label>Phone Number</Label>
                <Input value="(555) 123-4567" />
              </div>
              
              <div className="grid gap-1">
                <Label>Email</Label>
                <Input value="michael.johnson@example.com" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button>Update Contact</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}