"use strict";

const sourceUrl = "https://qr.finedinemenu.com/cikolata-evim-2/menu/69d0222b0dbc4f83db49c74f";
const chocolateSourceUrl = "https://qr.finedinemenu.com/cikolata-evim-2/menu/69d022330dbc4f83db49c97e";
const mediaUrl = "https://media.finedinemenu.com/filters:strip_exif()/filters:format(webp)/592x0/";
const pageSize = 18;
const storageKey = "cikolata-evim.v1";
const maxQuantity = 30;
const $ = (selector) => document.querySelector(selector);

const copy = {
  tr: {
    skip:"Menüye geç",menu:"Menü",moodsNav:"Ruh haline göre",pairNav:"Tatlı eşleşmeler",cart:"Sepet",
    heroKicker:"BELÇİKA ÇİKOLATASI",hero1:"Bir dünya",hero2:"mutluluk.",heroText:"Tatlı ve kahveyle küçük bir mola.",
    explore:"Menüyü keşfet",heroAdd:"Sepete ekle",moodTitle:"Bugün modun nasıl?",clearMood:"Seçimi kaldır",
    menuTitle:"Kafe menüsü",chocolateTitle:"Çikolatalarımız", all:"Tümü",cafe:"Kafe",chocolate:"Çikolata",search:"Menüde ara",favorites:"Favoriler",
    categories:"Kategoriler",views:"Görünüm",feed:"Akış",photo:"Fotoğraf",list:"Liste",pair:"Eşleşmeler",more:"Daha fazla göster",
    demo:"Bağımsız menü demosu",source:"Orijinal QR menü",items:"ürün",pairs:"eşleşme",empty:"Bu seçimle eşleşen ürün bulunamadı.",reset:"Filtreleri sıfırla",
    noPrice:"Fiyatı sorun",confirmAtCafe:"Fiyatı veya ürün seçeneğini personelden teyit edin.",soldByWeight:"Tartılarak satılır. Menüdeki ölçüyü ve fiyatı personelden teyit edin.",
    add:"Sepete ekle",options:"Seçenekleri gör",option:"Seçeneğini seç",open:"Ürün detayları",close:"Kapat",save:"Favorilere ekle",unsave:"Favorilerden çıkar",
    added:"Sepete eklendi",pairAdded:"İkisi de sepete eklendi",limit:"Ürün başına en fazla 30 adet eklenebilir.",removeOne:"Bir adet azalt",addOne:"Bir adet artır",
    emptyCart:"Sepetin boş. Menüden bir tatlı veya içecek seçebilirsin.",total:"Toplam",suitable:"Yanında iyi gider",reviewCart:"Sepeti gör",
    addPair:"İkisini ekle",staff:"Personel için listeyi aç",staffNote:"Sipariş ve ödeme kafede.",copyOrder:"Listeyi kopyala",copied:"Liste kopyalandı",
    fulfillment:"Servis tercihi",here:"Kafede",takeaway:"Paket",share:"Ürünü paylaş",linkCopied:"Bağlantı kopyalandı",copyLink:"Ürün bağlantısını kopyala",
    pick:["Çilek zamanı","Kahve molası","Serinle","Kutlama"],pickNote:["Meyveli & çikolatalı","Sıcak & yumuşak","Buzlu & ferah","Paylaşmalık tatlar"],
    pairNames:["Klasik mola","Çilekli serinlik","Çikolata ve kahve","Çıtır ve buzlu","Birlikte daha güzel","Fıstıklı mola"],
    ingredients:"Menüdeki açıklama (Türkçe)", itemLink:"QR menüde aç"
  },
  ru: {
    skip:"Перейти к меню",menu:"Меню",moodsNav:"По настроению",pairNav:"Вкусные пары",cart:"Корзина",
    heroKicker:"БЕЛЬГИЙСКИЙ ШОКОЛАД",hero1:"Целый мир",hero2:"счастья.",heroText:"Пауза для десерта и кофе.",
    explore:"Смотреть меню",heroAdd:"Добавить",moodTitle:"Какое сегодня настроение?",clearMood:"Сбросить",
    menuTitle:"Меню кафе",chocolateTitle:"Шоколад и подарки",all:"Все",cafe:"Кафе",chocolate:"Шоколад",search:"Поиск по меню",favorites:"Избранное",
    categories:"Категории",views:"Режим меню",feed:"Лента",photo:"Фото",list:"Список",pair:"Пары",more:"Показать ещё",
    demo:"Независимая демоверсия меню",source:"Исходное QR-меню",items:"позиций",pairs:"сочетаний",empty:"По этим фильтрам ничего не нашлось.",reset:"Сбросить фильтры",
    noPrice:"Уточнить цену",confirmAtCafe:"Уточни цену или вариант у персонала.",soldByWeight:"Продаётся на вес. Уточни единицу и цену у персонала.",
    add:"В корзину",options:"Выбрать вариант",option:"Выбери вариант",open:"Открыть карточку",close:"Закрыть",save:"В избранное",unsave:"Убрать из избранного",
    added:"Добавлено в корзину",pairAdded:"Обе позиции в корзине",limit:"Можно добавить до 30 единиц каждой позиции.",removeOne:"Уменьшить на одну",addOne:"Увеличить на одну",
    emptyCart:"Корзина пока пуста. Выбери десерт или напиток в меню.",total:"Итого",suitable:"Подойдёт к заказу",reviewCart:"К корзине",
    addPair:"Добавить оба",staff:"Показать список персоналу",staffNote:"Заказ и оплата в кафе.",copyOrder:"Скопировать список",copied:"Список скопирован",
    fulfillment:"Как подать",here:"В кафе",takeaway:"С собой",share:"Поделиться позицией",linkCopied:"Ссылка скопирована",copyLink:"Скопируй ссылку на позицию",
    pick:["Клубничное","Кофейная пауза","Освежиться","Праздник"],pickNote:["Ягоды и шоколад","Тёплое и уютное","Со льдом и свежестью","Чтобы поделиться"],
    pairNames:["Классическая пауза","Ягодная свежесть","Шоколад и кофе","Хруст и лёд","На двоих","Фисташковая пауза"],
    ingredients:"Описание из меню (на турецком)",itemLink:"Открыть в QR-меню"
  },
  en: {
    skip:"Skip to menu",menu:"Menu",moodsNav:"By mood",pairNav:"Sweet pairings",cart:"Basket",
    heroKicker:"BELGIAN CHOCOLATE",hero1:"A world of",hero2:"happiness.",heroText:"A little break for dessert and coffee.",
    explore:"Explore the menu",heroAdd:"Add to basket",moodTitle:"What's your mood today?",clearMood:"Clear mood",
    menuTitle:"Café menu",chocolateTitle:"Chocolates & gifts",all:"All",cafe:"Café",chocolate:"Chocolate",search:"Search the menu",favorites:"Favorites",
    categories:"Categories",views:"Menu view",feed:"Feed",photo:"Photos",list:"List",pair:"Pairs",more:"Show more",
    demo:"Independent menu demo",source:"Original QR menu",items:"items",pairs:"pairings",empty:"No products match these filters.",reset:"Reset filters",
    noPrice:"Ask for price",confirmAtCafe:"Check the price or available options with staff.",soldByWeight:"Sold by weight. Ask staff to confirm the unit and price.",
    add:"Add to basket",options:"Choose option",option:"Choose an option",open:"View product details",close:"Close",save:"Add to favorites",unsave:"Remove from favorites",
    added:"Added to basket",pairAdded:"Both items added",limit:"You can add up to 30 of each item.",removeOne:"Remove one",addOne:"Add one",
    emptyCart:"Your basket is empty. Choose a dessert or drink from the menu.",total:"Total",suitable:"Goes well with your basket",reviewCart:"View basket",
    addPair:"Add both",staff:"Show list to staff",staffNote:"Order and pay at the café.",copyOrder:"Copy the list",copied:"List copied",
    fulfillment:"Service preference",here:"Dine in",takeaway:"Takeaway",share:"Share item",linkCopied:"Link copied",copyLink:"Copy the item link",
    pick:["Berry mood","Coffee break","Cool down","Celebrate"],pickNote:["Berries & chocolate","Warm & mellow","Icy & refreshing","Made for sharing"],
    pairNames:["Classic break","Berry refresh","Chocolate & coffee","Crisp & iced","Better together","Pistachio break"],
    ingredients:"Menu description (Turkish)",itemLink:"Open in QR menu"
  }
};

