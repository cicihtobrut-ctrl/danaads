import { createPagesServerClient } from '@supabase/ssr';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  
  const supabase = createPagesServerClient({ req, res });

  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required.' });
    }

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('points')
      .eq('id', userId)
      .single();

    if (userError) {
      throw new Error(`User fetch error: ${userError.message}`);
    }

    const { data: transactionsData, error: transactionsError } = await supabase
      .from('transactions')
      .select('id, type, amount, description, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (transactionsError) {
      throw new Error(`Transactions fetch error: ${transactionsError.message}`);
    }

    res.status(200).json({
      pointsBalance: userData.points,
      transactions: transactionsData,
    });

  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
}

