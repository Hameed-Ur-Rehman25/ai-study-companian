import { Composition } from 'remotion';
import { PDFVideo } from './compositions/PDFVideo';

export const RemotionRoot: React.FC = () => {
    return (
        <>
            <Composition
                id="PDFVideo"
                component={PDFVideo}
                durationInFrames={300}
                fps={30}
                width={1920}
                height={1080}
                defaultProps={{
                    pages: []
                }}
            />
        </>
    );
};
