import { decryptPayload, verifyHash } from "../utils/crypto.js";

const decryptRequest = (req, res, next) => {
  try {
    if (req.method === "GET") {
      return next();
    }

    const { sek, hash } = req.body;

    if (!sek || !hash) {
      return res.status(400).json({
        message: "sek/hash missing",
      });
    }

    // ✅ Verify hash first
    const isValid = verifyHash(sek, hash);

    if (!isValid) {
      return res.status(400).json({
        message: "Invalid hash",
      });
    }

    // 🔓 decrypt payload
    const decryptedData = decryptPayload(sek);

    // Replace req.body
    req.body = decryptedData;

    next();
  } catch (error) {
    console.log(error);

    return res.status(400).json({
      message: "Invalid encrypted request",
    });
  }
};

export default decryptRequest;
