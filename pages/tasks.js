import { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/Tasks.module.css';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/get-tasks');
        if (!response.ok) throw new Error('Gagal memuat tugas');
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error(error);
        if (window.Telegram && window.Telegram.WebApp) {
          window.Telegram.WebApp.showAlert('Tidak dapat memuat daftar tugas.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Daftar Tugas</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>

      {/* Header dengan tombol kembali kita hapus karena sudah ada navigasi bawah */}
      <div style={{ marginBottom: '25px' }}>
         <h1 className={styles.title}>Daftar Tugas</h1>
      </div>

      {isLoading ? (
        <p>Memuat tugas...</p>
      ) : tasks.length > 0 ? (
        <div className={styles.taskList}>
          {tasks.map((task) => (
            <a href={task.task_url} key={task.id} className={styles.taskItem} target="_blank" rel="noopener noreferrer">
              <div className={styles.taskInfo}>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
              </div>
              <div className={styles.taskReward}>
                +{task.reward} Poin
              </div>
            </a>
          ))}
        </div>
      ) : (
        <p style={{ textAlign: 'center', color: 'var(--hint-color)' }}>Belum ada tugas yang tersedia saat ini.</p>
      )}
    </div>
  );
}

