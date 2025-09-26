import { supabase } from '../../lib/supabaseClient';

// Fungsi helper untuk verifikasi keanggotaan channel Telegram
async function verifyChannelMembership(userId, channelId) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    throw new Error('Telegram Bot Token not configured.');
  }
  
  // Channel ID bisa berupa @username atau -100xxxxxxxxxx
  const url = `https://api.telegram.org/bot${botToken}/getChatMember`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: channelId, user_id: userId }),
  });

  const data = await response.json();

  if (!data.ok) {
    // Jika bot bukan admin di channel, ini akan error.
    console.error('Telegram API Error:', data.description);
    return false;
  }
  
  // Status member: creator, administrator, member, restricted, left, kicked
  const validStatus = ['creator', 'administrator', 'member'];
  return validStatus.includes(data.result.status);
}


export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { userId, taskId } = req.body;
    if (!userId || !taskId) {
      return res.status(400).json({ error: 'Data tidak lengkap.' });
    }

    // 1. Cek apakah tugas sudah pernah diklaim
    const { data: existingClaim, error: claimError } = await supabase
      .from('completed_tasks')
      .select('*')
      .eq('user_id', userId)
      .eq('task_id', taskId)
      .single();

    if (existingClaim) {
      return res.status(400).json({ error: 'Anda sudah mengklaim hadiah untuk tugas ini.' });
    }

    // 2. Ambil detail tugas untuk verifikasi
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select('task_type, task_url, reward')
      .eq('id', taskId)
      .single();

    if (taskError || !task) {
      return res.status(404).json({ error: 'Tugas tidak ditemukan.' });
    }

    // 3. Lakukan verifikasi berdasarkan tipe tugas
    let isVerified = false;
    if (task.task_type === 'JOIN_CHANNEL') {
      const channelUsername = task.task_url.startsWith('https://t.me/') ? `@${task.task_url.split('/').pop()}` : task.task_url;
      isVerified = await verifyChannelMembership(userId, channelUsername);
    } else {
      // Untuk tipe tugas lain (VISIT_WEBSITE, dll), kita anggap langsung terverifikasi untuk saat ini
      isVerified = true; 
    }

    if (!isVerified) {
      return res.status(400).json({ error: 'Verifikasi tugas gagal. Pastikan Anda sudah menyelesaikan tugas dengan benar.' });
    }

    // 4. Jika terverifikasi, panggil fungsi database untuk memberikan poin
    const { error: awardError } = await supabase.rpc('award_points_for_task', {
      p_user_id: userId,
      p_task_id: taskId,
    });

    if (awardError) {
      throw new Error(awardError.message);
    }

    res.status(200).json({ success: true, message: `Selamat! Anda mendapatkan ${task.reward} Poin.` });

  } catch (err) {
    res.status(500).json({ error: 'Terjadi kesalahan di server.', details: err.message });
  }
}

