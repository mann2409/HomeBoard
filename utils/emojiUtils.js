import emojiMapping from '../assets/emojiMapping';

export const getEmojiForItem = (itemName) => {
    const normalizedItem = itemName.toLowerCase().replace(/\s+/g, '_');  // almond milk -> almond_milk

    // Keyword-based emoji detection
    if (itemName.toLowerCase().includes('chicken')) {
        return emojiMapping['chicken'];  // Return chicken emoji for any chicken-related item
    }

    // Exact match or fallback to second word (e.g., milk from almond milk)
    return (
        emojiMapping[normalizedItem] ||
        emojiMapping[itemName.toLowerCase().split(' ')[1]] ||  // fallback to second word (milk)
        '🛒'  // default emoji
    );
};
