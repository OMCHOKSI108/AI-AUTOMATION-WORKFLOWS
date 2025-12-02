const axios = require('axios');

// Test data for the n8n workflow
const testData = {
    reportId: `test-${Date.now()}`, // Unique report ID
    filename: 'Earthquake_data_processed.xlsx',
    filepath: 'D:\\OM\\AI-AUTOMATION-WORKFLOWS\\DATA_CLEANING_WORKFLOW\\frontend\\Earthquake_data_processed.xlsx',
    originalFilename: 'Earthquake_data_processed.xlsx'
};

// N8n webhook URL (using test URL instead of production)
const n8nWebhookUrl = 'http://localhost:5678/webhook-test/start-analysis';

async function testN8nWorkflow() {
    try {
        console.log('🚀 Testing N8n Data Cleaning Workflow...');
        console.log('📊 Test Data:', testData);
        console.log('🔗 Webhook URL:', n8nWebhookUrl);

        const response = await axios.post(n8nWebhookUrl, testData, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 30000 // 30 second timeout
        });

        console.log('✅ Workflow triggered successfully!');
        console.log('📋 Response Status:', response.status);
        console.log('📄 Response Data:', response.data);

        // Check backend for results after a delay
        setTimeout(async () => {
            try {
                console.log('\n🔍 Checking backend for analysis results...');
                const backendResponse = await axios.get(`http://localhost:5000/api/internal/report/${testData.reportId}`);
                console.log('📊 Backend Report Status:', backendResponse.data);
            } catch (backendError) {
                console.log('⚠️  Backend check failed:', backendError.message);
                console.log('💡 This is normal if the workflow is still processing');
            }
        }, 5000);

    } catch (error) {
        console.error('❌ Workflow test failed:');
        console.error('Error:', error.message);

        if (error.response) {
            console.error('Response Status:', error.response.status);
            console.error('Response Data:', error.response.data);
        } else if (error.code === 'ECONNREFUSED') {
            console.error('💡 Make sure n8n is running on port 5678');
        }
    }
}

// Run the test
testN8nWorkflow();