const categoryNames = {
  ru:["Десерты в стакане","Вафли","Десерты","Круассаны","Профитроли","Фирменные десерты","Мороженое","Горячие напитки","Холодные напитки","Добавки","Упакованные товары","Фирменный шоколад","Шоколад к празднику","Мадлен","Сладкие снеки","Шоколадные пасты","Шоколадные диски","Подарочная коллекция","Особые поводы","Коллекция для новорождённых","Подарочные корзины","Одеколон"],
  en:["Dessert cups","Waffles","Desserts","Croissants","Profiteroles","Signature desserts","Ice cream","Hot drinks","Cold drinks","Extras","Packaged products","Signature chocolate","Celebration chocolates","Madlen","Chocolate snacks","Chocolate spreads","Chocolate discs","Presentation collection","Special occasions","Newborn collection","Gift baskets","Cologne"]
};

const paths = {
  bag:'<path d="M5 8h14l1 13H4L5 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/>',
  spark:'<path d="M12 2v5m0 10v5M2 12h5m10 0h5M5 5l3.5 3.5m7 7L19 19m0-14-3.5 3.5m-7 7L5 19"/>',
  arrow:'<path d="M4 12h15m-6-6 6 6-6 6"/>',
  heart:'<path d="M20.8 8.4c0 4.3-8.8 9.6-8.8 9.6s-8.8-5.3-8.8-9.6a4.4 4.4 0 0 1 8.8-1 4.4 4.4 0 0 1 8.8 1Z"/>',
  search:'<circle cx="10.8" cy="10.8" r="6.3"/><path d="m15.5 15.5 4 4"/>',
  external:'<path d="M13 5h6v6m0-6-9 9m7-1v6H5V7h6"/>',
  feed:'<rect x="4" y="4" width="16" height="7" rx="1"/><rect x="4" y="14" width="16" height="6" rx="1"/>',
  menu:'<rect x="5" y="3.5" width="14" height="17" rx="2"/><path d="M9 8h6m-6 4h6m-6 4h4"/>',
  photo:'<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 15l4-4 4 4 3-3 5 5"/><circle cx="15" cy="8" r="1"/>',
  list:'<path d="M9 6h11M9 12h11M9 18h11M4 6h1M4 12h1M4 18h1"/>',
  pair:'<circle cx="9" cy="12" r="5.5"/><circle cx="15" cy="12" r="5.5"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  minus:'<path d="M5 12h14"/>',
  close:'<path d="m6 6 12 12M6 18 18 6"/>',
  globe:'<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17m-8.5-8.5c5 4 5 13 0 17-5-4-5-13 0-17Z"/>',
  share:'<path d="M12 15V3m-4 4 4-4 4 4M6 10H4v10h16V10h-2"/>'
};

