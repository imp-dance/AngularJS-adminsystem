I'll be putting some proper documentation here in a lil while, but for now I'm just dumping the project. It's a very light and simple drag and drop to your webserver-type backend system that essentially gives you users with permissions to post articles, easily adaptable to your own database. 

## Setup
If you do want to check it out already, here is the setup process:
1. Fork / clone repository
2. Place the files on a server with access to a database, either locally or remotely
3. Edit *[php/template.php](https://github.com/imp-dance/AngularJS-adminsystem/blob/master/php/template.php) (line 11)* and add your connection details
4. Import all .sql files to your database
5. Add root user to imp_users table
6. Done!
