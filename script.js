document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('orderFile');
    const uploadButton = document.getElementById('uploadButton');
    const resultsDiv = document.getElementById('results');

    // --- ❗❗❗ 最重要的設定 ❗❗❗ ---
    // 當您未來部署好後端後，請將這裡換成您後端的真實網址
    const BACKEND_URL = 'missfoodietw.pythonanywhere.com/upload'; 

    uploadButton.addEventListener('click', async () => {
        if (!fileInput.files || fileInput.files.length === 0) {
            alert('請先選擇一個訂單檔案！');
            return;
        }

        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append('order_file', file);

        // 顯示處理中...
        resultsDiv.classList.remove('hidden');
        resultsDiv.innerHTML = '<h2>正在為您產生清單，請稍候...</h2>';
        uploadButton.disabled = true;

        try {
            const response = await fetch(BACKEND_URL, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                // 如果後端回報錯誤，顯示錯誤訊息
                const errorText = await response.text();
                throw new Error(`後端處理失敗: ${errorText}`);
            }

            // 成功！後端應該會回傳一個 JSON 物件
            const data = await response.json();
            
            // 將 JSON 資料格式化成漂亮的 HTML 表格來顯示
            displayResults(data);

        } catch (error) {
            resultsDiv.innerHTML = `<h2>發生錯誤</h2><p>${error.message}</p><p>請檢查您的後端服務是否正常運行，或聯繫管理員。</p>`;
        } finally {
            uploadButton.disabled = false;
        }
    });

    function displayResults(data) {
        let html = '<h2>採購清單</h2>';

        // 遍歷後端回傳的每一個店家
        for (const store in data) {
            html += `<h3>🛒 店家: ${store}</h3>`;
            html += '<table border="1" cellpadding="5" cellspacing="0" width="100%">';
            html += '<tr><th>商品名稱</th><th>規格</th><th>數量</th></tr>';
            
            // 遍歷該店家的每一個商品
            data[store].forEach(item => {
                html += `<tr>
                            <td>${item['商品名稱']}</td>
                            <td>${item['規格']}</td>
                            <td>${item['數量']}</td>
                         </tr>`;
            });
            html += '</table>';
        }
        resultsDiv.innerHTML = html;
    }
});
