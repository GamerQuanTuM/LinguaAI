import cron from 'node-cron';

// This function can be imported and called in `instrumentation.ts` when Next.js starts
export function setupCronJobs() {
    console.log("Setting up global Cron Jobs...");

    // Run every day at exactly midnight (00:00)
    cron.schedule('0 0 * * *', async () => {
        console.log("Running Daily Cron Job: Generating Word of the Day for supported languages.");
        
        try {
            // Because Next.js runs this internally, we can just hit our own API route locally. 
            // Or you can directly import the logic. Hitting the API is isolated.
            const languages = ["Spanish", "French", "German"]; // Add your supported languages here
            
            for (const lang of languages) {
                // Determine base URL, fallback to localhost for local dev cron
                const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
                await fetch(`${baseUrl}/api/word-of-the-day?language=${lang}`);
                console.log(`Successfully generated word for ${lang}`);
            }
        } catch (error) {
            console.error("Cron Job Error:", error);
        }
    });
}
