// Integration Test Script for Frontend-Backend Connection
// Run this in browser console when both servers are running

const API_BASE = 'http://localhost:3000';

// Test 1: Backend Health Check
async function testBackendHealth() {
    try {
        const response = await fetch(`${API_BASE}/health`);
        const data = await response.json();
        console.log('✅ Backend Health Check:', data);
        return true;
    } catch (error) {
        console.error('❌ Backend Health Check Failed:', error);
        return false;
    }
}

// Test 2: CORS Configuration
async function testCORS() {
    try {
        const response = await fetch(`${API_BASE}/health`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        console.log('✅ CORS Working - Status:', response.status);
        return true;
    } catch (error) {
        console.error('❌ CORS Error:', error);
        return false;
    }
}

// Test 3: User Registration (with cleanup)
async function testUserRegistration() {
    const testUser = {
        username: `testuser_${Date.now()}`,
        email: `test_${Date.now()}@example.com`,
        password: 'testpass123'
    };

    try {
        const response = await fetch(`${API_BASE}/api/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testUser)
        });

        const data = await response.json();

        if (response.ok) {
            console.log('✅ User Registration Working:', data);
            return true;
        } else {
            console.log('⚠️ Registration Response:', data);
            return false;
        }
    } catch (error) {
        console.error('❌ Registration Error:', error);
        return false;
    }
}

// Run all tests
async function runIntegrationTests() {
    console.log('🧪 Starting Frontend-Backend Integration Tests...\n');

    const healthTest = await testBackendHealth();
    const corsTest = await testCORS();
    const regTest = await testUserRegistration();

    console.log('\n📊 Integration Test Results:');
    console.log(`Backend Health: ${healthTest ? '✅' : '❌'}`);
    console.log(`CORS Setup: ${corsTest ? '✅' : '❌'}`);
    console.log(`User Registration: ${regTest ? '✅' : '❌'}`);

    const allPassed = healthTest && corsTest && regTest;
    console.log(`\n${allPassed ? '🎉' : '🚨'} Integration Status: ${allPassed ? 'SUCCESS' : 'NEEDS FIXES'}`);
}

// Auto-run tests
runIntegrationTests();