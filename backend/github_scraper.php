<?php

function scrapeGitHubProfile($url) {
    if (!preg_match('/^https:\/\/github\.com\/[a-zA-Z0-9_-]+$/', $url)) {
        return ['error' => 'Invalid GitHub URL.'];
    }


    $html = file_get_contents($url);

    if (!$html) {
        return ['error' => 'Failed to fetch GitHub profile.'];
    }

    $dom = new DOMDocument();
    @$dom->loadHTML($html); 

    $xpath = new DOMXPath($dom);

 
    $nameNodes = $xpath->query("//span[@class='p-name vcard-fullname']");
    $name = $nameNodes->length > 0 ? trim($nameNodes->item(0)->nodeValue) : null;


    $emailNodes = $xpath->query("//a[contains(@href, 'mailto:')]");
    $email = $emailNodes->length > 0 ? trim($emailNodes->item(0)->nodeValue) : null;

    return [
        'name' => $name,
        'email' => $email,
    ];
}
