/**
 * Calculate total duration in frames for all pages
 */
export function calculateTotalDuration(pages: Array<{ duration: number }>, fps: number): number {
    return pages.reduce((total, page) => {
        return total + Math.ceil(page.duration * fps);
    }, 0);
}

/**
 * Get start frame for a specific page index
 */
export function getPageStartFrame(pages: Array<{ duration: number }>, pageIndex: number, fps: number): number {
    let frame = 0;
    for (let i = 0; i < pageIndex; i++) {
        frame += Math.ceil(pages[i].duration * fps);
    }
    return frame;
}
