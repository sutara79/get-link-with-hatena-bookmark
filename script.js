/**
 * はてなブックマーク関連の処理をまとめたオブジェクト
 */
var hatebu = {
  /**
   * はじめに実行する処理
   */
  init: function(isFirst) {
    this.clearResults();
    this.initOption(isFirst);
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
  initOption: function(isFirst) {
    // URLをサニタイズ (パーセントエンコーディングでURLエンコード)
    var url = $('#hb-url').val().replace(/["<>]/g, function(match) {
      return {
        '"': '%22',
        '<': '%3C',
        '>': '%3E'
      }[match]
    });

    // alt属性値をサニタイズ (文字実体参照でHTMLエスケープ)
    var alt = $('#hb-opt-alt').val().replace(/["<>]/g, function(match) {
      return {
        '"': '&quot;',
        '<': '&lt;',
        '>': '&gt;'
      }[match]
    });

    // オプション値を決定
    this.option = {
      url: url,
      title: '',
      blank: ($('#hb-opt-blank').prop('checked')) ? ' target="_blank" rel="noopener"' : '',
      users: ($('#hb-opt-users').prop('checked')) ? true : false,
      alt: alt,
      isFirst: isFirst
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
        console.log('focus!');
        if (!self.option.isFirst) {
          $('#result-html').focus();
        }
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
 * localStorage関連の処理
 */
var lsControl = {
  /**
   * ユーザーの設定値をlocalStorageに保存する
   */
  saveStorage: function() {
    var userSettings = {
      // URL入力欄
      hbUrl: $('#hb-url').val(),

      // 新しいタブで開くか
      hbOptBlank: $('#hb-opt-blank').prop('checked'),

      // ブックマーク数を表示するか
      hbOptUsers: $('#hb-opt-users').prop('checked'),

      // 画像のalt属性
      hbOptAlt: $('#hb-opt-alt').val()
    };
    localStorage.setItem('sutaraSample2HatebuUserSettings', JSON.stringify(userSettings));
  },
  /**
   * localStorageの値を元に、ユーザーの設定値を復元する
   */
  restoreStorage: function() {
    var userSettings = JSON.parse(localStorage.getItem('sutaraSample2HatebuUserSettings'));

    // localStorageに適切な値がなければ終了
    if (!userSettings || typeof userSettings != 'object') {
      return;
    }

    // URL入力欄
    $('#hb-url').val(userSettings.hbUrl);

    // 新しいタブで開くか
    $('#hb-opt-blank').prop('checked', userSettings.hbOptBlank);

    // ブックマーク数を表示するか
    $('#hb-opt-users').prop('checked', userSettings.hbOptUsers);

    // 画像のalt属性
    $('#hb-opt-alt').val(userSettings.hbOptAlt);
  }
};

// ページ読み込み後に実行する。
$(function() {
  // ユーザーの入力値を復元
  lsControl.restoreStorage();

  // 入力欄がフォーカスされたら、選択状態にする。
  $('.js-input').on('focus', function() {
    $(this).select();
  });

  // ボタンをクリックしたらリンクを取得する。
  $('#user-input').on('submit', function(ev) {
    ev.preventDefault(); // 必須。これがないとページが延々とリロードされる。
    lsControl.saveStorage(); // 入力値を保存
    hatebu.init(); // はてブ数取得処理
  });
  hatebu.init(true); // 読み込み後、1回だけ実行
});