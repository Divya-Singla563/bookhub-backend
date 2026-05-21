import CryptoJS from "crypto-js";

// 🔒 ENCRYPT PAYLOAD
const encryptPayload = (data) => {
  return CryptoJS.AES.encrypt(
    JSON.stringify(data),
    process.env.CRYPTO_SECRET_KEY,
  ).toString();
};

// 🔓 DECRYPT PAYLOAD
const decryptPayload = (encryptedText) => {
  const bytes = CryptoJS.AES.decrypt(
    encryptedText,
    process.env.CRYPTO_SECRET_KEY,
  );

  const decrypted = bytes.toString(CryptoJS.enc.Utf8);

  return JSON.parse(decrypted);
};

// 🔐 GENERATE HASH
const generateHash = (data) => {
  return CryptoJS.HmacSHA256(data, process.env.HASH_SECRET_KEY).toString();
};

// ✅ VERIFY HASH
const verifyHash = (data, hash) => {
  const generatedHash = generateHash(data);

  return generatedHash === hash;
};

export { encryptPayload, decryptPayload, generateHash, verifyHash };
