import cron from 'node-cron';

// This function can be imported and called in `instrumentation.ts` when Next.js starts
export function setupCronJobs() {
    console.log("Setting up global Cron Jobs...");

    // Run every day at exactly midnight (00:00)
    cron.schedule('0 0 * * *', async () => {
        console.log("Running Daily Cron Job: Generating Word of the Day for supported languages.");
        
        try {
            // Determine base URL, fallback to localhost for local dev cron
            const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
            const headers: Record<string, string> = {};
            if (process.env.CRON_SECRET) {
                headers['authorization'] = `Bearer ${process.env.CRON_SECRET}`;
            }

            const response = await fetch(`${baseUrl}/api/cron/word-of-the-day`, { headers });
            const data = await response.json();
            console.log("Successfully completed Word of the Day cron job:", data);
        } catch (error) {
            console.error("Cron Job Error:", error);
        }
    });
}
