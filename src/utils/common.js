export const getRandomInteger = (a = 0, b = 1) => {
  const minimum = Math.ceil(Math.min(a, b));
  const maximum = Math.floor(Math.max(a, b));

  return Math.floor(minimum + Math.random() * (maximum - minimum + 1));
};

export const getTimeInHours = (number) => number.toString().padStart(2, `0`);