const icons = (name) => `<svg aria-hidden="true" viewBox="0 0 24 24">${paths[name]}</svg>`;
const escape = (value) => String(value).replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
const money = (cents, locale = state.lang) => "₺" + new Intl.NumberFormat({tr:"tr-TR",ru:"ru-RU",en:"en-GB"}[locale], {minimumFractionDigits:cents % 100 ? 2 : 0,maximumFractionDigits:2}).format(cents / 100);
const safeRead = () => {
  try { return JSON.parse(localStorage.getItem(storageKey)) || {}; } catch { return {}; }
};
const menu = SOURCE_MENU.products.map(([id,name,category,description,prices,image,options,byWeight,local]) => {
  const choices = byWeight ? [] : options.length ? options : prices.length === 1 ? [["",prices[0]]] : [];
  return {id,name,category,description,prices,photo:mediaUrl + image,image:local ? `assets/${id}.webp` : mediaUrl + image,choices,byWeight};
});
const byId = new Map(menu.map((p)=>[p.id,p]));
const byName = new Map(menu.map((p)=>[p.name,p]));
const featured = ["Begonya","Grand Rocher Cup","Açelya (Büyük Boy)","Myra Dubai Cup (Büyük Boy)","Croccante","Iced Latte"].map((name)=>byName.get(name));
const moods = {
  berry:["Begonya","Gelincik (Küçük Boy)","Myra Profiterol (Antep Fıstıklı)","Violette Kek Cup","Çilek Frozen","Çilekli Limonata","Çikolata Kaplı Çilek","Çilekli Sıcak Çikolata"],
  cozy:["Myra Sufle","Capuccino","Myra Sebastian","Myra Lotus Cup","Caffe Latte","Sıcak Çikolata","Bucak Salebi","Kruvasan (Lotus Kremalı)"],
  fresh:["Refresh Green Cooler","Iced Latte","Affogato","Cup Dondurma","Klasik Limonata","Nane Limon Frozen","Apple Ice Cooler","Dondurma"],
  party:["Myra Hediye Box","Fondü","Pinata","Açelya (Büyük Boy)","Myra Dubai Cup (Büyük Boy)","Belçika Çikolatalı Yaş Pasta (4 Kişilik)","Grand Rocher","Myra Rainbow"]
};
const pairings = [
  ["Açelya (Küçük Boy)","Capuccino","cozy"],
  ["Begonya","Çilek Frozen","berry"],
  ["Grand Rocher Cup","Caffe Latte","cozy"],
  ["Kruvasan (Lotus Kremalı)","Iced Latte","fresh"],
  ["Fondü","Klasik Limonata","party"],
  ["Myra Dubai Cup (Büyük Boy)","Refresh Green Cooler","party"]
].map(([first,second,mood])=>({products:[byName.get(first),byName.get(second)],mood}));

const params = new URLSearchParams(location.search);
const stored = safeRead();
const validView = (view) => ["feed","photo","list","pair"].includes(view);
const validLang = (lang) => typeof lang === "string" && Object.hasOwn(copy,lang);
const validMood = (mood) => mood === "all" || Object.hasOwn(moods,mood);
const validCategory = (category) => Number.isInteger(category) && Boolean(SOURCE_MENU.categories[category]);
const validCollection = (collection) => collection === "cafe" || collection === "chocolate";
const state = {
  lang:[params.get("lang"),stored.lang].find(validLang) || "tr",
  view:[params.get("view"),stored.view].find(validView) || "feed",
  mood:[params.get("mood"),stored.mood].find(validMood) || "all",
  collection:validCollection(params.get("collection")) ? params.get("collection") : "cafe",
  category:params.has("category") && validCategory(Number(params.get("category"))) ? Number(params.get("category")) : "all",
  query:"",savedOnly:false,limit:pageSize,
  saved:new Set(Array.isArray(stored.saved) ? stored.saved.filter((id)=>byId.has(id)) : []),
  cart:{},detail:null,option:0,staff:false,service:stored.service==="takeaway" ? "takeaway" : "here"
};
if (state.category !== "all") state.collection = SOURCE_MENU.categories[state.category][1];
const itemKey = (id, index) => `${id}.${index}`;

