export default async function handler(req, res) {
    if (req.method === 'GET') {
      try {
        // Make a GET request to AWS API Gateway to fetch the fridge items
        const response = await fetch(`${process.env.NEXT_PUBLIC_AWS_CALENDAR_API_URL}/GetCalendarEvent`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch calendar events from AWS API');
        }
  
        const fridgeItems = await response.json();
        res.status(200).json(fridgeItems); // Respond with the fridge items
      } catch (error) {
        console.error('Error retrieving calendar events via AWS API:', error);
        res.status(500).json({ error: 'Error retrieving calendar events' });
      }
    } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} not allowed`);
    }
  }
  