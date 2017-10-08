// Polyfill requestAnimationFrame before using React (and Enzyme)
global.requestAnimationFrame = callback => global.setTimeout(callback, 0);

// Setup Enzyme for React 16
const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
Enzyme.configure({ adapter: new Adapter() });
