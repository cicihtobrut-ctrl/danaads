import { createPagesServerClient } from '@supabase/ssr';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  
  const supabase = createPagesServerClient({ req, res });

  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('id, title, description, reward, task_url')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
}

