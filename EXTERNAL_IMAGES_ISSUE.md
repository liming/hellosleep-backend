# External Images Issue - Documented for Future Resolution

## Problem Summary
External images from platforms like WeChat (mmbiz.qpic.cn) and QQ are not displaying properly in the article content. These platforms implement anti-hotlinking measures that prevent images from being displayed on external websites.

## Current Status
- ✅ **Rich Text Rendering**: Lexical JSON content is properly rendered
- ✅ **Article Page**: Individual article pages work correctly
- ❌ **External Images**: WeChat/QQ images show platform placeholders instead of actual content

## Attempted Solutions

### 1. Image Proxy Approach (Failed)
- **Implementation**: Created `/api/proxy-image` route to fetch external images server-side
- **Result**: Proxy successfully downloads images (confirmed with curl tests)
- **Issue**: WeChat platform detects external domain access and serves placeholder images
- **Status**: ❌ **Rolled back** - Not effective due to platform restrictions

### 2. Download and Store Approach (Ready for Implementation)
- **Script**: `service/script/download-external-images.js` - Downloads external images during migration
- **Storage**: Saves images to `/public/uploads/external-images/`
- **URL Updates**: Automatically updates article content to use local paths
- **Status**: ✅ **Ready** - Not yet implemented

## Current Fallback Behavior
For external images that fail to load:
- Shows "图片无法显示" (Image cannot be displayed) message
- Displays "External platform image" subtitle
- Provides "在新窗口打开" (Open in new window) button to access original image

## Technical Details

### Affected Platforms
- WeChat Official Account Platform (`mmbiz.qpic.cn`)
- QQ Platform (`qq.com`)
- WeChat Platform (`weixin.qq.com`)

### Image Detection Logic
```javascript
const isExternalImage = image.url.includes('mmbiz.qpic.cn') || 
                       image.url.includes('weixin.qq.com') ||
                       image.url.includes('qq.com');
```

### Current Implementation
- Images load directly from source URLs
- Error handling shows fallback message for external images
- Users can access original images via "Open in new window" button

## Future Resolution Options

### Option 1: Download During Migration (Recommended)
```bash
# Download all external images and update article URLs
npm run migration:download-images

# Re-import articles with local image paths
npm run migration:import
```

### Option 2: Manual Image Replacement
- Manually download and replace external images
- Update article content with local image paths
- Store images in `/public/uploads/` directory

### Option 3: Alternative Image Sources
- Find alternative image sources for affected content
- Replace external images with local or publicly accessible images

## Files Modified
- `web/src/components/RichTextRenderer.tsx` - Image rendering with fallback
- `service/script/download-external-images.js` - Download script (ready)
- `service/package.json` - Added download script command
- `package.json` - Added download script command

## Notes
- This issue affects article content display but doesn't break core functionality
- Users can still access original images via fallback button
- Rich text rendering works perfectly for all other content types
- Consider implementing download approach when time permits 