Explain:
This is a simple message board, allow users to post, edit and delete messages.


Deployment:
1. Install MySQL, create DB (name it "messages"), Table (name it also "messages") and user with full rights. Set the username & password in handlers/connnect_db.php.
2. Install PHP.
3. Publish the files.
4. If you want to delete old messages automaticly from database, run handlers/message_delete_expired.php in schedule
