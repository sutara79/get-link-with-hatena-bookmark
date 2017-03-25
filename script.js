var hatena_bookmark = {
  /**
   * はじめに実行する処理
   */
  init: function() {
    this.clearResults();
    this.initOption();
    this.getTitle(this.option.url);
  },
  /**
   * 現在表示されている結果を消去する。
   */
  clearResults: function() {
    $('#result-html').val('');
    $('#result-markdown').val('');
    $('#result-demo').html('');
  },
  /**
   * オプションを設定する。
   */
  initOption: function() {
    this.option = {
      url: $('#hb-url').val(),
      title: '',
      blank: ($('#hb-opt-blank').prop('checked')) ? ' target="_blank" rel="noopener"' : '',
      users: ($('#hb-opt-users').prop('checked')) ? true : false,
      alt: $('#hb-opt-alt').val()
    };
  },
  /**
   * タイトルタグの文字列を出力する。
   * Ajaxを利用し、実際の処理はPHP側で行う。
   */
  getTitle: function(url) {
    var self = this;
    $.get(
      'ajax.php',
      {url: url},
      function(title) {
        self.option.title = title;
        self.showResult();
      }
    );
  },
  /**
   * 結果を表示する
   */
  showResult: function() {
    var obj_page = this.getPage(this.option.url, this.option.title, this.option.blank);
    var obj_hatena = this.getHatena(this.option.url, this.option.title, this.option.blank, this.option.alt);
    var str_html = obj_page.html;
    var str_markdown = obj_page.markdown;
    if (this.option.users) {
      str_html += ' ' + obj_hatena.html;
      str_markdown += ' ' + obj_hatena.markdown;
    }
    $('#result-html').val(str_html);
    $('#result-markdown').val(str_markdown);
    $('#result-demo').html(str_html);
  },
  /**
   * ページ自体へのリンクを取得する。
   */
  getPage: function(url, title, blank) {
    return {
      html: '<a href="' + url + '"' + blank + '>' + title + '</a>',
      markdown: '[' + title + '](' + url + ')'
    };
  },
  /**
   * はてなブックマークへのリンクを取得する。
   */
  getHatena: function(url, title, blank, alt) {
    var url_encoded = url.replace(/#/g, '%23');
    var url_b_img = 'http://b.hatena.ne.jp/entry/image/' + url_encoded;
    var url_b_page = 'http://b.hatena.ne.jp/entry/' + url_encoded;
    return {
      html: '<a href="' + url_b_page + '"' + blank + '><img src="' + url_b_img + '" alt="' + alt + '"></a>',
      markdown: '[![' + alt + '](' + url_b_img + ')](' + url_b_page + ')'
    };
  }
};
/**
 * ページ読み込み後に実行する。
 */
$(function() {
  /**
   * 入力欄がフォーカスされたら、選択状態にする。
   */
  $('.js-input').on('focus', function() {
    $(this).select();
  });
  /**
   * ボタンをクリックしたらリンクを取得する。
   */
  $('.hb-execute').on('click', function() {
    hatena_bookmark.init();
  }).trigger('click');
});