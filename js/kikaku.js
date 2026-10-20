// --- 初期設定 ---
const container = document.getElementById("eventsContainer");

const modal = document.getElementById("modal");
const closeModal = document.getElementById("closeModal");
const modalSlideTrack = document.getElementById("modalSlideTrack");
const modalInfoTable = document.getElementById("modalInfoTable");

// HTMLで指定されたJSONファイルのパス
const eventsSrc = container.dataset.eventsSrc;

// --- モーダルタイトル ---
const modalTitle = document.createElement("h2");
modalTitle.id = "modalTitle";
modalTitle.style.margin = "10px 0";
modalTitle.style.fontSize = "1.3em";
modalTitle.style.textAlign = "center";

modal.querySelector(".modal-content")
    .insertBefore(modalTitle, modalInfoTable);

// --- JSON読み込み ---
async function loadEvents() {
    try {
        const response = await fetch(eventsSrc);

        if (!response.ok) {
            throw new Error(
                `JSON読み込み失敗: ${response.status}`
            );
        }

        const events = await response.json();

        if (!Array.isArray(events)) {
            throw new Error("JSONの形式が配列ではありません");
        }

        createCards(events);

    } catch (error) {
        console.error("企画データの読み込みに失敗しました:", error);
        container.textContent = "企画情報を読み込めませんでした。";
    }
}

// --- カード生成 ---
function createCards(events) {
    // ジャンルごとにグループ化
    const genres = {};

    events.forEach(e => {
        const genre = e.genre || "その他";

        if (!genres[genre]) {
            genres[genre] = [];
        }

        genres[genre].push(e);
    });

    // ジャンルごとにカード生成

    Object.keys(genres).forEach(genre => {
        // ジャンル全体のセクション
        const section = document.createElement("section");
        section.className = "genre-section";

        // ジャンル見出し
        const title = document.createElement("h2");
        title.textContent = genre;
        title.className = "genre-title";
        section.appendChild(title);

        // カード一覧
        const grid = document.createElement("div");
        grid.className = "grid";
        section.appendChild(grid);

        genres[genre].forEach(e => {
            const card = document.createElement("div");
            card.className = "card";

            const src = getImageSrc(e.image);

            if (src) {
                const slide = document.createElement("div");
                slide.className = "slide-container";

                const img = document.createElement("img");
                img.src = src;
                img.alt = e.title || "";

                slide.appendChild(img);
                card.appendChild(slide);
            }

            const info = document.createElement("div");
            info.className = "info";

            const heading = document.createElement("h3");
            heading.textContent = e.title || "";

            info.appendChild(heading);
            card.appendChild(info);

            card.addEventListener("click", () => openModal(e));
            grid.appendChild(card);
        });

        container.appendChild(section);
    });

}

// --- 画像パス取得 ---
function getImageSrc(image) {
    if (Array.isArray(image)) {
        return image[0] || "";
    }

    return typeof image === "string" ? image : "";
}

// --- モーダル表示 ---
function openModal(e) {
    modal.style.display = "flex";

    // 画像表示
    modalSlideTrack.replaceChildren();

    const src = getImageSrc(e.image);

    if (src) {
        const img = document.createElement("img");
        img.src = src;

        img.onerror = () => {
            img.remove();
        };

        modalSlideTrack.appendChild(img);
    }

    // タイトル表示
    modalTitle.textContent = e.title || "";

    // 表を生成
    modalInfoTable.replaceChildren();

    const table = document.createElement("table");

    const rows = [
        ["団体", e.organization],
        ["場所", e.place],
        ["時間", e.time],
        ["URL", e.link],
        ["紹介", e.intro]
    ];

    rows.forEach(([label, value]) => {
        // 空欄は表示しない
        if (
            value == null ||
            ["", "—", "－", "ー"].includes(
                String(value).trim()
            )
        ) {
            return;
        }

        const tr = document.createElement("tr");
        const th = document.createElement("th");
        const td = document.createElement("td");

        th.textContent = label;

        if (label === "URL") {
            const link = document.createElement("a");
            link.href = String(value);
            link.textContent = String(value);
            link.target = "_blank";
            link.rel = "noopener noreferrer";

            td.appendChild(link);
        } else if (label === "紹介") {
            // 改行を維持する
            td.style.whiteSpace = "pre-line";
            td.textContent = String(value).replace(/\\n/g, "\n");
        } else {
            td.textContent = String(value);
        }

        tr.append(th, td);
        table.appendChild(tr);
    });

    modalInfoTable.appendChild(table);
}

// --- モーダルを閉じる ---
function closeModalFunc() {
    modal.style.display = "none";
}

closeModal.addEventListener("click", closeModalFunc);

modal.addEventListener("click", e => {
    if (e.target === modal) {
        closeModalFunc();
    }
});

// --- 実行 ---
loadEvents();