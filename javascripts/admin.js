
$(() => {
    $("#frm-product").validate();
    let db;
    const request = indexedDB.open("mystoredb");
    request.onerror = (event) => {
      console.error("Some Error!");
    };
    request.onsuccess = (event) => {
      db = event.target.result;
      mydata(db);
      console.log(db);
    };

    $("#save-btn").click(() => {

      if ($("#frm-product").valid()) {

        var data = {
          name: $("#name").val(),
          price: Number($("#price").val()),
          description: $("#description").val(),
        };
        var f = document.getElementById("picture").files[0];
        var reader = new FileReader();
        reader.onload = () => {

          data.picture = reader.result;

          Add(db, data);

          $("#frm-product").trigger("reset");
        };
        reader.readAsDataURL(f);

      }

    });
    $("#reset-btn").click(() => {
      action = "add";
      $("#frm-product").trigger("reset");
    });
    $(document).on("click", ".del", function () {
      var id = $(this).data("pk");
      const transaction = db.transaction(["products"], "readwrite");
      const objectStore = transaction.objectStore("products");
      const query = objectStore.delete(Number(id));
      query.onsuccess = () => {
        mydata(db);
      }
    });
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
    } else {
      $("#admin").hide();
      $("#login").show();
      $("#register").show();
    }
  });

  function mydata(db) {
    $("#tbody").empty();
    const trx = db.transaction(["products"], "readonly");
    const store = trx.objectStore("products");
    const cursor = (store.openCursor().onsuccess = (event) => {
      const pointer = event.target.result;
      if (pointer) {
        $("#tbody").append(`<tr>
                          <td><img src="${pointer.value.picture}" class="circle-image" /></td>
                          <td>${pointer.value.name}</td>
                          <td>${pointer.value.price}</td>
                          <td>${pointer.value.description}</td>
                          <td>
                             
                              <button class="button-del del" data-pk="${pointer.value.id}">Delete</button>
                          </td>
                      </tr>`);
        pointer.continue();
      }
    });
  }
  function Add(db, data) {
   
    const transaction = db.transaction(["products"], "readwrite");
    const objectStore = transaction.objectStore("products");
    const query = objectStore.add(data);
    query.onsuccess = () => {
      
      mydata(db);
    };
  }

