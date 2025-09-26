import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, description, price, provider_icon_url, category')
      .eq('is_active', true)
      .or('stock.gt.0,stock.eq.-1') // Stok lebih dari 0 ATAU tak terbatas (-1)
      .order('price', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
}

