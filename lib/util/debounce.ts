export default function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
) {
  let debouncedTimeoutId: ReturnType<typeof setTimeout>;

  return function (...args: Parameters<T>) {
    clearTimeout(debouncedTimeoutId);
    debouncedTimeoutId = setTimeout(func.bind(null, ...args), delay);
  };
}
