# ./n8n/Dockerfile
FROM n8nio/n8n:latest

USER root

# Install Python + all needed packages
RUN apk add --no-cache \
    python3 \
    py3-pip \
    py3-pandas \
    py3-numpy \
    py3-openpyxl \
    py3-scipy \
    py3-matplotlib \
    py3-seaborn

# Make "python" command work
RUN ln -sf /usr/bin/python3 /usr/bin/python

# Copy your Python scripts into the container
COPY ./DATA_CLEANING_WORKFLOW/backend/scripts /home/node/scripts/
RUN chmod +x /home/node/scripts/*.py

# Go back to node user
USER node
