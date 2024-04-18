function editAllStockLevels() {
  document.querySelectorAll('.quantity-input').forEach(function(input) {
    input.removeAttribute('readonly');
  });
  document.getElementById('edit-all').style.display = 'none';
  document.getElementById('save-all').style.display = 'inline-block';
}

function saveAllStockLevels() {
  var quantities = [];
  document.querySelectorAll('.quantity-input').forEach(function(input) {
    quantities.push({ id: input.id.split('-')[1], quantity: input.value });
    input.setAttribute('readonly', true);
  });
  // Here you need to send `quantities` to the server to save all changes
  console.log('Quantities to save:', quantities);
  // You would need to implement this AJAX call.
  
  document.getElementById('save-all').style.display = 'none';
  document.getElementById('edit-all').style.display = 'inline-block';
}

function submitOrder(event) {
  event.preventDefault();
  const orderData = {
    item: document.getElementById('item').value,
    quantity: document.getElementById('quantity').value,
    location: document.getElementById('location').value,
    status: document.getElementById('status').value
  };

  fetch('/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  })
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
    $('#addOrderModal').modal('hide');
    // Optionally, refresh the page or update the UI to show the new order
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}

function removeOrder(orderId) {
  if (!confirm('Are you sure you want to remove this order?')) return;

  fetch('/orders/' + orderId, {
      method: 'DELETE', // Assuming your server is set up to handle DELETE requests for order removal
  })
  .then(response => response.json())
  .then(data => {
      console.log('Order removed:', data);
      // Optionally, remove the order row from the table in the UI
      document.getElementById('orderRow-' + orderId).remove();
  })
  .catch(error => console.error('Error removing order:', error));
}

function placeOrder(itemId, description, Country, quantity = 10, status = 'In Transit') {
  fetch('/orders', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          item: description,
          quantity: quantity,
          location: Country,
          status: status,
      }),
  })
  .then(response => response.json())
  .then(data => {
      alert('Order placed successfully');
      console.log(data);
      // Optionally, refresh the page or update the UI to reflect the new order
  })
  .catch(error => console.error('Error placing order:', error));
}

function confirmDelivery(orderId, itemName, orderQuantity) {
  fetch(`/orders/confirm-delivery/${orderId}`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          itemName: itemName,
          orderQuantity: orderQuantity
      }),
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert('Delivery confirmed, stock updated.');
      document.getElementById(`orderRow-${orderId}`).remove();
  }else {
    alert('Error confirming delivery: ' + data.message);
  }
})
  .catch(error => console.error('Error confirming delivery:', error));
}

