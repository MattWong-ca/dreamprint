"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";

interface CollageImage {
  id: number;
  image_url: string;
  claim_id: string;
}

export default function CollagePage() {
  const [images, setImages] = useState<CollageImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCollageImages();
  }, []);

  const fetchCollageImages = async () => {
    try {
      setLoading(true);
      
      // Fetch images from users who opted in for collage and have image URLs
      const { data, error } = await supabase
        .from('dreamprint_orders')
        .select('id, image_url, claim_id')
        .eq('collage_opt_in', true)
        .not('image_url', 'is', null)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setImages(data || []);
      console.log(`Loaded ${data?.length || 0} collage images`);
      
    } catch (err) {
      console.error("Error fetching collage images:", err);
      setError("Failed to load collage images");
    } finally {
      setLoading(false);
    }
  };

  // Generate random positions for images around the center
  const generateImageStyle = (index: number, total: number) => {
    // Use a seeded random based on index for consistent positioning
    const seed = index * 1000;
    const pseudoRandom1 = (Math.sin(seed) * 10000) % 1;
    const pseudoRandom2 = (Math.sin(seed + 1) * 10000) % 1;
    const pseudoRandom3 = (Math.sin(seed + 2) * 10000) % 1;
    
    const angle = (index / total) * 2 * Math.PI;
    const baseRadius = 25; // Base radius in viewport units
    const centerX = 50; // 50% from left
    const centerY = 50; // 50% from top
    
    // Add some randomness to make it look more natural
    const randomRadius = baseRadius + pseudoRandom1 * 15;
    const randomAngle = angle + (pseudoRandom2 - 0.5) * 0.8;
    
    const x = centerX + Math.cos(randomAngle) * randomRadius;
    const y = centerY + Math.sin(randomAngle) * randomRadius;
    
    // Random rotation for polaroid effect
    const rotation = (pseudoRandom3 - 0.5) * 40;
    
    return {
      position: 'absolute' as const,
      left: `${Math.max(5, Math.min(95, x))}%`,
      top: `${Math.max(5, Math.min(95, y))}%`,
      transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
      zIndex: Math.floor(pseudoRandom1 * 10) + 1,
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading collage...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchCollageImages}
              className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <Navbar />
      
      {/* Main Collage Container */}
      <div className="relative w-full h-screen">
        
        {/* Center Text */}
        <div className="absolute inset-0 flex items-center justify-center z-50">
          {/* Black highlight/shadow text - positioned down and to the right */}
          <h1 
            className="text-6xl md:text-8xl font-bold text-center leading-tight absolute"
            style={{
              color: '#000000',
              transform: 'translate(6px, 6px)',
              zIndex: 1,
              lineHeight: '0.9'
            }}
          >
            ETHGlobal<br />New York
          </h1>
          
          {/* Main text - on top */}
          <h1 
            className="text-6xl md:text-8xl font-bold text-center leading-tight relative"
            style={{
              color: '#2D1810',
              zIndex: 2,
              lineHeight: '0.9'
            }}
          >
            ETHGlobal<br />New York
          </h1>
        </div>

        {/* Collage Images */}
        {images.map((image, index) => (
          <div
            key={image.id}
            style={generateImageStyle(index, images.length)}
            className="w-32 h-40 bg-white shadow-lg border border-gray-200 p-2"
          >
            <img
              src={image.image_url}
              alt={`Dreamprint ${image.claim_id}`}
              className="w-full h-32 object-cover"
              onError={(e) => {
                // Hide broken images
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="text-xs text-gray-500 text-center mt-1 font-mono">
              {image.claim_id}
            </div>
          </div>
        ))}

        {/* No Images Message */}
        {images.length === 0 && (
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-center">
            <p className="text-gray-500 text-sm">
              No collage images yet. Be the first to opt in and share your Dreamprint!
            </p>
          </div>
        )}

        {/* Image Count */}
        {/* <div className="absolute top-20 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
          {images.length} {images.length === 1 ? 'image' : 'images'}
        </div> */}
      </div>
    </div>
  );
}
