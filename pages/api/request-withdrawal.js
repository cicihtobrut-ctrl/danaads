import { supabase } from '../../lib/supabaseClient';

// Tentukan aturan, misal minimal penarikan 10.000 poin
const MINIMUM_WITHDRAWAL = 10000;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { userId, amount, method, details } = req.body;

    if (!userId || !amount || !method || !details) {
      return res.status(400).json({ error: 'Semua kolom wajib diisi.' });
    }
    
    const amountPoints = parseInt(amount, 10);
    if (isNaN(amountPoints) || amountPoints < MINIMUM_WITHDRAWAL) {
      return res.status(400).json({ error: `Jumlah penarikan minimal adalah ${MINIMUM_WITHDRAWAL.toLocaleString()} poin.` });
    }

    // Panggil fungsi database yang aman
    // Kita asumsikan 1 poin = 1 Rupiah untuk saat ini
    const { error } = await supabase.rpc('request_user_withdrawal', {
      p_user_id: userId,
      p_amount_points: amountPoints,
      p_amount_rupiah: amountPoints, // 1 Poin = 1 Rupiah
      p_method: method,
      p_account_details: details
    });

    if (error) {
      if (error.message.includes('insufficient_points_for_withdrawal')) {
        return res.status(400).json({ error: 'Poin Anda tidak cukup untuk melakukan penarikan ini.' });
      }
      throw new Error(error.message);
    }
    
    res.status(200).json({ success: true, message: 'Permintaan penarikan berhasil dikirim dan akan segera diproses.' });

  } catch (err) {
    res.status(500).json({ error: 'Terjadi kesalahan di server.', details: err.message });
  }
}

