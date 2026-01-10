import './loadEnv.js';

const vars = [
    'TABLEAU_CLOUD_URL',
    'TABLEAU_SITE_ID',
    'TABLEAU_CLIENT_ID',
    'TABLEAU_SECRET_ID',
    'TABLEAU_SECRET_VALUE'
];

console.log('--- Env Var Lengths ---');
vars.forEach(v => {
    const val = process.env[v];
    if (val) {
        console.log(`${v}: length=${val.length}, startsWithSpace=${val.startsWith(' ')}, endsWithSpace=${val.endsWith(' ')}, endsWithNewline=${val.endsWith('\n') || val.endsWith('\r')}`);
        if (v === 'TABLEAU_CLOUD_URL') console.log(` - Value: ${val}`);
    } else {
        console.log(`${v}: MISSING`);
    }
});
console.log('------------------------');
