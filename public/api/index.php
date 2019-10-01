<?php
require __DIR__ . '/../../vendor/autoload.php';

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use \Slim\App;

include_once(__DIR__ . '/../config.php');

$cmsJsonPath = "../cms.json";
$dataJsonPath = "../data.json";
$uloadFolderPath = "../uploads/";

$app = new App();

$app->add(function($request, $response, $next) use ($jsoncms_salt, $jsoncms_username, $jsoncms_password, $jsoncms_passwordHash){
    $user = $request->getHeader("Authorization");

    if(isset($user) && isset($user[0])){
        $passwordFromUser = $user[0];
        $passwordhash = !empty(trim($jsoncms_passwordHash)) ? $jsoncms_passwordHash : hash("sha256", $jsoncms_salt.$jsoncms_username.$jsoncms_password);
        if($passwordFromUser == $passwordhash){
            $response = $next($request, $response);
        } else {
            $response = $response->withJson(['message' => "not authorized"], 401);
        }
    } else {
        $response = $response->withJson(['message' => "not authorized"], 401);
    }
    return $response;
});

$app->get('/login', function(Request $request, Response $response) {
    $response = $response->withJson(['message' => "login correct"], 200);
    return $response;
});

$app->post('/edit', function (Request $request, Response $response) use ($dataJsonPath){
    $parsedBody = $request->getParsedBody();
    $data = $parsedBody["data"] ? $parsedBody["data"] : [];
    file_put_contents($dataJsonPath, json_encode($data, JSON_PRETTY_PRINT));
    $response = $response->withJson(['message' => "data saved"], 200);
    return $response;
});

$app->post('/upload', function (Request $request, Response $response) use ($jsoncms_allowedFiles, $cmsJsonPath, $uloadFolderPath){
    if (sizeof($request->getUploadedFiles()) > 0) {
        $file = $request->getUploadedFiles()["file"];
        $file_mimetype = $file->getClientMediaType();
        $clientFilename = $file->getClientFilename();
        $clientFileExtention = pathinfo($clientFilename)['extension'];
        $clientFileExtention = strtolower($clientFileExtention);
        $isFileExtentionAllowed = array_key_exists($clientFileExtention, $jsoncms_allowedFiles);
        $isMimetypeAllowed = isset($jsoncms_allowedFiles[$clientFileExtention]) ? $jsoncms_allowedFiles[$clientFileExtention] == $file_mimetype : true;
        if($isFileExtentionAllowed && $isMimetypeAllowed){

            if (!file_exists($uloadFolderPath)) {
                mkdir($uloadFolderPath);
            }

            if(ini_get('date.timezone') == ""){
                date_default_timezone_set("UTC");
            }
            $serverFilename = uniqid(date('Ymd').'-');
            $moveToUrl = $serverFilename . "." . $clientFileExtention;
            try {
                $file->moveTo($uloadFolderPath . $moveToUrl);

                if ($file->getError() === UPLOAD_ERR_OK) {
                    $cmsJsonString = file_get_contents($cmsJsonPath);
                    $cmsJson = json_decode($cmsJsonString, true);

                    $parsedBody = $request->getParsedBody();
                    $filename = isset($parsedBody["filename"]) ? $parsedBody["filename"] : $file->getClientFilename();

                    $fileArrayObject = ["name" => $filename,
                                        "url" => $moveToUrl,
                                        "mimetype" => $file->getClientMediaType(),
                                        "size" => $file->getSize()];
                    array_push($cmsJson["uploads"],$fileArrayObject);
                    file_put_contents($cmsJsonPath, json_encode($cmsJson, JSON_PRETTY_PRINT));

                    $response = $response->withJson(['message' => "file uploaded", 'uploads' => json_encode($cmsJson["uploads"])], 200);
                } else {
                    $response = $response->withJson(['message' => $file["file"]->getError()], 400);
                }
            } catch (Exception $e) {
                $response = $response->withJson(['message' => "file is to big"], 400);
            }
        } else {
            $response = $response->withJson(['message' => $clientFileExtention . " with the MIME-Type ". $file_mimetype ." not allowed"], 400);
        }
    } else {
        $response = $response->withJson(['message' => "no files uploaded (files missing or is to big)"], 400);
    }
    return $response;
});

$app->delete('/upload', function (Request $request, Response $response) use ($jsoncms_allowedFiles, $cmsJsonPath, $uloadFolderPath){
    $parsedBodyGet = $request->getQueryParams();
    $fileUrl = $parsedBodyGet["fileUrl"];
    if($fileUrl != null){
        $cmsJsonString = file_get_contents($cmsJsonPath);
        $cmsJson = json_decode($cmsJsonString, true);
        $foundedKey = null;
        $foundedUrl = null;
        foreach ($cmsJson["uploads"] as $key => $value) {
            if($fileUrl === $value["url"]){
                $foundedKey = $key;
                $foundedUrl = $value["url"];
            }
        }
        if($foundedKey !== null){
            $filePath = $uloadFolderPath . $cmsJson["uploads"][$foundedKey]["url"];
            if(file_exists($filePath) && unlink($filePath)){
                unset($cmsJson["uploads"][$foundedKey]);
                file_put_contents($cmsJsonPath, json_encode($cmsJson, JSON_PRETTY_PRINT));
                $response = $response->withJson(['message' => "file deleted", 'uploads' => json_encode($cmsJson["uploads"])], 200);
            } else {
                $response = $response->withJson(['message' => "file not found"], 400);
            }
        } else {
            $response = $response->withJson(['message' => "file not found"], 400);
        }
    } else {
        $response = $response->withJson(['message' => "file not found"], 400);
    }
    return $response;
});

$app->run();
