/**
 * Test script for Tranzila Invoice Creation API
 * Run with: npx tsx scripts/test-tranzila-create-invoice.ts
 */

import { createHmac, randomBytes } from 'crypto';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const TERMINAL_NAME = (process.env.TRANZILA_TERMINAL_NAME || '').trim();
const APP_KEY = (process.env.TRANZILA_PUBLIC_KEY || '').trim();
const SECRET = (process.env.TRANZILA_PRIVATE_KEY || '').trim();

console.log('='.repeat(60));
console.log('Tranzila Invoice Creation Test');
console.log('='.repeat(60));
console.log('Terminal:', TERMINAL_NAME);
console.log('Endpoint: https://billing5.tranzila.com/api/documents_db/create_document');
console.log('='.repeat(60));

function generateAuthHeaders(): Record<string, string> {
  const timestamp = Math.floor(Date.now() / 1000);
  const nonce = randomBytes(40).toString('hex');

  const accessKey = createHmac('sha256', SECRET + timestamp + nonce)
    .update(APP_KEY)
    .digest('hex');

  return {
    'Content-Type': 'application/json',
    'X-tranzila-api-app-key': APP_KEY,
    'X-tranzila-api-request-time': timestamp.toString(),
    'X-tranzila-api-nonce': nonce,
    'X-tranzila-api-access-token': accessKey,
  };
}

async function testCreateInvoice() {
  console.log('\n--- Creating Invoice (חשבונית מס קבלה) ---\n');

  const today = new Date().toISOString().split('T')[0]; // yyyy-mm-dd format

  const payload = {
    terminal_name: TERMINAL_NAME,
    document_date: today,
    document_type: 'IR', // Invoice-Receipt = חשבונית מס קבלה
    action: 1, // 1 = Debit (חיוב)
    document_language: 'heb',
    document_currency_code: 'ILS',
    vat_percent: 17,
    response_language: 'heb',

    // Client details
    client_name: 'לקוח בדיקה',
    client_email: 'nioasoft@gmail.com',
    client_address_line_1: 'רחוב בדיקה 1',
    client_city: 'באר שבע',
    client_country_code: 'IL',

    // Items
    items: [
      {
        type: 'I',
        code: 'TEST-001',
        name: 'טייץ ספורט YL - מידה M',
        price_type: 'G', // Gross (כולל מע"מ)
        unit_price: 1,
        units_number: 1,
        unit_type: 1,
        currency_code: 'ILS',
        to_doc_currency_exchange_rate: 1,
      },
    ],

    // Payments
    payments: [
      {
        payment_method: 1, // Credit card
        payment_date: today,
        amount: 1,
        currency_code: 'ILS',
        to_doc_currency_exchange_rate: 1,
        cc_last_4_digits: '1234',
        cc_credit_term: 1, // Regular payment
        cc_brand: 1,
      },
    ],

    created_by_system: 'YL Sport Website Test',
  };

  console.log('Payload:', JSON.stringify(payload, null, 2));

  try {
    const response = await fetch('https://billing5.tranzila.com/api/documents_db/create_document', {
      method: 'POST',
      headers: generateAuthHeaders(),
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    console.log('\nResponse status:', response.status);
    console.log('Response text:', responseText);

    let json;
    try {
      json = JSON.parse(responseText);
      console.log('\nParsed response:', JSON.stringify(json, null, 2));
    } catch {
      console.log('Response is not valid JSON');
    }

    if (json?.status_code === 0) {
      console.log('\n✅ SUCCESS! Invoice created');
      console.log('Document ID:', json.document?.id);
      console.log('Document Number:', json.document?.number);
      console.log('Retrieval Key:', json.document?.retrieval_key);

      // Build the invoice URL
      if (json.document?.retrieval_key) {
        console.log('\nInvoice URL:');
        console.log(`https://my.tranzila.com/api/get_financial_document/${json.document.retrieval_key}`);
      }
    } else {
      console.log('\n❌ FAILED');
      console.log('Error code:', json?.status_code);
      console.log('Error message:', json?.status_msg);
    }
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

testCreateInvoice().then(() => {
  console.log('\n' + '='.repeat(60));
  console.log('Test Complete');
  console.log('='.repeat(60));
}).catch(console.error);
