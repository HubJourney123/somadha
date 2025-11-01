async function testAPI() {
  try {
    const url = 'http://localhost:3000/api/complaints/SMD-MHC5NHX4-DLZV';
    console.log('Testing API:', url);
    
    const response = await fetch(url);
    console.log('Status:', response.status);
    
    const data = await response.json();
    console.log('Response:', JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testAPI();