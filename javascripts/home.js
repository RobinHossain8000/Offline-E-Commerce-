$(() => {
    let db;
    const request = indexedDB.open("mystoredb");
    request.onerror = (event) => {
      console.error("Some Error !");
    };
    request.onsuccess = (event) => {
      db = event.target.result;
      populate(db);
      
    };
    request.onupgradeneeded = (event) => {
      console.log("upgrade ");

      db = event.target.result;


      if (!db.objectStoreNames.contains("products")) {
        db.createObjectStore("products", {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    };
    ///////////////////////////
    let data = sessionStorage.getItem("login-data");
    let isLoggedIn = false;
    if (data) {
      data = JSON.parse(data);
      isLoggedIn = true;
    }
    if (isLoggedIn) {
      $("#admin").show();
      
      $("#login").hide();
      $("#register").hide();
      $('#count').html(Countcart().toString());
    } else {
      $("#admin").hide();
      
      $("#login").show();
      $("#register").show();
    }
	 $('#count').html(Countcart().toString());
  });
  function populate(db) {
    
    let recordCount = 0;

    const trx = db.transaction(["products"], "readonly");
    trx.oncomplete = (event) => {
      
      if (recordCount < 1) {
        Add(db);
      }

      
    };
    const store = trx.objectStore("products");
    count = store.count();

    count.onsuccess = function () {
      recordCount = count.result;

    };
  }
  function Add(db) {

    const transaction = db.transaction(["products"], "readwrite");
    const objectStore = transaction.objectStore("products");
    for (var i = 0; i < iteminitial.length; i++) {
      const query = objectStore.add(iteminitial[i]);
      query.onsuccess = () => {
        
      };
    }

  }
  function Countcart() {
    var cart = [];
    var cartdata = localStorage.getItem('cart-data');
    if (cartdata) {
      cart = JSON.parse(cartdata)
    }
    let c = 0;
    cart.forEach(x => {
      c += Number(x.qty);
    });
    return c;
  }