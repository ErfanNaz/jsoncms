# JSON CMS

With json cms you can build your Webpages and get your Data from a single json File.
It is up to you if you want to use PHP or simple html with javascript for the Webpage, because the Content of your Webpage can be managed by JSON CMS.
It is the fastest way to create a simple Webpage with dynamic Content. There is no requirement for a Database.

## DEMO

[json cms](http://www.zentoo.de)

# How to use it?

You can download the zip file (JsonCMS.zip) and use it or Just run composer install and then gulp dist to build the newest version of JSON CMS. You have to change the Admin Password in the "backend/index.php" File.
Now you can manipulate the "backend/schema.json" File for all kind of Data you need. The Schema has to be compatible with the [Json schema v4](http://json-schema.org/) Standard.

## example

"backend/index.php"

```php
    /*
        change the admin password here, 
        this password will allow you to change the content data
    */
    $password = "mySecretPassword";
```

"backend/schema.json"

```json

{
    "type": "object",
    "properties": {
        "name": {
            "type": "string",
            "minLength": 2,
            "description": "Name or alias"
        },
        "sex": {
            "type": "string",
            "enum": [
                "man",
                "woman"
            ]
        },
        "birthday": {
            "type": "string",
            "title": "date of your birthday",
            "format": "date"
        },
        "books": {
            "type": "array",
            "title": "readed books",
            "items": {
                "type": "object",
                "properties": {
                    "title": {
                        "title": "Title of the Book",
                        "type": "string",
                        "format": "date"
                    },
                    "pages": {
                        "type": "integer",
                        "title": "How many pages the book has"
                    }
                },
                "required": [
                    "title",
                    "pages"
                ]
            }
        }
    },
    "required": [
        "name",
        "sex",
        "bookings"
    ]
}

```