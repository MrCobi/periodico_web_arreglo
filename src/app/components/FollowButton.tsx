'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';

export function FollowButton({ targetUserId }: { targetUserId: string }) {
  const { data: session } = useSession();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!session) return;
      
      const res = await fetch(`/api/follow/check?userId=${targetUserId}`);
      const data = await res.json();
      setIsFollowing(data.isFollowing);
      setIsLoading(false);
    };
    
    checkFollowStatus();
  }, [session, targetUserId]);

  const handleFollow = async () => {
    setIsLoading(true);
    try {
      const method = isFollowing ? 'DELETE' : 'POST';
      const res = await fetch('/api/follow', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followingId: targetUserId })
      });
      
      if (res.ok) setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error updating follow status:', error);
    }
    setIsLoading(false);
  };

  if (!session) {
    return (
      <Button asChild>
        <a href="/login">Iniciar sesión para seguir</a>
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleFollow}
      disabled={isLoading}
      variant={isFollowing ? 'outline' : 'default'}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isFollowing ? (
        'Dejar de seguir'
      ) : (
        'Seguir'
      )}
    </Button>
  );
}