<?php
/*
    replace the admin name and admin password with
    your own username and password
*/
$jsoncms_username = "admin";
$jsoncms_password = "password";

/*
    {optional} you can generate a sha 256 hash of your salt+username+password (don't forget the salt)
    if you enter the passwordHash username and password no more needed 
*/
$jsoncms_passwordHash = "";

/*
    salting your password must be the same like js/service/sha-genrator.js
    if you change it here you need to change it in the js aswell
*/
$jsoncms_salt = "json-cms";

/*
    allowed files for the admin to upload
*/
$jsoncms_allowedFiles = array(

    // images
    'png' => 'image/png',
    'jpeg' => 'image/jpeg',
    'jpg' => 'image/jpeg',
    'gif' => 'image/gif',
    'svg' => 'image/svg+xml',

    // audio/video
    'mp3' => 'audio/mp3',
    'mp4' => null,
    'ogg' => 'video/ogg',

    // adobe
    'pdf' => null,
);