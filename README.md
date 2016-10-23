# はてなブックマーク数表示付きリンクを取得する
URLを入力するだけでリンクを取得できます。

## Demo
http://usamimi.info/~sutara/sample2/get-link-with-hatena-bookmark/

## 特徴
- リンク文字列としてそのページのタイトルタグを表示します。  
  タイトルがなければURLを表示します。
- マークダウン形式とHTML形式、2通りのリンクを出力します。
- リンクとともに、はてなブックマーク数も合わせて出力します。
    - 下記のページで紹介されているAPIに従い、ブックマーク数の画像を取得します。  
      [ ブックマーク数を画像で取得する API の公開について - はてなブックマーク日記 - 機能変更、お知らせなど](http://hatena.g.hatena.ne.jp/hatenabookmark/20060712/1152696382) [![hatena bookmark](http://b.hatena.ne.jp/entry/image/http://hatena.g.hatena.ne.jp/hatenabookmark/20060712/1152696382)](http://b.hatena.ne.jp/entry/http://hatena.g.hatena.ne.jp/hatenabookmark/20060712/1152696382)
    - URL内の`#`は`%23`へ変換します。
    - 画像のalt属性はデフォルトでは`hatena bookmark`ですが、変更も可能です。