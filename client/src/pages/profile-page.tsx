import { useParams } from 'wouter';
import BasicUserProfile from '@/components/BasicUserProfile';

export default function ProfilePage() {
  const { username } = useParams();
  
  return (
    <div className="py-6">
      <BasicUserProfile />
    </div>
  );
}