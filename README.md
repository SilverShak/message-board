Explain:
This is a simple message board, allow users to post, edit and delete messages.

Requirements:
1. Web server: Apache, IIS, etc
2. PHP
3. MySQL (+Editor, like phpMyAdmin)

Deployment and modifications:
1. SQL prepare (see complete SQL command below):
  a. Create DB named "messageboard".
  b. Create table named "messages" with the following columns:
    1. Name: id | Type: INT, NOT NULL, AUTO INCREMENT, PRIMARY KEY
    2. Name: category | Type: varChar | length 15
    3. Name: message | Type: varChar | Length: 15
    4. Name: author |Type: varChar | Length: 15
    5. Name: expiration |Type: DATE
    6. Name: timestamp | Type: TIMESTAMP | Value: DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
  c. Create user named "message_editor" with the following privilages on Database: SELECT, INSERT, UPDATE, DELETE.
  
    SQL Commaned: 
    **CREATE DATABASE messageboard;CREATE TABLE messageboard.messages (id int not null auto_increment primary key, category varChar(15), message varChar(350), author varChar(15), expiration DATE, timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);**
  
2. Publish the files on Web Server

3. If you want to delete old messages automaticly from database, run handlers/message_delete_expired.php in schedule