for (const [key, quantity] of Object.entries(stored.cart || {})) {
  const [id,index] = key.split(".");
  if (String(Number(index)) === index && byId.get(id)?.choices[index] && Number.isInteger(quantity) && quantity > 0) {
    state.cart[key] = Math.min(quantity,maxQuantity);
  }
}
const t = (key) => copy[state.lang][key];
const categoryName = (index) => categoryNames[state.lang]?.[index] ?? SOURCE_MENU.categories[index][0];
const normalized = (s) => s.toLocaleLowerCase("tr").normalize("NFKD").replace(/\p{Diacritic}/gu,"").replaceAll("ı","i");
let toastTimer;
function notify(message) {
  clearTimeout(toastTimer);
  $("#toast").textContent = message;
  toastTimer = setTimeout(()=> { $("#toast").textContent = ""; },1900);
}
function persist() {
  try {
    localStorage.setItem(storageKey, JSON.stringify({lang:state.lang,view:state.view,mood:state.mood,cart:state.cart,saved:[...state.saved],service:state.service}));
  } catch { /* Current selections remain available for this visit. */ }
}
function syncUrl() {
  const url = new URL(location.href);
  for (const key of ["lang","view","mood","category","collection"]) url.searchParams.set(key,state[key]);
  if (state.category === "all") url.searchParams.delete("category");
  if (state.mood === "all") url.searchParams.delete("mood");
  if (state.collection === "cafe") url.searchParams.delete("collection");
  history.replaceState(null,"",url);
}
function img(product, alt = "", eager = false) {
  const src = escape(product.image);
  const fallback = product.image === product.photo ? "" : ` data-image-fallback="${escape(product.photo)}"`;
  return `<img src="${src}" alt="${escape(alt)}" width="592" height="444" decoding="async" loading="${eager ? "eager" : "lazy"}"${fallback}>`;
}
document.addEventListener("error",(event)=>{
  const image = event.target;
  if (!(image instanceof HTMLImageElement)) return;
  if (image.dataset.imageFallback) {
    image.src = image.dataset.imageFallback;
    delete image.dataset.imageFallback;
    return;
  }
  if (image.dataset.replaced) return;
  image.dataset.replaced = "true";
  image.src = "assets/placeholder.svg";
},true);
function shownPrice(p) {
  if (p.prices.length === 0) return t("noPrice");
  const prices = p.choices.length ? p.choices.map((choice)=>choice[1]) : p.prices;
  const low = Math.min(...prices);
  const high = Math.max(...prices);
  return low === high ? money(low) : `${money(low)} – ${money(high)}`;
}
function labelAction(key, name) {
  return escape(`${t(key)} · ${name}`);
}
function moodType(id) { return Object.keys(moods).indexOf(id); }
function paintInterface() {
  document.documentElement.lang = state.lang;
  document.querySelectorAll("[data-t]").forEach((el)=> { el.textContent = t(el.dataset.t); });
  document.querySelector(".top-nav").setAttribute("aria-label",t("menu"));
  document.querySelector(".mobile-nav").setAttribute("aria-label",t("menu"));
  $("#search").placeholder = t("search");
  $("#search").setAttribute("aria-label",t("search"));
  $("#categories").setAttribute("aria-label",t("categories"));
  $("#views").setAttribute("aria-label",t("views"));
  $("#lang").value = state.lang;
  $("[data-close=basket]").setAttribute("aria-label",t("close"));
  renderHero();
  renderMenu();
  renderCart();
  if ($("#detail").open && state.detail) renderDetail();
}
function renderHero() {
  const hero = byName.get("Grand Rocher Cup");
  $("#hero-img").dataset.imageFallback = hero.photo;
  $("#hero-item").dataset.detail = hero.id;
  $("#hero-name").textContent = hero.name;
  $("#hero-add").dataset.add = hero.id;
  $("#hero-add").setAttribute("aria-label",`${t("heroAdd")} · ${hero.name} · ${money(hero.choices[0][1])}`);
  $("#hero-price").textContent = money(hero.choices[0][1]);
}
function renderMood() {
  document.documentElement.dataset.mood = state.mood;
  $(".clear-mood").hidden = state.mood === "all";
  const focused = document.activeElement?.dataset.moodChoice;
  $("#mood-options").innerHTML = Object.entries(moods).map(([id,items])=>{
    const i = moodType(id);
    return `<button type="button" class="mood" data-mood-choice="${id}" aria-pressed="${state.mood===id}">
      <span><strong>${t("pick")[i]}</strong><small>${t("pickNote")[i]}</small></span>${img(byName.get(items[0]))}</button>`;
  }).join("");
  if (focused && focused !== "all") $(`.mood[data-mood-choice="${focused}"]`)?.focus({preventScroll:true});
}
function renderFilters() {
  const focus = document.activeElement?.dataset;
  const button = (kind,value,label,active)=>`<button type="button" data-${kind}="${value}" aria-pressed="${active}">${escape(label)}</button>`;
  $("#categories").innerHTML = `
    ${button("collection","cafe",t("cafe"),!state.savedOnly && state.collection==="cafe")}
    ${button("collection","chocolate",t("chocolate"),!state.savedOnly && state.collection==="chocolate")}
    ${button("category","all",t("all"),state.category==="all")}
    ${SOURCE_MENU.categories.map(([,collection],index)=> collection === state.collection ? button("category",index,categoryName(index),state.category===index) : "").join("")}`;
  $("#views").innerHTML = ["feed","photo","list","pair"].map((view)=>
    `<button type="button" data-view="${view}" aria-pressed="${state.view===view}">${icons(view)}<span>${t(view)}</span></button>`).join("");
  $("#menu-title").textContent = state.savedOnly ? t("favorites") : state.view==="pair" ? t("pairNav") : state.collection==="cafe" ? t("menuTitle") : t("chocolateTitle");
  $("#save-filter").setAttribute("aria-pressed",state.savedOnly);
  for (const key of ["category","collection","view"]) {
    if (focus?.[key] !== undefined) $(`[data-${key}="${focus[key]}"]`)?.focus({preventScroll:true});
  }
}
function matchesQuery(p) {
  const query = normalized(state.query.trim());
  return !query || normalized([p.name,p.description,categoryName(p.category),SOURCE_MENU.categories[p.category][0]].join(" ")).includes(query);
}
function matchesOtherFilters(product) {
  return (state.category === "all" || product.category === state.category) && matchesQuery(product)
    && (!state.savedOnly || state.saved.has(product.id));
}
function productCard(p) {
  const isSaved = state.saved.has(p.id);
  const addAttrs = p.choices.length === 1 ? `data-add="${p.id}" aria-label="${labelAction("add",p.name)}"`
    : `data-detail="${p.id}" aria-label="${labelAction("options",p.name)}"`;
  return `<article class="product">
    <button type="button" class="product-media" data-detail="${p.id}" aria-label="${labelAction("open",p.name)}">${img(p)}</button>
    <button type="button" class="icon-button favorite" data-favorite="${p.id}" aria-pressed="${isSaved}" aria-label="${labelAction(isSaved ? "unsave" : "save",p.name)}">${icons("heart")}</button>
    <div class="product-body">
     <button type="button" class="product-name" data-detail="${p.id}">${escape(p.name)}</button>
     <span class="product-price">${shownPrice(p)}</span>
     <button type="button" class="add" ${addAttrs}>${icons(p.choices.length===1 ? "plus" : "arrow")}</button>
     <p class="product-desc" lang="tr">${escape(p.description)}</p>
    </div>
  </article>`;
}
function renderProducts() {
  const products = state.mood === "all" ? [...featured,...menu.filter((p)=>!featured.includes(p))] : moods[state.mood].map((name)=>byName.get(name));
  const filtered = products.filter((p)=>(state.savedOnly || SOURCE_MENU.categories[p.category][1]===state.collection) && matchesOtherFilters(p));
  $("#result-count").textContent = `${filtered.length} ${t("items")}`;
  $("#more-row").hidden = filtered.length <= state.limit;
  return filtered.length ? `<div class="products ${state.view}">${filtered.slice(0,state.limit).map(productCard).join("")}</div>` : emptyResults();
}
const emptyResults = () => `<div class="empty"><p>${t("empty")}</p><button type="button" class="text-button" data-reset>${t("reset")}</button></div>`;
function renderPairs() {
  const matching = pairings.flatMap((pair,index)=>{
    const [first,second] = pair.products;
    if (state.collection !== "cafe" || (state.mood !== "all" && state.mood !== pair.mood) || ![first,second].some(matchesOtherFilters)) return [];
    return [`<article class="pair">
      <div class="pair-photos">${img(first,first.name)}${img(second,second.name)}</div>
      <div class="pair-copy"><h3>${t("pairNames")[index]}</h3>
      <p lang="tr">${escape(first.name)} + ${escape(second.name)}</p>
      <button type="button" class="primary" data-pair="${index}"><span>${t("addPair")}</span><strong>${money(first.choices[0][1]+second.choices[0][1])}</strong></button>
      </div>
    </article>`];
  });
  $("#result-count").textContent = `${matching.length} ${t("pairs")}`;
  $("#more-row").hidden = true;
  return matching.length ? `<div class="pairs">${matching.join("")}</div>` : emptyResults();
}
function renderMenu() {
  renderMood();
  renderFilters();
  const favoriteFocus = document.activeElement?.dataset.favorite;
  $("#catalog").innerHTML = state.view==="pair" ? renderPairs() : renderProducts();
  if (favoriteFocus) $("#catalog [data-favorite='" + favoriteFocus + "']")?.focus({preventScroll:true});
  renderDock();
}
function renderDock() {
  const area = $("#basket").open ? "cart" : state.savedOnly ? "saved" : state.view==="pair" ? "pair" : "menu";
  document.querySelectorAll(".mobile-nav [data-dock]").forEach((button)=> {
    if (button.dataset.dock===area) button.setAttribute("aria-current","true");
    else button.removeAttribute("aria-current");
  });
}
function renderDetail() {
  const p = byId.get(state.detail);
  const price = p.choices[state.option]?.[1];
  const isSaved = state.saved.has(p.id);
  const options = p.choices.length > 1 ? `<label class="option">${t("option")}<select id="variant" lang="tr">${p.choices.map(([name,cents],i)=>
      `<option value="${i}"${state.option===i ? " selected" : ""}>${escape(name)} · ${money(cents)}</option>`).join("")}</select></label>` : "";
  $("#detail-content").innerHTML = `<div class="detail-media">${img(p,p.name,true)}
      <div class="detail-controls">
        <button type="button" class="icon-button" data-share aria-label="${t("share")}">${icons("share")}</button>
        <button type="button" class="icon-button" data-favorite="${p.id}" aria-label="${labelAction(isSaved ? "unsave" : "save",p.name)}" aria-pressed="${isSaved}">${icons("heart")}</button>
        <button type="button" class="icon-button" data-close="detail" aria-label="${t("close")}" autofocus>${icons("close")}</button>
      </div>
    </div>
    <div class="detail-copy"><p class="eyebrow">${escape(categoryName(p.category))}</p><h2 id="detail-title" lang="tr">${escape(p.name)}</h2>
      ${p.description ? `<p><small>${t("ingredients")}</small><br><span lang="tr">${escape(p.description)}</span></p>` : ""}
      ${options}
      ${price === undefined ? `<p>${t(p.byWeight ? "soldByWeight" : "confirmAtCafe")}</p><div class="detail-foot"><strong>${shownPrice(p)}</strong></div>`
      : `<button type="button" class="primary" id="detail-add" data-add="${p.id}" data-index="${state.option}"><span>${t("add")}</span><strong>${money(price)}</strong></button>`}
      <p class="share-status" role="status" id="share-status"></p><input type="url" readonly hidden class="share-link" id="share-link" aria-label="${t("copyLink")}">
      <a class="text-button detail-foot" href="${SOURCE_MENU.categories[p.category][1] === "cafe" ? sourceUrl : chocolateSourceUrl}/detail/${p.id}" target="_blank" rel="noopener">${t("itemLink")}${icons("external")}</a>
    </div>`;
}
function cartEntries() {
  return Object.entries(state.cart).map(([key,quantity])=>{
    const [id,index] = key.split(".");
    const p = byId.get(id);
    const [option,cents] = p.choices[Number(index)];
    return {key,quantity,p,option,cents};
  });
}
function suggest(entries) {
  const ids = new Set(entries.map(({p})=>p.id));
  const hasDessert = entries.some(({p})=>p.category<7);
  const hasDrink = entries.some(({p})=>p.category===7 || p.category===8);
  if (hasDessert === hasDrink) return null;
  for (const {products:[a,b]} of pairings) {
    if (ids.has(a.id) && !ids.has(b.id)) return b;
    if (ids.has(b.id) && !ids.has(a.id)) return a;
  }
  return byName.get(hasDessert ? "Capuccino" : "Begonya");
}
function renderCart() {
  const entries = cartEntries();
  const count = entries.reduce((sum,e)=>sum+e.quantity,0);
  const total = entries.reduce((sum,e)=>sum+e.quantity*e.cents,0);
  document.querySelectorAll("[data-count]").forEach((el)=> {
    el.textContent=count;
    if (el.classList.contains("nav-count")) el.hidden = count===0;
  });
  $("#floating-cart").hidden = count === 0;
  $("#float-total").textContent = money(total);
  renderDock();
  if (!$("#basket").open) return;
  const focus = document.activeElement?.dataset;
  const scroll = $(".basket-body")?.scrollTop ?? 0;
  if (!count) {
    state.staff = false;
    $("#basket-content").innerHTML = `<div class="basket-empty"><p class="cart-note">${t("emptyCart")}</p><button type="button" class="primary cart-cta" data-dock="menu" data-browse>${t("explore")}${icons("arrow")}</button></div>`;
    if (focus?.qty) $(".cart-cta").focus({preventScroll:true});
    return;
  }
  const suggestion = suggest(entries);
  const summary = ["Çikolata Evim · Sipariş listesi",copy.tr[state.service],...entries.map(({quantity,p,cents,option})=>
    `${quantity} × ${p.name}${option ? " — " + option : ""} · ${money(quantity*cents,"tr")}`),
    "Toplam: " + money(total,"tr")].join("\n");
  const line = ({key,p,option,cents,quantity})=>`<div class="cart-line">${img(p)}
    <div><strong lang="tr">${escape(p.name)}</strong><small lang="tr">${escape(option ? option+" · " : "")}${money(cents*quantity)}</small></div>
    <div class="qty"><button type="button" data-qty="${key}" data-delta="-1" aria-label="${labelAction("removeOne",p.name)}">${icons("minus")}</button>
      <span>${quantity}</span><button type="button" data-qty="${key}" data-delta="1" aria-label="${labelAction("addOne",p.name)}"${quantity>=maxQuantity ? " disabled" : ""}>${icons("plus")}</button>
    </div></div>`;
  $("#basket-content").innerHTML = `
    <div class="basket-body">
      ${entries.map(line).join("")}
      ${suggestion ? `<div class="suggestion">${img(suggestion)}<div><p>${t("suitable")}</p><strong lang="tr">${escape(suggestion.name)}</strong></div>
      <button class="secondary" type="button" data-add="${suggestion.id}" aria-label="${labelAction("add",suggestion.name)}">+ ${money(suggestion.choices[0][1])}</button></div>` : ""}
      <fieldset class="fulfillment"><legend>${t("fulfillment")}</legend>
        ${["here","takeaway"].map((option)=>`<button type="button" class="secondary" data-service="${option}" aria-pressed="${state.service===option}">${t(option)}</button>`).join("")}
      </fieldset>
      ${state.staff ? `<div class="staff-card"><textarea rows="${Math.min(entries.length+3,8)}" lang="tr" class="cart-text" id="staff-summary" readonly aria-label="Sipariş listesi">${escape(summary)}</textarea></div>` : ""}
    </div>
    <div class="basket-footer">
      <p class="total"><strong>${t("total")}</strong><strong id="basket-total">${money(total)}</strong></p>
      <p class="cart-note">${t("staffNote")}</p>
      <button type="button" class="primary cart-cta" data-staff>${t(state.staff ? "copyOrder" : "staff")}${icons("arrow")}</button>
      <p class="basket-status" role="status" id="basket-status"></p>
    </div>`;
  $(".basket-body").scrollTop = scroll;
  if (focus?.qty) {
    const replacement = $(`[data-qty="${focus.qty}"][data-delta="${focus.delta}"]:not(:disabled)`) || $(".qty button") || $("[data-staff]");
    replacement.focus({preventScroll:true});
  }
  if (focus?.service) $(`[data-service="${focus.service}"]`).focus({preventScroll:true});
  if (focus?.add) $("[data-staff]").focus({preventScroll:true});
}
function addProducts(items, message) {
  const keys = items.map(([p,index])=>itemKey(p.id,index));
  if (keys.some((key)=>(state.cart[key]||0) >= maxQuantity)) {
    notify(t("limit"));
    return false;
  }
  for (const key of keys) state.cart[key] = (state.cart[key]||0)+1;
  persist();
  renderCart();
  notify(message);
  return true;
}
function changeMenu(change) {
  Object.assign(state,change,{limit:pageSize});
  persist();
  syncUrl();
  renderMenu();
}
function openDetail(id) {
  state.detail = id;
  state.option = 0;
  renderDetail();
  $("#detail").showModal();
}
async function showStaff() {
  if (!state.staff) {
    state.staff = true;
    renderCart();
    $("#staff-summary").focus({preventScroll:true});
    $("#staff-summary").scrollIntoView({block:"nearest"});
    return;
  }
  const summary = $("#staff-summary");
  try {
    await navigator.clipboard.writeText(summary.value);
    $("#basket-status").textContent = t("copied");
  } catch {
    summary.focus();
    summary.select();
    if (document.execCommand?.("copy")) $("#basket-status").textContent = t("copied");
  }
}
async function shareItem() {
  const product = byId.get(state.detail);
  const url = new URL(location.pathname,location.origin);
  url.searchParams.set("item",product.id);
  url.searchParams.set("lang",state.lang);
  if (navigator.share) {
    try {
      await navigator.share({title:`${product.name} · Çikolata Evim`,url:url.href});
      return;
    } catch (error) {
      if (error.name === "AbortError") return;
    }
  }
  const status = $("#share-status");
  try {
    await navigator.clipboard.writeText(url.href);
    status.textContent = t("linkCopied");
  } catch {
    status.textContent = t("copyLink");
    const field = $("#share-link");
    field.value = url.href;
    field.hidden = false;
    field.select();
  }
}
document.addEventListener("click",(event)=>{
  const button = event.target.closest("button");
  if (!button) return;
  const d = button.dataset;
  if (d.close) { $("#"+d.close).close(); return; }
  if (d.openCart !== undefined) {
    state.staff = false;
    $("#basket").showModal();
    renderCart();
    return;
  }
  if (d.openSearch !== undefined) {
    $("#menu").scrollIntoView();
    $("#search").focus({preventScroll:true});
    return;
  }
  if (d.dock) {
    if (d.browse !== undefined) $("#basket").close();
    const view = d.dock==="pair" ? "pair" : state.view==="pair" ? "feed" : state.view;
    changeMenu({view,collection:"cafe",category:"all",mood:"all",query:"",savedOnly:d.dock==="saved"});
    $("#search").value="";
    $("#menu").scrollIntoView();
    return;
  }
  if (d.share !== undefined) { void shareItem(); return; }
  if (d.service) {
    state.service = d.service;
    persist();
    renderCart();
    return;
  }
  if (d.detail) { openDetail(d.detail); return; }
  if (d.add) {
    const p = byId.get(d.add);
    const i = Number(d.index||0);
    if (p?.choices[i] && addProducts([[p,i]],t("added")) && $("#detail").open) $("#detail").close();
    return;
  }
  if (d.pair !== undefined) {
    const {products} = pairings[Number(d.pair)];
    addProducts(products.map((p)=>[p,0]),t("pairAdded"));
    return;
  }
  if (d.qty && Object.hasOwn(state.cart,d.qty)) {
    const newQuantity = state.cart[d.qty]+Number(d.delta);
    if (newQuantity>maxQuantity) return;
    if (newQuantity<=0) delete state.cart[d.qty];
    else state.cart[d.qty]=newQuantity;
    persist();
    renderCart();
    return;
  }
  if (d.favorite) {
    if (state.saved.has(d.favorite)) state.saved.delete(d.favorite);
    else state.saved.add(d.favorite);
    persist();
    renderMenu();
    if ($("#detail").open) {
      const p=byId.get(d.favorite);
      button.setAttribute("aria-pressed",state.saved.has(d.favorite));
      button.setAttribute("aria-label",`${t(state.saved.has(d.favorite) ? "unsave" : "save")} · ${p.name}`);
    }
    return;
  }
  if (d.staff !== undefined) { void showStaff(); return; }
  if (d.moodChoice) {
    const mood = state.mood===d.moodChoice ? "all" : d.moodChoice;
    changeMenu({mood,collection:"cafe",category:"all",query:"",savedOnly:false});
    $("#search").value="";
    return;
  }
  if (d.collection) { changeMenu({collection:d.collection,category:"all",mood:"all",savedOnly:false,view:state.view==="pair" && d.collection==="chocolate" ? "photo" : state.view}); return; }
  if (d.category !== undefined) { changeMenu({category:d.category==="all" ? "all" : Number(d.category),mood:"all"}); return; }
  if (d.view || d.viewLink) {
    const view=d.view||d.viewLink;
    changeMenu(view==="pair" ? {view,collection:"cafe",category:"all",savedOnly:false} : {view});
    if (d.viewLink) $("#menu").scrollIntoView();
    return;
  }
  if (d.saved !== undefined) { changeMenu({savedOnly:!state.savedOnly,view:state.view==="pair" ? "photo" : state.view}); return; }
  if (d.reset !== undefined) {
    changeMenu({mood:"all",category:"all",query:"",savedOnly:false});
    $("#search").value="";
    $("#search").focus();
    return;
  }
  if (button.id==="more") {
    const previous=state.limit;
    state.limit+=pageSize;
    $("#catalog").innerHTML=renderProducts();
    $("#catalog article:nth-child("+(previous+1)+") .product-name")?.focus({preventScroll:true});
  }
});
$("#search").addEventListener("input",(event)=> {
  state.query=event.target.value;
  state.limit=pageSize;
  $("#catalog").innerHTML=state.view==="pair" ? renderPairs() : renderProducts();
});
$("#lang").addEventListener("change",(event)=>{
  state.lang=event.target.value;
  persist();
  syncUrl();
  paintInterface();
});
$("#detail").addEventListener("change",(event)=>{
  if (event.target.id !== "variant") return;
  const index = Number(event.target.value);
  const choice=byId.get(state.detail).choices[index];
  if (!choice) return;
  state.option=index;
  $("#detail-add").dataset.index=index;
  $("#detail-add strong").textContent=money(choice[1]);
});
for (const dialog of document.querySelectorAll("dialog")) {
  dialog.addEventListener("click",(event)=>{
    if (event.target!==dialog) return;
    const {left,right,top,bottom}=dialog.getBoundingClientRect();
    if (event.clientX<left||event.clientX>right||event.clientY<top||event.clientY>bottom) dialog.close();
  });
}
document.querySelectorAll("[data-icon]").forEach((el)=>{el.innerHTML=icons(el.dataset.icon);});
$("#lang-icon").innerHTML=icons("globe");
$("#basket").addEventListener("close",renderDock);
$("#detail").addEventListener("close",()=>{
  const url = new URL(location.href);
  if (!url.searchParams.has("item")) return;
  url.searchParams.delete("item");
  history.replaceState(null,"",url);
});
paintInterface();
if (byId.has(params.get("item"))) openDetail(params.get("item"));
