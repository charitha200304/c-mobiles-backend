import dotenv from 'dotenv';
import User, { IUser } from "../models/user.model";
import jwt from "jsonwebtoken";
import * as bcrypt from 'bcrypt';
import { Document } from 'mongoose';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your-refresh-secret';

// In-memory store for refresh tokens (in production, use a database)
export const refreshTokens = new Set<string>();

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  [key: string]: any;
}

export const authenticateUser = async (email: string, inputPassword: string) => {
  try {
    console.log(`[AUTH SERVICE] Attempting to authenticate user: ${email}`);

    // Find user by email in the database
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      console.log(`[AUTH SERVICE] Authentication Failed: User not found for email: ${email}.`);
      return null;
    }

    console.log(`[AUTH SERVICE] User found: ${existingUser.email}. Proceeding to compare password.`);

    // Check if password is valid
    const isValidPassword = await existingUser.comparePassword(inputPassword);
    if (!isValidPassword) {
      console.log(`[AUTH SERVICE] Authentication Failed: Invalid password for user: ${existingUser.email}.`);
      return null;
    }

    console.log(`[AUTH SERVICE] Authentication Successful for user: ${existingUser.email}. Generating tokens.`);

    // Generate tokens
    const accessToken = jwt.sign(
        {
          userId: existingUser._id,
          email: existingUser.email,
          role: existingUser.role
        },
        JWT_SECRET,
        { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
        {
          userId: existingUser._id,
          email: existingUser.email,
          role: existingUser.role
        },
        REFRESH_SECRET,
        { expiresIn: '7d' }
    );

    // Store refresh token (in production, store in a database with expiry)
    refreshTokens.add(refreshToken);

    // Return user data without sensitive information
    const { password: _, refreshToken: __, ...userData } = existingUser.toObject();

    return {
      accessToken,
      refreshToken,
      user: userData
    };
  } catch (error) {
    console.error('[AUTH SERVICE] Authentication error (in service catch block):', error);
    throw new Error('Authentication failed');
  }
};

export const refreshAccessToken = async (refreshToken: string) => {
  try {
    if (!refreshTokens.has(refreshToken)) {
      throw new Error('Invalid refresh token');
    }

    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as TokenPayload;

    // Find the user in the database
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new Error('User not found');
    }

    // Generate new access token
    const accessToken = jwt.sign(
        {
          userId: user._id,
          email: user.email,
          role: user.role
        },
        JWT_SECRET,
        { expiresIn: '15m' }
    );

    // Generate new refresh token
    const newRefreshToken = jwt.sign(
        {
          userId: user._id,
          email: user.email,
          role: user.role
        },
        REFRESH_SECRET,
        { expiresIn: '7d' }
    );

    // Remove old refresh token and add new one
    refreshTokens.delete(refreshToken);
    refreshTokens.add(newRefreshToken);

    return {
      accessToken,
      refreshToken: newRefreshToken,
      user: user.toObject()
    };

  } catch (error) {
    console.error('[AUTH SERVICE] Refresh token error (in service catch block):', error);
    throw new Error('Failed to refresh token');
  }
};

export const revokeRefreshToken = async (refreshToken: string) => {
  try {
    if (refreshTokens.has(refreshToken)) {
      refreshTokens.delete(refreshToken);
      console.log(`[AUTH SERVICE] Refresh token revoked: ${refreshToken}`);
    } else {
      console.log(`[AUTH SERVICE] Refresh token not found for revocation: ${refreshToken}`);
    }
  } catch (error) {
    console.error('[AUTH SERVICE] Logout error (in service catch block):', error);
    throw new Error('Failed to logout');
  }
};