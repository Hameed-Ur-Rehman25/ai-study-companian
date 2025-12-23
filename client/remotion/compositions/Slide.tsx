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
                    src={`file://${page.unsplash_image_path}`}
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

                    {/* PDF Page Image */}
                    {page.pdf_image_path && (
                        <Img
                            src={`file://${page.pdf_image_path}`}
                            style={{
                                maxWidth: '100%',
                                maxHeight: '600px',
                                objectFit: 'contain',
                                borderRadius: 10,
                            }}
                        />
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

            {/* Audio Narration */}
            {page.audio_path && (
                <Audio src={`file://${page.audio_path}`} />
            )}
        </AbsoluteFill>
    );
};
