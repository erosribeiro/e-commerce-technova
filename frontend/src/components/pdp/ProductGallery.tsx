import Image from 'next/image';
import { useState } from 'react';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      {/* Imagem Principal */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-border/50 bg-background/50 flex items-center justify-center p-8">
        <Image
          src={images[selectedImage]}
          alt={`${productName} - Imagem Principal`}
          fill
          className="object-contain transition-transform duration-500 hover:scale-110"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
        
        {/* Placeholder para botão 360/AR */}
        <button className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-md border border-border px-4 py-2 rounded-full text-xs font-semibold text-foreground hover:bg-accent transition-colors z-10 shadow-lg">
          Ver no seu espaço (AR)
        </button>
      </div>

      {/* Miniaturas */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(idx)}
              className={`relative aspect-square overflow-hidden rounded-md border-2 transition-colors ${
                selectedImage === idx ? 'border-primary' : 'border-transparent hover:border-muted-foreground'
              }`}
              aria-label={`Visualizar imagem ${idx + 1}`}
              aria-current={selectedImage === idx ? 'true' : 'false'}
            >
              <Image
                src={img}
                alt={`${productName} - Miniatura ${idx + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 25vw, 10vw"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
