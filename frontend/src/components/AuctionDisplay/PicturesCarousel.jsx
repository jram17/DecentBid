import React from 'react';
import { Carousel, CarouselContent, CarouselItem } from '../ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
const PicturesCarousel = ({ extra_pictures }) => {
  if (!extra_pictures) {
    return null;
  }
  return (
    <div>
      <Carousel
        plugins={[
          Autoplay({
            delay: 2000,
          }),
        ]}
      >
        <CarouselContent>
          {extra_pictures.map((picture, index) => (
            <CarouselItem key={index}>
              <img src={picture} alt="Auction" />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default PicturesCarousel;
