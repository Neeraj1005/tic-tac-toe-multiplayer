export function createGuestUser() {
  // Generate a random number for the guest username
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const guestUserName = `Guest${randomNum}`;

  // Generate a unique ID using the current timestamp and a random number
  const userId = generateUniqueId();

  return {
    userName: guestUserName,
    userId: userId,
  };
}

export function generateUniqueId() {
  // Create a base unique ID using the current timestamp and a random number
  const timestamp = Date.now().toString(36); // Convert to base-36
  const randomNum = Math.random().toString(36).substr(2, 9); // Generate a random base-36 string
  return `${timestamp}-${randomNum}`;
}
