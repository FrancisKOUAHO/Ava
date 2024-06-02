export function generateRandomColor() {
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 30 + 90) + '%';
    const lightness = Math.floor(Math.random() * 10 + 80) + '%';
    return `hsl(${hue}, ${saturation}, ${lightness})`;
}
