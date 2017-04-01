<?php
/**
 * タイトルタグの内容を出力する
 */
$url = $_GET['url'];

// cURLでHTMLソースを取得する
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 60);
curl_setopt($ch, CURLOPT_USERAGENT, 'Dummy'); // はてなの503エラー対策 参照: http://q.hatena.ne.jp/1451205850
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // SSL証明回避 参照: http://mio-koduki.blogspot.jp/2012/08/php-curlsslhttpsca.html
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Accept-Language: ' . $_SERVER['HTTP_ACCEPT_LANGUAGE']));
$html = curl_exec($ch);
curl_close($ch);

// 正規表現で<title>の中身を取得する
if (
    preg_match(
        '/<title>(.*?)<\/title>/is',
        mb_convert_encoding($html, 'UTF-8', 'ASCII,JIS,UTF-8,EUC-JP,SJIS'),
        $matches
    )
) {
    $title = trim($matches[1]);
} else {
    $title = $url;
}
echo $title;