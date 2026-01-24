# Use the official n8n image
FROM n8n/n8n:latest

# Expose the default n8n port
EXPOSE 5678

# Set environment variables for local access
ENV N8N_HOST=0.0.0.0
ENV N8N_PORT=5678

# Start n8n
CMD ["n8n"]