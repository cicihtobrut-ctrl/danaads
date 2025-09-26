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

    const { count, error } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('referred_by', userId);

    if (error) {
      throw new Error(error.message);
    }

    res.status(200).json({ totalReferrals: count });

  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
}

