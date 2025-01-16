export default async function handler(req, res) {
    if (req.method === 'PATCH') {
      try {
        const { Id } = req.body; // Extract the Id from the request body
        
        // Make a POST request to AWS API Gateway to change the status to 'D'
        const response = await fetch(`${process.env.NEXT_PUBLIC_AWS_TODO_API_URL}/UpdateToDoList`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ Id, Status: 'D' }), // Send the Id and update status to 'D'
        });
  
        if (!response.ok) {
          throw new Error('Failed to update To Do  list via AWS API');
        }
  
        const data = await response.json();
        res.status(200).json(data); // Respond with the updated item or confirmation
      } catch (error) {
        console.error('Error updating To Do  list via AWS API:', error);
        res.status(500).json({ error: 'Error updating To Do  list' });
      }
    } else {
      res.setHeader('Allow', ['PATCH']);
      res.status(405).end(`Method ${req.method} not allowed`);
    }
  }
  