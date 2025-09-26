import { createPagesServerClient } from '@supabase/ssr';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  
  const supabase = createPagesServerClient({ req, res });

  try {
    const { userId, productId, targetNumber } = req.body;

    if (!userId || !productId || !targetNumber) {
      return res.status(400).json({ error: 'Data tidak lengkap.' });
    }

    const { data, error } = await supabase.rpc('purchase_item', {
      p_user_id: userId,
      p_product_id: productId,
      p_description: `Pembelian produk ke nomor ${targetNumber}`
    });
    
    if (error) {
        if (error.message.includes('insufficient_points')) {
            return res.status(400).json({ error: 'Poin Anda tidak cukup.' });
        }
        throw new Error(error.message);
    }

    res.status(200).json({ success: true, message: 'Pembelian berhasil! Produk akan segera diproses.' });

  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
}

