describe('Posts API', () => {
  const endpoint = 'https://jsonplaceholder.typicode.com/posts';
  const validPost = {
    title: 'Test post',
    body: 'Test body content',
    userId: 1,
  };

  describe('POST /posts', () => {
    it('should create a new post successfully', async () => {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(validPost),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });

      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          title: validPost.title,
          body: validPost.body,
          userId: validPost.userId,
        }),
      );
    });

    describe('Validation errors (400)', () => {
      it('should return 400 when title is missing', async () => {
        const postWithoutTitle = {
          body: validPost.body,
          userId: validPost.userId,
        };

        const response = await fetch(endpoint, {
          method: 'POST',
          body: JSON.stringify(postWithoutTitle),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        });

        expect(response.status).toBe(400);
        const error = await response.json();
        expect(error).toEqual(
          expect.objectContaining({
            error: expect.stringContaining('title'),
          }),
        );
      });

      it('should return 400 when body is missing', async () => {
        const postWithoutBody = {
          title: validPost.title,
          userId: validPost.userId,
        };

        const response = await fetch(endpoint, {
          method: 'POST',
          body: JSON.stringify(postWithoutBody),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        });

        expect(response.status).toBe(400);
        const error = await response.json();
        expect(error).toEqual(
          expect.objectContaining({
            error: expect.stringContaining('body'),
          }),
        );
      });

      it('should return 400 when userId is missing', async () => {
        const postWithoutUserId = {
          title: validPost.title,
          body: validPost.body,
        };

        const response = await fetch(endpoint, {
          method: 'POST',
          body: JSON.stringify(postWithoutUserId),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        });

        expect(response.status).toBe(400);
        const error = await response.json();
        expect(error).toEqual(
          expect.objectContaining({
            error: expect.stringContaining('userId'),
          }),
        );
      });

      it('should return 400 when userId is not a number', async () => {
        const postWithInvalidUserId = {
          ...validPost,
          userId: 'not-a-number',
        };

        const response = await fetch(endpoint, {
          method: 'POST',
          body: JSON.stringify(postWithInvalidUserId),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        });

        expect(response.status).toBe(400);
        const error = await response.json();
        expect(error).toEqual(
          expect.objectContaining({
            error: expect.stringContaining('userId must be a number'),
          }),
        );
      });
    });

    describe('Server errors (500)', () => {
      // Mock the fetch function to simulate a server error
      const originalFetch = global.fetch;

      beforeAll(() => {
        global.fetch = jest.fn(() =>
          Promise.reject(new Error('Internal Server Error')),
        );
      });

      afterAll(() => {
        global.fetch = originalFetch;
      });

      it('should handle server errors gracefully', async () => {
        try {
          await fetch(endpoint, {
            method: 'POST',
            body: JSON.stringify(validPost),
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
          });
        } catch (error) {
          expect(error.message).toBe('Internal Server Error');
        }
      });
    });

    describe('Content type validation', () => {
      it('should return 400 when Content-Type header is missing', async () => {
        const response = await fetch(endpoint, {
          method: 'POST',
          body: JSON.stringify(validPost),
          // Intentionally omitting Content-Type header
        });

        expect(response.status).toBe(400);
        const error = await response.json();
        expect(error).toEqual(
          expect.objectContaining({
            error: expect.stringContaining('Content-Type'),
          }),
        );
      });

      it('should return 400 when sending invalid JSON', async () => {
        const response = await fetch(endpoint, {
          method: 'POST',
          body: 'invalid-json',
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        });

        expect(response.status).toBe(400);
        const error = await response.json();
        expect(error).toEqual(
          expect.objectContaining({
            error: expect.stringContaining('Invalid JSON'),
          }),
        );
      });
    });

    describe('Field validation', () => {
      it('should return 400 when title exceeds maximum length', async () => {
        const postWithLongTitle = {
          ...validPost,
          title: 'a'.repeat(101), // Assuming 100 is max length
        };

        const response = await fetch(endpoint, {
          method: 'POST',
          body: JSON.stringify(postWithLongTitle),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        });

        expect(response.status).toBe(400);
        const error = await response.json();
        expect(error).toEqual(
          expect.objectContaining({
            error: expect.stringContaining('title length'),
          }),
        );
      });

      it('should return 400 when body is empty string', async () => {
        const postWithEmptyBody = {
          ...validPost,
          body: '',
        };

        const response = await fetch(endpoint, {
          method: 'POST',
          body: JSON.stringify(postWithEmptyBody),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        });

        expect(response.status).toBe(400);
        const error = await response.json();
        expect(error).toEqual(
          expect.objectContaining({
            error: expect.stringContaining('body cannot be empty'),
          }),
        );
      });
    });
  });
});
