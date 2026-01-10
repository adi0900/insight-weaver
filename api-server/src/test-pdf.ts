import { exportService } from './services/export/index.js';
import fs from 'fs';

async function testPDF() {
    console.log('Generating test PDF...');
    const mockNarrative = {
        id: 'nar_test',
        title: 'Q4 Revenue Analysis',
        status: 'published',
        createdAt: new Date(),
        updatedAt: new Date(),
        revisions: [
            {
                hypothesis: 'Revenue increased by 15% due to new product launch.',
                confidence: 0.95,
                authorId: 'user_demo',
                timestamp: new Date(),
                evidence: [],
                sources: []
            }
        ],
        collaborators: [],
        tags: ['finance', 'revenue']
    };

    try {
        const result = await exportService.toPDF(mockNarrative as any);
        if (result.buffer) {
            fs.writeFileSync('test_output.pdf', result.buffer);
            console.log('✅ PDF generated successfully: test_output.pdf');
            console.log('Buffer size:', result.buffer.length, 'bytes');
        } else {
            console.log('❌ PDF generation failed: No buffer returned');
        }
    } catch (err) {
        console.error('❌ PDF generation error:', err);
    }
}

testPDF();
