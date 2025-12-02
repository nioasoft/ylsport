/**
 * Test script for Tranzila Invoice API
 * Run with: npx tsx scripts/test-tranzila-invoice.ts
 */

import { createHmac, randomBytes } from 'crypto';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const API_HOST = process.env.TRANZILA_API_HOST || 'https://api.tranzila.com';
const TERMINAL_NAME = process.env.TRANZILA_TERMINAL_NAME || '';
const APP_KEY = process.env.TRANZILA_PUBLIC_KEY || '';
const SECRET = process.env.TRANZILA_PRIVATE_KEY || '';

console.log('='.repeat(60));
console.log('Tranzila Invoice Test');
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

async function testPaymentRequestWithInvoice() {
  console.log('\n--- Creating Payment Request with Invoice + Email Settings ---\n');

  // Base payload with send_email
  const basePayload = {
    terminal_name: TERMINAL_NAME,
    action_type: 2,
    response_language: 'hebrew',
    request_currency: 'ILS',
    request_vat: 17,
    payments_number: 1,
    payment_plans: [1],
    payment_methods: [1],
    created_by_user: 'test',

    client: {
      name: 'YL Sport Test',
      contact_person: 'YL Sport Test',
      email: 'nioasoft@gmail.com',
      phone_country_code: '972',
      phone_area_code: '50',
      phone_number: '1234567',
      id: '000000000',
    },

    items: [{
      id: 1,
      code: 'TEST-001',
      name: 'טייץ ספורט - בדיקה',
      unit_price: 1,
      units_number: 1,
      type: 'I',
      unit_type: 1,
      price_type: 'G',
      currency_code: 'ILS',
    }],

    payment_label: 'YL Sport',

    // Required: email sending configuration
    send_email: {
      sender_name: 'YL Sport',
      sender_email: 'noreply@yl-sport.co.il',
    },
  };

  // Test different document configurations
  const testConfigs = [
    {
      name: 'Test 1: No document params (baseline)',
      extra: {}
    },
    {
      name: 'Test 2: create_document=true, document_type=3 (חשבונית מס קבלה)',
      extra: {
        create_document: true,
        document_type: 3,
      }
    },
    {
      name: 'Test 3: create_document=true, document_type=1 (קבלה)',
      extra: {
        create_document: true,
        document_type: 1,
      }
    },
    {
      name: 'Test 4: create_document=true, document_type=2 (חשבונית מס)',
      extra: {
        create_document: true,
        document_type: 2,
      }
    },
    {
      name: 'Test 5: invoice object',
      extra: {
        invoice: {
          create: true,
          type: 3,
        }
      }
    },
    {
      name: 'Test 6: auto_document=true',
      extra: {
        auto_document: true,
      }
    },
  ];

  for (const config of testConfigs) {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`${config.name}`);
    console.log('='.repeat(50));

    const payload = { ...basePayload, ...config.extra };
    console.log('Extra params:', JSON.stringify(config.extra, null, 2));

    try {
      const response = await fetch(`${API_HOST}/v1/pr/create`, {
        method: 'POST',
        headers: generateAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const json = await response.json();

      if (json.error_code === 0 || json.pr_link || json.pr_id) {
        console.log('\n✅ SUCCESS! Payment Request Created');
        console.log('PR ID:', json.pr_id);
        console.log('Payment Link:', json.pr_link);

        // List ALL response fields
        console.log('\nAll response fields:');
        for (const [key, value] of Object.entries(json)) {
          console.log(`  ${key}: ${JSON.stringify(value)}`);
        }
      } else if (json.error_code) {
        console.log('\n❌ Error:', json.error_code, '-', json.message);
      } else {
        console.log('\nUnexpected response:', JSON.stringify(json, null, 2));
      }
    } catch (error) {
      console.log('Fetch error:', error);
    }
  }
}

testPaymentRequestWithInvoice().then(() => {
  console.log('\n' + '='.repeat(60));
  console.log('Test Complete');
  console.log('='.repeat(60));
}).catch(console.error);
