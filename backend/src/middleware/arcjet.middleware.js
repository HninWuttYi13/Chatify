import express from "express";
import { isSpoofedBot } from "@arcjet/inspect";
import aj from "../lib/arject.js";
/***
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
export const arcjetProtection = async (req, res, next) => {
  try {
    const decision = await aj.protect(req);

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({
          message: "Rate limit exceeded. Please try again later",
        });
      }

      else if (decision.reason.isBot()) {
        return res.status(403).json({
          message: "Bot access denied",
        });
      }

      return res.status(403).json({
        message: "Access denied by security policy",
      });
    }

    // Spoofed bots
    if (decision.results.some(isSpoofedBot)) {
      return res.status(403).json({
        error: "spoofBot detected",
        message: "Malicious bot activity detected",
      });
    }

    next();
  } catch (error) {
    console.log("Arcjet protection error:", error);
    next();
  }
};