import { createPagesServerClient } from '@supabase/ssr';

async function verifyChannelMembership(userId, channelId) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    throw new Error('Telegram Bot Token not configured.');
  }
  
  const url = `https://api.telegram.org/bot${botToken}/getChatMember`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: channelId, user_id: userId }),
  });
  const data = await response.json();

  if (!data.ok) {
    console.error('Telegram API Error:', data.description);
    return false;
  }
  
  const validStatus = ['creator', 'administrator', 'member'];
  return validStatus.includes(data.result.status);
}

export default async function handler(req, res) {
  const supabase = createPagesServerClient({ req, res });

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { userId, taskId } = req.body;
    if (!userId || !taskId) {
      return res.status(400).json({ error: 'Data tidak lengkap.' });
    }

    const { data: existingClaim } = await supabase
      .from('completed_tasks').select('*').eq('user_id', userId).eq('task_id', taskId).single();

    if (existingClaim) {
      return res.status(400).json({ error: 'Anda sudah mengklaim hadiah untuk tugas ini.' });
    }

    const { data: task } = await supabase
      .from('tasks').select('task_type, task_url, reward').eq('id', taskId).single();

    if (!task) {
      return res.status(404).json({ error: 'Tugas tidak ditemukan.' });
    }

    let isVerified = false;
    if (task.task_type === 'JOIN_CHANNEL') {
        const channelUsername = task.task_url.startsWith('https://t.me/') ? `@${task.task_url.split('/').pop()}` : task.task_url;
        isVerified = await verifyChannelMembership(userId, channelUsername);
    } else {
        isVerified = true; 
    }

    if (!isVerified) {
      return res.status(400).json({ error: 'Verifikasi tugas gagal. Pastikan Anda sudah menyelesaikan tugas dengan benar.' });
    }

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

