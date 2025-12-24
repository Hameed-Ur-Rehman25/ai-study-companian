import React from 'react';
import { AbsoluteFill, Sequence, useVideoConfig } from 'remotion';
import { Slide } from './Slide';

export interface PageData {
    page_num: number;
    title?: string;
    teacher_script?: string;
    pdf_image_path?: string;
    unsplash_image_path?: string;
    audio_path?: string;
    duration: number;
    images?: string[];
}

export interface PDFVideoProps {
    pages: PageData[];
}

export const PDFVideo: React.FC<PDFVideoProps> = ({ pages }) => {
    const { fps } = useVideoConfig();

    // Calculate start frame for each page
    let currentFrame = 0;
    const pageSequences = pages.map((page) => {
        const startFrame = currentFrame;
        const durationInFrames = Math.ceil(page.duration * fps);
        currentFrame += durationInFrames;

        return {
            page,
            startFrame,
            durationInFrames
        };
    });

    return (
        <AbsoluteFill style={{ backgroundColor: '#000' }}>
            {pageSequences.map(({ page, startFrame, durationInFrames }, index) => (
                <Sequence
                    key={index}
                    from={startFrame}
                    durationInFrames={durationInFrames}
                >
                    <Slide page={page} />
                </Sequence>
            ))}
        </AbsoluteFill>
    );
};
