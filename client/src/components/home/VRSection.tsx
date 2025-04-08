import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

interface VRCounselor {
  id: number;
  name: string;
  email: string;
  phone: string;
  organization: string;
}

const VRSection: React.FC = () => {
  const { toast } = useToast();
  
  const { data: counselors, isLoading } = useQuery<VRCounselor[]>({
    queryKey: ['/api/vr-counselors'],
  });

  const handleConnectWithVR = () => {
    if (counselors && counselors.length > 0) {
      toast({
        title: "VR Counselor Connection",
        description: `Connecting you with ${counselors[0].name} from ${counselors[0].organization}...`,
      });
    } else {
      toast({
        title: "VR Counselor Connection",
        description: "Connecting you with a vocational rehabilitation counselor...",
      });
    }
  };

  return (
    <section className="mb-12">
      <div className="bg-gradient-to-r from-secondary/10 to-accent/10 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="md:w-3/5">
            <h2 className="text-2xl font-bold mb-3 font-heading text-slate-900">Vocational Rehabilitation Services</h2>
            <p className="text-slate-700 mb-4">
              Access specialized business support services through vocational rehabilitation programs. 
              Our platform integrates seamlessly with VR counselors to provide comprehensive support.
            </p>
            <div className="flex flex-wrap gap-3">
              <button 
                className="bg-secondary hover:bg-secondary/90 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
                onClick={handleConnectWithVR}
                hx-post="/api/users/1/vr-counselors"
                hx-trigger="click[ctrlKey]"
                hx-vals='{"counselorId": 1}'
                hx-swap="none"
              >
                <i className="ri-user-voice-line"></i> Connect with VR Counselor
              </button>
              <button className="bg-white hover:bg-slate-50 text-slate-800 px-4 py-2 rounded-lg font-medium border border-slate-200 flex items-center gap-2">
                <i className="ri-information-line text-secondary"></i> Learn More
              </button>
            </div>
          </div>
          <div className="md:w-2/5">
            <div className="rounded-lg shadow-md w-full h-auto bg-slate-200 aspect-video flex items-center justify-center">
              <i className="ri-team-line text-5xl text-slate-400"></i>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VRSection;
