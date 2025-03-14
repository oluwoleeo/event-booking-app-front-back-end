<?php
    $numbers = [1, 2];

    $squared = array_map(function($n){
        return $n * $n;
    }, $numbers);

    $squared_arrow = array_map(fn($n) => $n * $n, $numbers);

    $multiplier = 7;

    // Can't access variables outside its scope including global variables
    // would have to be imported with global or use
    $multiply = array_map(function($n) use ($multiplier){
        // global $multiplier;
        return $n * $multiplier;
    }, $numbers);


    // Inherits variables from its parent scope
    $multiply_arrow = array_map(fn($n) => $n * $multiplier, $numbers);

    var_dump($numbers, $squared, $squared_arrow);
    var_dump($numbers, $multiply, $multiply_arrow);