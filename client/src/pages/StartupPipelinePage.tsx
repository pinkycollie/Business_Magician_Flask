import { StartupPipeline } from "@/components/startup/StartupPipeline";
import ASLVideo from "@/components/asl/ASLVideo";

export function StartupPipelinePage() {
  return (
    <div className="py-8">
      <div className="container max-w-6xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Startup Pipeline</h1>
            <p className="text-slate-600 mt-2">
              Streamline your business creation from idea to launch with our comprehensive startup pipeline
            </p>
          </div>
          <ASLVideo videoUrl="/asl/startup-pipeline-intro.mp4" title="Startup Pipeline Introduction" className="w-16 h-16" />
        </div>
        
        <div className="bg-primary/5 rounded-lg p-6 mb-8">
          <div className="flex gap-4">
            <div className="bg-primary/10 rounded-full p-3 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="m8 3 4 8 5-5 5 15H2L8 3z"></path></svg>
            </div>
            <div>
              <h2 className="text-lg font-medium mb-1">Micro-Startup Accelerator</h2>
              <p className="text-sm text-slate-600">
                Our pipeline makes it easier for deaf entrepreneurs to validate ideas, create technical solutions, 
                and launch businesses with accessibility built-in from the start. Receive expert guidance and 
                support throughout the entire process.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <StartupPipeline />
    </div>
  );
}