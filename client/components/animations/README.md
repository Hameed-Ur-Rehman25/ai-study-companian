# Animation Components

This directory contains Lottie-based animation components used throughout the AI Study Companion application.

## Components

### 1. FileUploadAnimation
A Lottie animation that displays a cloud upload animation during file upload.

**Props:**
- `size?: number` - Size of the animation (default: 200)
- `className?: string` - Additional CSS classes

**Usage:**
```tsx
import { FileUploadAnimation } from '../components/animations/FileUploadAnimation'

<FileUploadAnimation size={180} />
```

### 2. TextExtractionAnimation
A Lottie animation showing a document with a scanning effect during text extraction.

**Props:**
- `size?: number` - Size of the animation (default: 200)
- `className?: string` - Additional CSS classes

**Usage:**
```tsx
import { TextExtractionAnimation } from '../components/animations/TextExtractionAnimation'

<TextExtractionAnimation size={180} />
```

### 3. ProcessingAnimation
A comprehensive processing animation component that displays different stages of PDF processing with progress indication.

**Props:**
- `stage: 'uploading' | 'extracting' | 'processing'` - Current processing stage
- `fileName?: string` - Name of the file being processed
- `progress?: number` - Progress percentage (0-100)
- `className?: string` - Additional CSS classes

**Usage:**
```tsx
import { ProcessingAnimation } from '../components/animations/ProcessingAnimation'

<ProcessingAnimation
  stage="uploading"
  fileName="document.pdf"
  progress={45}
/>
```

**Features:**
- Displays different animations based on the current stage
- Shows a progress bar with shimmer effect
- Displays stage indicators at the bottom
- Shows the file name being processed
- Smooth transitions between stages
- Color-coded stages:
  - **Uploading**: Blue theme
  - **Extracting**: Emerald theme
  - **Processing**: Purple theme

## Implementation Details

### Lottie Animations
The animations are fetched from LottieFiles CDN:
- File Upload: Cloud with arrow animation
- Text Extraction: Document scanning animation

### Styling
All components use Tailwind CSS for styling with:
- Smooth transitions and animations
- Responsive design
- Gradient backgrounds
- Grid pattern overlays
- Shimmer effects on progress bars

## Pages Using These Animations

1. **Chat with PDF** (`/chat-with-pdf`)
   - Shows ProcessingAnimation during upload, extraction, and initial chat setup
   - Progress stages: uploading → extracting → processing

2. **Summarize PDF** (`/summarize-pdf`)
   - Shows ProcessingAnimation during upload, extraction, and summarization
   - Progress stages: uploading → extracting → processing (summarization)

## Future Enhancements

Potential improvements:
- Add more animation variations
- Support for custom Lottie animation URLs
- Add sound effects (optional)
- Implement animation caching for better performance
- Add animation presets for different use cases
