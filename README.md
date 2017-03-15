# midtrans-node

Promise based Midtrans integration module for Node JS. Written in ES6 and support multiple payment account.

Why multiple account? Currently midtrans not yet support multiple bank account number, and we need to separate some purchases pool for some reason.

### Prerequisites

- > Node 6

### Installation

```
$ npm install midtrans-nodex
```

### Usage

__Note:__ For detail description about payload and responses, please refer to [Official Midtrans documentation](http://api-docs.midtrans.com/#api-methods).

#### Setup

Instantiate by assigning the module using `new` keyword into variable. See below for examples.

##### Single Account

For single account, pass configuration object with properties `clientKey`, `serverKey`, and `isProduction`. This configuration can be seen at __Midtrans MAP > Configuration__

```
const Midtrans = require('midtrans-node');

const mds = new Midtrans({
    "clientKey": "Your-Midtrans-Client-Key",
    "serverKey": "Your-Midtrans-Server-Key",
    "isProduction": false
  });
```

##### Multiple Account

For multiple account, pass array of object containing configuration like single account plus additional properties `name`.

```
const Midtrans = require('midtrans-node');

const mdm = new Midtrans([
  {
    "name": "store-wahid",
    "clientKey": "Your-Midtrans-Client-Key",
    "serverKey": "Your-Midtrans-Server-Key",
    "isProduction": false
  },
  {
    "name": "store-isnan",
    "clientKey": "Your-Midtrans-Client-Key",
    "serverKey": "Your-Midtrans-Server-Key",
    "isProduction": false
  }
]);
```

### API Reference

#### Core

##### Get Transaction Status

Send `transaction_id` / `order_id` of previous purchase to get the transaction status.

- Single -- `mds.transaction.status(id)`
- Multiple -- `mdm.transaction.status(id, name)`


__Params:__

- `id` (String) - A string representing the order_id or transaction_id.
- `name` (String) - A string representing property `name` that passed when instantiating multiple account, to determine which account will be used.


__Example:__

- Single

  ```
  mds.transaction.status('ORDER-101')
  .then((res) => {
    console.log(res.data);
  })
  .catch((err) => {
    console.log(err);
  });
  ```

- Multiple

  ```
  mdm.transaction.status('ORDER-101', 'store-isnan')
  .then((res) => {
    console.log(res.data);
  })
  .catch((err) => {
    console.log(err);
  });
  ```


#### SNAP

##### Get Snap Token

Send payload information about transactions to get `SNAP_TOKEN`. The `SNAP_TOKEN` is required to show pop up midtrans payment.

- Single -- `mds.snap.transactions(payload)`
- Multiple -- `mdm.snap.transactions(payload, name)`


__Params:__

- `payload` (Object) - An object representing transaction details.

  Minimum payload:
  ```
  {
    "transaction_details": {
      "order_id": "ORDER-101",
      "gross_amount": 10000
    }
  }
  ```

  All possible payload and details can be seen [here](https://snap-docs.midtrans.com/#json-parameter-request-body).

- `name` (String) -  A string representing property `name` that passed when instantiating multiple account, to determine which account will be used.


__Example:__

- Single

  ```
  mds.snap.transactions({
    "transaction_details": {
      "order_id": "ORDER-101",
      "gross_amount": 10000
    }
  })
  .then((token) => {
    console.log(token);
  })
  .catch((err) => {
    console.log(err);
  });
  ```

- Multiple

  ```
  mdm.snap.transactions({
    "transaction_details": {
      "order_id": "ORDER-101",
      "gross_amount": 10000
    }
  }, 'store-wahid')
  .then((token) => {
    console.log(token);
  })
  .catch((err) => {
    console.log(err);
  });
  ```


#### Notification

##### Verify Payload Notification

Midtrans will post payload data to our specified url, this API making sure the payload data is truly sent by midtrans, by comparing the received data signature key with the signature key data response from status API.

- Single -- mds.notification.verify(orderId, signatureKey)
- Double -- mdm.notification.verify(orderId, signatureKey, name)

__Params:__

- `orderId` (String) - A string representing the order_id or transaction_id.
- `signatureKey` (String) - A string representing signature_key received from midtrans notification.
- `name` (String) -  A string representing property `name` that passed when instantiating multiple account, to determine which account will be used.

__Example:__

- Single
  ```
  mds.notification.verify('ORDER-101', '833c8afeb91f9d913a38304ef1849ed7dbbad5d78ff2892af6f6e472d5f3b61e803ba92c198cb587f3222a746821ad71eda22a594f5b21445a0822d807fc4097')
  .then((res) => {
    console.log(res);
    // If genuine
    // {
    //   status: true,
    //   data: {
    //     // response object like check status transaction
    //   }
    // }
  })
  .catch((err) => {
    console.log(err);
  })
  ```

- Multiple
  ```
  mdm.notification.verify('ORDER-101', '833c8afeb91f9d913a38304ef1849ed7dbbad5d78ff2892af6f6e472d5f3b61e803ba92c198cb587f3222a746821ad71eda22a594f5b21445a0822d807fc4097', 'store-wahid')
  .then((res) => {
    console.log(res);
    // If not genuine
    // {
    //   status: false,
    //   data: {
    //     // response object like check status transaction
    //   }
    // }
  })
  .catch((err) => {
    console.log(err);
  });
  ```
