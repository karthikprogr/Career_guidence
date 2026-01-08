import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

// Log levels
export const LOG_LEVELS = {
  INFO: 'INFO',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS'
};

/**
 * Logger utility for logging all actions performed in the application
 * @param {string} level - Log level (INFO, WARNING, ERROR, SUCCESS)
 * @param {string} action - Action performed
 * @param {string} message - Log message
 * @param {object} metadata - Additional metadata
 */
export const logger = async (level, action, message, metadata = {}) => {
  const logEntry = {
    level,
    action,
    message,
    metadata,
    timestamp: serverTimestamp(),
    userAgent: navigator.userAgent,
    url: window.location.href
  };

  // Console logging for development
  const consoleMethod = level === LOG_LEVELS.ERROR ? 'error' : 
                        level === LOG_LEVELS.WARNING ? 'warn' : 'log';
  console[consoleMethod](`[${level}] ${action}: ${message}`, metadata);

  // Firebase logging for production
  try {
    await addDoc(collection(db, 'logs'), logEntry);
  } catch (error) {
    // Silently fail if logging permissions are not set up yet
    // This prevents errors during initial setup
    if (error.code !== 'permission-denied') {
      console.error('Failed to log to Firebase:', error);
    }
  }
};

// Convenience methods
export const logInfo = (action, message, metadata) => 
  logger(LOG_LEVELS.INFO, action, message, metadata);

export const logWarning = (action, message, metadata) => 
  logger(LOG_LEVELS.WARNING, action, message, metadata);

export const logError = (action, message, metadata) => 
  logger(LOG_LEVELS.ERROR, action, message, metadata);

export const logSuccess = (action, message, metadata) => 
  logger(LOG_LEVELS.SUCCESS, action, message, metadata);

export default logger;
