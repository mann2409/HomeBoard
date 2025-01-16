// eventIconUtils.js
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
// import { FontAwesome5 } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

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
