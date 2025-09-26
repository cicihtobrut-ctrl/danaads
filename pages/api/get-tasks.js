import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Ambil semua tugas dari tabel 'tasks' yang statusnya aktif
    const { data, error } = await supabase
      .from('tasks')
      .select('id, title, description, reward, task_url')
      .eq('is_active', true) // Hanya ambil tugas yang aktif
      .order('created_at', { ascending: false }); // Urutkan dari yang terbaru

    if (error) {
      throw new Error(error.message);
    }

    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
}

