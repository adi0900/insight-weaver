import './loadEnv.js';
import { tableauService } from './services/tableau/index.js';

async function diagnose() {
    console.log('--- Insight Weaver Diagnostic ---');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('Configured:', tableauService.isConfigured());

    try {
        console.log('Testing Tableau Authentication...');
        const token = await tableauService.authenticate('nilambhojwaningp@gmail.com');
        console.log('✅ Auth Success. Token length:', token.length);

        console.log('Fetching Data Sources...');
        const ds = await tableauService.getDataSources();
        console.log(`✅ Fetched ${ds.length} Data Sources:`, ds.map(d => d.name));

        console.log('Fetching Workbooks...');
        const wb = await tableauService.getWorkbooks();
        console.log(`✅ Fetched ${wb.length} Workbooks:`, wb.map(w => w.name));

    } catch (err) {
        console.error('❌ Diagnostic Failed:', err.message);
    }
    console.log('--------------------------------');
}

diagnose();
