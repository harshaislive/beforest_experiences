# Static Images Inventory

## Default/Fallback Images

### Location Pages
**Page:** `[location]/page.tsx`
**Section:** LocationHero
**Image:** `/images/default-location-hero.jpg`
**Replace with:** [TO FILL]

**Page:** `LocationCard.tsx`
**Section:** Card Image
**Image:** `/images/default-location.jpg`
**Replace with:** [TO FILL]

### Event Pages
**Page:** `[slug]/EventPageClient.tsx`
**Section:** Event Hero
**Image:** `/images/event-placeholder.jpg`
**Replace with:** [TO FILL]

## Homepage Images

### Hero Section
**Page:** `HeroSection.tsx`
**Section:** Hero Background
**Image:** `https://images.unsplash.com/photo-1542273917363-3b1817f69a2d`
**Fallback:** `https://images.unsplash.com/photo-1506126613408-eca07ce68773`
**Replace with:** [TO FILL]

### Experience Cards
**Page:** `ExperienceCard.tsx`
**Section:** Card Images
**Images:** Dynamic from props
**Replace with:** [TO FILL]

### Community Glimpses
**Page:** `CommunityGlimpses.tsx`
**Section:** Gallery
**Images:** Dynamic from props
**Replace with:** [TO FILL]

### Testimonials
**Page:** `TestimonialSection.tsx`
**Section:** Testimonial Images
**Images:** Dynamic from testimonials array
**Replace with:** [TO FILL]

## About Page Images

### Values Section
**Page:** `about/page.tsx`
**Section:** Values Cards
**Images:** Dynamic from values array
**Replace with:** [TO FILL]

### Team Section
**Page:** `about/page.tsx`
**Section:** Team Members
**Images:** Dynamic from team array
**Replace with:** [TO FILL]

## Shared Images

### Newsletter Section
**Page:** Multiple
**Section:** Newsletter Background
**Image:** `/images/shared/newsletter-bg.jpg`
**Replace with:** [TO FILL]

### Contact Section
**Page:** Multiple
**Section:** Contact Background
**Image:** `/images/shared/contact-bg.jpg`
**Replace with:** [TO FILL]

## Script for Unsplash Image Download

```typescript
import fs from 'fs';
import path from 'path';
import axios from 'axios';

const UNSPLASH_ACCESS_KEY = 'YOUR_ACCESS_KEY';
const IMAGE_DIRECTORY = './public/images';

interface ImageConfig {
  search: string;
  filename: string;
  width: number;
  height: number;
}

const images: ImageConfig[] = [
  {
    search: 'forest retreat nature',
    filename: 'default-location-hero.jpg',
    width: 1920,
    height: 1080
  },
  {
    search: 'eco community',
    filename: 'default-location.jpg',
    width: 800,
    height: 600
  },
  // Add more image configurations
];

async function downloadImage(config: ImageConfig) {
  try {
    const response = await axios.get(
      `https://api.unsplash.com/photos/random?query=${config.search}&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
      }
    );

    const imageUrl = response.data.urls.raw + 
      `&w=${config.width}&h=${config.height}&fit=crop&crop=entropy`;
    
    const imageResponse = await axios.get(imageUrl, {
      responseType: 'arraybuffer'
    });

    const filepath = path.join(IMAGE_DIRECTORY, config.filename);
    fs.writeFileSync(filepath, imageResponse.data);

    console.log(`Downloaded: ${config.filename}`);
  } catch (error) {
    console.error(`Error downloading ${config.filename}:`, error);
  }
}

async function downloadAllImages() {
  for (const config of images) {
    await downloadImage(config);
  }
}

downloadAllImages();
```

## Usage Instructions

1. Install required dependencies:
```bash
npm install axios
```

2. Set up Unsplash API access:
- Create an account at https://unsplash.com/developers
- Get your access key
- Replace `YOUR_ACCESS_KEY` in the script

3. Configure image requirements:
- Add/modify image configurations in the `images` array
- Adjust search terms for better results
- Set appropriate dimensions

4. Run the script:
```bash
ts-node download-images.ts
```

5. Review and optimize downloaded images:
- Check image quality and relevance
- Optimize for web if needed
- Update image paths in components 