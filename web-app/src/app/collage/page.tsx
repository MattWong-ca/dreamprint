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

  // Generate positions with minimal overlap
  const generateImageStyle = (index: number, total: number) => {
    // Use a seeded random based on index for consistent positioning
    const seed = index * 1000;
    const pseudoRandom1 = Math.abs((Math.sin(seed) * 10000) % 1);
    const pseudoRandom2 = Math.abs((Math.sin(seed + 1) * 10000) % 1);
    const pseudoRandom3 = Math.abs((Math.sin(seed + 2) * 10000) % 1);
    
    // Create a spiral pattern with multiple rings to prevent overlap
    const ring = Math.floor(index / 8); // 8 images per ring
    const positionInRing = index % 8;
    const baseRadius = 30 + (ring * 12); // Start further out to avoid text, increase radius for each ring
    
    // Calculate angle with even spacing and some randomness
    const baseAngle = (positionInRing / 8) * 2 * Math.PI;
    const angleVariation = (pseudoRandom2 - 0.5) * 0.3; // Smaller variation
    const angle = baseAngle + angleVariation;
    
    // Add some radius variation but keep minimum distance to avoid text
    const radiusVariation = (pseudoRandom1 - 0.5) * 8;
    const radius = Math.max(baseRadius + radiusVariation, 28); // Minimum radius to clear center text
    
    const centerX = 50;
    const centerY = 50;
    
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    
    // Smaller rotation to prevent too much overlap
    const rotation = (pseudoRandom3 - 0.5) * 25;
    
    return {
      position: 'absolute' as const,
      left: `${Math.max(8, Math.min(92, x))}%`,
      top: `${Math.max(8, Math.min(92, y))}%`,
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
    <div className="min-h-screen overflow-hidden" style={{
      background: `
        linear-gradient(45deg, #8B4513 1px, transparent 1px),
        linear-gradient(-45deg, #8B4513 1px, transparent 1px),
        linear-gradient(90deg, #CD853F 0.5px, transparent 0.5px),
        linear-gradient(0deg, #CD853F 0.5px, transparent 0.5px),
        #D2B48C
      `,
      backgroundSize: '20px 20px, 20px 20px, 10px 10px, 10px 10px',
      backgroundPosition: '0 0, 0 0, 0 0, 0 0'
    }}>
      <Navbar />
      
      {/* Cork Board Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(circle at 25% 25%, #A0522D 2px, transparent 2px),
            radial-gradient(circle at 75% 75%, #8B4513 1.5px, transparent 1.5px),
            radial-gradient(circle at 50% 10%, #CD853F 1px, transparent 1px),
            radial-gradient(circle at 10% 90%, #A0522D 1.5px, transparent 1.5px)
          `,
          backgroundSize: '40px 40px, 35px 35px, 25px 25px, 45px 45px'
        }}
      />
      
      {/* Main Collage Container */}
      <div className="relative w-full h-screen">
        
        {/* Center Text */}
        <div className="absolute inset-0 flex items-center justify-center z-50">
          {/* Black highlight/shadow text - positioned down and to the right */}
          <h1 
            className="text-6xl md:text-8xl font-bold text-center leading-tight absolute"
            style={{
              color: '#000000',
              transform: 'translate(8px, 8px)',
              zIndex: 1,
              lineHeight: '0.9',
              fontWeight: '900'
            }}
          >
            ETHGlobal<br />New York
          </h1>
          
          {/* Main text - on top */}
          <h1 
            className="text-6xl md:text-8xl font-bold text-center leading-tight relative"
            style={{
              color: 'white',
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
            <div className="h-6 mt-1">
              {/* Empty space for polaroid bottom margin */}
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
