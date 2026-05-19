export async function register() {
    // We only want to run the cron job on the Node.js server, not the Edge runtime
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        const { setupCronJobs } = await import('./lib/cron');
        setupCronJobs();
    }
}
