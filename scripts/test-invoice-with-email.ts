/**
 * Test Tranzila Invoice Creation with Email Sending
 * Run with: npx tsx scripts/test-invoice-with-email.ts
 */

import { createHmac, randomBytes } from 'crypto';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const TERMINAL_NAME = (process.env.TRANZILA_TERMINAL_NAME || '').trim();
const APP_KEY = (process.env.TRANZILA_PUBLIC_KEY || '').trim();
const SECRET = (process.env.TRANZILA_PRIVATE_KEY || '').trim();

console.log('='.repeat(60));
console.log('Tranzila Invoice Creation - Email Test');
console.log('='.repeat(60));
console.log('Terminal:', TERMINAL_NAME);
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

async function testInvoiceWithEmail() {
  const today = new Date().toISOString().split('T')[0];

  // Test different email configurations
  const testConfigs = [
    {
      name: 'Test 1: send_document_to_client = true',
      extra: {
        send_document_to_client: true,
      }
    },
    {
      name: 'Test 2: send_email = true',
      extra: {
        send_email: true,
      }
    },
    {
      name: 'Test 3: email_document = true',
      extra: {
        email_document: true,
      }
    },
    {
      name: 'Test 4: send_to_client object',
      extra: {
        send_to_client: {
          email: true,
        }
      }
    },
    {
      name: 'Test 5: distribution object',
      extra: {
        distribution: {
          email: true,
        }
      }
    },
  ];

  for (const config of testConfigs) {
    console.log(`\n${'='.repeat(50)}`);
    console.log(config.name);
    console.log('='.repeat(50));

    const payload = {
      terminal_name: TERMINAL_NAME,
      document_date: today,
      document_type: 'IR',
      action: 1,
      document_language: 'heb',
      document_currency_code: 'ILS',
      vat_percent: 17,
      response_language: 'heb',

      client_name: 'לקוח בדיקה',
      client_email: 'nioasoft@gmail.com',
      client_address_line_1: 'רחוב בדיקה 1',
      client_city: 'באר שבע',
      client_country_code: 'IL',

      items: [{
        type: 'I',
        code: 'TEST-EMAIL',
        name: 'בדיקת שליחת מייל',
        price_type: 'G',
        unit_price: 1,
        units_number: 1,
        unit_type: 1,
        currency_code: 'ILS',
        to_doc_currency_exchange_rate: 1,
      }],

      payments: [{
        payment_method: 1,
        payment_date: today,
        amount: 1,
        currency_code: 'ILS',
        to_doc_currency_exchange_rate: 1,
        cc_last_4_digits: '1234',
        cc_credit_term: 1,
        cc_brand: 1,
      }],

      created_by_system: 'YL Sport Email Test',

      // Add extra config
      ...config.extra,
    };

    console.log('Extra params:', JSON.stringify(config.extra, null, 2));

    try {
      const response = await fetch('https://billing5.tranzila.com/api/documents_db/create_document', {
        method: 'POST',
        headers: generateAuthHeaders(),
        body: JSON.stringify(payload),
      });

      const json = await response.json();
      console.log('Response:', JSON.stringify(json, null, 2));

      if (json.status_code === 0) {
        console.log('✅ Document created:', json.document?.number);
        console.log('Check email at nioasoft@gmail.com');
      } else {
        console.log('❌ Error:', json.status_msg);
      }
    } catch (error) {
      console.log('Fetch error:', error);
    }

    // Wait between tests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

testInvoiceWithEmail().then(() => {
  console.log('\n' + '='.repeat(60));
  console.log('Test Complete - Check email for any received invoices');
  console.log('='.repeat(60));
}).catch(console.error);
