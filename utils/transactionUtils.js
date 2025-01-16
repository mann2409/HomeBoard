export const formatTransactions = (apiResponse) => {
  if (!Array.isArray(apiResponse)) {
    console.error('Invalid API response:', apiResponse);
    return [];
  }

  const groupedTransactions = apiResponse.reduce((acc, transaction) => {
    const formattedDate = new Date(transaction.date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    if (!acc[formattedDate]) {
      acc[formattedDate] = [];
    }

    acc[formattedDate].push({
      title: transaction.title,
      description: transaction.description,
      category: transaction.category,
      amount: transaction.amount,
      icon: getIcon(transaction.category), // Assign icon based on category
    });

    return acc;
  }, {});

  const result = Object.keys(groupedTransactions).map((date) => ({
    date,
    data: groupedTransactions[date],
  }));
  const responseData = JSON.stringify(result, null, 2);
  // console.log('Formatted Transactions:', JSON.stringify(result, null, 2)); // Log the final structure
  return result;
};


// Helper function to assign icons based on category
const getIcon = (category) => {
  if (category === '') return 'credit-card';
  if (category.toLowerCase().includes('subscriptions')) return 'subscriptions';
  if (category.toLowerCase().includes('groceries') || category.toLowerCase().includes('eating out'))
    return 'shopping-cart';
  // if (category.toLowerCase().includes('eating out')) return 'local-grocery-store';
  if (category.toLowerCase().includes('personal')) return 'wallet';
  return 'question'; // Default icon if no category matches
};

//Helper for calculating total amount 
// utils/transactionUtils.js
export const calculateTotalAmount = (transactions) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth(); // 0-based index
  const currentYear = currentDate.getFullYear();

  let total = 0;

  transactions.forEach((transaction) => {
    const transactionDate = new Date(transaction.date); // Assuming date is YYYY-MM-DD
    if (
      transactionDate.getMonth() === currentMonth &&
      transactionDate.getFullYear() === currentYear
    ) {
      const parsedAmount = parseFloat(transaction.amount.replace('$', '').replace('-', ''));
      total += parsedAmount;
    }
  });
  // const output = '-' + total.toFixed(2);
  return total.toFixed(2); // Return formatted total
  // return output;
};
