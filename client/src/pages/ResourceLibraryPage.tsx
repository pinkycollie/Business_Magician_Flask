import ResourceLibrary from "../components/resources/ResourceLibrary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ASLVideo from "../components/asl/ASLVideo";
import { useQuery } from "@tanstack/react-query";

const ResourceLibraryPage = () => {
  // Fetch ASL videos related to resources
  const { data: aslVideos } = useQuery({
    queryKey: ['/api/asl-videos'],
    staleTime: 60000,
  });

  const resourcesASLVideo = aslVideos?.find((video) => 
    video.title.toLowerCase().includes('resource') || 
    video.description.toLowerCase().includes('resource library')
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-3/4">
          <h1 className="text-3xl font-bold mb-2">Resource Library</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Access guides, documents, and helpful resources for your business journey. 
            Includes SBA resources, VR materials, and business planning templates.
          </p>

          <div className="bg-slate-50 border rounded-lg p-4 mb-8">
            <h2 className="text-xl font-semibold mb-3">
              SBA Resource Integration
            </h2>
            <p className="mb-3">
              This resource library includes materials from the Small Business Administration (SBA), 
              providing valuable information for starting and growing your business. Resources marked 
              with the SBA badge are officially sourced from the Small Business Administration.
            </p>
            <div className="flex flex-wrap gap-2">
              <div className="bg-white p-3 rounded-md border flex-1 min-w-[200px]">
                <h3 className="font-medium mb-1">Business Planning</h3>
                <p className="text-sm text-muted-foreground">Templates, guides, and resources for creating effective business plans</p>
              </div>
              <div className="bg-white p-3 rounded-md border flex-1 min-w-[200px]">
                <h3 className="font-medium mb-1">Financial Resources</h3>
                <p className="text-sm text-muted-foreground">Funding opportunities, tax guides, and financial management tools</p>
              </div>
              <div className="bg-white p-3 rounded-md border flex-1 min-w-[200px]">
                <h3 className="font-medium mb-1">VR Service Integration</h3>
                <p className="text-sm text-muted-foreground">Resources from Vocational Rehabilitation specifically for deaf entrepreneurs</p>
              </div>
            </div>
          </div>

          <ResourceLibrary />
        </div>

        <div className="w-full md:w-1/4">
          <div className="sticky top-4">
            <div className="bg-white border rounded-lg overflow-hidden mb-6">
              <div className="bg-slate-100 p-4 border-b">
                <h3 className="font-medium">ASL Resource Guide</h3>
              </div>
              <div className="p-4">
                {resourcesASLVideo ? (
                  <ASLVideo
                    title={resourcesASLVideo.title}
                    description={resourcesASLVideo.description}
                    videoUrl={resourcesASLVideo.videoUrl}
                  />
                ) : (
                  <div className="text-center p-4 text-muted-foreground">
                    <p>ASL guide video coming soon</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white border rounded-lg overflow-hidden">
              <div className="bg-slate-100 p-4 border-b">
                <h3 className="font-medium">Quick Links</h3>
              </div>
              <div className="p-4">
                <ul className="space-y-2">
                  <li>
                    <a 
                      href="https://www.sba.gov/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline block"
                    >
                      Small Business Administration
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://www.score.org/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline block"
                    >
                      SCORE Mentorship
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://www.irs.gov/businesses/small-businesses-self-employed" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline block"
                    >
                      IRS Small Business Resources
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://www.copyright.gov/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline block"
                    >
                      U.S. Copyright Office
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://www.uspto.gov/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline block"
                    >
                      U.S. Patent and Trademark Office
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceLibraryPage;