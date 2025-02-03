-- Update Location Images
UPDATE location_images 
SET image_url = 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e'
WHERE id = 'a1b2c3d4-e5f6-4a5b-9c8d-1e2f3a4b5c6d';

UPDATE location_images 
SET image_url = 'https://images.unsplash.com/photo-1507499739999-097706ad8914'
WHERE id = 'b2c3d4e5-f6a7-5b6c-8d9e-2f3a4b5c6d7e';

UPDATE location_images 
SET image_url = 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf'
WHERE id = 'c3d4e5f6-a7b8-6c7d-9e0f-3a4b5c6d7e8f';

UPDATE location_images 
SET image_url = 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e'
WHERE id = 'd4e5f6a7-b8c9-7d8e-0f1a-4b5c6d7e8f9a';

-- Update Event Images
UPDATE event_images 
SET image_url = 'https://images.unsplash.com/photo-1509773896068-7fd415d91e2e'
WHERE id = 'a7b8c9d0-e1f2-0a1b-3c4d-7e8f9a0b1c2d';

UPDATE event_images 
SET image_url = 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45'
WHERE id = 'b8c9d0e1-f2a3-1b2c-4d5e-8f9a0b1c2d3e';

UPDATE event_images 
SET image_url = 'https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb'
WHERE id = 'c9d0e1f2-a3b4-2c3d-5e6f-9a0b1c2d3e4f';

UPDATE event_images 
SET image_url = 'https://images.unsplash.com/photo-1447933601403-0c6688de566e'
WHERE id = 'd0e1f2a3-b4c5-3d4e-6f7a-0b1c2d3e4f5a';

-- Update PhonePe Config
UPDATE phonepay_config
SET 
    merchant_id = 'M2282MICTQDNO',
    salt_key = '025d030a-b6e3-4d2c-913a-22b850698c5a'
WHERE id = 'd2e3f4a5-b6c7-5d6e-8f9a-2b3c4d5e6f7a';