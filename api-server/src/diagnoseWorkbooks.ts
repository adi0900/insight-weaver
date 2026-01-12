import './loadEnv.js';
import { tableauService } from './services/tableau/index.js';

async function diagnose() {
    console.log('--- Tableau Diagnostic ---');
    try {
        const email = process.env.TABLEAU_USER_EMAIL || 'nilambhojwaningp@gmail.com';
        console.log(`Using email: ${email}`);

        console.log('Attempting to authenticate...');
        const token = await tableauService.authenticate(email);
        console.log('Authentication successful!');

        console.log('Fetching workbooks...');
        const workbooks = await tableauService.getWorkbooks();
        console.log(`Found ${workbooks.length} workbooks:`);
        workbooks.forEach(wb => {
            console.log(` - ${wb.name} (ID: ${wb.id})`);
        });

        if (workbooks.length > 0) {
            console.log('\nFetching views for the first workbook...');
            // The getWorkbooks in the service is currently mocked if it fails or returns empty views
            // Let's see if we can find a real view URL if it's connected.
        }

    } catch (err) {
        console.error('Diagnostic failed:', err);
    }
    console.log('--------------------------');
}

diagnose();
