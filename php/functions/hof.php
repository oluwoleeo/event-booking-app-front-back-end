<?php
    $users = [
        ['id' => 1, 'name' => 'Alice', 'role' => 'admin'],
        ['id' => 2, 'name' => 'Bob', 'role' => 'user'],
        ['id' => 3, 'name' => 'Charlie', 'role' => 'user']
    ];

    //Higher-Order function is a function that returns a function
    function createFilter($key, $value){
        return fn($item) => $item[$key] === $value;
    }

    $isAdmin = createFilter('role', 'admin');
    $admins = array_filter($users, $isAdmin);

    var_dump($admins);