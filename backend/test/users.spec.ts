describe('Users API', () => {
  const endpoint = 'https://jsonplaceholder.typicode.com/users';
  let response;
  let users;

  beforeAll(async () => {
    response = await fetch(endpoint);
    users = await response.json();
  });

  it('Should return status 200', () => {
    expect(response.status).toBe(200);
  });

  it('Should return exactly 10 users', () => {
    expect(users).toHaveLength(10);
  });

  it('Should have correct data structure for each user', () => {
    users.forEach((user) => {
      expect(user).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          username: expect.any(String),
          email: expect.any(String),
          phone: expect.any(String),
          website: expect.any(String),
        }),
      );

      expect(user.address).toEqual(
        expect.objectContaining({
          street: expect.any(String),
          suite: expect.any(String),
          city: expect.any(String),
          zipcode: expect.any(String),
          geo: expect.objectContaining({
            lat: expect.any(String),
            lng: expect.any(String),
          }),
        }),
      );

      expect(user.company).toEqual(
        expect.objectContaining({
          name: expect.any(String),
          catchPhrase: expect.any(String),
          bs: expect.any(String),
        }),
      );
    });
  });

  it('Should contain valid email formats', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    users.forEach((user) => {
      expect(user.email).toMatch(emailRegex);
    });
  });

  it('Should have positive numeric IDs', () => {
    users.forEach((user) => {
      expect(user.id).toBeGreaterThan(0);
    });
  });

  it('Should have valid geographic coordinates', () => {
    users.forEach((user) => {
      const lat = parseFloat(user.address.geo.lat);
      const lng = parseFloat(user.address.geo.lng);

      expect(lat).not.toBeNaN();
      expect(lng).not.toBeNaN();
      expect(lat).toBeGreaterThanOrEqual(-90);
      expect(lat).toBeLessThanOrEqual(90);
      expect(lng).toBeGreaterThanOrEqual(-180);
      expect(lng).toBeLessThanOrEqual(180);
    });
  });

  it('Should have non-empty required fields', () => {
    users.forEach((user) => {
      expect(user.name.length).toBeGreaterThan(0);
      expect(user.username.length).toBeGreaterThan(0);
      expect(user.email.length).toBeGreaterThan(0);
      expect(user.address.city.length).toBeGreaterThan(0);
      expect(user.company.name.length).toBeGreaterThan(0);
    });
  });
});
