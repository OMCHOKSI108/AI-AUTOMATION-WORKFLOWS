/**
 * Utility functions for the SANS EDA application
 */

/**
 * Format file size from bytes to human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size (e.g., "2.5 MB")
 */
export const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Format date to human-readable format
 * @param {string} dateString - ISO date string
 * @param {boolean} includeTime - Whether to include time in the output
 * @returns {string} Formatted date
 */
export const formatDate = (dateString, includeTime = true) => {
    if (!dateString) return 'N/A';
    
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    };
    
    if (includeTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
    }
    
    return new Date(dateString).toLocaleDateString('en-US', options);
};

/**
 * Format relative time (e.g., "2 hours ago")
 * @param {string} dateString - ISO date string
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffSecs < 60) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return formatDate(dateString, false);
};

/**
 * Truncate text to specified length with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 50) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

/**
 * Get status color variant for Badge component
 * @param {string} status - Status value (completed, failed, processing, etc.)
 * @returns {string} Color variant name
 */
export const getStatusVariant = (status) => {
    const statusMap = {
        'completed': 'success',
        'failed': 'error',
        'processing': 'warning',
        'pending': 'default'
    };
    
    return statusMap[status?.toLowerCase()] || 'default';
};

/**
 * Validate file type
 * @param {File} file - File object
 * @param {string[]} allowedTypes - Array of allowed MIME types
 * @returns {boolean} Whether file type is valid
 */
export const validateFileType = (file, allowedTypes) => {
    if (!file) return false;
    return allowedTypes.includes(file.type);
};

/**
 * Validate file size
 * @param {File} file - File object
 * @param {number} maxSizeMB - Maximum size in MB
 * @returns {boolean} Whether file size is valid
 */
export const validateFileSize = (file, maxSizeMB = 50) => {
    if (!file) return false;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
};

/**
 * Parse JSON safely
 * @param {string} jsonString - JSON string to parse
 * @param {*} defaultValue - Default value if parsing fails
 * @returns {*} Parsed object or default value
 */
export const safeJSONParse = (jsonString, defaultValue = null) => {
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        console.error('JSON parse error:', error);
        return defaultValue;
    }
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        return false;
    }
};

/**
 * Download file from URL
 * @param {string} url - File URL
 * @param {string} filename - Filename for download
 */
export const downloadFile = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

/**
 * Generate random ID
 * @param {number} length - Length of ID
 * @returns {string} Random ID
 */
export const generateId = (length = 8) => {
    return Math.random().toString(36).substring(2, 2 + length);
};

/**
 * Check if value is empty
 * @param {*} value - Value to check
 * @returns {boolean} Whether value is empty
 */
export const isEmpty = (value) => {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim() === '';
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
};
