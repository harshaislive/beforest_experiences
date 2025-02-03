// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock window.location
const mockLocation = new URL('http://localhost:3000');
delete window.location;
window.location = mockLocation; 