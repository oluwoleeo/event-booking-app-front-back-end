<?php
    $url = "https://google.com";
    var_dump(urlencode($url));
    var_dump(urldecode(urlencode($url)));

    $html = '<p>This is "quoted" text & a <a href="#">Link</a>.</p>';
    var_dump(htmlentities($html));

    var_dump(base64_encode("Hello World"));