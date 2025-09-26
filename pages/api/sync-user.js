import { createPagesServerClient } from '@supabase/ssr';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Membuat client Supabase khusus untuk request ini
  const supabase = createPagesServerClient({ req, res });

  try {
    const { user } = req.body;

    if (!user || !user.id) {
      return res.status(400).json({ error: 'User data is required.' });
    }

    const { data, error } = await supabase
      .from('users')
      .upsert({ 
        id: user.id, 
        first_name: user.first_name,
        username: user.username 
      })
      .select('id, first_name, points')
      .single();

    if (error) {
      console.error('Supabase error:', error.message);
      throw new Error(error.message);
    }

    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
