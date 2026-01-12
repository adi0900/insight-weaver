import './loadEnv.js';
import { tableauService } from './services/tableau/index.js';

async function diagnose() {
    console.log('--- Tableau Detailed Diagnostic ---');
    try {
        const email = process.env.TABLEAU_USER_EMAIL || 'nilambhojwaningp@gmail.com';
        const token = await tableauService.authenticate(email);

        // We need siteLuid which is private in the service, but let's assume it worked.
        // Actually, the service stores it. Let's add a quick hack to the service or just use the REST API here manually.

        const cloudUrl = process.env.TABLEAU_CLOUD_URL;
        const siteId = process.env.TABLEAU_SITE_ID; // This might be the site LUID if it was just authenticate! 
        // No, siteId in env is usually the contentUrl.

        // Let's call the REST API directly to get workbooks and their views.
        const apiVersion = '3.22';
        // We need the site LUID. The service logged it: 0aaf4090-3884-46d1-9409-060e5458637a
        const siteLuid = '0aaf4090-3884-46d1-9409-060e5458637a';

        const response = await fetch(`${cloudUrl}/api/${apiVersion}/sites/${siteLuid}/workbooks`, {
            headers: { 'X-Tableau-Auth': token, 'Accept': 'application/json' }
        });

        const data = await response.json();
        const workbooks = data.workbooks.workbook;

        for (const wb of workbooks) {
            console.log(`Workbook: ${wb.name} (ID: ${wb.id})`);
            const viewsResponse = await fetch(`${cloudUrl}/api/${apiVersion}/sites/${siteLuid}/workbooks/${wb.id}/views`, {
                headers: { 'X-Tableau-Auth': token, 'Accept': 'application/json' }
            });
            const viewsData = await viewsResponse.json();
            const views = viewsData.views.view;
            for (const view of views) {
                console.log(`  - View: ${view.name}, URL: ${view.contentUrl}`);
            }
        }

    } catch (err) {
        console.error('Diagnostic failed:', err);
    }
    console.log('-----------------------------------');
}

diagnose();
