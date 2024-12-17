const espera = (tiempo = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("resolved");
    }, tiempo);
  });
};

export { espera };
