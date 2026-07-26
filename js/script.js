document.addEventListener('DOMContentLoaded', () => {

    fetch(`json/news-data.json?cache=${new Date().getTime()}`)
        .then(response => response.json())
        .then(data => {
            const listContainer = document.getElementById('news-list-container');
            const loadMoreBtn = document.getElementById('load-more-btn');

            if (!listContainer) return;
            listContainer.innerHTML = '';

            // 画面幅が768px以下ならスマホと判定し、初期表示・追加件数を3件、それ以外は5件
            const isMobile = window.innerWidth <= 768;
            const displayCount = isMobile ? 3 : 5;

            // 新しい順に表示
            data.reverse().forEach((item, index) => {
                const li = document.createElement('li');
                li.className = 'news-item';

                // 初期表示件数を超えたものは非表示
                if (index >= displayCount) {
                    li.classList.add('is-hidden');
                }

                // URLがある場合のみリンク化
                const titleHtml = item.url
                    ? `<a href="${item.url}" class="news-link">${item.title}</a>`
                    : `<span class="news-title">${item.title}</span>`;

                li.innerHTML = `
                    <span class="news-date">${item.date}</span>
                    ${titleHtml}
                `;

                listContainer.appendChild(li);
            });

            // 初期状態でボタンの表示/非表示を決定
            if (loadMoreBtn) {
                if (data.length <= displayCount) {
                    loadMoreBtn.classList.add('is-hidden');
                } else {
                    loadMoreBtn.classList.remove('is-hidden');
                }

                // 「もっと見る」ボタン
                loadMoreBtn.addEventListener('click', () => {
                    const hiddenItems = listContainer.querySelectorAll('.news-item.is-hidden');

                    // displayCount件ずつ表示
                    for (let i = 0; i < Math.min(displayCount, hiddenItems.length); i++) {
                        hiddenItems[i].classList.remove('is-hidden');
                    }

                    // 全て表示されたらボタンを隠す
                    if (listContainer.querySelectorAll('.news-item.is-hidden').length === 0) {
                        loadMoreBtn.classList.add('is-hidden');
                    }
                });
            }
        })
        .catch(error => console.error('データの読み込みに失敗しました:', error));

});