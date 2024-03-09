const axios = require('axios');

// Önceden alınmış ürün bilgilerini saklamak için bir değişken
let previousProductIds = [];

// Discord Webhook URL
const webhookUrl = '';

// Yeni ürün tespit edildiğinde bu fonksiyon çağrılır
function sendNotification(product) {
    const message = {
        content: `Yeni ürün eklendi: ${product.name}\nURL: https://www.piccolo.com.tr${product.url}\nFotoğraf: ${product.imageThumbPath}`
    };

    axios.post(webhookUrl, message)
        .then(response => {
            console.log('Webhook response:', response.data);
        })
        .catch(error => {
            console.error('Error sending webhook:', error);
        });
}

async function getProductList() {
    try {
        const response = await axios.get('https://www.piccolo.com.tr/api/product/GetProductList?c=trtry0000&FilterJson={"CategoryIdList":[64],"BrandIdList":[],"SupplierIdList":[],"TagIdList":[],"TagId":-1,"FilterObject":[],"MinStockAmount":0,"IsShowcaseProduct":-1,"IsOpportunityProduct":-1,"FastShipping":-1,"IsNewProduct":-1,"IsDiscountedProduct":-1,"IsShippingFree":-1,"IsProductCombine":-1,"MinPrice":0,"MaxPrice":0,"Point":0,"SearchKeyword":"","StrProductIds":"","IsSimilarProduct":false,"RelatedProductId":0,"ProductKeyword":"","PageContentId":0,"StrProductIDNotEqual":"","IsVariantList":-1,"IsVideoProduct":-1,"ShowBlokVideo":-1,"VideoSetting":{"ShowProductVideo":-1,"AutoPlayVideo":-1},"ShowList":1,"VisibleImageCount":0,"ShowCounterProduct":-1,"ImageSliderActive":false,"ProductListPageId":0,"ShowGiftHintActive":false,"IsInStock":true,"IsPriceRequest":true,"IsProductListPage":true,"NonStockShowEnd":1}&PagingJson={"PageItemCount":0,"PageNumber":1,"OrderBy":"KATEGORISIRA","OrderDirection":"ASC"}&CreateFilter=false&TransitionOrder=0&PageType=1&PageId=64');
        
        // Yeni ürünlerin kontrol edilmesi
        response.data.products.forEach(product => {
            if (!previousProductIds.includes(product.productId)) {
                sendNotification(product);
                previousProductIds.push(product.productId);
            }
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

// Belirli aralıklarla API'yi kontrol etmek için bir zamanlayıcı
setInterval(getProductList, 60000); // 60 saniye (1 dakika)

// Başlangıçta ürün listesini al
getProductList();
