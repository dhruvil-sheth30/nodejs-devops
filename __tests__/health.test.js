const request = require('supertest');
const app = require('../src/index');

describe('Health Check Endpoint', () => {
  it('should return health status', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(response.body).toHaveProperty('status', 'UP');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('uptime');
    expect(response.body).toHaveProperty('memoryUsage');
    expect(response.body).toHaveProperty('cpuUsage');
  });
});