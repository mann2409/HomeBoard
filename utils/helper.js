import { MaterialIcons } from '@expo/vector-icons';
// import { FontAwesome5 } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

// Format the date as YYYY-MM-DD
export const formatDate = (date) => {
    // const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
    // };  
};


// Format the time as HH:mm:ss AM/PM
export const formatTime = (date) => {
    const hours = date.getHours() % 12 || 12; // Convert to 12-hour format
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const period = date.getHours() >= 12 ? 'PM' : 'AM';
    return `${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${period}`;
};

export const formatEventDate = (eventDate) => {
    // Helper function to trim the time and retain only the date
    const trimToDate = (date) => {
        const trimmedDate = new Date(date);
        trimmedDate.setHours(0, 0, 0, 0); // Set time to midnight
        return trimmedDate;
    };

    // Trim the input dates
    const today = trimToDate(new Date());
    const event = trimToDate(eventDate);

    // Calculate the difference in days
    const diffInDays = Math.floor((event - today) / (1000 * 60 * 60 * 24));
    // console.log('Difference in days:', diffInDays);

    // Determine the formatted output
    if (diffInDays === 0) {
        return 'Today';
    } else if (diffInDays === 1) {
        return 'Tomorrow';
    } else if (diffInDays > 1 && diffInDays < 7) {
        return `In ${diffInDays} days`;
    } else if (diffInDays >= 7 && diffInDays < 30) {
        const weeks = Math.floor(diffInDays / 7);
        return weeks === 1 ? `In 1 week` : `In ${weeks} weeks`;
    } else {
        return event.toLocaleDateString(); // Default to formatted date
    }
};

export const formatTimeToHHMM = (time) => {
    const [hours, minutes] = time.split(':'); // Split time into hours and minutes
    const period = time.toLowerCase().includes('pm') ? 'PM' : 'AM'; // Determine AM/PM
    const formattedHours = ((+hours % 12) || 12).toString().padStart(2, '0'); // Convert to 12-hour format
    return `${formattedHours}:${minutes.split(' ')[0]} ${period}`; // Return formatted time
};


// Helper function to truncate time from a Date
export const trimToDate = (date) => {
    const trimmedDate = new Date(date);
    trimmedDate.setHours(0, 0, 0, 0); // Set time to midnight
    return trimmedDate;
};

export const closeAllSwipeables = () => {
    Object.values(swipeableRefs.current).forEach((ref) => {
        if (ref && ref.close) {
            ref.close();
        }
    });
};

export const getEventIcon = (eventName) => {
    // Ensure the event name is sanitized and uppercase
    const sanitizedEventName = eventName?.toUpperCase().replace(/[^A-Z0-9\s]/g, '') || '';

    if (sanitizedEventName.includes('BIRTHDAY') || sanitizedEventName.includes('BDAY')) {
        return <FontAwesome5 name="birthday-cake" size={24} color="black" />;
    }

    if (sanitizedEventName.includes('CRICKET')) {
        return <MaterialIcons name="sports-cricket" size={24} color="black" />;
    }

    // Default icon for other events
    return <MaterialIcons name="event" size={30} color="#4845d2" />;
};


