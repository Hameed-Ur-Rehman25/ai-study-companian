import React, { useEffect, useState } from 'react';
import { Player } from '@remotion/player';
import { PDFVideo, PageData } from '../remotion/compositions/PDFVideo';
import { calculateTotalDuration } from '../remotion/utils/calculations';
import { Loader2, Download } from 'lucide-react';

interface RemotionPlayerProps {
    jobId: string;
}

export const RemotionPlayer: React.FC<RemotionPlayerProps> = ({ jobId }) => {
    const [videoData, setVideoData] = useState<PageData[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchVideoData();
    }, [jobId]);

    const fetchVideoData = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/video/data/${jobId}`);

            if (!response.ok) {
                throw new Error('Failed to fetch video data');
            }

            const data = await response.json();
            setVideoData(data.pages);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching video data:', err);
            setError('Failed to load video data');
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12 bg-gray-50 rounded-xl">
                <div className="text-center">
                    <Loader2 className="animate-spin mx-auto mb-4 text-blue-600" size={40} />
                    <p className="text-gray-600">Loading video data...</p>
                </div>
            </div>
        );
    }

    if (error || !videoData || videoData.length === 0) {
        return (
            <div className="p-8 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-700">{error || 'No video data available'}</p>
            </div>
        );
    }

    const fps = 30;
    const totalDuration = calculateTotalDuration(videoData, fps);

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                <Player
                    component={PDFVideo}
                    inputProps={{ pages: videoData }}
                    durationInFrames={totalDuration}
                    fps={fps}
                    compositionWidth={1920}
                    compositionHeight={1080}
                    style={{
                        width: '100%',
                        aspectRatio: '16/9',
                    }}
                    controls
                    loop
                />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                    <div className="flex-1">
                        <h3 className="font-semibold text-blue-900 mb-1">Video Preview Ready!</h3>
                        <p className="text-sm text-blue-700">
                            Your video has been generated with AI narration and background images.
                            Use the player controls to preview before downloading.
                        </p>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 whitespace-nowrap">
                        <Download size={16} />
                        Download
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="text-2xl font-bold text-blue-600">{videoData.length}</div>
                    <div className="text-sm text-gray-600">Pages</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="text-2xl font-bold text-emerald-600">
                        {Math.ceil(totalDuration / fps)}s
                    </div>
                    <div className="text-sm text-gray-600">Duration</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="text-2xl font-bold text-purple-600">1080p</div>
                    <div className="text-sm text-gray-600">Quality</div>
                </div>
            </div>
        </div>
    );
};
