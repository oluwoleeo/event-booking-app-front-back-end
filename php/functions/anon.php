<?php
    $greet = function($name){
        return "Hello, $name!\n";
    };

    $message = "Bye";
    $greet1 = function($name) use ($message){
        return "$message, $name!\n";
    };

    echo $greet("Wole");
    echo $greet1("Wole");

    $numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    $squared = array_map(function($number){
        return $number * $number;
    }, $numbers);

    var_dump($numbers, $squared);