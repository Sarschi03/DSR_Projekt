FROM php:8.0-apache

# Install required extensions
RUN apt-get update && apt-get install -y \
    libpq-dev \
    libonig-dev \
    && docker-php-ext-install pdo pdo_mysql

# Enable mod_rewrite for Apache
RUN a2enmod rewrite

# Copy application files (optional)
COPY ./php /var/www/html

# Set proper permissions
RUN chown -R www-data:www-data /var/www/html

# Install msmtp for sending emails
RUN apt-get update && apt-get install -y msmtp msmtp-mta ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy msmtp configuration file
COPY ./msmtprc.txt /etc/msmtprc
RUN chmod 600 /etc/msmtprc && chown www-data:www-data /etc/msmtprc

# Set sendmail path for PHP
RUN echo "sendmail_path = \"/usr/bin/msmtp -t -i\"" > /usr/local/etc/php/conf.d/sendmail.ini

