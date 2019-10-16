# Ride Hailing App

Implementasi sederhana pattern CQRS dengan Eventsourcing

## Homework

Buat 3 buah service yang terhubung melalui sebuah message bus

1. Driver tracker

    driver tracker memiliki endpoint yang berfungsi mengirim informasi mengenai perpindahan driver relatif terhadap arah mata angin

    ```bash
    POST /track { north, south, west, east, rider_id  }
    ```

    setiap event perpindahan akan disimpan ke `eventstore` yang direpresentasikan dalam bentuk fisik berupa database `SQL`.

    layanan juga akan mengimisikan `event` `driver.moved` dengan payload sebagai berikut

    ```js
    { north, south, west, east, rider_id  }
    ```

2. Position Monitoring

    service ini akan melakukan proyeksi posisi driver dalam GPS. posisi driver akan disimpan dalam database `SQL` yang berisi informasi berikut

    ```js
    { rider_id, latitude, longitude }
    ```

    service ini juga dapat mengirim informasi mengenai posisi rider

    ```bash
    GET /position/:rider_id
    ```

    mengembalikan payload sebagai berikut

    ```js
    { latitude, longitude }
    ```

3. Performance monitoring

    service ini akan menambahkan point driver tiap kali driver berpindah sejauh 1 KM, 1 Point untuk tiap KM-nya. Point dapat dibaca dengan mengakses endpoint berikut.

    ```bash
    GET /point/:rider_id
    ```

    mengembalikan payload sebagai berikut

    ```js
    { point }
    ```







