import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import Image from 'next/image'

interface TreePhotoCarouselProps {
  photos: string[];
}

export function TreePhotoCarousel({ photos }: TreePhotoCarouselProps) {
  return (
    <Carousel className="w-full max-w-xs mx-auto">
      <CarouselContent>
        {photos.map((photo, index) => (
          <CarouselItem key={index}>
            <Card>
              <CardContent className="flex aspect-square items-center justify-center p-1">
                <Image
                  src={photo}
                  alt={`Tree photo ${index + 1}`}
                  width={300}
                  height={300}
                  objectFit="cover"
                  unoptimized
                />
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="absolute inset-0 flex items-center justify-between p-2">
        <CarouselPrevious />
        <CarouselNext />
      </div>
    </Carousel>
  )
}