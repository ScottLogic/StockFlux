export default () => {
  if (!window || !window.fin) {
    throw new Error('This React hook requires the OpenFin API');
  }
  return window.fin;
};
