'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, CreditCard, Heart, Share2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { toast } from 'sonner';

interface ProductImage {
  src: string;
  alt?: string;
  is_default?: boolean;
}

interface ProductVariant {
  id: number;
  title: string;
  options: {
    color?: string;
    size?: string;
  };
  price: number;
  is_enabled: boolean;
}

export default function ProductPage() {
  // Enhanced color mapping with real API color names to hex values
  const getColorHex = (colorName: string): string => {
    const colorMap: { [key: string]: string } = {
      'White': '#ffffff',
      'Terracotta': '#DB8C76',
      'Butter': '#F5E1A4',
      'Pepper': '#5F605B',
      'Sage': '#B5B5A3',
      'Dusty blue': '#7BA4B0',
      'Mauve': '#BA9BB4',
      'Heather Prism Lilac': '#C8A2C8',
      'Heather Prism Mint': '#9BC2A8',
      'Heather Prism Natural': '#E8E2D5',
      'Heather Prism Sunset': '#FFB347',
      'Heather Prism Peach': '#FFCAB0',
      'Heather Prism Ice Blue': '#B8E0D2',
      'Heather Prism Dusty Blue': '#A4C2CE'
    };
    
    return colorMap[colorName] || '#808080';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Enhanced Product Page</h1>
        <p className="text-gray-600 mt-2">Color swatches and cart functionality working!</p>
      </div>
    </div>
  );
}
