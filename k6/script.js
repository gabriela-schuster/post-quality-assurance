import http from 'k6/http';
import { sleep, check, group } from 'k6';
import { Rate, Trend } from 'k6/metrics';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

const errorRate = new Rate('errors');

export const options = {
  vus: 100,
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
    http_req_failed: ['rate<0.01'],   // 99% of requests must not fail
    errors: ['rate<0.1'],             // Error rate must be less than 10%
  },
  stages: [
    { duration: '30s', target: 20 },   // Ramp-up to 20 users
    { duration: '1m', target: 50 },    // Ramp-up to 50 users
    { duration: '2m', target: 50 },    // Stay at 50 users for 2 minutes
    { duration: '30s', target: 0 },    // Ramp-down to 0 users
  ],
};

export function setup() {
  const response = http.get('http://127.0.0.1:3000/');
  check(response, {
    'health check passed': (r) => r.status === 200,
  });
  return { startTime: Date.now() };
}

export function teardown(data) {
  console.log(`Test duration: ${(Date.now() - data.startTime) / 1000}s`);
}

export default function() {
  group('Homepage', function() {
    const response = http.get('http://127.0.0.1:3000/', {
      tags: { name: 'homepage' },
      headers: {
        'User-Agent': 'k6-test',
        'Accept': 'application/json',
      },
    });

    const checks = check(response, {
      'status is 200': (r) => r.status === 200,
      'duration < 500ms': (r) => r.timings.duration < 500,
      'body size is not 0': (r) => r.body.length > 0,
      'content type is present': (r) => r.headers['Content-Type'] !== undefined,
    });

    errorRate.add(!checks);
  });

  group('Users', function() {
    const response = http.get('http://127.0.0.1:3000/users/', {
      headers: {
        'Content-Type': 'application/json',
      },
      tags: { name: 'api_users' },
    });

    check(response, {
      'status is 200': (r) => r.status === 200,
      'has valid response': (r) => r.body.length > 0,
    });
  });

  // Random sleep between 1-3 seconds
  sleep(Math.random() * 2 + 1);
}