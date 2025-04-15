import { 
  Layout, 
  Globe, 
  Video, 
  ShoppingBag, 
  PieChart, 
  Info, 
  Users, 
  Settings, 
  LogOut,
  Server,
  Database,
  Cloud
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TerraformDeploymentWidget } from './TerraformDeploymentWidget';
import { SEOOptimizationWidget } from './SEOOptimizationWidget';

export default function DeafFirstDashboard() {
  const [activePath, setActivePath] = useState<string>('dashboard');
  const [showCloudDialog, setShowCloudDialog] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-20 bg-indigo-900 flex flex-col items-center py-8 space-y-8">
        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
          <span className="text-indigo-900 font-bold text-lg">DF</span>
        </div>
        <div className="flex flex-col items-center space-y-6 mt-8">
          <button 
            className={`w-12 h-12 rounded-full ${activePath === 'dashboard' ? 'bg-indigo-700' : 'hover:bg-indigo-800'} flex items-center justify-center ${activePath === 'dashboard' ? 'text-white' : 'text-gray-300'}`}
            onClick={() => setActivePath('dashboard')}
          >
            <Layout size={24} />
          </button>
          <button 
            className={`w-12 h-12 rounded-full ${activePath === 'web' ? 'bg-indigo-700' : 'hover:bg-indigo-800'} flex items-center justify-center ${activePath === 'web' ? 'text-white' : 'text-gray-300'}`}
            onClick={() => setActivePath('web')}
          >
            <Globe size={24} />
          </button>
          <button 
            className={`w-12 h-12 rounded-full ${activePath === 'video' ? 'bg-indigo-700' : 'hover:bg-indigo-800'} flex items-center justify-center ${activePath === 'video' ? 'text-white' : 'text-gray-300'}`}
            onClick={() => setActivePath('video')}
          >
            <Video size={24} />
          </button>
          <button 
            className={`w-12 h-12 rounded-full ${activePath === 'ecommerce' ? 'bg-indigo-700' : 'hover:bg-indigo-800'} flex items-center justify-center ${activePath === 'ecommerce' ? 'text-white' : 'text-gray-300'}`}
            onClick={() => setActivePath('ecommerce')}
          >
            <ShoppingBag size={24} />
          </button>
          <button 
            className={`w-12 h-12 rounded-full ${activePath === 'analytics' ? 'bg-indigo-700' : 'hover:bg-indigo-800'} flex items-center justify-center ${activePath === 'analytics' ? 'text-white' : 'text-gray-300'}`}
            onClick={() => setActivePath('analytics')}
          >
            <PieChart size={24} />
          </button>
        </div>
        <div className="flex flex-col items-center space-y-6 mt-auto">
          <button className="w-12 h-12 rounded-full hover:bg-indigo-800 flex items-center justify-center text-gray-300">
            <Info size={24} />
          </button>
          <button className="w-12 h-12 rounded-full hover:bg-indigo-800 flex items-center justify-center text-gray-300">
            <Users size={24} />
          </button>
          <button className="w-12 h-12 rounded-full hover:bg-indigo-800 flex items-center justify-center text-gray-300">
            <Settings size={24} />
          </button>
          <button className="w-12 h-12 rounded-full hover:bg-indigo-800 flex items-center justify-center text-gray-300">
            <LogOut size={24} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="h-20 bg-white shadow-sm px-8 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-gray-800">DEAF FIRST</h1>
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 flex items-center">
              <span className="mr-2">ASL</span>
              <Video size={16} />
            </button>
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white">
              <span>JD</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-8">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Choose Your Path</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-40 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                  <Video size={64} className="text-white" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2">Content Creator</h3>
                  <p className="text-gray-600 mb-4">Create and manage videos with advanced accessibility features</p>
                  <button className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    Select
                  </button>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-40 bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center">
                  <ShoppingBag size={64} className="text-white" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2">Entrepreneur</h3>
                  <p className="text-gray-600 mb-4">Build and grow your business with simplified tech solutions</p>
                  <button className="w-full py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                    Select
                  </button>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-40 bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                  <Globe size={64} className="text-white" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2">Tech Specialist</h3>
                  <p className="text-gray-600 mb-4">Develop ML/AI solutions customized for Deaf community needs</p>
                  <button className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    Select
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Hosting Solutions for Beginners</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div 
                className="bg-white p-4 rounded-xl shadow-sm flex flex-col items-center justify-center space-y-3 hover:bg-blue-50 hover:border hover:border-blue-200 cursor-pointer transition-all py-6"
                onClick={() => {
                  setSelectedProvider('ionos');
                  setShowCloudDialog(true);
                }}
              >
                <div className="w-16 h-16 rounded bg-blue-100 flex items-center justify-center">
                  <span className="font-bold text-blue-600 text-xl">IO</span>
                </div>
                <div className="text-center">
                  <h3 className="font-medium">IONOS</h3>
                  <p className="text-sm text-gray-500">Easy Website Hosting</p>
                  <div className="mt-2 inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Partner Offer</div>
                </div>
              </div>
              
              <div 
                className="bg-white p-4 rounded-xl shadow-sm flex flex-col items-center justify-center space-y-3 hover:bg-blue-50 cursor-pointer transition-all py-6"
                onClick={() => {
                  setSelectedProvider('gcp');
                  setShowCloudDialog(true);
                }}
              >
                <div className="w-16 h-16 rounded bg-red-100 flex items-center justify-center">
                  <span className="font-bold text-red-600 text-xl">G</span>
                </div>
                <div className="text-center">
                  <h3 className="font-medium">Google Cloud</h3>
                  <p className="text-sm text-gray-500">ML/AI Solutions</p>
                </div>
              </div>
              
              <div 
                className="bg-white p-4 rounded-xl shadow-sm flex flex-col items-center justify-center space-y-3 hover:bg-blue-50 cursor-pointer transition-all py-6"
                onClick={() => {
                  setSelectedProvider('aws');
                  setShowCloudDialog(true);
                }}
              >
                <div className="w-16 h-16 rounded bg-orange-100 flex items-center justify-center">
                  <span className="font-bold text-orange-600 text-xl">A</span>
                </div>
                <div className="text-center">
                  <h3 className="font-medium">AWS</h3>
                  <p className="text-sm text-gray-500">Business Solutions</p>
                </div>
              </div>
              
              <div 
                className="bg-white p-4 rounded-xl shadow-sm flex flex-col items-center justify-center space-y-3 hover:bg-blue-50 cursor-pointer transition-all py-6"
                onClick={() => {
                  setSelectedProvider('azure');
                  setShowCloudDialog(true);
                }}
              >
                <div className="w-16 h-16 rounded bg-blue-100 flex items-center justify-center">
                  <span className="font-bold text-blue-600 text-xl">Az</span>
                </div>
                <div className="text-center">
                  <h3 className="font-medium">Azure</h3>
                  <p className="text-sm text-gray-500">Enterprise Tools</p>
                </div>
              </div>
              
              <div 
                className="bg-white p-4 rounded-xl shadow-sm flex flex-col items-center justify-center space-y-3 hover:bg-blue-50 cursor-pointer transition-all py-6"
                onClick={() => {
                  setSelectedProvider('vercel');
                  setShowCloudDialog(true);
                }}
              >
                <div className="w-16 h-16 rounded bg-gray-900 flex items-center justify-center">
                  <span className="font-bold text-white text-xl">V</span>
                </div>
                <div className="text-center">
                  <h3 className="font-medium">Vercel</h3>
                  <p className="text-sm text-gray-500">Web App Hosting</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Business Tools</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                    <Globe className="text-indigo-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Optimize Your Online Presence</h3>
                    <p className="text-gray-600">Simple SEO tools to improve visibility</p>
                  </div>
                </div>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => setActivePath('seo')}
                >
                  SEO Optimization Tools
                </Button>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm overflow-hidden p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Server className="text-green-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Deploy Your Infrastructure</h3>
                    <p className="text-gray-600">One-click cloud infrastructure setup</p>
                  </div>
                </div>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => setActivePath('infrastructure')}
                >
                  Cloud Infrastructure Tools
                </Button>
              </div>
            </div>
          </div>
          
          {/* Conditional Content Based on Active Path */}
          {activePath === 'seo' && (
            <div className="mt-8">
              <SEOOptimizationWidget />
            </div>
          )}
          
          {activePath === 'infrastructure' && (
            <div className="mt-8">
              <TerraformDeploymentWidget />
            </div>
          )}
        </main>
      </div>
      
      {/* Cloud Provider Dialog */}
      <Dialog open={showCloudDialog} onOpenChange={setShowCloudDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {selectedProvider === 'ionos' ? 'IONOS Hosting Solutions' : 
               selectedProvider === 'gcp' ? 'Google Cloud Platform' :
               selectedProvider === 'aws' ? 'Amazon Web Services' :
               selectedProvider === 'azure' ? 'Microsoft Azure' :
               selectedProvider === 'vercel' ? 'Vercel Platform' : 'Cloud Solutions'}
            </DialogTitle>
            <DialogDescription>
              {selectedProvider === 'ionos' ? 
                'Simple and affordable web hosting solutions perfect for beginners' : 
                'Configure and deploy your cloud infrastructure'}
            </DialogDescription>
          </DialogHeader>
          
          {selectedProvider === 'ionos' && (
            <div className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <div className="flex items-start gap-4">
                  <div className="bg-white rounded-full p-3">
                    <Cloud className="text-blue-600 h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-800">IONOS Partner Offer</h3>
                    <p className="text-blue-700 mt-1">
                      Get started with IONOS hosting at special rates for deaf entrepreneurs. 
                      Our partnership provides you with simplified setup and dedicated support.
                    </p>
                    <div className="mt-4 bg-white rounded-md p-4 border border-blue-200">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium">Website Hosting</h4>
                          <p className="text-sm text-gray-600">From $3.99/month</p>
                          <span className="inline-block mt-1 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Includes free domain</span>
                        </div>
                        <div>
                          <h4 className="font-medium">Website Builder</h4>
                          <p className="text-sm text-gray-600">From $5.99/month</p>
                          <span className="inline-block mt-1 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">ASL tutorial included</span>
                        </div>
                        <div>
                          <h4 className="font-medium">E-Commerce Store</h4>
                          <p className="text-sm text-gray-600">From $9.99/month</p>
                          <span className="inline-block mt-1 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Accessible templates</span>
                        </div>
                        <div>
                          <h4 className="font-medium">Business Email</h4>
                          <p className="text-sm text-gray-600">From $1.99/month</p>
                          <span className="inline-block mt-1 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Professional email</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold mb-3">Website Builder</h3>
                  <p className="text-gray-600 mb-4">
                    Create professional websites without coding knowledge using drag-and-drop tools.
                  </p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>Accessible templates</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>Mobile responsive</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>ASL video support</span>
                    </li>
                  </ul>
                  <Button className="w-full">Get Started</Button>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold mb-3">E-Commerce Solution</h3>
                  <p className="text-gray-600 mb-4">
                    Launch your online store with easy setup and accessibility features.
                  </p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>Product management</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>Payment processing</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>Order management</span>
                    </li>
                  </ul>
                  <Button className="w-full">Launch Store</Button>
                </div>
              </div>
              
              <div className="text-center text-sm text-gray-500 flex items-center justify-center gap-2">
                <Video size={16} />
                <span>All solutions include ASL video guides and accessible support</span>
              </div>
            </div>
          )}
          
          {selectedProvider !== 'ionos' && (
            <div className="p-6 bg-gray-50 rounded-lg">
              <p className="text-center text-gray-600">
                Configure and deploy cloud infrastructure using our Terraform deployment tool.
              </p>
              <div className="mt-4 text-center">
                <Button onClick={() => {
                  setShowCloudDialog(false);
                  setActivePath('infrastructure');
                }}>
                  Go to Deployment Tool
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}