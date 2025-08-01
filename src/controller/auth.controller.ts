import { Request, Response } from "express";
import * as authService from "../services/auth.service";

export const login = async (req: Request, res: Response) => {
  try {
    console.log('[AUTH CONTROLLER] Login request received. Body:', req.body); // ADDED req.body for more detail

    const { email, password } = req.body;
    if (!email || !password) {
      console.log('[AUTH CONTROLLER] Missing email or password in request body.');
      return res.status(400).json({ message: "Email and password are required" });
    }

    const tokens = await authService.authenticateUser(email, password);
    if (!tokens) {
      console.log('[AUTH CONTROLLER] Authentication failed: authService.authenticateUser returned null.');
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log('[AUTH CONTROLLER] Login successful, sending tokens.');
    res.status(200).json({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    });
  } catch (error) {
    console.error('Login error (in controller catch block):', error);
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ message });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    const newTokens = await authService.refreshAccessToken(refreshToken);
    if (!newTokens) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    res.status(200).json(newTokens);
  } catch (error) {
    console.error('Refresh token error (in controller):', error);
    const message = error instanceof Error ? error.message : "Failed to refresh token";
    res.status(500).json({ message });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    await authService.revokeRefreshToken(refreshToken);
    res.status(200).json({ message: "Successfully logged out" });
  } catch (error) {
    console.error('Logout error (in controller):', error);
    const message = error instanceof Error ? error.message : "Failed to logout";
    res.status(500).json({ message });
  }
};

export const authController = {
  login,
  refreshToken,
  logout
};