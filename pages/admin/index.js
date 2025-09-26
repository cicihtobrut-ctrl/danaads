// KODE BARU YANG SUDAH DIPERBAIKI
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

export async function getServerSideProps(ctx) {
  // Membuat client Supabase khusus untuk sisi server
  const supabase = createServerSupabaseClient(ctx);

  // Mengambil sesi pengguna
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Jika tidak ada sesi (belum login), redirect ke halaman login
  if (!session) {
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    };
  }

  // Jika sudah login, kirim data user ke halaman
  return {
    props: {
      user: session.user,
    },
  };
}

