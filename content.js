let lasturl = location.href; // 儲存上次的網址

function clickButtonOnce() {
    const errorWrapper = document.querySelector("#error-wrapper");
    // 確認警告頁面是否隱藏
    if (errorWrapper && errorWrapper.style.display == "none") {
        console.log("警告頁面隱藏，跳過自動點擊");
        return; // 如果警告頁面隱藏，直接跳出
    }

    const buttons = document.querySelectorAll("button");
    for (const button of buttons) {
        if (
            button.innerText.includes("我瞭解並希望繼續觀看") &&
            !button.disabled
        ) {
            console.log("自動點擊按鈕：我瞭解並希望繼續觀看");
            button.click();
            break; // 點一次就跳出，不再繼續找
        }
    }
}

function onPageChanged() {
    console.log("網址變更，重新檢測按鈕");
    setTimeout(() => {
        clickButtonOnce();
    }, 2000); // 延遲兩秒再點擊
}

function observeUrlChange() {
    const observer = new MutationObserver(() => {
        if (location.href !== lasturl) {
            lasturl = location.href; // 更新網址
            onPageChanged(); // 網址變更時執行
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

// 使用 popstate 和 pushState 監聽 URL 變化
function monitorHistoryChanges() {
    const originalPushState = history.pushState;
    history.pushState = function (...args) {
        originalPushState.apply(this, args);
        onPageChanged();
    };

    window.addEventListener("popstate", () => {
        onPageChanged();
    });
}

// 等待頁面載入完成，再延遲兩秒
window.addEventListener("load", () => {
    setTimeout(() => {
        clickButtonOnce();
    }, 2000);

    observeUrlChange();
    monitorHistoryChanges();
});