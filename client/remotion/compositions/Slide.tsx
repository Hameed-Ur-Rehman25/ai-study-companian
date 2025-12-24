import React from 'react';
import {
    AbsoluteFill,
    Audio,
    Img,
    interpolate,
    useCurrentFrame,
    useVideoConfig,
    spring
} from 'remotion';
import { PageData } from './PDFVideo';

interface SlideProps {
    page: PageData;
}

export const Slide: React.FC<SlideProps> = ({ page }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Fade in animation
    const fadeIn = interpolate(frame, [0, 15], [0, 1], {
        extrapolateRight: 'clamp',
    });

    // Slide in animation for content card
    const slideIn = spring({
        frame,
        fps,
        config: {
            damping: 100,
        },
    });

    const translateY = interpolate(slideIn, [0, 1], [50, 0]);

    return (
        <AbsoluteFill>
            {/* Unsplash Background Image */}
            {page.unsplash_image_path && (
                <Img
                    src={page.unsplash_image_path}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: 'blur(3px) brightness(0.6)',
                        opacity: fadeIn,
                    }}
                />
            )}

            {/* PDF Content Card */}
            <AbsoluteFill
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    opacity: fadeIn,
                    transform: `translateY(${translateY}px)`,
                }}
            >
                <div
                    style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: 20,
                        padding: 60,
                        maxWidth: '80%',
                        maxHeight: '80%',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 30,
                    }}
                >
                    {/* Title */}
                    {page.title && (
                        <h1
                            style={{
                                fontSize: 56,
                                fontWeight: 'bold',
                                color: '#1f2937',
                                margin: 0,
                                textAlign: 'center',
                                fontFamily: 'Inter, system-ui, sans-serif',
                            }}
                        >
                            {page.title}
                        </h1>
                    )}

                    {/* PDF Page Image or Extracted Figures */}
                    {page.images && page.images.length > 0 ? (
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            gap: 10,
                            maxWidth: '100%',
                            maxHeight: '600px',
                            overflow: 'hidden'
                        }}>
                            {page.images.slice(0, 2).map((imgUrl, i) => (
                                <Img
                                    key={i}
                                    src={imgUrl}
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: page.images!.length > 1 ? '280px' : '560px',
                                        objectFit: 'contain',
                                        borderRadius: 8,
                                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                    }}
                                />
                            ))}
                        </div>
                    ) : (
                        page.pdf_image_path && (
                            <Img
                                src={page.pdf_image_path}
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '600px',
                                    objectFit: 'contain',
                                    borderRadius: 10,
                                }}
                            />
                        )
                    )}

                    {/* Page Number Badge */}
                    <div
                        style={{
                            position: 'absolute',
                            top: 20,
                            right: 20,
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            padding: '10px 20px',
                            borderRadius: 25,
                            fontSize: 24,
                            fontWeight: 'bold',
                            fontFamily: 'Inter, system-ui, sans-serif',
                        }}
                    >
                        {page.page_num}
                    </div>
                </div>
            </AbsoluteFill>

            {/* Reels-style Captions Overlay */}
            {page.teacher_script && (() => {
                const text = page.teacher_script;
                const durationInFrames = page.duration * fps;

                // 1. Split text into small chunks (approx 5-7 words or 40 chars max)
                const words = text.split(' ');
                const chunks: { text: string; startFrame: number; endFrame: number }[] = [];

                let currentChunk = [];
                let currentLength = 0;
                let totalTextLength = 0;

                // First pass: maintain words and calculate total length (ignoring spaces for simpler math)
                // actually including spaces is better for time distrib
                const fullTextLength = text.length;

                let accumulatedCharCount = 0;

                for (let i = 0; i < words.length; i++) {
                    const word = words[i];
                    currentChunk.push(word);
                    currentLength += word.length + 1; // +1 for space

                    // Break chunk if it's long enough or ends with punctuation
                    const endsWithPunctuation = /[.!?,;]$/.test(word);
                    if (currentLength > 30 || endsWithPunctuation || i === words.length - 1) {
                        const chunkText = currentChunk.join(' ');

                        // Calculate duration based on this chunk's proportion of total text
                        const chunkStartChar = accumulatedCharCount;
                        const chunkEndChar = accumulatedCharCount + chunkText.length;

                        const startFrame = (chunkStartChar / fullTextLength) * durationInFrames;
                        const endFrame = (chunkEndChar / fullTextLength) * durationInFrames;

                        // Add a small buffer to end frame to prevent flickering gaps? 
                        // or just use exact numbers.

                        chunks.push({
                            text: chunkText,
                            startFrame,
                            endFrame
                        });

                        accumulatedCharCount += chunkText.length + 1; // +1 for the space that was used to join
                        currentChunk = [];
                        currentLength = 0;
                    }
                }

                // 2. Find the active chunk for the current frame
                const activeChunk = chunks.find(c => frame >= c.startFrame && frame < c.endFrame);

                if (!activeChunk) return null;

                // Animation for the text itself (pop in)
                const chunkProgress = interpolate(
                    frame,
                    [activeChunk.startFrame, activeChunk.startFrame + 5],
                    [0.8, 1],
                    { extrapolateRight: 'clamp' }
                );

                const chunkOpacity = interpolate(
                    frame,
                    [activeChunk.startFrame, activeChunk.startFrame + 3],
                    [0, 1],
                    { extrapolateRight: 'clamp' }
                );

                return (
                    <div
                        style={{
                            position: 'absolute',
                            bottom: 80, // Moved up slightly
                            left: '50%',
                            transform: `translateX(-50%) scale(${chunkProgress})`,
                            width: '80%',
                            textAlign: 'center',
                            zIndex: 10,
                        }}
                    >
                        <div style={{
                            display: 'inline-block',
                            backgroundColor: 'rgba(0,0,0,0.6)',
                            padding: '10px 20px',
                            borderRadius: 12,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                            backdropFilter: 'blur(4px)'
                        }}>
                            <span style={{
                                color: '#ffffff',
                                fontFamily: 'Montserrat, sans-serif', // More modern font
                                fontWeight: 800,
                                fontSize: 42,
                                lineHeight: 1.2,
                                textShadow: '2px 2px 0 #000',
                                opacity: chunkOpacity
                            }}>
                                {activeChunk.text}
                            </span>
                        </div>
                    </div>
                );
            })()}

            {/* Audio Narration */}
            {
                page.audio_path && (
                    <Audio src={page.audio_path} />
                )
            }
        </AbsoluteFill >
    );
};
