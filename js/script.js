document.addEventListener('DOMContentLoaded', () => {

    fetch(`json/news-data.json?cache=${new Date().getTime()}`)
        .then(response => response.json())
        .then(data => {
            const listContainer = document.getElementById('news-list-container');
            const loadMoreBtn = document.getElementById('load-more-btn');

            if (!listContainer) return;
            listContainer.innerHTML = '';

            // 【追加】画面幅が768px以下ならスマホと判定し、初期表示・追加件数を「3」、それ以外は「5」にする
            const isMobile = window.innerWidth <= 768;
            const displayCount = isMobile ? 3 : 5;

            // 全てのお知らせを生成して、指定件数（3件または5件）目以降は隠しておく
            data.reverse().forEach((item, index) => {
                const li = document.createElement('li');
                li.className = 'news-item';

                // スマホなら4件目（インデックス3）、PCなら6件目（インデックス5）以降に「is-hidden」をつける
                if (index > (displayCount - 1)) {
                    li.classList.add('is-hidden');
                }

                li.innerHTML = `
                    <span class="news-date">${item.date}</span>
                    <span class="news-title">${item.title}</span>
                `;
                listContainer.appendChild(li);
            });

            // 最初からお知らせが指定件数（3件または5件）以下ならボタンを非表示にする
            if (data.length <= displayCount) {
                if (loadMoreBtn) loadMoreBtn.classList.add('is-hidden');
            } else {
                if (loadMoreBtn) loadMoreBtn.classList.remove('is-hidden');
            }

            // 「もっと見る」ボタンが押されたときの動き（スマホなら3件、PCなら5件ずつ出す）
            if (loadMoreBtn) {
                loadMoreBtn.addEventListener('click', () => {
                    // 現在隠れている（is-hiddenがついている）記事をすべて取得
                    const hiddenItems = listContainer.querySelectorAll('.news-item.is-hidden');

                    // 隠れている記事のうち、指定件数（3件または5件）だけクラスを外して表示する
                    for (let i = 0; i < Math.min(displayCount, hiddenItems.length); i++) {
                        hiddenItems[i].classList.remove('is-hidden');
                    }

                    // まだ隠れている記事があるか再チェックし、無くなったらボタンを消す
                    const remainingHidden = listContainer.querySelectorAll('.news-item.is-hidden');
                    if (remainingHidden.length === 0) {
                        loadMoreBtn.classList.add('is-hidden');
                    }
                });
            }
        })
        .catch(error => console.error('データの読み込みに失敗しました:', error));
});