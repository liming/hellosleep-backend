const axios = require('axios');

async function testImageStructure() {
  try {
    console.log('🔍 Testing image structure in Strapi...');
    
    // Test with a simple image structure
    const testImageData = {
      data: {
        title: "Test Image Article",
        excerpt: "Testing image structure",
        body: [
          {
            type: "paragraph",
            children: [
              {
                type: "text",
                text: "This is a test paragraph with an image:"
              }
            ]
          },
          {
            type: "image",
            image: {
              name: "test-image",
              alternativeText: "Test Image",
              url: "https://via.placeholder.com/640x427/0066cc/ffffff?text=Test+Image",
              caption: null,
              width: 640,
              height: 427,
              formats: {
                small: {
                  name: "small_test-image",
                  hash: "small_test-image",
                  ext: ".jpg",
                  mime: "image/jpeg",
                  path: null,
                  width: 500,
                  height: 334,
                  size: 25.88,
                  sizeInBytes: 25875,
                  url: "https://via.placeholder.com/500x334/0066cc/ffffff?text=Test+Image"
                },
                thumbnail: {
                  name: "thumbnail_test-image",
                  hash: "thumbnail_test-image",
                  ext: ".jpg",
                  mime: "image/jpeg",
                  path: null,
                  width: 234,
                  height: 156,
                  size: 6.56,
                  sizeInBytes: 6557,
                  url: "https://via.placeholder.com/234x156/0066cc/ffffff?text=Test+Image"
                }
              },
              hash: "test-image_hash",
              ext: ".jpg",
              mime: "image/jpeg",
              size: 40.46,
              previewUrl: null,
              provider: "external",
              provider_metadata: null,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            children: [
              {
                type: "text",
                text: ""
              }
            ]
          }
        ],
        like: 0,
        coverUrl: "https://via.placeholder.com/640x427/0066cc/ffffff?text=Cover+Image",
        date: "2025-01-27",
        altId: "test-image-article",
        originUrl: "https://example.com/test",
        locale: "en"
      }
    };

    console.log('📤 Sending test image data to Strapi...');
    console.log('Image structure:', JSON.stringify(testImageData, null, 2));
    
    const response = await axios.post('http://localhost:1337/api/articles', testImageData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_TOKEN_HERE' // Replace with your actual token
      }
    });
    
    console.log('✅ Test article created successfully!');
    console.log('Article ID:', response.data.data.id);
    console.log('Check the article in Strapi admin panel to see if the image displays correctly.');
    
  } catch (error) {
    console.error('❌ Error testing image structure:', error.response?.data || error.message);
    console.log('💡 Make sure Strapi is running and you have a valid API token.');
  }
}

testImageStructure(); 