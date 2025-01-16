export default async function handler(req, res) {
    if (req.method === 'POST') {
      try {
        const newItem = req.body;
  
        // Make a POST request to AWS API Gateway
        const response = await fetch(`${process.env.NEXT_PUBLIC_AWS_TODO_API_URL}/CreateToDoList`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newItem),
        });
  
        if (!response.ok) {
          throw new Error('Failed to create item via AWS API');
        }
  
        const data = await response.json();
        res.status(201).json(data); // Respond with the new item created
      } catch (error) {
        console.error('Error adding To Do  list via AWS API:', error);
        res.status(500).json({ error: 'Error adding To Do  list ' });
      }
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} not allowed`);
    }
  }
  