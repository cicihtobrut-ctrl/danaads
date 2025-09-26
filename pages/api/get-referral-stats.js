import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { userId } = req.query; // Mengambil userId dari parameter URL

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required.' });
    }

    // Menghitung jumlah baris di tabel 'users'
    // di mana kolom 'referred_by' sama dengan userId yang diminta
    const { count, error } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true }) // Opsi untuk hanya menghitung
      .eq('referred_by', userId);

    if (error) {
      throw new Error(error.message);
    }

    res.status(200).json({ totalReferrals: count });

  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
}

