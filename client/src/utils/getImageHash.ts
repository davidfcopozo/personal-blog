async function getImageHash(
  file: File,
  algorithm: string = "SHA-256"
): Promise<string> {
  try {
    // Read the file as an ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Compute the hash using the Web Crypto API
    const hashBuffer = await crypto.subtle.digest(algorithm, arrayBuffer);

    // Convert the hash to a hexadecimal string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");

    return hashHex;
  } catch (error) {
    console.error("Error computing image hash:", error);
    throw error;
  }
}

export default getImageHash;
