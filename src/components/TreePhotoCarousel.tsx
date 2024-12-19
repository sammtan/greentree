// src/components/TreePhotoCarousel.tsx

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import Image from 'next/image'

interface TreePhotoCarouselProps {
    photos: string[];
}

export function TreePhotoCarousel({ photos }: TreePhotoCarouselProps) {
    return (
        <Carousel className="w-full max-w-xs">
            <CarouselContent>
                {photos.map((photo, index) => (
                    <CarouselItem key={index}>
                        <div className="p-1">
                            <Card>
                                <CardContent className="flex aspect-square items-center justify-center p-6">
                                    <Image
                                        src={photo}
                                        alt={`Tree photo ${index + 1}`}
                                        width={300}
                                        height={300}
                                        objectFit="cover"
                                        unoptimized // Add this if you're using external URLs like Postimages
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    )
}