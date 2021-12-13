FROM nginx
COPY dist/blockchain /usr/share/nginx/html
RUN sed -i '10itry_files $uri $uri/ /index.html?$args;' /etc/nginx/conf.d/default.conf && \
    sed -i '10ilocation ~* (.(jpg|jpeg|png|gif|ico|css|js)|image)$ { expires 1d; add_header Access-Control-Allow-Origin *; }' /etc/nginx/conf.d/default.conf