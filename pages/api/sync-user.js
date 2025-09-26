import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  // Hanya izinkan metode POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { user } = req.body;

    // Pastikan data user dikirim dari frontend
    if (!user || !user.id) {
      return res.status(400).json({ error: 'User data is required.' });
    }

    // Menggunakan "upsert" dari Supabase
    // Upsert akan INSERT jika data belum ada, atau UPDATE jika data sudah ada
    // Kita menggunakan 'id' sebagai penentu (onConflict)
    const { data, error } = await supabase
      .from('users')
      .upsert({ 
        id: user.id, 
        first_name: user.first_name,
        username: user.username 
      })
      .select('id, first_name, points') // Meminta data yg di-upsert dikembalikan
      .single(); // Kita tahu hasilnya hanya akan satu baris

    if (error) {
      console.error('Supabase error:', error.message);
      throw new Error(error.message);
    }

    // Kirim kembali data pengguna dari database (termasuk poinnya)
    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

