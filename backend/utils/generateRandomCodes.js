import prisma from "../db/db.js";

/**
 * Generates a random invite code and ensures it's unique in the database.
 * @param {number} length The length of the code to generate (default: 8)
 * @returns {Promise<string>} A unique random code
 */

export const generateRandomCode = async (length = 8) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code;
  let isUnique = false;

  while (!isUnique) {
    code = "";
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Check if the code already exists in the database
    const existingCode = await prisma.inviteCode.findFirst({
      where: { code },
    });
    if (!existingCode) {
      isUnique = true;
    }
  }

  return code;
};
