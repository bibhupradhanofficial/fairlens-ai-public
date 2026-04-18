# Serve
FROM nginx:alpine
COPY dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Use sed to replace 8080 with the $PORT env var at runtime
CMD ["/bin/sh", "-c", "sed -i 's/listen 8080;/listen '\"$PORT\"';/' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
