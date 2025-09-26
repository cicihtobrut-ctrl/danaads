import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required.' });
    }

    // Mengambil data saldo poin dari tabel users
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('points')
      .eq('id', userId)
      .single();

    if (userError) {
      throw new Error(`User fetch error: ${userError.message}`);
    }

    // Mengambil 10 transaksi terakhir dari pengguna tersebut
    const { data: transactionsData, error: transactionsError } = await supabase
      .from('transactions')
      .select('id, type, amount, description, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }) // Urutkan dari yang terbaru
      .limit(10); // Batasi hanya 10 transaksi

    if (transactionsError) {
      throw new Error(`Transactions fetch error: ${transactionsError.message}`);
    }

    // Kirim semua data dalam satu respons
    res.status(200).json({
      pointsBalance: userData.points,
      transactions: transactionsData,
    });

  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
}

