document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle'); // HTMLのid名に合わせる
    const navLinks = document.querySelectorAll('.header-right a');

    if (!menuToggle) return;

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // クリックされたリンクのhrefが「#」で始まっているかチェック
            const href = link.getAttribute('href');
            if (href && (href.startsWith('#') || href.includes('#'))) {
                // チェックボックスのチェックを外してメニューを閉じる
                menuToggle.checked = false;
            }
        });
    });
});