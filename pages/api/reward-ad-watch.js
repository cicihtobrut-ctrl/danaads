import { supabase } from '../../lib/supabaseClient';

// Tentukan jumlah poin yang diberikan setiap kali menonton iklan
const AD_REWARD_AMOUNT = 50;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'User ID dibutuhkan.' });
    }
    
    // Panggil fungsi database yang aman untuk memberikan hadiah
    const { error } = await supabase.rpc('award_points_for_ad_watch', {
      p_user_id: userId,
      p_reward_amount: AD_REWARD_AMOUNT
    });

    if (error) {
      throw new Error(error.message);
    }
    
    res.status(200).json({ success: true, reward: AD_REWARD_AMOUNT });

  } catch (err) {
    res.status(500).json({ error: 'Terjadi kesalahan di server.', details: err.message });
  }
}

