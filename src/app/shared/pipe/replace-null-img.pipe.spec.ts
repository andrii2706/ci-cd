import { ReplaceNullImgPipe } from './replace-null-img.pipe';

describe('ReplaceNullImgPipe', () => {
	let pipe: ReplaceNullImgPipe;

	beforeEach(() => {
		pipe = new ReplaceNullImgPipe();
	});

	it('create an instance', () => {
		expect(pipe).toBeTruthy();
	});

	it('should return the default URL when the value is null', () => {
		const result = pipe.transform('');
		expect(result).toBe(pipe.defaultUrl);
	});

	it('should return the default URL when the value is empty', () => {
		const result = pipe.transform('');
		expect(result).toBe(pipe.defaultUrl);
	});

	it('should return the default URL when the value is undefined', () => {
		/* eslint-disable  @typescript-eslint/no-explicit-any */
		const result = pipe.transform(undefined as any);
		expect(result).toBe(pipe.defaultUrl);
	});

	it('should return the default URL when the value contains the Google URL', () => {
		const googleUrl = 'https://lh3.googleusercontent.com';
		const result = pipe.transform(googleUrl);
		expect(result).toBe(pipe.defaultUrl);
	});

	it('should return the input URL if it does not match the conditions', () => {
		const inputUrl = 'https://example.com/image.jpg';
		const result = pipe.transform(inputUrl);
		expect(result).toBe(inputUrl);
	});
});
