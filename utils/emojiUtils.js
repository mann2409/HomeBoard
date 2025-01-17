import emojiMapping from '../assets/emojiMapping';

export const getEmojiForItem = (itemName) => {
    if (!itemName) return '🛒'; // Return default emoji if itemName is undefined or empty

    // Normalize the item name
    const normalizedItem = itemName.toLowerCase().replace(/\s+/g, '_'); // "Almond Milk" -> "almond_milk"

    // Check for exact match in the emoji mapping
    if (emojiMapping[normalizedItem]) {
        return emojiMapping[normalizedItem];
    }

    // Check for individual word matches if no exact match is found
    const words = itemName.toLowerCase().split(' ');
    for (const word of words) {
        if (emojiMapping[word]) {
            return emojiMapping[word];
        }
    }

    // Fallback to keyword matching for broader detection
    const keywords = [
        { keyword: 'chicken', emoji: emojiMapping['chicken'] },
        { keyword: 'kebab', emoji: emojiMapping['kebab'] },
        { keyword: 'tomato', emoji: emojiMapping['tomato'] },
        { keyword: 'corn', emoji: emojiMapping['corn'] },
    ];

    for (const { keyword, emoji } of keywords) {
        if (itemName.toLowerCase().includes(keyword)) {
            return emoji;
        }
    }

    // Final fallback: default emoji
    return '🛒';
};
